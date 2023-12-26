# get_input_args.py

import argparse

def get_train_args():
    parser = argparse.ArgumentParser(description="Train a new network on a dataset")
    parser.add_argument("data_dir", type=str, help="Path to the dataset directory")
    parser.add_argument("--save_dir", type=str, default="checkpoints", help="Directory to save checkpoints")
    parser.add_argument("--arch", type=str, default="vgg16", help="Architecture (e.g., vgg13)")
    parser.add_argument("--learning_rate", type=float, default=0.01, help="Learning rate")
    parser.add_argument("--hidden_units", type=int, default=512, help="Number of hidden units in the classifier")
    parser.add_argument("--epochs", type=int, default=20, help="Number of training epochs")
    parser.add_argument("--gpu", action="store_true", help="Use GPU for training")

    return parser.parse_args()

def get_predict_args():
    parser = argparse.ArgumentParser(description="Use a trained network to predict the class for an input image")
    parser.add_argument("image_path", type=str, help="Path to the input image")
    parser.add_argument("checkpoint_path", type=str, help="Path to the trained model checkpoint")
    parser.add_argument("--topk", type=int, default=5, help="Return top K most likely classes")
    parser.add_argument("--gpu", action="store_true", help="Use GPU for training")
    return parser.parse_args()
