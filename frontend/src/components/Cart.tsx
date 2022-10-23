import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetCarts } from "../services/HttpClientService";
import { CartsInterface } from "../models/ICart";
import { ListCarts } from "../services/HttpClientService";


function Carts() {
  const [carts, setcarts] = useState<CartsInterface[]>([]);

  const getCarts = async () => {
    let res = await ListCarts();
    if (res) {
      setcarts(res);
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
    { field: "Start_Work", headerName: "รายการจองเวลางาน", width: 300 },
    { field: "Estimate", headerName: "ประเภทการซ่อมบำรุง", width: 200 },
    {
      field: "Estimate",
      headerName: "ประเภทการซ่อมบำรุง",
      width: 200,
      valueFormatter: (params) => params.value.Name,
    },
  ];

  useEffect(() => {
    getCarts();
    console.log(carts);
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
              บันทึกการจองตารางงาน
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/cart/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={carts}
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

export default Carts;