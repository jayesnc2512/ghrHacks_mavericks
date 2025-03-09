import React from 'react';
import './index.css';
// import BrandAnalysisTable from "../ThirdPage/BrandAnalysisTable";
// import PlatformAnalysisTable from "../ThirdPage/PlatformAnalysisTable";
// import BarChart from "./BarChart";
import TestPurchaseTable from './TestPurchaseTable';
import TestPie from './TestPie';

import {
    Flex,
    Heading,
    Text,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react";

const SecondPage = (props) => {
    const {test}=props

   

    const textColor = useColorModeValue("secondaryGray.900", "white");

    return (
        <div className="fourth-page">
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
                        TEST PURCHASE
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
                    Genuine v/s Counterfeit
                </Text>
            </Flex>
            <SimpleGrid columns="2" gap='10px' mb='20px'>
                <TestPurchaseTable finalData={test} heading="Brands" />
                <TestPie finalData={test} />
            </SimpleGrid>


           
        </div>
    );
};

export default SecondPage;
