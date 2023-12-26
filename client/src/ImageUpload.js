// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Chart, BarElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ImageUpload.css"

// Registering necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement);

const ImageUpload = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [uploadWarning, setUploadWarning] = useState(false);

  // Event handler for when the user selects a new file
  const handleFileChange = (e) => {
    // Reset predictions and set the newly selected file
    setPredictions(null);
    setSelectedFile(e.target.files[0]);
    // Reset the upload warning when a new file is selected
    setUploadWarning(false);
  };

  // Event handler for form submission to make predictions
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there is a selected file
    if (!selectedFile) {
      setUploadWarning(true);
      return;
    }

    // Create a FormData object and append the selected image file
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Send a POST request to the prediction endpoint
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update state with the prediction results
      setPredictions(response.data);
    } catch (error) {
      console.error('Error occurred during prediction:', error);
    }
  };


  return (
    <div className='container-fluid d-flex flex-row justify-content-start'>
      <div className="description-box">
        <p>
          Welcome to the Flower Type Classifier — an intelligent image recognition system! Our application employs a
          state-of-the-art deep learning model trained on a diverse dataset of flower images. By leveraging advanced
          neural network architectures, it accurately identifies and categorizes various flower types.
        </p>
        <p>
          The underlying model has been trained using advanced deep learning techniques, specifically leveraging
          Convolutional Neural Networks (CNNs). These networks are designed to understand and recognize intricate
          patterns in images, ensuring the Flower Type Classifier is both accurate and efficient.
        </p>
        <p>
          <strong>How It Works:</strong>
        </p>
        <ul>
          <li><strong>Upload Image:</strong> Select an image of a flower you'd like to identify.</li>
          <li><strong>Predict:</strong> Click the "Predict" button to let the model analyze the image.</li>
          <li><strong>View Results:</strong> Instantly receive the top 5 predictions with corresponding probabilities.</li>
        </ul>
      </div>


      <div className="container mt-5 text-center">
        <h1 className="mb-4">Flower Type Classifier</h1>

        {/* Form for file upload and prediction */}
        <div className="d-flex justify-content-center mb-4">
          <form onSubmit={handleSubmit} className="d-flex gap-3">
            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
            <button type="submit" className="btn btn-primary">Predict</button>
          </form>
        </div>

        {/* Display selected image and prediction results */}
        <div className="d-flex flex-wrap justify-content-center gap-5">
          {uploadWarning && <p>Please upload an image first.</p>}
          {predictions && selectedFile && (
            <div className="selected-image-container">
              <h3>Selected Image:</h3>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="selected-image"
              />
            </div>
          )}

          {predictions && (
            <div>
              <h3>Predictions:</h3>
              {/* Display a warning if the highest predicted probability is less than 50% */}
              {predictions.probabilities[0] < 50 ? (
                <p>Warning: This may not be a recognized flower.</p>
              ) : null}

              {/* Bar chart for displaying prediction probabilities */}
              <Bar
                data={{
                  labels: predictions.classes.map(label => label.toUpperCase()),
                  datasets: [
                    {
                      label: 'Probability',
                      data: predictions.probabilities,
                      backgroundColor: 'blue',
                      barThickness: 25,
                    },
                  ],
                }}
                options={{
                  indexAxis: 'y',
                  scales: {
                    y: {
                      type: 'category',
                      labels: predictions.classes.map(label => label.toUpperCase()),
                    },
                    x: {
                      ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                      },
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Top 5 Predictions',
                    },
                  },
                }}
                height={300}
                width={400}
              />
            </div>
          )}
        </div>
      </div>
    </div>


  );
};

export default ImageUpload;
