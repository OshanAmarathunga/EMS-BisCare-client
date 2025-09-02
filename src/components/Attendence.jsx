import React, {useEffect, useState} from 'react';
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import {Toaster} from "sonner";

function Attendence() {
    const [employeeList,setEmployeeList]=useState([]);
    const url=import.meta.env.VITE_SERVER_URL;
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const getAllEmployees=()=>{
        axios.get(url+"/v1/employee/get-all-employee-with-last-working-data")
            .then((res)=>{
                setEmployeeList(res.data.employeeList);
            })
            .catch((e)=>{
                console.log(e);
            })
    }

    useEffect(()=>{
        getAllEmployees();
    },[])

    const inEmployee=(emp)=>{
        handleOpen();
        const data={
            "empPrimaryKey":emp._id,
            "empNo": emp.empNo
        }
        axios.post(url+"/v1/working-hour/save-in",data)
            .then((rsp)=>{
                getAllEmployees();
                handleClose();
            })
            .catch((e)=>{
                handleClose();
            });
    }
    const outEmployee=(emp)=>{
        handleOpen();

        axios.post(url+`/v1/working-hour/save-out${emp.lastWorkingHour._id}`)
            .then((rsp)=>{
                getAllEmployees();
                handleClose();
            })
            .catch((e)=>{
                handleClose();
            });
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
            <h1 className='text-2xl font-bold'>Attendance</h1>
            <div >
                <TableContainer  sx={{
                    maxWidth:{
                        xs: 450, md: '100%'
                    }
                }}>
                    <Table  size="small" aria-label="a dense table" sx={{ minWidth: 300 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Employee No</TableCell>
                                <TableCell align="center">First Name</TableCell>
                                <TableCell align="center">In-Time</TableCell>
                                <TableCell align="center">Attendance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeList.filter((emp)=>emp.isActive)
                                .map((emp) => (
                                <TableRow
                                    key={emp._id}
                                >
                                    <TableCell align="center">{emp.empNo}</TableCell>
                                    <TableCell align="center">{emp.firstName}</TableCell>
                                    <TableCell align="center">{emp.lastWorkingHour?.startDateTime && emp.lastWorkingHour.status === "IN"
                                        ? formatSLDateTime(emp.lastWorkingHour.startDateTime)
                                        : "-"}</TableCell>
                                    <TableCell align="center">
                                        {emp.lastWorkingHour.status=="IN" &&
                                            <Button onClick={()=>outEmployee(emp)} variant="contained" color="error">
                                                OUT
                                            </Button>
                                        }
                                        {(emp.lastWorkingHour.status=="OUT" || emp.lastWorkingHour.status==null) &&
                                            <Button onClick={()=>inEmployee(emp)} variant="contained" color="success">
                                                IN
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Attendence;