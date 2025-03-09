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
// import { useListContext } from "../../../../../contexts/listContext";












export default function SuspectedBrandsTable(props) {
  const { finalData,heading } = props;
  // const { list, checkedPlatforms, abuse_type, dateFilter } = useListContext();

  const userInfo = JSON.parse(localStorage.getItem('PAuser'));
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("black.400", "whiteAlpha.100");




  return (

    <Table variant='simple' color='black' mb='24px'>
      <Thead>
        <Tr >
          <Th
            borderBottom="2px solid"
            borderColor={borderColor}
            textAlign="center"
            justify='space-between'
            fontSize={{ sm: "10px", lg: "12px" }}
            color='black.400'
>
        
              EmpId
          </Th>
          <Th
            borderBottom="2px solid"
            borderColor={borderColor}
            textAlign="center"
            justify='space-between'
            fontSize={{ sm: "10px", lg: "12px" }}
            color='black.400'
          >

            Name
          </Th>
          <Th
            borderBottom="2px solid"
            borderColor={borderColor}
            textAlign="center"
            justify='space-between'
            fontSize={{ sm: "10px", lg: "12px" }}
            color='black.400'
>
            
              Count
          </Th>
        </Tr>
      </Thead>
      <Tbody >
        {finalData?.map((row, index) => (
          <Tr key={index} >
            <Td
              fontSize={{ sm: "14px" }}
              borderColor='transparent'
              padding="5px"
              textAlign="center"
              color='black.400'

            >
              {row.brand||row.sellers||row.platform_name}
            </Td>
            <Td
              fontSize={{ sm: "14px" }}
              borderColor='transparent'
              padding="5px"
              textAlign="center"
              color='black.400'

            >
              {row.name}
            </Td>
            <Td
              paddingBottom="0px"
              textAlign="center"
              fontSize={{ sm: "14px" }}
              borderColor='transparent'
              color='black.400'

            >
              {row.count}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
