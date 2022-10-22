import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { RequestsInterface } from "../models/IRequest";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetRequests } from "../services/HttpClientService";
function Requests() {
  const [requests, setRequests] = useState<RequestsInterface[]>([]);

  const getRequests = async () => {
    let res = await GetRequests();
    if (res) {
      setRequests(res);
    }
  };
  
//   const columns: GridColDef[] = [
//     { field: "ID", headerName: "ลำดับ", width: 100 },
//     { field: "Date_Start", headerName: "วันที่อุปกรณ์พัง", width: 300 },
//     { field: "Explain", headerName: "คำอธิบาย", width: 200 },
//     { field: "Room_has_Device.DeviceID", headerName: "ชื่ออุปกรณ์", width: 200 },
//   ];

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },
    { field: "Date_Start", headerName: "วันที่อุปกรณ์พัง", width: 300 },
    { field: "Explain", headerName: "คำอธิบาย", width: 200 },

  ];

  useEffect(() => {
    getRequests();
    console.log(requests);

  }, []);
  
  return (
    <div>
      <Container maxWidth="md">
        <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลการแจ้งซ่อม
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/request/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={requests}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </Container>
    </div>
  );
}

export default Requests;