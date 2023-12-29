import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Chart, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ImageUpload.css';

Chart.register(CategoryScale, LinearScale, BarElement, ChartDataLabels);

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [uploadWarning, setUploadWarning] = useState(false);

  const handleFileChange = (e) => {
    setPredictions(null);
    setSelectedFile(e.target.files[0]);
    setUploadWarning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadWarning(true);
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPredictions(response.data);
    } catch (error) {
      console.error('Error occurred during prediction:', error);
    }
  };

  return (
    <div className="container-fluid d-flex flex-row flex-wrap justify-content-start main-container p-0">
      <div className="description-box p-4">
        <h3 className="text-primary mb-4">Flower Image Classification Project Overview</h3>

        <h6>Project Details:</h6>
        <p>
          Developed an image classification project using PyTorch to recognize 102 flower species. Achieved through data preparation, VGG11 model selection, classifier design, model training, and checkpoint saving. Implemented inference for new image predictions and performed sanity checks for validation.
        </p>

        <h6>Technologies Used:</h6>
        <p>
          Python (v3.6), PyTorch (v1.0.0), Matplotlib, PIL
        </p>

        <h6>Achievements:</h6>
        <ul>
          <li>Trained a deep learning model for flower classification.</li>
          <li>Utilized transfer learning with a pre-trained VGG11 model.</li>
          <li>Demonstrated expertise in data preprocessing and model evaluation.</li>
          <li>Created an efficient inference pipeline for real-world predictions.</li>
        </ul>

        <p>
          This project showcases end-to-end machine learning capabilities, highlighting technical skills in model development and the potential for real-world deployment.
        </p>
      </div>

      <div className="prediction-box text-center">
        <h1 className="mb-4">Flower Type Classifier</h1>

        {/* Form for file upload and prediction */}
        <div className="d-flex justify-content-center mb-4">
          <form onSubmit={handleSubmit} className="d-flex gap-3">
            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
            <button type="submit" className="btn btn-primary">Predict</button>
          </form>
        </div>
          {uploadWarning && <p className="text-danger">Please upload an image first.</p>}

        {/* Display selected image and prediction results */}
        <div className="data d-flex flex-wrap justify-content-center gap-3">
          {!predictions && (
            <div className="alert alert-info p-4" style={{ textAlign: "left", maxWidth: "500px", borderRadius: "10px" }}>
              <p>
                <strong className="text-primary">How It Works:</strong>
              </p>
              <ul>
                <li><strong>Upload Image:</strong> Select an image of a flower you'd like to identify.</li>
                <li><strong>Predict:</strong> Click the "Predict" button to let the model analyze the image.</li>
                <li><strong>View Results:</strong> Instantly receive the top 5 predictions with corresponding probabilities.</li>
              </ul>
            </div>
          )}

          {predictions && selectedFile && (
            <div className="selected-image-container rounded">
              <h4>Selected Image:</h4>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="selected-image img-fluid"
              />
            </div>
          )}

          {predictions && (
            <div className=" rounded">
              <h4>Predictions:</h4>
              {/* Bar chart for displaying prediction probabilities */}
              <Bar
                data={{
                  labels: predictions.classes.map(label => label.toUpperCase()),
                  datasets: [
                    {
                      label: 'Probability',
                      data: predictions.probabilities,
                      backgroundColor: '#66c2a5',  // Greenish color
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
                      min: 0,
                      max: 100,
                      ticks: {
                        beginAtZero: true,
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
                    datalabels: {
                      color: 'black',
                      anchor: 'start',
                      align: 'end',
                      formatter: (value, context) => {
                        return value.toFixed(1) + '%';
                      },
                      offset: 5,
                    },
                  },
                }}
                height={300}
                width={400}
              />
              {/* Display a warning if the highest predicted probability is less than 50% */}
              {predictions.probabilities[0] < 50 ? (
                <p style={{ margin: 0 }} className="text-danger">Warning: This may not be a recognized flower.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
