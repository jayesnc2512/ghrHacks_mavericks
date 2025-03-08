import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  Grid,
  Image,
  Spinner,
  Select,
} from "@chakra-ui/react";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Replace with your API key
const SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

// Dropdown options (categories of industrial safety)
const SAFETY_TOPICS = [
  { label: "General Safety Training", query: "industrial safety training" },
  { label: "PPE (Personal Protective Equipment)", query: "PPE kit professional safety training" },
  { label: "Fire Safety", query: "fire safety workplace training" },
  { label: "Hazard Awareness", query: "workplace hazard awareness" },
  { label: "Machine Safety", query: "machine safety training" },
];

const YouTubeVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(SAFETY_TOPICS[0].query);

  useEffect(() => {
    fetchVideos(selectedTopic);
  }, [selectedTopic]);

  const fetchVideos = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(SEARCH_URL, {
        params: {
          key: API_KEY,
          q: query,
          part: "snippet",
          maxResults: 10,
          type: "video",
        },
      });
      setVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  };

  return (
    <VStack spacing={6} p={6} maxW="900px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Industrial Safety Tutorials
      </Text>

      {/* Dropdown for selecting a safety category */}
      <Select
        placeholder="Select Safety Topic"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
        size="lg"
        focusBorderColor="blue.500"
        width="100%"
        maxW="500px"
      >
        {SAFETY_TOPICS.map((topic) => (
          <option key={topic.query} value={topic.query}>
            {topic.label}
          </option>
        ))}
      </Select>

      {loading && <Spinner size="xl" color="blue.500" />}

      {/* Video Grid */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6} width="100%">
        {videos.map((video) => (
          <Box key={video.id.videoId} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
            
            <Box p={4}>
              <Text fontWeight="bold" noOfLines={2}>
                {video.snippet.title}
              </Text>
              <Box mt={2}>
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  title={video.snippet.title}
                  allowFullScreen
                  style={{ borderRadius: "8px" }}
                ></iframe>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
};

export default YouTubeVideos;







