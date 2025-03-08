

// Chakra imports
import { Box, SimpleGrid,Grid } from "@chakra-ui/react";
import React, {useState} from "react";
import Camera from "./components/Camera";
  

export default function Settings() {
  // Person, Gloves, Helmet, Goggles, Vest, Shoes



  const [cameraData, setCameraData] = useState([
    {
      name: "Site 1",
      prediction_classes: ["Person", "Gloves", "Helmet"],
      site: "Site 1",
      video_path: "0"     
    }
  ]);

    const invokeCamera = async (data) => {
      try {
        const response = await fetch("http://localhost:8001/dash/start-cctv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video: data.video_path, // Mapping video_path to video
            site: data.site,
            prediction_classes: data.prediction_classes
          }),
        });

        const result = await response.json();
        alert(JSON.stringify(result));
      } catch (error) {
        console.error("Error invoking API:", error);
        alert("Error invoking API:" + error);
      }
  };
  const stopCamera = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/dash/stop-cctv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ site: data.site }), // Send JSON body
      });

      const result = await response.json();
      alert(JSON.stringify(result));
    } catch (error) {
      console.error("Error invoking API:", error);
      alert("Error invoking API: " + error);
    }
  };

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        // mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>

        <Grid
          templateColumns={{
            base: "3fr",
            lg: "1.34fr 3fr 1.62fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "3fr",
          }}
          gap={{ base: "20px", xl: "20px" }}>
          
          {cameraData.map((it) => 
            <Camera
              gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
              data={it}
              invokeCamera={() => invokeCamera(it)}
              stopCamera={()=>stopCamera(it)}
              
            />
          )}
         
          </Grid>
      </SimpleGrid>
    </Box>
  );
}
