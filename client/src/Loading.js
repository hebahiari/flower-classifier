import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ImageUpload.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loading = () => {
    return (
        <div className="data d-flex flex-wrap justify-content-center gap-3">
            <div className="selected-image-container rounded">
                <h4>Selected Image:</h4>
                <Skeleton height='300px' width='300px' borderRadius='8px' />
            </div>
            <div className=" rounded">
                <h4>Predictions:</h4>
                <Bar
                    data={{
                        datasets: [
                            {
                                label: 'Probability',
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
                                labels: ""
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
            </div>
        </div>
    )
}

export default Loading