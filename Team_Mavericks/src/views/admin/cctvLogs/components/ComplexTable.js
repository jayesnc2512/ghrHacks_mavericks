import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Icon,
  Center,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

// Column Helper
const columnHelper = createColumnHelper();

// React Component
export default function ComplexTable() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // Fetch data from API
  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('http://127.0.0.1:8000/dash/kiosk-logs'); // Use your actual server URL
        const result = await response.json();
        if (result.status === 200) {
          setData(result.data);
        } else {
          console.error('Failed to fetch logs:', result.message);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }

    fetchLogs();
  }, []);






  const headers = ["Sr.no", "Employee Name", "Log Details", "Status", "Time"];
  const rows = [{
    employeeName: "JNC",
    logDetails: "as",
    status: "true",
    time:"03/07/2025 18:20"
  }]

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Kiosk Log
        </Text>
        <Menu />
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            <Tr>
              {headers.map((headerGroup, index) => (
                  <Th
                    key={index}
                  colSpan={headerGroup}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                  >
                    <Flex
                      justifyContent="center"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                     {headerGroup}
                    </Flex>
                </Th>
              ))}

              </Tr>
          </Thead>
          <Tbody>
            {rows.map((row,index) => (
              <Tr key={index}>
                {/* SRNO */}
                  <Td
                    key={index}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                  borderColor="transparent"
                  textAlign="center"

                  >
                    {index+1}
                </Td>
                {/* Employee */}
                <Td
                  key={index}
                  fontSize={{ sm: '14px' }}
                  minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                  borderColor="transparent"
                  textAlign="center"

                >
                  {row.employeeName}
                </Td>
                {/* logDetails */}
                <Td
                  key={index}
                  fontSize={{ sm: '14px' }}
                  minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                  borderColor="transparent"
                  textAlign="center"

                >
                  {row.logDetails}
                </Td>
                {/* status */}
                <Td
                  key={index}
                  fontSize={{ sm: '14px' }}
                  minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                  borderColor="transparent"
                  textAlign="center"

                >
                  {row.status}
                </Td>
                {/* time */}
                <Td
                  key={index}
                  fontSize={{ sm: '14px' }}
                  minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                  borderColor="transparent"
                  textAlign="center"

                >
                  {row.time}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
