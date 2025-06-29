import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title);

const AircraftTypeRevenueChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Humidity (%)",
        data: [],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  });

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        "https://weather.shancloudservice.com/weatherdata",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = response.data;

      console.log("Fetched weather data:", data); // Debug log

      const labels = data.map((entry) => entry.Time);
      const temperatures = data.map((entry) => parseFloat(entry.Temperature));
      const humidity = data.map((entry) => parseFloat(entry.Humidity));

      setChartData((prev) => ({
        ...prev,
        labels: labels,
        datasets: [
          {
            ...prev.datasets[0],
            data: temperatures,
          },
          {
            ...prev.datasets[1],
            data: humidity,
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []); // Run only once on mount

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Temperature and Humidity Over Time",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "80%" }}>
      <h2>Dynamic Temperature and Humidity Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AircraftTypeRevenueChart;
