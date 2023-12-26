import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, Chart, BarElement } from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);


const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [predictions, setPredictions] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPredictions(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Image Classifier</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Predict</button>
            </form>
            {selectedFile && (
                <div>
                    <h2>Selected Image:</h2>
                    <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected"
                        style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                </div>
            )}
            {predictions && (
                <div>
                    <h2>Predictions:</h2>
                    <Bar
                        data={{
                            labels: predictions.classes,
                            datasets: [
                                {
                                    label: 'Probability',
                                    data: predictions.probabilities,
                                    backgroundColor: 'blue',
                                },
                            ],
                        }}
                        options={{
                            scales: {
                                xAxes: [
                                    {
                                        type: 'category',
                                        labels: predictions.classes,
                                    },
                                ],
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                    },
                                ],
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: 'Top 5 Predictions',
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
