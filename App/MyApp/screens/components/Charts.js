import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';  // Import the LineChart component

const { width } = Dimensions.get('window');  // Get the window width for chart responsiveness

const Charts = ({ timeRange, dataType }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    fetchData();
  }, [timeRange, dataType]);

  // Mock data fetching function based on time range and data type
  const fetchData = async () => {
    let data;

    switch (dataType) {
      case 'AQI':
        data = await fetchAQIData(timeRange);
        break;
      case 'Temperature':
        data = await fetchTemperatureData(timeRange);
        break;
      case 'Noise':
        data = await fetchNoiseData(timeRange);
        break;
      case 'Gas Concentration':
        data = await fetchGasConcentrationData(timeRange);
        break;
      default:
        data = [];
    }

    setChartData(data);
  };

  // Mock fetch data functions
  const fetchAQIData = async (timeRange) => {
    const data = {
      labels: ['0', '1', '2', '3', '4', '5'],
      datasets: [
        {
          data: [30, 45, 60, 75, 80, 90], // Mock AQI data
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        },
      ],
    };
    return data;
  };

  const fetchTemperatureData = async (timeRange) => {
    const data = {
      labels: ['0', '1', '2', '3', '4', '5'],
      datasets: [
        {
          data: [22, 23, 25, 26, 28, 30], // Mock temperature data
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        },
      ],
    };
    return data;
  };

  const fetchNoiseData = async (timeRange) => {
    const data = {
      labels: ['0', '1', '2', '3', '4', '5'],
      datasets: [
        {
          data: [50, 55, 60, 65, 70, 75], // Mock noise data
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        },
      ],
    };
    return data;
  };

  const fetchGasConcentrationData = async (timeRange) => {
    const data = {
      labels: ['0', '1', '2', '3', '4', '5'],
      datasets: [
        {
          data: [5, 6, 8, 9, 10, 12], // Mock gas concentration data
          strokeWidth: 2,
          color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
        },
      ],
    };
    return data;
  };

  return (
    <View>
      {chartData.labels ? (
        <>
          {/* <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
            {dataType} - {timeRange}
          </Text> */}
          <LineChart
            data={chartData}
            width={width - 30} // Set chart width
            height={220} // Set chart height
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2, // Optional: Set number of decimal places
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Customize axis line color
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Customize label color
              style: {
                borderRadius: 16,
              },
            }}
            withDots={true} // Show dots on the line chart
            withInnerLines={false} // Disable inner lines
            withOuterLines={false} // Disable outer lines
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Charts;
