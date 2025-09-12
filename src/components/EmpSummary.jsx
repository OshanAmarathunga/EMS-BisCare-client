import React, {useEffect, useState} from 'react';
import { Toaster, toast } from 'sonner'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from "axios";
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import { Dialog, DialogTitle, DialogContent, DialogActions,TextField ,FormControl,InputLabel,Select, MenuItem} from "@mui/material";

const EmpSummary = () => {
    const [open, setOpen] = useState(false);
    const [summaryList,setSummaryList] = useState([]);
    const url=import.meta.env.VITE_SERVER_URL;
    const [openDialog, setOpenDialog] = useState(false);
    const [empName ,setEmpName ]=useState("");
    const [amount,setAmount]=useState("");
    const [ empKey,setEmpKey]=useState("");
    const [toBepaidAmount,setToBepaidAmount]=useState("");
    const [cumulativeBalance,setCumulativeBlance]=useState("");

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    async function getSummaryList(){
        handleOpen();
       await axios.get(url+"/v1/payment-detail/get-summary")
            .then((response) => {
                // toast.success('Summary generate success!');
                setSummaryList(response.data.responseList);
                setCumulativeBlance(response.data.cumulativeBalance);
                handleClose();
            })
            .catch((error) => {
                toast.error('generate error : '+error.message);
                handleClose();
            })
    }

    function saveEmployeePayment(){
        handleOpen();
        if (amount>toBepaidAmount){
            toast.error("You can not pay more than : Rs. "+toBepaidAmount);
            handleClose();
        }else {
            setOpenDialog(false);
            const data={
                empNoPrimaryKey:empKey,
                amount:amount
            }
            axios.post(url+"/v1/payment-detail/employee-payment",data)
                .then((response) => {
                    toast.success('Payment success!');
                    getSummaryList();
                    setAmount("")
                    setToBepaidAmount("");
                })
                .catch((error) => {
                    toast.error('Payment error : '+error.message);
                    handleClose();
                });
        }
    }

    useEffect(() => {
        getSummaryList();
    }, []);

    return (
        <div>
            <div className="mb-5">
                <Toaster richColors position="top-center" />
                <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={open}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <h1 className='text-2xl font-bold'>Summary</h1>
                <br/>
                <div className="grid grid-cols-2 content-between">
                    <div>
                        <div>
                            <Button sx={{padding: "2px 8px"}} onClick={getSummaryList} variant="contained"
                                    color="success">
                                Refresh
                            </Button>
                        </div>
                    </div>
                    <div className="bg-amber-300 text-center rounded-xl h-[35px] content-center ">
                        <h2 className="font-bold text-shadow-2xs">Total Payable : Rs. {cumulativeBalance}</h2>
                    </div>
                </div>
            </div>
            <div>
                <TableContainer  sx={{
                    maxWidth:{
                        xs: 450, md: '100%'
                    }
                }}>
                    <Table  size="small" aria-label="a dense table" sx={{ minWidth: 300 }}>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>EMP No</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Name</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Tot.Bonus</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Tot.Cah.Adv</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Tot.Wor.Hour</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Tot.Earning</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Payable Amt (Rs.)</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Paid Amt (Rs.)</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}>Balance (Rs.)</TableCell>
                                <TableCell align="center" style={{ fontWeight: "bold", fontFamily: "'Roboto', 'Segoe UI', sans-serif", borderBottom: "2px solid #ccc" }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {summaryList.map((sum) => (
                                <TableRow key={sum.empPrimaryKey}>
                                    <TableCell align="center">{sum.empNo}</TableCell>
                                    <TableCell align="center">{sum.firstName}</TableCell>
                                    <TableCell align="center">{sum.totalBonusAmount}</TableCell>
                                    <TableCell align="center">{sum.totalCashAdvancedAmount}</TableCell>
                                    <TableCell align="center">{sum.totalWorkingHours}</TableCell>
                                    <TableCell align="center">{sum.totalEarningAmount}</TableCell>
                                    <TableCell align="center" style={{ color:sum.balanceAmount<0?"red":"green",fontWeight:"bold",fontFamily:"sans-serif"}}>{sum.payableAmount}</TableCell>
                                    <TableCell align="center">{sum.paidAmount}</TableCell>
                                    <TableCell align="center" style={{ color:sum.balanceAmount<0?"red":"green",fontWeight:"bold",fontSize:"large",fontFamily:"sans-serif"}}>{sum.balanceAmount}</TableCell>
                                    <TableCell align="center" sx={{
                                        cursor: "pointer",          // cursor changes to hand
                                        "&:hover svg": {
                                            color: "yellow",          // icon turns yellow on hover
                                            transform: "scale(1.2)",  // optional: make icon slightly bigger
                                            transition: "0.2s",       // smooth effect
                                        },
                                    }}><CleanHandsIcon onClick={()=>{setOpenDialog(true),setEmpName(sum.firstName),setEmpKey(sum.empPrimaryKey),setToBepaidAmount(sum.balanceAmount)}}/>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
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
                        <Button variant="contained" sx={{
                            backgroundColor: "yellow",
                            color: "black",              // text color for contrast
                            "&:hover": {
                                backgroundColor: "#FFD700", // darker yellow on hover
                            },fontWeight:"bold"
                        }} onClick={()=>{saveEmployeePayment()}}>
                            Pay
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default EmpSummary;