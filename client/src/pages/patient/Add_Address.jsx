import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const InputField = ({type, placeholder, name, handelchange, address}) => (
    <input
        className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handelchange}
        name={name}
        value={address[name]}
        required
    />
)

const Add_Address = () => {
    const { axios, patient, navigate } = useAppContext();

    const [address, setAddress] = useState({
        street: '',
        city: '',
        province: '',
        phone: '',
    });

    const handelchange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/address/add', address);
            if (data.success) {
                toast.success(data.message);
                navigate('/patient'); // Or wherever you want
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // useEffect(()=>{
    //         if(!patient){
    //             navigate('/')
    //         }
    //     },[])

    return (
        <div className='m-16 pb-16'>
            <p className='text-2xl md:text-3xl text-gray-500'>Add <span className='font-semibold text-primary'>Address</span></p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-16'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <InputField handelchange={handelchange} address={address} name='street' type="text" placeholder="Street" />
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handelchange={handelchange} address={address} name='city' type="text" placeholder="City" />
                            <InputField handelchange={handelchange} address={address} name='province' type="text" placeholder="Province" />
                        </div>
                        <InputField handelchange={handelchange} address={address} name='phone' type="text" placeholder="Phone" />
                        <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase rounded'>
                            Save address
                        </button>
                    </form>
                </div>
                <img className='md:mr-22 ml-22 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add address" />
            </div>
        </div>
    )
}

export default Add_Address
