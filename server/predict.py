from get_input_args import get_predict_args
from model_utils import load_checkpoint, predict
from data_utils import process_image
import json

with open('cat_to_name.json', 'r') as f:
    cat_to_name = json.load(f)

def main():
    args = get_predict_args()

    model = load_checkpoint(args.checkpoint_path)

    image = process_image(args.image_path)

    probs, classes = predict(image, model, args.topk, args.gpu)

    print(f"Top {args.topk} Classes:")
    for prob, cls in zip(probs, classes):
        print(f"ClassID: {cls}, Class Name: {cat_to_name[str(cls)]}, Probability: {prob}")

if __name__ == "__main__":
    main()
