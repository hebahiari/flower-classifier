from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from model_utils import load_checkpoint, predict
from data_utils import process_image
import json

with open('cat_to_name.json', 'r') as f:
    cat_to_name = json.load(f)

app = Flask(__name__)
CORS(app)

# Load your trained model checkpoint
model = load_checkpoint("checkpoint.pth")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        image_path = "temp_image.jpg"  # Save the uploaded image temporarily
        file.save(image_path)

        # Process and predict using the loaded model
        image = process_image(image_path)
        probabilities, classes = predict(image, model, topk=5)

        # Convert class indices to class names
        class_names = [cat_to_name[str(class_idx)] for class_idx in classes]

        # Convert probabilities to percentages
        probabilities_percentage = [round(prob * 100, 2) for prob in probabilities]

        # Return predictions as JSON
        return jsonify({'probabilities': probabilities_percentage, 'classes': class_names})

if __name__ == '__main__':
    app.run(debug=True)
