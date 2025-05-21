import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphCard = ({ coin }) => {
  const data = {
    labels: coin.sparkline_in_7d.price.map((_, index) => index),
    datasets: [
      {
        label: coin.name,
        data: coin.sparkline_in_7d.price,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${coin.name} Price Chart`,
      },
    },
  };

  return (
    <div className="bg-[#141414] bg-opacity-5 p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default GraphCard;
