import React from "react";
import { Pie } from "react-chartjs-2";

export const DonaGrafico = ({ databar }) => {
  let sumtotal = databar.data.reduce((a, b) => parseInt(a) + parseInt(b));

  let percents = [];
  let newestratos = [];

  if (databar.title === "Estrato social de las personas encuestadas") {
    databar.labels.map(dato => {
      let newestra = `Estrato ${dato}`;
      newestratos.push(newestra.toString());
    });
  } else {
    newestratos = databar.labels;
  }

  databar.data.map(dato => {
    let percentin = Math.round(parseFloat((dato / sumtotal) * 100), 10);
    percents.push(percentin.toString());
  });
  const options = {
    legend: {
      display: false
    },
    responsive: true,
    legend: {
      display: true
    },
    animation: {
      animateRotate: true,
      duration: 1000,
      animateScale: true,
      animationSteps: 15
    },

    plugins: {
      labels: {
        render: "percentage",
        fontSize: 14,
        fontStyle: "bold",
        fontColor: "#000",
        precision: 2
      }
    }
  };

  const datashow = {
    labels: newestratos,
    titulo: databar.title,
    datasets: [
      {
        data: percents,
        backgroundColor: [
          "#0BC0C1",
          "#FFCC33",
          "#FF3366",
          "#FF6633",
          "#3B96E1",
          "##0BC0C1"
        ],
        borderColor: [
          "#0BC0C1",
          "#FFCC33",
          "#FF3366",
          "#FF6633",
          "#3B96E1",
          "##0BC0C1"
        ],
        borderWidth: 1
      }
    ]
  };

  return <Pie data={datashow} width={50} height={50} options={options} />;
};
