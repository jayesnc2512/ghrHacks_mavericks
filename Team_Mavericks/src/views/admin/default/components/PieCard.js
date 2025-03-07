// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";

export default function Conversion(props) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
        <Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
          Pie Chart Containing Detected Objects
        </Text>
        <Select
          fontSize='sm'
          variant='subtle'
          defaultValue='monthly'
          width='unset'
          fontWeight='700'>
          <option value='daily'>Daily</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </Select>
      </Flex>

      <PieChart
        h='300px'
        w='300px'
        chartData={pieChartData}
        chartOptions={pieChartOptions}
      />
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>
    <Flex direction='row' py='5px' me='10px'>
      {pieChartOptions.labels.map((label, index) => (
        <React.Fragment key={label}>
          <Flex align='center' mb='10px'>
            <Box
              h='8px'
              w='8px'
              bg={pieChartOptions.colors[index]}
              borderRadius='50%'
              me='4px'
            />
            <Text
              fontSize='xs'
              color='secondaryGray.600'
              fontWeight='700'
              mb='5px'>
              {label}
            </Text>
            <Text fontSize='lg' color='secondaryGray.900' fontWeight='700' ml='4px'>
              {pieChartData[index]}%
            </Text>
          </Flex>
          {index < pieChartOptions.labels.length - 1 && (
            <Box
              mx={{ base: "10px", xl: "10px", "2xl": "10px" }}
              h='20px'
              w='1px'
              bg='secondaryGray.400'
            />
          )}
        </React.Fragment>
      ))}
    </Flex>

      </Card>
    </Card>
  );
}
