import React, {useState} from 'react';
import Button from '@mui/material/Button';
import axios from "axios";

const SalaryCategory = () => {


    const [name,setName]=useState(null);
    const [rate,setRate]=useState(0);
    const [note,setNote]=useState(null);
    const url=import.meta.env.VITE_SERVER_URL;

    const handleSubmit=(e)=>{
        e.preventDefault();
        const data={
            "categoryName":name,
            "perHourRate": rate,
            "note": note
        };
        axios.post(url+"/v1/salary-category/save-salary-category",data)
            .then((res)=>{
            console.log(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }
    return (
        <div>
            <h1 className='text-2xl font-bold'>Registration</h1>
            <br/>
            <form onSubmit={handleSubmit}>

                <div className='my-2'>
                    <label>Category Name</label>
                    <input onChange={(e)=>setName(e.target.value)} className='ml-[55px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Per Hour Rate</label>
                    <input onChange={(e)=>setRate(e.target.value)} className='ml-[65px] bg-amber-50' type='text' required/>
                </div>
                <div className='my-2'>
                    <label>Note</label>
                    <input onChange={(e)=>setNote(e.target.value)} className='ml-[135px] bg-amber-50' type='text'/>
                </div>
                <div className='flex items-center justify-between'>
                    <Button variant="contained" color="success" type="submit">
                        Save
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default SalaryCategory;