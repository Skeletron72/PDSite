import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { PixelContainer } from './ui/PixelUI';

Chart.register(...registerables);

const PixelChart = ({ data, title }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            // Disable smoothing for pixel effect
            ctx.imageSmoothingEnabled = false;

            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    family: '"Press Start 2P"',
                                    size: 10
                                },
                                color: '#fff'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: { family: '"Press Start 2P"', size: 8 },
                                color: '#fff'
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        x: {
                            ticks: {
                                font: { family: '"Press Start 2P"', size: 8 },
                                color: '#fff'
                            },
                            grid: { display: false }
                        }
                    },
                    animation: false // Instant rendering for 8-bit feel
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return (
        <PixelContainer dark title={title} className="h-64">
            <canvas ref={chartRef} style={{ imageRendering: 'pixelated' }} />
        </PixelContainer>
    );
};

export default PixelChart;
