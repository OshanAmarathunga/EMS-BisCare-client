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
import { Dialog, DialogTitle, DialogContent, DialogActions,TextField } from "@mui/material";

const SalaryCategory = () => {


    const [name,setName]=useState(null);
    const [rate,setRate]=useState(0);
    const [note,setNote]=useState(null);
    const url=import.meta.env.VITE_SERVER_URL;
    const [open, setOpen] = React.useState(false);
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

    const handleClickOpen = (category) => {
        setName(category.categoryName);
        setRate(category.perHourRate);
        setNote(category.note);
        setCategoryId(category._id);
        setOpenDialog(true);
    };


    const handleSubmit=(e)=>{
        e.preventDefault();
        handleOpen();
        const data={
            "categoryName":name,
            "perHourRate": rate,
            "note": note
        };
        axios.post(url+"/v1/salary-category/save-salary-category",data)
            .then((res)=>{
                clear();
                handleClose();
                getAllCategories();
                toast.success('Salary category saved successfully');
        }).catch((e)=>{
            handleClose()
            toast.error('Not saved , please contact DEV');
        });
    }

    const clear=()=>{
        setName("");
        setRate(0);
        setNote("");
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

    const handleUpdate=()=>{
        handleOpen();
        const data={
            "categoryName":name,
            "perHourRate": rate,
            "note": note
        };
        axios.put(url+`/v1/salary-category/update-salary-category/${categoryId}`,data)
            .then((res)=>{
                handleCloseDialog();
                getAllCategories();
                handleClose();
                clear();
                toast.success('Salary category updated!');
            })
            .catch((e)=>{
                console.log(e)
                handleClose();
                toast.error('Not updated , please contact DEV');
            })
    }

    useEffect(()=>{
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
            <h1 className='text-2xl font-bold'>Category Registration</h1>
            <br/>
            <form onSubmit={handleSubmit}>

                <div className='my-2'>
                    <label>Category Name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} required className='ml-[55px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Per Hour Rate</label>
                    <input value={rate} onChange={(e)=>setRate(e.target.value)} className='ml-[65px] bg-amber-50' type='Number' min='1' step='0.01' required/>
                </div>
                <div className='my-2'>
                    <label>Note</label>
                    <input value={note} onChange={(e)=>setNote(e.target.value)} className='ml-[135px] bg-amber-50' type='text'/>
                </div>
                <div className='flex items-center justify-between'>
                    <Button variant="contained" color="success" type="submit">
                        Save
                    </Button>
                </div>

                <hr className='my-5'/>
                <div>
                    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                        <Table  size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Category Id</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Rate (rs/h)</TableCell>
                                    <TableCell align="center">note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categoryList.map((category) => (
                                    <TableRow
                                        key={category._id}
                                    >

                                        <TableCell align="center">{category.categoryId}</TableCell>
                                        <TableCell align="center">{category.categoryName}</TableCell>
                                        <TableCell align="center">{category.perHourRate}</TableCell>
                                        <TableCell align="center">{category.note}</TableCell>
                                        <TableCell align="center"><CreateIcon onClick={()=>handleClickOpen(category)}  style={{ cursor: "pointer" }}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div>
                    <Dialog open={openDialog} onClose={handleClose}>
                        <DialogTitle>Update Category</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                label="Category Name"
                                name="categoryName"
                                fullWidth
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Per Hour Rate"
                                name="perHourRate"
                                type="number"
                                fullWidth
                                value={rate}
                                onChange={(e)=>setRate(e.target.value)}
                            />
                            <TextField
                                margin="dense"
                                label="Note"
                                name="note"
                                fullWidth
                                value={note}
                                onChange={(e)=>setNote(e.target.value)}
                            />
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

export default SalaryCategory;