

// Chakra imports
import { Box, SimpleGrid,Grid } from "@chakra-ui/react";
import React, {useState} from "react";
import Camera from "./components/Camera";
  
  
export default function Settings() {



  const [cameraData, setCameraData] = useState([
    {
      name: "Site 1",
      settings: "Gloves, Helmet, Vest",
      camId: "1"
    }
  ]);

  const invokeCamera = ((data) => {
    alert(JSON.stringify(data));
  })
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
            />
          )}
         
          </Grid>
      </SimpleGrid>
    </Box>
  );
}
