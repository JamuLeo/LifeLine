import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const { isAdmin, setIsAdmin, navigate, axios, fetchAdmin } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/admin/login', { email, password });
            if (data.success) {
                setIsAdmin(true);
                toast.success('Login successful!');
                fetchAdmin(); 
                navigate('/admin');
            } else {
                setIsAdmin(false);
                toast.error(data.message);
            }
        } catch (error) {
            setIsAdmin(false);
            toast.error(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAdmin) {
            navigate("/admin");
        }
    }, [isAdmin, navigate]);

    return !isAdmin && (
        <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>
            <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
                <p className='text-2xl font-medium m-auto'>
                    <span className='text-primary'>Admin</span> Login
                </p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='enter your email' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='enter your password' className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' required />
                </div>
                <button
                    disabled={loading}
                    className={`bg-primary text-white w-full py-2 rounded-md cursor-pointer ${loading ? "opacity-60" : ""}`}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </form>
    )
}

export default AdminLogin;
