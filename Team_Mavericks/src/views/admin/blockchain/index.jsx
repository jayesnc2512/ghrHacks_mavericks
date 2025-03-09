import React, { useState } from "react";
import { Box, Button, Input, Text, VStack, HStack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import {Link, Card, CardBody, CardHeader } from "@chakra-ui/react";

import Web3 from "web3";
import axios from "axios";

const pinataApiKey = "2b3bc97dcee172987299";
const pinataSecretApiKey = "91f13f0fed40ff2ace327e7f867157365cc55d7fdfd60077594994f8fb187c09";
const web3 = new Web3("http://127.0.0.1:7545");
const contractAddress = "0xbA00d14468178055Bc6edE062186c7f4D570ECc4";
const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "reportId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "ReportAdded", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_ipfsHash", "type": "string" }, { "internalType": "string", "name": "_name", "type": "string" }], "name": "addReport", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_reportId", "type": "uint256" }], "name": "getReport", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "ipfsHash", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reportCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "reports", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "ipfsHash", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }];
const contract = new web3.eth.Contract(contractABI, contractAddress);
const userAccount = "0xD320883Fd406900D4283740772E82849B65a30e8";

export default function BlockchainReportSystem() {
    const [file, setFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState("");
    const [reportName, setReportName] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [reportId, setReportId] = useState("");
    const [retrievedReport, setRetrievedReport] = useState(null);

    const uploadToIPFS = async () => {
        if (!file) {
            alert("Please select a file!");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    "pinata_api_key": pinataApiKey,
                    "pinata_secret_api_key": pinataSecretApiKey,
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.data && response.data.IpfsHash) {
                setIpfsHash(response.data.IpfsHash);
            }
        } catch (error) {
            console.error("IPFS Upload Error:", error);
        }
    };

    const storeOnBlockchain = async () => {
        if (!reportName || !ipfsHash) {
            alert("Please enter a name and upload a file first!");
            return;
        }
        try {
            const gasEstimate = await contract.methods.addReport(reportName, ipfsHash).estimateGas({ from: userAccount });
            const tx = await contract.methods.addReport(reportName, ipfsHash).send({
                from: userAccount,
                gas: gasEstimate
            });
            setTransactionHash(tx.transactionHash);
        } catch (error) {
            console.error("Blockchain Error:", error);
        }
    };

    const retrieveReport = async () => {
        if (!reportId) {
            alert("Enter a report ID!");
            return;
        }
        try {
            const result = await contract.methods.getReport(reportId).call();
            setRetrievedReport({ name: result[0], ipfsHash: result[1] });
        } catch (error) {
            console.error("Retrieval Error:", error);
        }
    };

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Tabs isFitted>
                <TabList>
                    <Tab>Upload</Tab>
                    <Tab>Store</Tab>
                    <Tab>Retrieve</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack>
                            <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                            <Button colorScheme="blue" onClick={uploadToIPFS}>Upload to IPFS</Button>
                            {ipfsHash && <Text>IPFS Hash: {ipfsHash}</Text>}
                        </VStack>
                    </TabPanel>
                    <TabPanel>
                        <VStack>
                            <Input placeholder="Enter Report Name" value={reportName} onChange={(e) => setReportName(e.target.value)} />
                            <Button colorScheme="green" onClick={storeOnBlockchain}>Store on Blockchain</Button>
                            {transactionHash && <Text>Transaction Hash: {transactionHash}</Text>}
                        </VStack>
                    </TabPanel>

                    <TabPanel>
                        <VStack spacing={4} align="stretch">
                            <Input
                                type="number"
                                placeholder="Enter Report ID"
                                value={reportId}
                                onChange={(e) => setReportId(e.target.value)}
                            />
                            <Button colorScheme="purple" onClick={retrieveReport}>Retrieve Report</Button>

                            {retrievedReport && (
                                <Card borderWidth="1px" borderRadius="lg" boxShadow="md" p={4}>
                                    <CardHeader fontSize="lg" fontWeight="bold">Report Details</CardHeader>
                                    <CardBody>
                                        <Text><strong>Report Name:</strong> {retrievedReport.name}</Text>
                                        <Text><strong>IPFS Hash:</strong> {retrievedReport.ipfsHash}</Text>
                                        <Link
                                            href={`https://gateway.pinata.cloud/ipfs/${retrievedReport.ipfsHash}`}
                                            isExternal
                                            color="blue.500"
                                            fontWeight="bold"
                                        >
                                            View on IPFS
                                        </Link>
                                    </CardBody>
                                </Card>
                            )}
                        </VStack>
                    </TabPanel>

                </TabPanels>
            </Tabs>
        </Box>
    );
}
