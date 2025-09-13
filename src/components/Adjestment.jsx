import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import Button from '@mui/material/Button';
import { Toaster, toast } from 'sonner'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function Adjestment() {
    const [empWorkingHourList,setEmpWorkingHourList] = useState([]);
    const [empList,setEmpList] = useState([]);
    const [empPrimaryKey,setEmpPrimaryKey] = useState("");
    const url=import.meta.env.VITE_SERVER_URL;
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [workingHourPrimaryKey,setWorkingHourKey]=useState("");
    const [startDate,setStartDate]=useState(dayjs());
    const [endDate,setEndDate]=useState(dayjs());

    const handleDialogOpen = () => {
        setOpenDialog(true);
    }
    const handleDialogClose = () =>{
        setOpenDialog(false);
    }

    const handleConfirm = () => {
        handleOpen();
        axios.post(url+`/v1/working-hour/make-validity/${workingHourPrimaryKey}`)
            .then((response) => {
                handleClose();
                getWorkingHourList()
                toast.success('Validity changed !');
            })
            .catch((error) => {
                handleClose();
                toast.error('Update error : '+error.message);
            })
        handleDialogClose();
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const getAllEmployees=()=>{
        axios.get(url+"/v1/employee/get-all-employee")
            .then((res)=>{
                setEmpList(res.data.employeeList);
            })
            .catch((e)=>{
                console.log(e)
            })
    }
    function getWorkingHourList(){
        handleOpen();
        axios.get(url+`/v1/working-hour/get-employee-working-hours/${empPrimaryKey}`).then((res)=>{
            setEmpWorkingHourList(res.data);
            handleClose();
        }).catch((err)=>{
            handleClose();
            toast.error('Not get working hour details : '+err.message);
        })
    }

    useEffect(()=>{
        getAllEmployees();
    },[]);

    function handleAddNewData(){
        // Convert to Date objects for comparison
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            toast.error("Start date must be earlier than end date!");
            return; // ⛔ stop execution, don’t call API
        }
        handleOpen();
        const data={
            "startDate":startDate,
            "endDate":endDate,
            "empPrimaryKey":empPrimaryKey,
        }
        axios.post(url+"/v1/working-hour/add-working-times",data)
            .then((res)=>{
                setOpenUpdateDialog(false);
                getWorkingHourList();
                handleClose();
                toast.success('Added new entry!');
            })
            .catch((error)=>{
                setOpenUpdateDialog(false);
                handleClose();
                toast.error('Not saved, try again : '+error.message);
            })
    }

    function formatSLDateTime(dateString){
        if (!dateString) return "-";
        return new Date(dateString)
            .toLocaleString("en-GB", {
                timeZone: "Asia/Colombo",
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })
            .replace(",", "")
            .toUpperCase();
    }

    return (
        <div>
            <Toaster richColors position="top-center" />
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <h1 className='text-2xl font-bold'>Adjustments</h1>
            <br/>
            <div className='my-2 grid grid-cols-3 justify-items-center items-center'>
                <div>
                    <select
                        // value={salaryCategoryId}
                        onChange={(e) =>{
                            setEmpPrimaryKey(e.target.value);
                        }}
                        className='ml-[15px] bg-amber-50 border rounded px-2 py-1'
                        required
                    >
                        <option value="">Select Employee</option>
                        {
                            empList.map((emp) => (
                                <option key={emp._id} value={emp._id}>{emp.firstName} --- {emp.empNo}</option>
                            ))
                        }

                    </select>
                </div>
                <div >
                    <Button sx={{ padding: "2px 8px" }} disabled={empPrimaryKey==""?true:false} onClick={()=>getWorkingHourList()} variant="contained" color="success">
                        Search
                    </Button>
                </div>
                <div >
                    <Button sx={{ padding: "2px 8px" }} disabled={empPrimaryKey==""?true:false} onClick={()=>{setOpenUpdateDialog(true),setStartDate(dayjs()),setEndDate(dayjs())}}  variant="contained" color="warning">
                        +
                    </Button>
                </div>
            </div>
            <div >
                <TableContainer  sx={{
                    maxWidth:{
                        xs: 450, md: '100%'
                    },
                    maxHeight: 500,
                    overflowY: 'auto'
                }}>
                    <Table  size="small" aria-label="a dense table" sx={{ minWidth: 300 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">In-Time</TableCell>
                                <TableCell align="center">Out-Time</TableCell>
                                <TableCell align="center">Rate</TableCell>
                                <TableCell align="center">Working Hours</TableCell>
                                <TableCell align="center">Earning</TableCell>
                                <TableCell align="center">Status</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {empWorkingHourList.map((emp) => (
                                    <TableRow key={emp._id}>
                                        <TableCell align="center">{formatSLDateTime(emp.startDateTime)}</TableCell>
                                        <TableCell align="center">{formatSLDateTime(emp?.endDateTime)}</TableCell>
                                        <TableCell align="center">{emp.relevantRate}</TableCell>
                                        <TableCell align="center">{emp.workingHours}</TableCell>
                                        <TableCell align="center">{emp.slotEarningAmount}</TableCell>
                                        <TableCell align="center">{emp.isActive==true?
                                            <Button onClick={(e)=>{handleDialogOpen(),setWorkingHourKey(emp._id)}}  variant="contained" color="success" sx={{ padding: "0.01px 0.1px" }}>
                                                Valid
                                            </Button> :<CancelIcon sx={{ color: 'red' }} onClick={(e)=>{handleDialogOpen(),setWorkingHourKey(emp._id)}}/>
                                        }</TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div>
                    <Dialog open={openDialog} onClose={handleDialogClose}>
                        <DialogTitle>Do you want to change this ?</DialogTitle>
                        {/*<DialogContent>*/}
                        {/*    <DialogContentText>Are you sure?</DialogContentText>*/}
                        {/*</DialogContent>*/}
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={()=>handleConfirm()} color="error" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div >
                    <Dialog open={openUpdateDialog} onClose={handleClose}>
                        <DialogTitle>Add In and Out Data</DialogTitle>
                        <DialogContent>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Start Time"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
                                />
                            </LocalizationProvider>

                        </DialogContent>
                        <DialogContent>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="End Time"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
                                />
                            </LocalizationProvider>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setOpenUpdateDialog(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleAddNewData} >
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>

        </div>

    );
}

export default Adjestment;