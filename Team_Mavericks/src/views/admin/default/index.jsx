/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import WeatherStats from "./components/weatherStats";
import IconBox from "components/icons/IconBox";
import React,{useState,useEffect} from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import ReactWeather, { useWeatherBit } from 'react-open-weather';
import { FaTemperatureHigh } from "react-icons/fa";
import { MdAir } from "react-icons/md";
import { WiDayWindy } from "react-icons/wi";





export default function UserReports() {
  const [weatherData, setWeatherData] = useState({
    "count": 1,
    "data": [
      {
        "app_temp": 33.1,
        "aqi": 160,
        "city_name": "Jalgaon",
        "clouds": 0,
        "country_code": "IN",
        "datetime": "2025-03-08:07",
        "dewpt": -0.3,
        "dhi": 124,
        "dni": 948,
        "elev_angle": 61.34,
        "ghi": 947,
        "gust": 4.8,
        "h_angle": 0,
        "lat": 20.9735,
        "lon": 75.5575,
        "ob_time": "2025-03-08 07:47",
        "pod": "d",
        "precip": 0,
        "pres": 984,
        "rh": 10,
        "slp": 1011,
        "snow": 0,
        "solar_rad": 947,
        "sources": [
          "analysis",
          "radar",
          "satellite"
        ],
        "state_code": "16",
        "station": "VAAU",
        "sunrise": "01:11",
        "sunset": "13:06",
        "temp": 35.8,
        "timezone": "Asia/Kolkata",
        "ts": 1741420030,
        "uv": 9,
        "vis": 16,
        "weather": {
          "description": "Clear sky",
          "code": 800,
          "icon": "c01d"
        },
        "wind_cdir": "NW",
        "wind_cdir_full": "northwest",
        "wind_dir": 325,
        "wind_spd": 4.1
      }
    ],
  });

  const API_KEY = "6f07ddbed3b543bfaa0aa30122fd14de"; // Replace with your actual API key
  const lat = 20.973520;
  const lon = 75.557498;

  // useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API_KEY}&include=minutely`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        console.log(data);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

  // }, []); // Runs only once when the component mounts


  // Chakra Color Mode


  

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const weatherBg = useColorModeValue("orange.200", "orange.100");
  const weatherIconBg = useColorModeValue("secondaryGray.600", "orange.100");


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='10px'
        pb='10px'
        borderBottom="2px"

      >
        <WeatherStats
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="white"
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Registered Employees'
          value='45'
        />
        <WeatherStats
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="white"
              icon={
                <Icon w='32px' h='32px' as={MdAddTask} color={brandColor} />
              }
            />
          }
          name='Today Employees Verified'
          value='34'
        />
        <WeatherStats
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="white"
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total logs generated'
          value='120+'
        />
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'
      >
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={FaTemperatureHigh} color={brandColor} />
              }
            />
          }
          name='Temperature'
          value={`${weatherData.data[0].temp} °C`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAir} color={brandColor} />
              }
            />
          }
          name='Air Quality Index'
          value={weatherData.data[0].aqi}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={WiDayWindy} color={brandColor} />
              }
            />
          }
          name='Wind Speed / Direction'
          value={`${weatherData.data[0].wind_spd} / ${weatherData.data[0].wind_dir}`}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'> */}
          {/* <DailyTraffic /> */}
          <PieCard />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        {/* </SimpleGrid> */}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
