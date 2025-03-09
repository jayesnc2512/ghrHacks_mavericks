// Chakra imports
import ReactApexChart from "react-apexcharts";
import './SecondPage.css';

// Custom components

import React, { useEffect, useState } from "react";

export default function Conversion(props) {
    const { finalData }=props;

    const pieChartOptions = {
        labels: finalData && finalData.length > 0 ? finalData?.map((it) => it.brand || it.sellers || it.platform_name || "unknown") : [],
        colors: ["#6ce5e8", "#41b8d5", "#2d8bba", "#2f5f98", "#31356e", "#111D4A"],
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
            position: 'bottom'
        },
        dataLabels: {
            enabled: true,
        },

        hover: { mode: null },
        plotOptions: {
            donut: {
                expandOnClick: false,
                donut: {
                    labels: {
                        show: true,
                    },
                },
            },
        },
        fill: {
            colors: ["#6ce5e8", "#41b8d5", "#2d8bba", "#2f5f98", "#31356e", "#111D4A"],
        },
        tooltip: {
            enabled: true,
            theme: "dark",
        },
    };
    return (
        <div className="pie-card">
            <ReactApexChart
                options={pieChartOptions}
                series={finalData?.map((it) => it.count)}
                type='donut'
            />

        </div>
    );
}
