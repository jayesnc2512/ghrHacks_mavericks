

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
// import DevelopmentTable from "views/admin/cctvLogs/components/DevelopmentTable";
// import CheckTable from "views/admin/cctvLogs/components/CheckTable";
// import ColumnsTable from "views/admin/cctvLogs/components/ColumnsTable";
import ComplexTable from "views/admin/cctvLogs/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/kiosk/variables/columnsData";
// import tableDataDevelopment from "views/admin/kiosk/variables/tableDataDevelopment.json";
// import tableDataCheck from "views/admin/kiosk/variables/tableDataCheck.json";
// import tableDataColumns from "views/admin/kiosk/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/cctvLogs/variables/tableDataComplex.json";
import Search from 'views/admin/tutorials/YtubeSearch';
import React from "react";

export default function Settings() {
  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        // mb='20px'
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: "20px", xl: "20px" }}>
        {/* <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        /> */}
        {/* <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} /> */}
        {/* <ColumnsTable
          columnsData={columnsDataColumns}
          tableData={tableDataColumns}
        /> */}
       
       <Search/>
      </SimpleGrid>
    </Box>
  );
}
