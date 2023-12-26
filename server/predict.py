from get_input_args import get_predict_args
from model_utils import load_checkpoint, predict
from data_utils import process_image
import json

with open('cat_to_name.json', 'r') as f:
    cat_to_name = json.load(f)

def main():
    args = get_predict_args()

    # Load the model checkpoint
    model = load_checkpoint(args.checkpoint_path)

    # Preprocess the input image
    image = process_image(args.image_path)

    # Predict the class
    probs, classes = predict(image, model, args.topk, args.gpu)

    # Display the results
    print(f"Top {args.topk} Classes:")
    for prob, cls in zip(probs, classes):
        print(f"ClassID: {cls}, Class Name: {cat_to_name[str(cls)]}, Probability: {prob}")

    # idx_to_class = {v: k for k, v in model.class_to_idx.items()}
    # classes = [idx_to_class[idx.item()] for idx in indices]

    # for c, p in zip(classes, probs):
    #     print(f"Class = {c}, Prob = {p}")

if __name__ == "__main__":
    main()
