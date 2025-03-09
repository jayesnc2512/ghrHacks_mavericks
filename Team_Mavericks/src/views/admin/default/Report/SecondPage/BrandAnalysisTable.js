import {
    Flex,
    Table,
    Checkbox,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";




export default function SuspectedBrandsTable(props) {
    const {  finalData} = props;
    // finalData, setFinalData
    const userInfo = JSON.parse(localStorage.getItem('PAuser'));
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("black.200", "whiteAlpha.100");

    return (
        
            <Table variant='simple' color='black.500' mb='24px'>
                <Thead>

                <Tr borderBottom="2px solid"
>
                        <Th
                            pe='10px'
    >
                            <Flex
                                justify='space-between'
                                align='center'
                                fontSize={{ sm: "10px", lg: "12px" }}
                            color='black.400'>
                                Site
                            </Flex>
                        </Th>
                        <Th
                            pe='10px'
                            borderTop='4px solid #6ce5e8'
                            margin='5px'
                            marginTop='5px'
                            marginRight='5px'
                            marginLeft='5px'>
                            <Flex
                                justify='space-between'
                                align='center'
                                fontSize={{ sm: "10px", lg: "12px" }}
                            color='black.400'>
                                Vest
                            </Flex>
                        </Th>
                        <Th
                            pe='10px'
                        borderTop='4px solid #41b8d5'
                        
                            margin='5px'
                            marginTop='5px'
                            marginRight='5px'
                            marginLeft='5px'>
                            <Flex
                                justify='space-between'
                                align='center'
                                fontSize={{ sm: "10px", lg: "12px" }}
                                color='black.400'>
                                Helmet
                            </Flex>
                        </Th>
                        <Th
                            pe='10px'
                            borderTop='4px solid #2d8bba'
                            margin='5px'
                            marginTop='5px'
                            marginRight='5px'
                            marginLeft='5px'>
                            <Flex
                                justify='space-between'
                                align='center'
                                fontSize={{ sm: "10px", lg: "12px" }}
                                color='black.400'>
                                Gloves
                            </Flex>
                        </Th>

                    </Tr>
                </Thead>
                <Tbody >
                    {finalData?.map((item, index) => (
                        <Tr key={index}>
                            <Td
                                fontSize={{ sm: "14px" }}
                                borderColor='transparent'
                                padding="5px"
                                textAlign="center">
                                {item.brands}
                            </Td>
                            <Td
                                fontSize={{ sm: "14px" }}
                                borderColor='transparent'
                                padding="5px"
                                textAlign="center">
                                {item.Vest}
                            </Td>
                            <Td
                                fontSize={{ sm: "14px" }}
                                borderColor='transparent'
                                padding="5px"
                                textAlign="center">
                                {item.Helmet}
                            </Td>
                            <Td
                                fontSize={{ sm: "14px" }}
                                borderColor='transparent'
                                padding="5px"
                                textAlign="center">
                                {item.Gloves}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
    )
};
