import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";

import {
  GetBuildings,
  GetUser,
  GetRooms,
  GetRHD,
  GetJobTypes,
  Requests,
} from "../services/HttpClientService";

import { RequestsInterface } from "../models/IRequest";
import { BuildingsInterface } from "../models/IBuilding";
import { RoomsInterface } from "../models/IRoom";
import { UsersInterface } from "../models/IUser";
import { RHDsInterface } from "../models/IRHD";
import { JobTypesInterface } from "../models/IJobType";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert( props, ref ) {
 return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function RequestCreate() {
  const [user, setUser] = useState<UsersInterface>({});
  const [request, setRequest] = useState<RequestsInterface>({
    Explain: "",
    Date_Start: new Date(),
  });
  const [building, setBuilding] = useState<BuildingsInterface[]>([]);
  const [room, setRoom] = useState<RoomsInterface[]>([]);
  const [rhd, setRHD] = useState<RHDsInterface[]>([]);
  const [jobtypes, setJobTypes] = useState<JobTypesInterface[]>([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

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

  const handleInputChange_Text = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
    const id = event.target.id as keyof typeof request;
    const { value } = event.target;
    setRequest({ ...request, [id]: value, });
    console.log(`[${id}]: ${value}`);
  };

  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof request;
    const value = event.target.value;
    setRequest({
      ...request,
      [name]: value,
    });
    console.log(`[${name}]: ${value}`);
  };

  const onChangeBuilding = async (e: SelectChangeEvent) =>{
    const bid = e.target.value;
    let res = await GetRooms(bid);
    if (res) {
      setRoom(res);
      
      console.log("Load Room Complete");
    }
    else{
      console.log("Load Room Incomplete!!!");
    }
    
  }

  const onChangeRoom = async (e: SelectChangeEvent) =>{
    const rid = e.target.value;
    // console.log(rid);
    let res = await GetRHD(rid);
    if (res) {
      setRHD(res);
      console.log("Load Device Complete");
    }
    else{
      console.log("Load Device Incomplete!!!");
    }
  }

  // const onChangeRHD = async (e: SelectChangeEvent) =>{
  //   const value = e.target.value;
  //   console.log(value);
  //   const name = e.target.name as keyof typeof request;
  //   console.log("Load!!!");
  //   console.log(`[${name}]: ${value}`);
  // }

  const getUser = async () => {
    let res = await GetUser();
    if (res) {
      setUser(res);
      console.log("Load User Complete");
    }
    else{
      console.log("Load User InComplete!!!!");
    }
  };

  const getJobType = async () => {
    let res = await GetJobTypes();
    if (res) {
      setJobTypes(res);
      console.log("Load JobType Complete");
    }
    else{
      console.log("Load JobType InComplete!!!!");
    }
  };

  const getBuilding = async () => {
    let res = await GetBuildings();
    if (res) {
      setBuilding(res);
      console.log("Load Building Complete");
    }
    else{
      console.log("Load Building InComplete!!!!");
    }
    
    // console.log(building);
  };

  useEffect(() => {
    getBuilding();
    getUser();
    getJobType();
  }, []);

  async function submit() {
    let data = {
      Date_Start: request.Date_Start,
      Explain: request.Explain,
      
      UserID: convertType(user.ID),
      JobTypeID: convertType(request.JobTypeID),
      Room_has_Device_ID: convertType(request.Room_has_Device_ID),

    };

    let res = await Requests(data);
    console.log(res);
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }
  }


  return (
  <Container maxWidth="md">
           <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}
             anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
           >
             <Alert onClose={handleClose} severity="success">
               บันทึกข้อมูลสำเร็จ
             </Alert>
           </Snackbar>

           <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
             <Alert onClose={handleClose} severity="error">
               บันทึกข้อมูลไม่สำเร็จ
             </Alert>
           </Snackbar>

    <Paper>

      <Divider />
      <Grid container spacing={3} sx={{ padding: 2 }}>       
        <Grid item xs={6}>
          {/* <p>สถานที่ที่อุปกรณ์ชำรุด </p> */}
          <FormControl fullWidth variant="outlined">
            <p>ตึก</p>
            <Select
              required
              defaultValue={"0"}
              onChange={ (onChangeBuilding) }
              inputProps={{
                name: "BuildingID",
              }}
            >
              <MenuItem  value={"0"}>กรุณาเลือกตึก</MenuItem>
                {building.map((item: BuildingsInterface) => (
                  <MenuItem 
                    key={item.ID}
                    value={item.ID}
                  >
                    {item.Name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">   
            <p>ห้อง</p>
            <Select
              required
              defaultValue={"0"}
              onChange={onChangeRoom}
              inputProps={{
                name: "RoomID",
              }}
            >
              <MenuItem value={"0"}>กรุณาเลือกห้อง</MenuItem>
                {room?.map((item: RoomsInterface) => 
                  <MenuItem
                    key={item.ID}
                    value={item.ID}
                  >
                    {item.Name}
                  </MenuItem>
                )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">   
            <p>รหัสอุปกรณ์</p>
            <Select
              required
              defaultValue={"0"}
              // value={request.RHD_ID + ""}
              onChange={handleChange}
              inputProps={{
                name: "Room_has_Device_ID",
              }}
            >
              <MenuItem value={"0"}>กรุณาเลือกรหัสอุปกรณ์</MenuItem>
                {rhd?.map((item: RHDsInterface) => 
                  <MenuItem
                    key={item.ID}
                    value={item.ID}
                  >
                    {item?.Device?.ID}
                  </MenuItem>
                )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
          <p>อธิบายปัญหาแบบคร่าวๆ</p>
            <TextField
              required
              id="Explain"
              type="string"
              inputProps={{
                name: "Explain",
              }}
              value={request.Explain + ""}
              onChange={handleInputChange_Text}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">   
            <p>เลือกประเภทงาน</p>
            <Select
              required
              defaultValue={"0"}
              onChange={handleChange}
              inputProps={{
                name: "JobTypeID",
              }}
            >
              <MenuItem value={"0"}>กรุณาเลือกประเภทงาน</MenuItem>
                {jobtypes?.map((item: JobTypesInterface) => 
                  <MenuItem
                    key={item.ID}
                    value={item.ID}
                  >
                    {item.Name}
                  </MenuItem>
                )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <p>วันที่และเวลา</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={request.Date_Start}
                onChange={(newValue) => {
                  setRequest({
                    ...request,
                    Date_Start: newValue,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button component={RouterLink} to="/request" variant="contained">
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
    </Paper>
  </Container>

  );
}




export default RequestCreate;