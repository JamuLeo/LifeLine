import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const InputField = ({type, placeholder, name, handelchange, account})=>(
    <input
        className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handelchange}
        name={name}
        value={account[name]}
        required
    />
)

const AddBankAccount = () => {
    const {axios, patient, navigate} = useAppContext();

    const [account, setAccount] = useState({
        fullName: '',
        bankName: '',
        accNumber: '',
        branch: '',
    })

    const handelchange = (e)=>{
        const {name, value} = e.target;
        setAccount((prevAccount)=>({
            ...prevAccount,
            [name]: value,
        }))
    }

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try {
            // send flat object, NOT { account: ... }
            const { data } = await axios.post('/api/account/add', account);
            if(data.success){
                toast.success(data.message);
                navigate('/patient');
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(!patient){
            navigate('/')
        }
    },[patient, navigate])

    return (
        <div className='m-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>Add <span className='font-semibold text-primary'>Account Details</span></p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-16'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <InputField handelchange={handelchange} account={account} name='fullName' type="text" placeholder="Full Name" />
                        <InputField handelchange={handelchange} account={account} name='bankName' type="text" placeholder="Bank Name" />
                        <InputField handelchange={handelchange} account={account} name='accNumber' type="text" placeholder="Account Number" />
                        <InputField handelchange={handelchange} account={account} name='branch' type="text" placeholder="Branch" />
                        <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase rounded'>
                            Save Account Details
                        </button>
                    </form>
                </div>
                <img className='md:mr-22 ml-22 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add address" />
            </div>
        </div>
    )
}

export default AddBankAccount
