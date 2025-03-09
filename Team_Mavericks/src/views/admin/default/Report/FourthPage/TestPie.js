// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue, Heading } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";

// Custom components
import Card from "components/card/Card.js";
// import { useListContext } from "../../../../../contexts/listContext";



import React, { useEffect, useState } from "react";

export default function Conversion(props) {
  const { finalData } = props;
  const [genuine, setGenuine] = useState();
  const [counterfeit, setCounterfeit] = useState();


  const sumParameter = async () => {
    if (!Array.isArray(finalData)) return;
    let sumG = 0
    let sumC = 0
    finalData?.forEach(element => {
      sumG += element.genuine;
      sumC += element.counterfeit;
    });
    setGenuine(sumG);
    setCounterfeit(sumC);
  };

  useEffect(() => {
    sumParameter();
  }, [finalData]);

  const pieChartOptions = {
    labels: ["Genuine", "Counterfeit"],
    colors: ["#6ce5e8", "#41b8d5"],
    chart: {
      width: "70px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: { // Changed from 'donut' to 'pie'
        donut: {
          expandOnClick: false,
          labels: {
            show: true,
          },
        },
      },
    },
    fill: {
      colors: ["#6ce5e8", "#41b8d5"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  return (
      <ReactApexChart
        options={pieChartOptions}
        series={[genuine || 0, counterfeit || 0]} // Default to 0 if undefined
        type='donut'
      />


  );
}
