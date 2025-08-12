import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState(null); 
    const [patients, setPatients] = useState([]); 
    const [isPatient, setIsPatient] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [showPatientLogin, setShowPatientLogin] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState(""); 
    const [favouriteCampaigns, setFavouriteCampaigns] = useState({});
    const [donors, setDonors] = useState([]);

    const fetchDonors = async () => {
        try {
            const { data } = await axios.get('/api/donor/list');
            if (data.success) setDonors(data.donors);
        } catch (e) { }
    };

    // Fetch Patient Auth Status
    const fetchPatientAuth = async () => {
        try {
            const { data } = await axios.get('/api/patient/is-auth');
            if (data.success) {
                setIsPatient(true);
                setPatient(data.patient);
            } else {
                setIsPatient(false);
                setPatient(null);
            }
        } catch {
            setIsPatient(false);
            setPatient(null);
        }
    };

    // Fetch Admin Auth Status
    const fetchAdmin = async () => {
        try {
            const { data } = await axios.get('/api/admin/is-auth');
            setIsAdmin(data.success);
        } catch {
            setIsAdmin(false);
        }
    };


    // Fetch All Campaigns (from server)
    const fetchCampaigns = async () => {
        try {
            const { data } = await axios.get('/api/campaign/list');
            if (data.success) {
                setCampaigns(data.campaigns);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    // Fetch All Patient (from server)
    const fetchPatients = async () => {
        try {
            const { data } = await axios.get('/api/patient/all-patients');
            if (data.success) {
                setPatients(data.patients);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    };

    useEffect(() => {
        fetchPatients();
        fetchAdmin();
        fetchPatientAuth();
        fetchCampaigns(); 
    }, []);

    const value = {
        navigate, user, setUser, setIsPatient, isPatient,
        showUserLogin, setShowUserLogin, campaigns, currency,
        cartItems, searchQuery, setSearchQuery, axios, fetchCampaigns,
        setCartItems, isAdmin, setIsAdmin, showPatientLogin, setShowPatientLogin,
        patient, setPatient, getCartCount, fetchAdmin, patients, setPatients, fetchPatients,donors,setDonors,fetchDonors
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
};

export const useAppContext = () => useContext(AppContext);
