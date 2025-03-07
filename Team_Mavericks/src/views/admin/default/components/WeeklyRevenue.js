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
import React from "react";
import Chart from "react-apexcharts";
import { MdBarChart } from "react-icons/md";

export default function WeeklyRevenue(props) {
  const { ...rest } = props;

  // ApexChart configuration
  const chartOptions = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  };
  const chartSeries = [
    {
      name: "series-1",
      data: [85, 45, 55, 70, 49, 30],
    },
  ];

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

  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Daily Users
        </Text>
        <Button
          align="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
        </Button>
      </Flex>

      <Box h="240px" mt="auto" w="100%">
        {/* Replace the BarChart with ApexChart */}
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
          height="240px"
        />
      </Box>
    </Card>
  );
}
