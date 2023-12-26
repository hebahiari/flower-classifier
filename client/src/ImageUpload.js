import React, { useState } from 'react';
import axios from 'axios';

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
            {predictions && (
                <div>
                    <h2>Predictions:</h2>
                    <ul>
                        {predictions.classes.map((className, index) => (
                            <li key={index}>
                                {className}: {predictions.probabilities[index]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
