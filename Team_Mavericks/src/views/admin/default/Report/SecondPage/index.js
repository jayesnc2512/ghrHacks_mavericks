import React from 'react';
import './SecondPage.css';
import PieCard from './PieCard';
import SuspectedTable from "./SuspectedTable";
import {
    Flex,
    Heading,
    Text,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react";
import BrandAnalysisTable from "./BrandAnalysisTable";
import BarChart from "./BarChart";
const SecondPage = (props) => {
    const { topSuspectedBrands,
topSuspectedSellers,
topInfringingPlatforms } = props;

    const finalData = [
        { brand: "Emp001",name:"Ravi", count: 20 },
        { brand: "Emp002", name: "Prakash", count: 30 },
        { brand: "Emp003", name: "Ram", count: 20 },
        { brand: "Emp004", name: "Sam", count: 10 },
        { brand: "Emp005", name: "Rishi",count: 10 },
        { brand: "Emp006", name: "Radhe", count: 10 }
    ];
    const sampleFinalData = [
        { brands: "Construction Site A", Vest: 120, Helmet: 85, Gloves: 40 },
        { brands: "Factory B", Vest: 95, Helmet: 70, Gloves: 30 },
        { brands: "Warehouse C", Vest: 75, Helmet: 50, Gloves: 25 },
        { brands: "Site D", Vest: 60, Helmet: 45, Gloves: 20 },
        { brands: "Factory E", Vest: 50, Helmet: 30, Gloves: 10 },
    ];


    const textColor = useColorModeValue("secondaryGray.900", "white");

    return (
        <div className="second-page">
            <Heading fontSize='24px' mb='10px'>
                <Flex paddingBottom='10px' justify='space-between' align='center'>
                    <Text
                        color={textColor}
                        fontSize='24px'
                        fontWeight='700'
                        lineHeight='100%'
                        m='auto'
                        className="heading1"
                    >
                        OVERVIEW
                    </Text>
                </Flex>
            </Heading>
            <Flex px='10px' paddingBottom='10px' justify='space-between' align='center'>
                <Text
                    color={textColor}
                    fontSize='18px'
                    fontWeight='700'
                    lineHeight='100%'
                    m='auto'
                    className="heading2"
                >
                    Top employee safety failures
                </Text>
            </Flex>
            <SimpleGrid columns="2" gap='10px' mb='20px'>
                <SuspectedTable finalData={finalData} heading="Brands" />
                <PieCard finalData={finalData} />
            </SimpleGrid>
            <Flex px='10px' paddingBottom='10px' justify='space-between' align='center'>
                <Text
                    color={textColor}
                    fontSize='18px'
                    fontWeight='700'
                    lineHeight='100%'
                    m='auto'
                    className="heading2"
                >
                    Top Safety Violations
                </Text>
            </Flex>
            <SimpleGrid columns='2' gap='10px' mb='20px'>
                <BrandAnalysisTable finalData={sampleFinalData}  />
                <BarChart finalData={sampleFinalData} />
            </SimpleGrid>
        </div>
    );
};

export default SecondPage;
