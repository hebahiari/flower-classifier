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

    // Event handler for when the user selects a new file
    const handleFileChange = (e) => {
        // Reset predictions and set the newly selected file
        setPredictions(null);
        setSelectedFile(e.target.files[0]);
    };

    // Event handler for form submission to make predictions
    const handleSubmit = async (e) => {
        e.preventDefault();

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
      <div className="container-fluid d-flex">
        {/* Fixed box on the left side */}
        <div className="fixed-box">
          <h2>About Flower Type Classifier</h2>
          <p>
            Welcome to the Flower Type Classifier, an intelligent image recognition system! This application uses a
            state-of-the-art deep learning model trained on a diverse dataset of flower images.
          </p>
          <p>
            Start exploring the fascinating world of flowers with our Flower Type Classifier today!
          </p>
        </div>
  
        {/* Main content on the right side */}
        <div className="flex-grow-1 mt-5 text-center main-content">
          <h1 className="mb-4">Flower Type Classifier</h1>
  
          {/* Form for image upload */}
          <div className="d-flex justify-content-center mb-4">
            <form onSubmit={handleSubmit} className="d-flex gap-3">
              <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
              <button type="submit" className="btn btn-primary">
                Predict
              </button>
            </form>
          </div>
  
          {/* Selected image and predictions */}
          <div className="d-flex justify-content-center gap-5">
            {/* Display selected image if available */}
            {predictions && selectedFile && (
              <div className="selected-image-container">
                <h3>Selected Image:</h3>
                <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="selected-image" />
              </div>
            )}
  
            {/* Display predictions if available */}
            {predictions && (
              <div>
                <h3>Predictions:</h3>
                {predictions.probabilities[0] < 50 ? (
                  <p>Warning: Object does not seem to be a recognized flower.</p>
                ) : null}
                {/* Bar chart for predictions */}
                <Bar
                  data={{
                    labels: predictions.classes.map((label) => label.toUpperCase()),
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
                        labels: predictions.classes.map((label) => label.toUpperCase()),
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
