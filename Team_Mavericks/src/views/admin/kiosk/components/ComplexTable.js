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
import { GiGloves } from "react-icons/gi";
import { FaHelmetSafety } from "react-icons/fa6";
import { FaShoePrints } from "react-icons/fa";
import { GiProtectionGlasses } from "react-icons/gi";
import { RiSurgicalMaskFill } from "react-icons/ri";



// Column Helper
const columnHelper = createColumnHelper();

const safetyItems = [
  { key: "gloves", icon: GiGloves },
  { key: "glasses", icon: GiProtectionGlasses },
  { key: "boots", icon: FaShoePrints },
  { key: "helmet", icon: FaHelmetSafety },
  { key: "jacket", icon: MdCheckCircle }
];

export default function ComplexTable() {
  const [data, setData] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('http://127.0.0.1:8000/dash/kiosk-logs');
        const result = await response.json();
        if (result.status === 200) {
          const processedData = result.data.map(entry => {
            const logValues = Object.values(entry.log);
            const trueCount = logValues.filter(value => value === true).length;
            return { ...entry, status: trueCount >= 3 };
          });
          setData(processedData);
        } else {
          console.error('Failed to fetch logs:', result.message);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }
    fetchLogs();
  }, []);

  const getSafetyIcons = (log) => (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
      {safetyItems.map(({ key, icon: Icon }) => (
        <Icon key={key} color={log[key] ? "green" : "red"} size={22} />
      ))}
    </div>
  );

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
              <Th borderColor={borderColor} textAlign="center">Sr. No</Th>
              <Th borderColor={borderColor} textAlign="center">Employee ID</Th>
              <Th borderColor={borderColor} textAlign="center">Log Details</Th>
              <Th borderColor={borderColor} textAlign="center">Time</Th>
              <Th borderColor={borderColor} textAlign="center">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.slice().reverse().map((row, index) => (
              <Tr key={index} backgroundColor={row.status ? "lightgreen" : "red.200"}>
                <Td textAlign="center">{index + 1}</Td>
                <Td textAlign="center">{row.empID}</Td>
                <Td textAlign="center">{getSafetyIcons(row.log)}</Td>
                <Td textAlign="center">{new Date(row.timestamp).toLocaleString()}</Td>
                <Td textAlign="center">
                  {row.status ? <MdCheckCircle color="green" size={22} /> : <MdCancel color="red" size={22} />}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
