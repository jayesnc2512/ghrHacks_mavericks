import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import logo from "assets/logo.jpg";
import './FirstPage.css';

const FirstPage = (props) => {
    const { brandName,setName } = props;
 
    const [timeline, setTimeline] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search); // Using window.location for client-side

        const encodedDateFilter = searchParams.get('dateFilter');

        if (encodedDateFilter) {
            try {
                const decodedDateFilter = JSON.parse(decodeURIComponent(encodedDateFilter));

                if (decodedDateFilter) {
                    const { startDate, endDate } = decodedDateFilter;

                    // Convert strings to Date objects
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    if (!isNaN(start) && !isNaN(end)) {
                        // Check if the dates are valid
                        const options = { year: 'numeric', month: 'long' };
                        let startFormatted = new Intl.DateTimeFormat('en-US', options).format(start);
                        let endFormatted = new Intl.DateTimeFormat('en-US', options).format(end);
                        if (startFormatted === "August 2000") {
                            startFormatted=""
                        }

                        setTimeline(`${startFormatted} - ${endFormatted}`);
                    } else {
                        console.error('Invalid Date objects:', start, end);
                    }
                }
            } catch (error) {
                console.error('Error parsing dateFilter:', error);
            }
        }

        if (brandName) {
            setName(brandName);
        }
    }, []);

    return (
        <Box className="first-page">
            <Flex justifyContent="center" alignItems="center" height="20%">
                {/* <Image src={logo} alt="Pirates Alert Logo" boxSize="200px" /> */}
                </Flex>
            <Flex direction="column" className="brand-box" alignItems="center">
                <Heading as="h1" fontSize="100px" mt="45px">सुRakshak Ai</Heading>
                <Heading as="h3" fontWeight='350' letterSpacing="10px" wordSpacing="normal" mt="45px">
                    Safety REPORT
                </Heading>
                <Heading as="h3" size='lg' letterSpacing="7px" fontWeight='250'>
                    {timeline}
                </Heading>
            </Flex>
        </Box>
    );
};

export default FirstPage;
