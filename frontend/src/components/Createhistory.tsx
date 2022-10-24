import React,{useState,useEffect} from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Link as RouterLink } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import { HistorysInterface } from "../models/IHistory";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { CartsInterface } from "../models/ICart";
import { DMGlevelsInterface } from "../models/IDMGlevel";

import {
  GetCarts,
  GetDMGlevels,
  GetOnlyCart,
  GetRequest,
  GetOnlyRHD,
  History,
} from "../services/HttpClientService";
import { RequestsInterface } from "../models/IRequest";
import { RHDsInterface } from "../models/IRHD";

function Createhistory() {
    const [history,setHistory] = useState<HistorysInterface>({});
    const [cause,setCause] = useState<string>("");
    const [solution,setSolution] = useState<string>("");
    const [price,setPrice] = useState<string>("");
    const [carts,setCarts] = useState<CartsInterface[]>([]);
    const [cart,setCart] = useState<CartsInterface>({});
    const [request,setRequest] = useState<RequestsInterface>({});
    const [rhd,setRHD] = useState<RHDsInterface>({});
    const [dmglevels,setDMGlevels] = useState<DMGlevelsInterface[]>([]);

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    // const handleInputChange = (
    //   event: React.ChangeEvent<{ id?: string; value: any }>
    // ) => {
    //   const id = event.target.id as keyof typeof Createhistory;
    //   const { value } = event.target;
    //   setHistory({ ...history, [id]: value });
    // };  
    
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
      props,
      ref
     ) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
     });
    const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);
    };
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    const convertType = (data: string | number | undefined) => {
      let val = typeof data === "string" ? parseInt(data) : data;
      return val;
    };

    async function submit() {
      let data = {
        Cause: (cause),
        Solution: (solution),
        Price: convertType(price),
        CartID:     convertType(history.CartID),
	      UserID:     convertType(localStorage.getItem("uid")+""),
	      DMGLevelID: convertType(history.DMGLevelID),
    };
    console.log(data);
    let res = await History(data);
    console.log(res);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
    } 

    const handleChange = (event: SelectChangeEvent) => {      //onchange
      const name = event.target.name as keyof typeof history;
      const value = event.target.value;
      setHistory({
        ...history,
        [name]: value,
      });
      console.log(`[${name.toString()}]: ${value}`);
    };
    const getCarts = async () => {
      let res = await GetCarts();
      if (res) {
        setCarts(res);
        console.log("Load Cart Complete");
      }
      else{
        console.log("Load Cart InComplete!!!!");
      }
    };
    const getDMGlevels = async () => {
      let res = await GetDMGlevels();
      if (res != null) {
        setDMGlevels(res);
        console.log(res);
        console.log("Load DMGlevel Complete");
      }
      else{
        console.log("Load DMGlevel InComplete!!!!");
      }
    };
    const onChangeCart = async (e: SelectChangeEvent) => {
      let id = e.target.value;
      let res = await GetOnlyCart(id);
      if (res) {
        setCart(res);  
        console.log(res);
        console.log("Load Cart ID Complete");
      }
      else{
        console.log("Load Cart ID Incomplete!!!");
      }

      id = res.RequestID; // id cart for find re-id
      res = await GetRequest(id);
      if (res) {
        setRequest(res);  
        console.log("Load Request Complete");
      }
      else{
        console.log("Load Request Incomplete!!!");
      }
      id = res.Room_has_Device_ID; // id request for find RHD-id
      res = await GetOnlyRHD(id);
      if (res) {
        setRHD(res);  
        console.log("Load RHD Complete");
      }
      else{
        console.log("Load RHD Incomplete!!!");
      }
    };
    useEffect(() => {
      getCarts();
      getDMGlevels();
    }, []);

  return (
    <div>
      <Container maxWidth="md">
          <Box flexGrow={1}>
            <Paper>
              <Box sx = {{paddingX : 2,paddingY : 2}}>
                <Typography
                  component="h5"
                  variant="h5"
                  color="primary"
                  gutterBottom
                >
                  สรุปผลการซ่อมบำรุง
                </Typography>
              </Box>
            </Paper>
                <Divider />
          </Box>

        <Paper>
          <Box sx = {{paddingX : 4,paddingY : 4}}>
            <Grid container spacing={2}>

              <Snackbar 
                  open={success}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}> 
            <Alert onClose={handleClose} severity="success">
              บันทึกข้อมูลสำเร็จ
            </Alert>
              </Snackbar>

              <FormControl fullWidth variant="outlined">     
                <Typography
                    component="h2"
                    variant="h5"
                    color="primary"
                    gutterBottom
                  >รายการงานที่เลือก
                </Typography>
                  <Grid item xs={6}>
                  <Select
                    required
                    defaultValue={"0"}
                    onChange={(e) => {
                      (handleChange(e));
                      onChangeCart(e);
                    }}
                    inputProps={{
                      name: "CartID",
                    }}
                  >
                    <MenuItem value={"0"}>เลือกงานที่ต้องการซ่อมบำรุง</MenuItem>
                      {carts?.map((item: CartsInterface) => {
                        if (item.History == null) {
                        return(<MenuItem
                          key={item.ID}
                          value={item.ID}
                        >
                          {item.ID}
                        </MenuItem>)
                        }
                      })}
                  </Select>
                  </Grid>
              </FormControl>
              
              <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <p>ผู้แจ้ง</p>
                      <TextField
                        value={request?.User?.Name || ""}  
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <p>วันที่แจ้ง</p>
                      <TextField
                        value={request?.Date_Start || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                      /> 
                    </FormControl>
                  </Grid>  
              </Grid>  

              <Grid container spacing={2}>
                <Grid item xs={6}>    
                    <FormControl fullWidth variant="outlined">
                        <p>สถานที่</p>
                        <TextField
                            
                            multiline
                            maxRows={2}
                            value={ `ชื่อตึก: ${rhd?.Room?.Building?.Name}\n`+
                                    `ชื่อห้อง: ${rhd?.Room?.Name}`}
                          />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined">
                  <p>รหัสอุปกรณ์ที่เสีย</p>
                    <TextField
                      value={rhd?.DeviceID || ""}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <p>ข้อความจากผู้แจ้ง</p>
                        <TextField
                          value={cart?.Request?.Explain || ""}
                          InputProps={{
                            readOnly: true,
                          }}/>
                    </FormControl>
                  </Grid>
                             
                  <Grid container spacing={2}>
                    <Grid item xs={12}><p>สาเหตุที่เสีย</p>
                      <TextField fullWidth id="สาเหตุที่เสีย" 
                        type="String" variant="outlined" 
                        onChange={(event)=> setCause(event.target.value)} 
                    />
                    </Grid> 
                  </Grid>         

                  <Box sx = {{paddingX : 2,paddingY : 2}}>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined">   
                        <p>เลือกระดับความเสียหาย</p>
                        <Select
                          required
                          defaultValue={"0"}
                          onChange={handleChange}
                          inputProps={{
                            name: "DMGLevelID",
                          }}
                        >
                          <MenuItem value={"0"}>กรุณาเลือกระดับความเสียหาย</MenuItem>
                            {dmglevels?.map((item: DMGlevelsInterface) => 
                            
                              <MenuItem
                                key={item.ID}
                                value={item.ID}>
                                {item.DMGLevel}
                              </MenuItem>
                            )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Box> 

                  <Grid item xs={12}></Grid>

                  <Box flexGrow={1}>
                    <Box sx = {{paddingX : 2,paddingY : 2}}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}><p>วิธีซ่อม</p>
                        <TextField fullWidth id="วิธีซ่อม" type="String" variant="outlined" 
                          onChange={(event)=> setSolution(event.target.value)}/>
                      </Grid>
              
                      <Grid item xs={6}><p>ค่าใช้จ่าย</p>
                        <TextField fullWidth id="ค่าใช้จ่าย"
                          InputProps={{inputProps:{min:0, max:1000000}}} 
                          type="number" variant="outlined" 
                          onChange={(event)=> setPrice(event.target.value)}/>
                      </Grid>
                      </Grid>
                    </Box>
                  </Box> 

                    <Grid item xs={12}>
                  <Button component={RouterLink} to="/history" variant="contained">
                    Back
                  </Button>
                  <Button
                    style={{ float: "right" }}
                    onClick={submit}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>

            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
export default Createhistory;