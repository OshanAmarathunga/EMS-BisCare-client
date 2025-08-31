import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import axios from "axios";
import { Toaster, toast } from 'sonner'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CreateIcon from '@mui/icons-material/Create';
import { Dialog, DialogTitle, DialogContent, DialogActions,TextField ,FormControl,InputLabel,Select, MenuItem} from "@mui/material";

const EmployeeRegister = () => {

    const [firstName,setFirstName]=useState(null);
    const [lastName,setLastName]=useState(null);
    const [empNo,setEmpNo]=useState(null);
    const [contactNo,setContactNo]=useState(null);
    const [gender,setGender]=useState(null);
    const [salaryCategoryId,setSalaryCategoryId]=useState(0);
    const [active,setActive]=useState(false);
    const [mongoId,setMongoID ]=useState("");
    const url=import.meta.env.VITE_SERVER_URL;
    const [open, setOpen] = React.useState(false);
    const [employeeList,setEmployeeList]=useState([]);
    const [categoryList,setCategoryList]=useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [categoryId,setCategoryId]=useState(null);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        clear();
    };

    const handleClickOpen = (emp) => {
        setFirstName(emp.firstName);
        setLastName(emp.lastName);
        setEmpNo(emp.empNo);
        setContactNo(emp.contactNo);
        setGender(emp.gender);
        setSalaryCategoryId(emp.salaryCategoryId);
        setActive(emp.isActive);
        setOpenDialog(true);
        setMongoID(emp._id);
    };


    const handleSubmit=(e)=>{
        e.preventDefault();
        handleOpen();
        const data={
            "firstName":firstName,
            "lastName": lastName,
            "empNo": empNo,
            "contactNo": contactNo,
            "gender":gender,
            "salaryCategoryId":salaryCategoryId

        };
        axios.post(url+"/v1/employee/saveEmployee",data)
            .then((res)=>{
                clear();
                handleClose();
                getAllEmployees();
                toast.success('Employee saved successfully');
            }).catch((e)=>{
            console.log(e)
            handleClose()
            toast.error('Not saved : '+e.response.data.saveError);
        });
    }

    const clear=()=>{
        setFirstName("");
        setLastName("");
        setEmpNo("");
        setContactNo("");
        setGender("")
        setSalaryCategoryId(0)
    }
    const getAllCategories=()=>{
        axios.get(url+"/v1/salary-category/get-all-categories")
            .then((res)=>{
                setCategoryList(res.data.categoryList);
            })
            .catch((e)=>{
                console.log(e)
            })
    }

    const getAllEmployees=()=>{
        axios.get(url+"/v1/employee/get-all-employee")
            .then((res)=>{
                setEmployeeList(res.data.employeeList);
            })
            .catch((e)=>{
                console.log(e)
            })
    }

    const handleUpdate=()=>{
        //handleOpen();
        const data={
            "firstName":firstName,
            "lastName": lastName,
            "empNo": empNo,
            "contactNo": contactNo,
            "gender":gender,
            "salaryCategoryId":salaryCategoryId,
            "isActive":active
        };

        axios.put(url+`/v1/employee/update-employee/${mongoId}`,data)
            .then((res)=>{
                handleCloseDialog();
                getAllEmployees();
                handleClose();
                clear();
                toast.success('Employee updated!');
            })
            .catch((e)=>{
                console.log(e)
                handleClose();
                toast.error('Not updated : '+e.response.data.message);
            })
    }

    useEffect(()=>{
        getAllEmployees();
        getAllCategories();
    },[])
    return (
        <div>

            <Toaster richColors position="top-center" />
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <h1 className='text-2xl font-bold'>Employee Registration</h1>
            <br/>
            <form onSubmit={handleSubmit}>

                <div className='my-2'>
                    <label>First Name</label>
                    <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} required className='ml-[70px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Last Name</label>
                    <input value={lastName} onChange={(e)=>setLastName(e.target.value)} className='ml-[70px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>EMP No</label>
                    <input value={empNo} onChange={(e)=>setEmpNo(e.target.value)} required className='ml-[90px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Contact No</label>
                    <input value={contactNo} onChange={(e)=>setContactNo(e.target.value)}  className='ml-[70px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className='ml-[95px] bg-amber-50 border rounded px-2 py-1'
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className='my-2'>
                    <label>Salary Category Id</label>
                    <select
                        value={salaryCategoryId}
                        onChange={(e) => setSalaryCategoryId(e.target.value)}
                        className='ml-[15px] bg-amber-50 border rounded px-2 py-1'
                        required
                    >
                        <option value="">Select Category</option>
                        {
                            categoryList.map((category)=>(
                            <option key={category.categoryId} value={category.categoryId}>{category.categoryName}  |  Rs.{category.perHourRate}</option>
                            ))
                        }

                    </select>
                </div>
                <div className='flex items-center justify-between'>
                    <Button variant="contained" color="success" type="submit">
                        Save
                    </Button>
                </div>

                <hr className='my-5'/>
                <div  className="w-full overflow-hidden">
                    <TableContainer  sx={{
                        maxWidth:{
                            xs: 500, md: '100%'
                        }
                    }}>
                        <Table  size="small" aria-label="a dense table" sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Employee NO</TableCell>
                                    <TableCell align="center">First Name</TableCell>
                                    <TableCell align="center">Last Name</TableCell>
                                    <TableCell align="center">Contact No</TableCell>
                                    <TableCell align="center">Gender</TableCell>
                                    <TableCell align="center">Salary Category</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeList.map((emp) => (
                                    <TableRow
                                        key={emp._id}
                                    >
                                        <TableCell align="center">{emp.firstName}</TableCell>
                                        <TableCell align="center">{emp.lastName}</TableCell>
                                        <TableCell align="center">{emp.empNo}</TableCell>
                                        <TableCell align="center">{emp.contactNo}</TableCell>
                                        <TableCell align="center">{emp.gender}</TableCell>
                                        <TableCell align="center">{emp.salaryCategory[0]?.categoryName} | Rs.{emp.salaryCategory[0]?.perHourRate} </TableCell>
                                        <TableCell align="center">{emp.isActive==true?"Active":"Inactive"}</TableCell>
                                        <TableCell align="center"><CreateIcon onClick={()=>handleClickOpen(emp)}  style={{ cursor: "pointer" }}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div >
                    <Dialog open={openDialog} onClose={handleClose}>
                        <DialogTitle>Update Employee</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                label="First name"
                                name="firstName"
                                fullWidth
                                value={firstName}
                                onChange={(e)=>setFirstName(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Last name"
                                name="lastName"
                                fullWidth
                                value={lastName}
                                onChange={(e)=>setLastName(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Emp No"
                                name="empNo"
                                fullWidth
                                value={empNo}
                                onChange={(e)=>setEmpNo(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Contact No"
                                name="contactNo"
                                fullWidth
                                value={contactNo}
                                onChange={(e)=>setContactNo(e.target.value)}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <InputLabel id="Salary category">Salary category</InputLabel>
                                <Select
                                    labelId="Salary category"
                                    value={salaryCategoryId}
                                    onChange={(e) => setSalaryCategoryId(e.target.value)}
                                >
                                    {categoryList.map((category)=>(
                                    <MenuItem key={category._id} value={category.categoryId}>{category.categoryName}    ==>  Rs.{category.perHourRate}</MenuItem>
                                    ))}

                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={active}
                                    onChange={(e) => setActive(e.target.value)}
                                >
                                    <MenuItem value='true'>Active</MenuItem>
                                    <MenuItem value='false'>Inactive</MenuItem>
                                </Select>
                            </FormControl>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button variant="contained" onClick={handleUpdate}>
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </form>
        </div>
    );
};

export default EmployeeRegister;