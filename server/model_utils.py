import torch
from torch import nn, optim
from torchvision import models
from collections import OrderedDict
import os

def build_model(arch='vgg16', hidden_units=512):
    if arch == 'vgg16':
        model = models.vgg16(pretrained=True)
        input_size = model.classifier[0].in_features
    elif arch == 'densenet121':
        model = models.densenet121(pretrained=True)
        input_size = model.classifier.in_features
    else:
        raise ValueError(f"Unsupported architecture: {arch}")

    # Freeze parameters
    for param in model.parameters():
        param.requires_grad = False

    # Build custom classifier
    classifier = nn.Sequential(OrderedDict([
        ('fc1', nn.Linear(input_size, hidden_units)),
        ('relu', nn.ReLU()),
        ('dropout', nn.Dropout(0.5)),
        ('fc2', nn.Linear(hidden_units, 102)),
        ('output', nn.LogSoftmax(dim=1))
    ]))

    model.classifier = classifier

    return model

def train_model(model, train_loader, valid_loader, learning_rate=0.001, epochs=5, use_gpu=False):
    criterion = nn.NLLLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=learning_rate)

    device = torch.device('cuda' if use_gpu and torch.cuda.is_available() else 'cpu')
    model.to(device)

    for epoch in range(epochs):
        model.train()
        running_loss = 0

        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()

            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()

        print(f"Epoch {epoch + 1}/{epochs}.. "
              f"Training Loss: {running_loss / len(train_loader):.3f}")

        validate_model(model, valid_loader, criterion, device)

def validate_model(model, valid_loader, criterion, device):
    model.eval()
    validation_loss = 0
    accuracy = 0

    with torch.no_grad():
        for inputs, labels in valid_loader:
            inputs, labels = inputs.to(device), labels.to(device)

            outputs = model(inputs)
            validation_loss += criterion(outputs, labels).item()

            ps = torch.exp(outputs)
            top_p, top_class = ps.topk(1, dim=1)
            equals = top_class == labels.view(*top_class.shape)
            accuracy += torch.mean(equals.type(torch.FloatTensor)).item()

    print(f"Validation Loss: {validation_loss / len(valid_loader):.3f}.. "
          f"Validation Accuracy: {accuracy / len(valid_loader):.3f}")

def save_checkpoint(model, arch, hidden_units, learning_rate, epochs, class_to_idx, save_dir='checkpoints'):
    checkpoint = {
        'arch': arch,
        'hidden_units': hidden_units,
        'learning_rate': learning_rate,
        'epochs': epochs,
        'state_dict': model.state_dict(),
        'class_to_idx': class_to_idx
    }

    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    torch.save(checkpoint, f'{save_dir}/checkpoint.pth')

def load_checkpoint(filepath):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    checkpoint = torch.load(filepath, map_location=device)

    model = build_model(checkpoint['arch'], checkpoint['hidden_units'])
    model.load_state_dict(checkpoint['state_dict'])
    model.class_to_idx = checkpoint['class_to_idx']

    return model

# def predict(image, model, topk=1, use_gpu=False):
#     device = torch.device('cuda' if use_gpu and torch.cuda.is_available() else 'cpu')
#     model.to(device)

#     image = image.to(device)
#     image = image.unsqueeze(0)

#     with torch.no_grad():
#         model.eval()
#         output = model(image)

#     probs, classes = torch.topk(torch.exp(output), topk)
#     probs, classes = probs.cpu().numpy()[0], classes.cpu().numpy()[0]

#     return probs, classes

def predict(image, model, topk=5, use_gpu=False):
    device = torch.device('cuda' if use_gpu and torch.cuda.is_available() else 'cpu')
    model.to(device)

    image = image.to(device)
    image = image.unsqueeze(0)

    with torch.no_grad():
        model.eval()
        output = model(image)
    
    # Calculate the probabilities and indices of the topk predictions
    probabilities, indices = torch.topk(torch.nn.functional.softmax(output[0], dim=0), topk)
    
    # Convert indices to class labels
    idx_to_class = {v: k for k, v in model.class_to_idx.items()}
    classes = [idx_to_class[idx.item()] for idx in indices]
    
    # Convert tensor to NumPy array for easier manipulation
    probabilities = probabilities.numpy()
    
    return probabilities, classes