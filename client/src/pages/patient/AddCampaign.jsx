import React, { useState, useEffect, useCallback } from 'react';
import { assets, categories } from '../../assets/assets';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

const AddCampaign = () => {
    // Form state
    const [files, setFiles] = useState([null]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [endDate, setEndDate] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [account, setAccount] = useState([]);
    const [showAccount, setShowAccount] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { axios, navigate, patient } = useAppContext();

    // Validation function
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (description.length > 500) newErrors.description = 'Description must be less than 500 characters';
        if (!category) newErrors.category = 'Category is required';
        if (!goalAmount || isNaN(goalAmount)) {
        newErrors.goalAmount = 'Valid amount is required';
    } else if (Number(goalAmount) <= 0) {
        newErrors.goalAmount = 'Amount must be greater than 0';
    }
        if (!endDate || new Date(endDate) < new Date()) newErrors.endDate = 'Valid future date required';
        if (!files[0]) newErrors.image = 'Medical document/image is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [title, description, category, goalAmount, endDate, files]);

    // Handle file upload with improved validation
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = [
            'image/jpeg', 
            'image/png', 
            'application/pdf',
            'image/webp',
            'image/gif'
        ];
        
        if (!validTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, WEBP, GIF or PDF files allowed');
            return;
        }

        // Increased file size limit to 10MB
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
            return;
        }

        setFiles([file]);
        setErrors(prev => ({ ...prev, image: '' }));
    };

    // Improved submit handler with progress tracking
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const campaignData = {
                title,
                description: description.split('\n'),
                category,
                goalAmount: Number(goalAmount), // Ensure it's a number
                endDate,
                address: selectedAddress?._id,
                account: selectedAccount?._id
            };

            const formData = new FormData();
            formData.append('campaignData', JSON.stringify(campaignData));
            if (files[0]) {
                formData.append('images', files[0]);
            }

            // Configure axios for progress tracking
            const config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const { data } = await axios.post('/api/campaign/add', formData, config);

            if (data.success) {
                toast.success(data.message);
                // Reset form
                setTitle('');
                setDescription('');
                setCategory('');
                setGoalAmount('');
                setEndDate('');
                setFiles([null]);
                setErrors({});
                setUploadProgress(0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || error.message || 'Upload failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch patient data with error handling
    const getPatientAddress = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            toast.error('Failed to load addresses');
        }
    }, [axios]);

    const getPatientAccount = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/account/get');
            if (data.success) {
                setAccount(data.accounts);
                if (data.accounts.length > 0) {
                    setSelectedAccount(data.accounts[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
            toast.error('Failed to load bank accounts');
        }
    }, [axios]);

    useEffect(() => {
        if (patient) {
            getPatientAddress();
            getPatientAccount();
        }
    }, [patient, getPatientAddress, getPatientAccount]);

    // Reusable dropdown component with improved accessibility
    const SelectDropdown = React.memo(({ 
        label,
        options,
        selected,
        onSelect,
        displayFn,
        show,
        setShow,
        addNewPath
    }) => (
        <div className="mb-6">
            <label className="text-sm font-medium uppercase">{label}</label>
            <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-start">
                    <p className="text-gray-500">
                        {selected ? displayFn(selected) : `No ${label.toLowerCase()} found`}
                    </p>
                    <button
                        onClick={() => setShow(!show)}
                        className="text-primary hover:underline cursor-pointer"
                        type="button"
                        aria-expanded={show}
                        aria-controls={`${label.toLowerCase()}-dropdown`}
                    >
                        Change
                    </button>
                </div>
                {show && (
                    <div 
                        id={`${label.toLowerCase()}-dropdown`}
                        className="py-1 bg-white border border-gray-300 text-sm w-full rounded mt-2 max-h-40 overflow-y-auto"
                    >
                        {options.length > 0 ? (
                            options.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        onSelect(item);
                                        setShow(false);
                                    }}
                                    className="w-full text-left text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {displayFn(item)}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500 p-2">No options available</p>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate(addNewPath)}
                            className="w-full text-center text-primary cursor-pointer p-2 hover:bg-indigo-500/10"
                        >
                            Add new
                        </button>
                    </div>
                )}
            </div>
        </div>
    ));

    // Preview component for uploaded files
    const FilePreview = ({ file }) => {
        if (!file) return null;
        
        const fileType = file.type.split('/')[0];
        const fileSize = (file.size / (1024 * 1024)).toFixed(2); // MB

        return (
            <div className="flex items-center gap-3 mt-2 p-2 border rounded">
                {fileType === 'image' ? (
                    <img
                        className="w-16 h-16 object-cover rounded"
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                    />
                ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                        <span className="text-xs text-gray-500">PDF</span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                        {fileType.toUpperCase()} • {fileSize}MB
                    </p>
                    {isSubmitting && (
                        <div className="w-full bg-gray-200 rounded h-1.5 mt-1">
                            <div 
                                className="bg-primary h-1.5 rounded" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
                {!isSubmitting && (
                    <button
                        type="button"
                        onClick={() => setFiles([null])}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove file"
                    >
                        ×
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="no-scrollbar flex-1 h-auto overflow-y-visible flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg mx-auto">
                {/* Document Upload */}
                <div>
                    <label className="text-base font-medium">Medical Document & Image</label>
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                    
                    {files[0] ? (
                        <FilePreview file={files[0]} />
                    ) : (
                        <div className="flex items-center gap-3 mt-2">
                            <label htmlFor="image0" className="cursor-pointer">
                                <input
                                    onChange={handleFileChange}
                                    type="file" 
                                    id="image0" 
                                    hidden
                                    accept="image/*,.pdf"
                                    disabled={isSubmitting}
                                />
                                <img
                                    className="max-w-24"
                                    src={assets.upload_area}
                                    alt="Upload area"
                                    width={100}
                                    height={100}
                                />
                            </label>
                            <div>
                                <p className="text-sm text-gray-500">No file selected</p>
                                <p className="text-xs text-gray-400">
                                    JPG, PNG, WEBP, GIF or PDF (max 10MB)
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Campaign Title */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="campaign-title">
                        Campaign Title
                    </label>
                    <input 
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors(prev => ({ ...prev, title: '' }));
                        }} 
                        value={title}
                        id="campaign-title" 
                        type="text" 
                        placeholder="Type here" 
                        className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.title ? 'border-red-500' : 'border-gray-500/40'}`} 
                        disabled={isSubmitting}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* Campaign Description */}
                <div className="flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="campaign-description">
                        Campaign Description
                    </label>
                    <textarea 
                        onChange={(e) => {
                            setDescription(e.target.value);
                            setErrors(prev => ({ ...prev, description: '' }));
                        }} 
                        value={description}
                        id="campaign-description" 
                        rows={4} 
                        className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.description ? 'border-red-500' : 'border-gray-500/40'} resize-none`} 
                        placeholder="Type here"
                        disabled={isSubmitting}
                        maxLength={500}
                    ></textarea>
                    <div className="flex justify-between">
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        <p className={`text-xs ml-auto ${description.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
                            {description.length}/500 characters
                        </p>
                    </div>
                </div>

                {/* Category */}
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select 
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setErrors(prev => ({ ...prev, category: '' }));
                        }} 
                        value={category}
                        id="category" 
                        className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.category ? 'border-red-500' : 'border-gray-500/40'}`}
                        disabled={isSubmitting}
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>

                {/* Goal Amount & End Date */}
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="goal-amount">
                            Goal Amount (MWK)
                        </label>
                        <input 
                            onChange={(e) => {
                                setGoalAmount(e.target.value);
                                setErrors(prev => ({ ...prev, goalAmount: '' }));
                            }} 
                            value={goalAmount}
                            id="goal-amount" 
                            type="number" 
                            placeholder="0" 
                            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.goalAmount ? 'border-red-500' : 'border-gray-500/40'}`} 
                            disabled={isSubmitting}
                            min="0"
                            step="1"
                        />
                        {errors.goalAmount && <p className="text-red-500 text-sm">{errors.goalAmount}</p>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-base font-medium" htmlFor="end-date">
                            End Date
                        </label>
                        <input 
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setErrors(prev => ({ ...prev, endDate: '' }));
                            }} 
                            value={endDate}
                            id="end-date" 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${errors.endDate ? 'border-red-500' : 'border-gray-500/40'}`} 
                            disabled={isSubmitting}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                    </div>
                </div>

                {/* Address & Bank Details */}
                <div className="w-full rounded p-5 border border-gray-300/70">
                    <SelectDropdown
                        label="Select Address"
                        options={addresses}
                        selected={selectedAddress}
                        onSelect={setSelectedAddress}
                        displayFn={(addr) => `${addr.street}, ${addr.city}, ${addr.province}`}
                        show={showAddress}
                        setShow={setShowAddress}
                        addNewPath="/patient/add-address"
                    />

                    <hr className="border-gray-300 mb-5" />

                    <SelectDropdown
                        label="Bank Details"
                        options={account}
                        selected={selectedAccount}
                        onSelect={setSelectedAccount}
                        displayFn={(acc) => `${acc.bankName} (${acc.accNumber})`}
                        show={showAccount}
                        setShow={setShowAccount}
                        addNewPath="/patient/add-bank"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 w-full py-3 bg-primary text-white font-medium rounded cursor-pointer hover:bg-primary-dull transition-colors ${
                        isSubmitting ? 'opacity-70' : ''
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg 
                                className="animate-spin h-5 w-5 text-white" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Processing...'}
                        </span>
                    ) : 'ADD CAMPAIGN'}
                </button>
            </form>
        </div>
    );
};

export default AddCampaign;