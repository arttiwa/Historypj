import React, { useState, useEffect } from "react";
import { HistorysInterface } from "../models/IHistory";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {GetHistorys} from "../services/HttpClientService";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

function History() {
    const [historys,setHistorys] = useState<HistorysInterface[]>([]);

    const getHistorys = async () => {1
        let res = await GetHistorys();
        if (res) {
            setHistorys(res);
        }
      };

    const columns: GridColDef[] = [
        { field: "ID", headerName: "ลำดับ", width: 50 },
        { field: "CreatedAt", headerName: "รายการจองเวลางาน", width: 200 },
        { field: "Cause",headerName: "สาเหตุ",width: 200, valueFormatter: (params) => params.value.Name}, 
        { field: "Solution", headerName: "วิธีซ่อม", width: 200 },
        { field: "Price", headerName: "ราคา", width: 100 },
    
    ];
    
      useEffect(() => {
        getHistorys();
        console.log(historys);
    
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
                  ประวัติการซ่อมบำรุง
                </Typography>
              </Box>
              <Box>
                <Button
                  component={RouterLink}
                  to="/history/create"
                  variant="contained"
                  color="primary"
                >
                  สร้างข้อมูล
                </Button>
              </Box>
            </Box>
            <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
              <DataGrid
                rows={historys}
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
export default History;


























