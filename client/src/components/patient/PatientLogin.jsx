import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const PatientLogin = () => {
  const {
    isPatient, setShowPatientLogin, setPatient, axios,
    navigate, setIsPatient
  } = useAppContext();

  // State
  const [mode, setMode] = useState('login'); // login | register | forgot
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [tempEmail, setTempEmail] = useState(''); // for verify/reset
  const [resetPasswordStep, setResetPasswordStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');

  // Standard Login/Register Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        const { data } = await axios.post('/api/patient/register', { name, email, password });
        if (data.success) {
          setShowOTP(true);
          setTempEmail(email);
          toast.success("OTP sent to your email");
        } else {
          toast.error(data.message || "Registration failed");
        }
      } else if (mode === 'login') {
        const { data } = await axios.post('/api/patient/login', { email, password });
        if (data.success) {
          toast.success("Logged in!");
          setPatient(data.patient);
          setIsPatient(true);
          setShowPatientLogin(false);
          navigate('/patient');
        } else if (data.message && data.message.toLowerCase().includes('verify')) {
          setShowOTP(true);
          setTempEmail(email);
          toast.error("Account not verified. OTP sent to your email.");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Error");
    }
    setLoading(false);
  };

  // OTP verification for registration or login
  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/patient/verify-otp', { email: tempEmail, otp });
      if (data.success) {
        toast.success("Verified! You can now login.");
        setShowOTP(false);
        setMode('login');
        setOTP('');
        setTempEmail('');
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("OTP verification failed");
    }
    setLoading(false);
  };

  // Forgot password step 1: send OTP
  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/patient/forgot-password', { email });
      if (data.success) {
        setResetPasswordStep(2);
        setTempEmail(email);
        toast.success("OTP sent to your email");
      } else {
        toast.error(data.message || "Error");
      }
    } catch (error) {
      toast.error("Error");
    }
    setLoading(false);
  };

  // Forgot password step 2: verify OTP
  const handleForgotVerifyOTP = async (event) => {
    event.preventDefault();
    setResetPasswordStep(3);
    toast.success("OTP Verified. Set new password.");
  };

  // Forgot password step 3: set new password
  const handleResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/patient/reset-password', {
        email: tempEmail,
        otp,
        password: newPassword
      });
      if (data.success) {
        toast.success("Password reset successful! You can login now.");
        setMode('login');
        setResetPasswordStep(1);
        setOTP('');
        setTempEmail('');
        setNewPassword('');
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (error) {
      toast.error("Reset failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isPatient) {
      setShowPatientLogin(false);
      navigate("patient");
    }
  }, [isPatient]);

  // Render OTP Verification UI
  if (showOTP) {
    return (
      <div
        onClick={() => { setShowOTP(false); setOTP(''); setTempEmail(''); }}
        className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
      >
        <form
          onClick={e => e.stopPropagation()}
          onSubmit={handleVerifyOTP}
          className="flex flex-col gap-4 bg-white rounded-lg shadow-xl border border-gray-200 p-8 py-10 w-80 sm:w-[360px]"
        >
          <p className="text-2xl font-medium text-center">Enter OTP</p>
          <input
            type="text"
            value={otp}
            onChange={e => setOTP(e.target.value)}
            placeholder="Enter OTP from email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            required
            maxLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer ${loading && "opacity-60 cursor-wait"}`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={() => { setShowOTP(false); setOTP(''); setTempEmail(''); }}
            className="text-primary underline mt-2"
          >Cancel</button>
        </form>
      </div>
    );
  }

  // Forgot Password Steps
  if (mode === 'forgot') {
    return (
      <div
        onClick={() => setShowPatientLogin(false)}
        className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="flex flex-col gap-4 bg-white rounded-lg shadow-xl border border-gray-200 p-8 py-10 w-80 sm:w-[360px]"
        >
          {resetPasswordStep === 1 && (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <p className="text-2xl font-medium m-auto">Forgot Password</p>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="email"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer ${loading && "opacity-60 cursor-wait"}`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <span onClick={() => setMode('login')} className="text-primary cursor-pointer text-center underline">Back to Login</span>
            </form>
          )}
          {resetPasswordStep === 2 && (
            <form onSubmit={handleForgotVerifyOTP} className="flex flex-col gap-4">
              <p className="text-xl font-medium m-auto">Verify OTP</p>
              <input
                value={otp}
                onChange={e => setOTP(e.target.value)}
                placeholder="Enter OTP from email"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                required
                maxLength={6}
              />
              <button
                type="submit"
                className="bg-primary text-white rounded-md py-2"
              >
                Verify OTP
              </button>
            </form>
          )}
          {resetPasswordStep === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <p className="text-xl font-medium m-auto">Reset Password</p>
              <input
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="password"
                required
                minLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer ${loading && "opacity-60 cursor-wait"}`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Login/Register UI
  return !isPatient && (
    <div
      onClick={() => setShowPatientLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        className="flex flex-col gap-4 bg-white rounded-lg shadow-xl border border-gray-200 p-8 py-10 w-80 sm:w-[360px]"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Patient</span> {mode === "login" ? "Login" : "Sign Up"}
        </p>
        {mode === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required={mode !== 'forgot'}
            minLength={mode === 'register' ? 6 : undefined}
          />
        </div>
        {mode === "register" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setMode("login")} className="text-primary cursor-pointer">Click here</span>
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            <p>
              Create an account?{" "}
              <span onClick={() => setMode("register")} className="text-primary cursor-pointer">Click here</span>
            </p>
            <p>
              <span onClick={() => setMode("forgot")} className="text-primary cursor-pointer underline text-xs">Forgot Password?</span>
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer ${loading && "opacity-60 cursor-wait"}`}
        >
          {loading
            ? (mode === "register" ? "Registering..." : "Logging in...")
            : (mode === "register" ? "Create Account" : "Login")}
        </button>
      </form>
    </div>
  );
};

export default PatientLogin;
