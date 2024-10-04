import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  // Set initial data using useState
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [33, 53, 85, 41, 44, 65],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  });

  // Increment function to increase each value by 10
  const incrementValues = () => {
    const newData = chartData.datasets[0].data.map(value => value + 10);
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: newData
        }
      ]
    });
  };

  // Decrement function to decrease each value by 10
  const decrementValues = () => {
    const newData = chartData.datasets[0].data.map(value => value - 10);
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: newData
        }
      ]
    });
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'nearest',
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      {/* Line Chart */}
      <Line data={chartData} options={options} />

      {/* Buttons for incrementing and decrementing values */}
      <div className="mt-4 space-x-4">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow"
          onClick={incrementValues}
        >
          Increment by 10
        </button>
        <button 
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow"
          onClick={decrementValues}
        >
          Decrement by 10
        </button>
      </div>
    </div>
  );
};

export default LineChart;
