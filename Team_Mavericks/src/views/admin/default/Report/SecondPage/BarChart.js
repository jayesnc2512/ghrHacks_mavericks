// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import Chart from "react-apexcharts";
import React, { useEffect } from "react";
// import {
//   barChartDataConsumption,
//   barChartOptionsConsumption,
// } from "variables/charts";
import { MdBarChart } from "react-icons/md";
import { transform } from "framer-motion";

export default function WeeklyRevenue(props) {
  const { finalData, setFinalData } = props;

  useEffect(() => {
    //console.log("keywordsArray", finalData);
  }, [finalData]);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  const barChartDataConsumption = [
    {
      name: "Vest",
      data: finalData.map((it) => it.Vest),
    },
    {
      name: "Helmet",
      data: finalData.map((it) => it.Helmet),
    },
    {
      name: "Gloves",
      data: finalData.map((it) => it.Gloves),
    },
  ];

  const barChartOptionsConsumption = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: finalData.map((it) => it.brands || it.Platforms),
      show: false,
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    yaxis: {
      show: true,
      color: "black",
      labels: {
        show: true,
        style: {
          colors: "#A3AED0",
          fontSize: "13px",
          fontWeight: "500",
        },
      },
    },

    grid: {
      borderColor: "rgba(163, 174, 208, 0.3)",
      show: true,
      yaxis: {
        lines: {
          show: false,
          opacity: 0.5,
        },
      },
      row: {
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#6ce5e8", "#41b8d5", "#2d8bba"],
    },
    legend: {
      show: true,
    },
    colors: ["#6ce5e8", "#41b8d5", "#2d8bba"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        // columnWidth: "40px",
        horizontal: true,


      },
    },
  };



  return (
    <>
      {finalData ? (
        <Box >
          <Chart
            options={finalData ? barChartOptionsConsumption : []}
            series={finalData ? barChartDataConsumption : {}}
            type='bar'
            height='400px'
          />
        </Box>
      ) : <></>}
    </>
  );
}
