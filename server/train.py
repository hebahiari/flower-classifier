from get_input_args import get_train_args
from model_utils import build_model, train_model, save_checkpoint
from data_utils import load_data

def main():
    args = get_train_args()
   
    # Load and preprocess the data
    train_loader, valid_loader, _ , class_to_idx = load_data(args.data_dir)

    # Build the model
    model = build_model(args.arch, args.hidden_units)

    # Train the model
    train_model(model, train_loader, valid_loader, args.learning_rate, args.epochs, args.gpu)

    # Save the checkpoint
    save_checkpoint(model, args.arch, args.hidden_units, args.learning_rate, args.epochs, args.save_dir, class_to_idx)

if __name__ == "__main__":
    main()
