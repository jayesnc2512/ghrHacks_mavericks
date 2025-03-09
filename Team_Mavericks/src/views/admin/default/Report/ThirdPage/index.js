import React from 'react';
import './index.css';
import BrandAnalysisTable from "../SecondPage/BrandAnalysisTable";
import PlatformAnalysisTable from "../ThirdPage/PlatformAnalysisTable";
import BarChart from "../SecondPage/BarChart";

import {
    Flex,
    Heading,
    Text,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react";

const SecondPage = (props) => {
    const { brandWise,
        platformWise } = props;


    const finalData = [
        { brand: "La shiels", count: 20 },
        { brand: "scaple pro", count: 30 },
        { brand: "glenmark", count: 20 },
        { brand: "Abc", count: 10 },
        { brand: "DEF", count: 10 },
        { brand: "GHI", count: 10 }
    ];

    const data= [
        {
            "brands": "bontress",
            "suspicious": 70,
            "reported": 69,
            "removed": 69
        },
        {
            "brands": "candid",
            "suspicious": 63,
            "reported": 37,
            "removed": 36
        },
        {
            "brands": "D ACNE SOFT",
            "suspicious": 42,
            "reported": 15,
            "removed": 13
        },
        {
            "brands": "elovera",
            "suspicious": 61,
            "reported": 38,
            "removed": 38
        },
        {
            "brands": "episoft",
            "suspicious": 44,
            "reported": 30,
            "removed": 30
        },
        {
            "brands": "hair4u",
            "suspicious": 31,
            "reported": 25,
            "removed": 23
        },
        {
            "brands": "la shield",
            "suspicious": 123,
            "reported": 72,
            "removed": 63
        },
        {
            "brands": "lite glo",
            "suspicious": 19,
            "reported": 17,
            "removed": 16
        },
        {
            "brands": "maxrich",
            "suspicious": 137,
            "reported": 132,
            "removed": 132
        },
        {
            "brands": "reverzo",
            "suspicious": 8,
            "reported": 6,
            "removed": 6
        },
        {
            "brands": "scalpe pro",
            "suspicious": 33,
            "reported": 19,
            "removed": 17
        }
    ]

    const textColor = useColorModeValue("secondaryGray.900", "white");

    return (
        <div className="third-page">
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
                        DETAIL ANALYSIS
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
                    Brand-wise
                </Text>
            </Flex>
            <SimpleGrid columns="2" gap='10px' mb='20px'>
                <BrandAnalysisTable finalData={brandWise} heading="Brands" />
                <BarChart finalData={brandWise} />
            </SimpleGrid>
          
           
            <Flex px='25px' paddingBottom='10px' justify='space-between' align='center'>
                <Text
                    color={textColor}
                    fontSize='22px'
                    fontWeight='700'
                    lineHeight='100%'
                    m='auto'
                >
                    Platform Analysis
                </Text>
            </Flex>
            <SimpleGrid columns="2" gap='10px' mb='20px'>
                <PlatformAnalysisTable finalData={platformWise} heading="Platforms" />
                <BarChart finalData={platformWise} />

            </SimpleGrid>
        </div>
    );
};

export default SecondPage;
