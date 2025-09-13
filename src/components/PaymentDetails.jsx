import React, {useEffect, useState} from 'react';
import { Toaster, toast } from 'sonner'
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import dayjs from "dayjs";
import Backdrop from '@mui/material/Backdrop';
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions,TextField ,FormControl,InputLabel,Select, MenuItem} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CancelIcon from '@mui/icons-material/Cancel';

function PaymentDetails() {
    const [empList,setEmpList] = useState([]);
    const url=import.meta.env.VITE_SERVER_URL;
    const [empPrimaryKey,setEmpPrimaryKey] = useState("");
    const [open, setOpen] = React.useState(false);
    const [paymentList,setPaymentList]=useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [amount,setAmount]=useState("");
    const [empName,setEmpName]=useState("");
    const [openVerifyDialog,setOpenVerifyDialog]=useState(false)
    const [paymentId,setPaymentId]=useState("");
    const [totalPaidAmount,setTotalPaidAmount]=useState("");
    const [balanceAmount,setBalanceAmount]=useState("");
    const [transactionAmt,setTransactionAmt]=useState("");

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseVerifyDialog = () => {
        setOpenVerifyDialog(false);
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

    const getPaymentList=()=>{
        handleOpen();
        axios.get(url+`/v1/payment-detail/get-employee-payment/${empPrimaryKey}`)
            .then((res)=>{
                setTotalPaidAmount(res.data.totalPaidAmount);
                setBalanceAmount(res.data.balanceAmount);
                setPaymentList(res.data.paymentList);
                handleClose();
            })
            .catch((e)=>{
                console.log(e)
                handleClose();
            })
    }

    const savePayment=()=>{
        if(amount>balanceAmount){
            toast.error("you can not pay more than Rs."+balanceAmount);
        }else {
            handleOpen();
            const data={
                empPrimaryKey:empPrimaryKey,
                amount:amount
            }
            axios.post(url+"/v1/payment-detail/employee-payment", data)
                .then((res)=>{
                    handleClose();
                    setOpenDialog(false);
                    toast.success('Cash Advance saved!');
                    getPaymentList();
                    setAmount("");
                })
                .catch((error)=>{
                    console.log(error)
                    handleClose();
                    setOpenDialog(false);
                    toast.error('Not saved CASH advance: '+error.message);
                })
        }
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

    useEffect(()=>{
        getAllEmployees();
    },[]);

    function handleConfirm(){
        if (balanceAmount<transactionAmt){
            setOpenVerifyDialog(false);
            toast.error("You can not exceed the maximum amount : "+balanceAmount);
        }else {
            setOpenVerifyDialog(false);
            handleOpen();
            axios.put(url+`/v1/payment-detail/change-status/${paymentId}`)
                .then((res)=>{
                    toast.success('Updated success!');
                    getPaymentList();
                })
                .catch((error)=>{
                    handleClose();
                    toast.error('Not updated: '+error.message);
                })
        }
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
            <div className="grid sm:grid-cols-1 lg:grid-cols-3  content-center">
                <div><h1 className='text-2xl font-bold'>Payment Details</h1></div>
                <div className="bg-amber-300 rounded-xl mx-5 p-3 mb-2 font-bold">Total Paid : Rs.{totalPaidAmount}</div>
                <div className="bg-amber-300 rounded-xl mx-5 p-3 mb-2 font-bold">Payable Amount : Rs.{balanceAmount}</div>

            </div>
            <br/>
            <div className='my-2 grid grid-cols-3 justify-items-center items-center'>
                <div>
                    <select
                        onChange={(e) =>{
                            const selectedEmp = empList.find(emp => emp._id === e.target.value);
                            setEmpPrimaryKey(e.target.value);
                            setEmpName(selectedEmp.firstName);
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
                    <Button sx={{ padding: "2px 8px" }} disabled={empPrimaryKey==""?true:false} onClick={()=>getPaymentList()} variant="contained" color="success">
                        Search
                    </Button>
                </div>
                {balanceAmount!=0 &&
                    <div >
                    <Button sx={{ padding: "2px 8px" }} disabled={empPrimaryKey==""?true:false} onClick={()=>{setOpenDialog(true)}}  variant="contained" color="warning">
                        +
                    </Button>
                </div>}
            </div>
            <div>
                <div >
                    <Dialog open={openDialog} onClose={handleClose}>
                        <DialogTitle>Add Payment to {empName}</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                label="Amount"
                                name="amount"
                                fullWidth
                                value={amount}
                                onChange={(e)=>setAmount(e.target.value)}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button variant="contained" onClick={savePayment}>
                                Pay
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            <div  className="w-full overflow-hidden">
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
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Amount</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paymentList.map((bonus) => (
                                <TableRow
                                    key={bonus._id}
                                >
                                    <TableCell align="center">{formatSLDateTime(bonus.date)}</TableCell>
                                    <TableCell align="center">{bonus.amount}</TableCell>
                                    <TableCell align="center">{bonus.status==true?
                                        <Button onClick={(e)=>{setOpenVerifyDialog(true),setPaymentId(bonus._id),setTransactionAmt(0)}}  variant="contained" color="success" sx={{ padding: "0.01px 0.1px" }}>
                                            Valid
                                        </Button>
                                        :
                                        <CancelIcon sx={{ color: 'red' }} onClick={(e)=>{setOpenVerifyDialog(true),setPaymentId(bonus._id),setTransactionAmt(bonus.amount)}}/>
                                    }</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <Dialog open={openVerifyDialog} onClose={handleCloseVerifyDialog}>
                    <DialogTitle>Do you want to change this ?</DialogTitle>
                    {/*<DialogContent>*/}
                    {/*    <DialogContentText>Are you sure?</DialogContentText>*/}
                    {/*</DialogContent>*/}
                    <DialogActions>
                        <Button onClick={handleCloseVerifyDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={()=>handleConfirm()} color="error" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default PaymentDetails;