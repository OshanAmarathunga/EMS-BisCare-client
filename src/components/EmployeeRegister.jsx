import React from 'react';
import Button from '@mui/material/Button';

const EmployeeRegister = () => {
    return (
        <div>
            <h1 className='text-2xl font-bold'>Registration</h1>
            <br/>
            <form>
                <div className='my-2'>
                    <label>First Name</label>
                    <input className='ml-[120px] bg-amber-50' type='text' required/>
                </div>
                <div className='my-2'>
                    <label>Last Name</label>
                    <input className='ml-[120px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Employee Number</label>
                    <input className='ml-[65px] bg-amber-50' type='text' required/>
                </div>
                <div className='my-2'>
                    <label>Contact Number</label>
                    <input className='ml-[80px] bg-amber-50' type='text'/>
                </div>

                <div className='my-2'>
                    <label>Gender</label>
                    <input className='ml-[145px] bg-amber-50' type='text'/>
                </div>
                <div className='my-2'>
                    <label>Salary Category Id</label>
                    <input type='text'/>
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

export default EmployeeRegister;