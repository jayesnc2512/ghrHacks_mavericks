import React, { useEffect, useState } from "react";
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
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { MdCheckCircle, MdCancel, MdImage } from "react-icons/md";


import { GiGloves } from "react-icons/gi";
import { FaHelmetSafety } from "react-icons/fa6";
import { FaShoePrints } from "react-icons/fa";
import { GiProtectionGlasses } from "react-icons/gi";
import { RiSurgicalMaskFill } from "react-icons/ri";
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';

// Safety gear icons mapping
const safetyItems = [
  { key: "gloves", icon: GiGloves },
  { key: "glasses", icon: GiProtectionGlasses },
  { key: "boots", icon: FaShoePrints },
  { key: "helmet", icon: FaHelmetSafety },
  { key: "mask", icon: RiSurgicalMaskFill },
];

export default function ComplexTable() {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("http://127.0.0.1:8000/dash/cctv-logs");
        const result = await response.json();
        if (result.status === 200) {
          const processedData = result.data.map((entry) => {
            return {
              ...entry,
              allSafe: entry.prediction.every((p) =>
                Object.values(p.safety_gear).every((v) => v === true)
              ),
            };
          });
          setData(processedData);
        } else {
          console.error("Failed to fetch logs:", result.message);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    fetchLogs();
  }, []);

  // Function to render safety icons
  const getSafetyIcons = (safetyGear) => (
    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
      {safetyItems.map(({ key, icon: Icon }) => (
        <Icon key={key} color={safetyGear[key] ? "green" : "red"} size={22} />
      ))}
    </div>
  );

  return (
    <>
      <Box flexDirection="column" w="100%" px="0px" overflowX="auto">
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            CCTV Log
          </Text>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              <Tr>
                <Th borderColor={borderColor} textAlign="center">Sr. No</Th>
                <Th borderColor={borderColor} textAlign="center">Site</Th>
                <Th borderColor={borderColor} textAlign="center">Safety Gear</Th>
                <Th borderColor={borderColor} textAlign="center">Image</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, index) => (
                <Tr key={index} backgroundColor={row.allSafe ? "lightgreen" : "red.200"}>
                  <Td textAlign="center">{index + 1}</Td>
                  <Td textAlign="center">{row.site}</Td>
                  <Td textAlign="center">{getSafetyIcons(row.prediction[0].safety_gear)}</Td>
                  <Td textAlign="center">
                    <Button
                      leftIcon={<MdImage />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(`http://127.0.0.1:8000/images/${row.frame_name}.jpg`);
                        onOpen();
                      }}
                    >
                      Preview
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Image Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center">
            <Image src={selectedImage} alt="CCTV Frame" maxW="100%" maxH="500px" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
