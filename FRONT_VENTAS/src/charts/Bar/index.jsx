import React from "react";
import { Bar } from "react-chartjs-2";
import { colors } from "../helper";

export const BarGrafico = ({ databar }) => {
  let numcolors = databar.labels.length;
  let colorsforthis = [];

  colors.map((col, i) => {
    if (i < numcolors) {
      colorsforthis.push(col);
    }
  });

  function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  let mayorstat = getMaxOfArray(databar.data);
  let sumtotal = databar.data.reduce((a, b) => parseInt(a) + parseInt(b));
  let position = 0;
  databar.data.map((label, i) => {
    if (label == mayorstat) {
      position = i;
    }
  });

  const options = {
    plugins: {
      labels: {
        render: "value",
        fontSize: 14,
        fontStyle: "bold",
        fontColor: "#000",
        precision: 2
      }
    },
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,

    legend: {
      display: false,
      position: "top"
    },

    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      },
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "No. de personas"
          },
          ticks: {
            beginAtZero: false,
            steps: 4,
            stepValue: 1,
            max: sumtotal || 5000
          }
        }
      ],

      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: `${databar.title}`
          }
        }
      ]
    }
  };

  const datashow = {
    labels: databar.labels,
    titulo: databar.title,
    datasets: [
      {
        backgroundColor: [
          "#0BC0C1",
          "#FFCC33",
          "#FF3366",
          "#FF6633",
          "#3B96E1",
          "##0BC0C1"
        ],
        labels: databar.labels,
        data: databar.data
      }
    ]
  };


  return <Bar data={datashow} options={options} />;
};
