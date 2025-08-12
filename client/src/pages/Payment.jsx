import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react'

const Payment = () => {
  const { campaigns, isPatient, navigate, axios, patient } = useAppContext();
  const { id } = useParams();

  const campaign = campaigns.find(c => c._id === id);

  // Handle private campaign (not approved)
  if (!campaign) return <div className="p-10 text-center">Campaign not found.</div>;
  if (!campaign.isApprove) return (
    <div className="p-10 text-center text-xl font-semibold text-red-600">
      This campaign is private.
    </div>
  );

  const [amount, setAmount] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCVC] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const { user } = useUser(); 
const donorId = user?.id;   

 
  const canDonate = !!patient; 

  
  const handleDonate = async (e) => {
    e.preventDefault();
    if (!canDonate) {
      toast.error("Please login to donate");
      return;
    }
    if (Number(amount) < 100) {
      toast.error("Minimum amount is 100");
      return;
    }
    if (!cardName || !cardNumber || !expMonth || !expYear || !cvc) {
      toast.error("Please fill all payment fields");
      return;
    }
    setIsPaying(true);
    
    try {
      const { data } = await axios.post('/api/donation/add', {
  campaignId: campaign._id,
  donorId, 
  amount: Number(amount),
  message,
  isAnonymous,
});
      if (data.success) {
        toast.success("Donation Successful!");
        navigate(`/donate/${campaign.category.toLowerCase()}/${campaign._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error in donation");
    }
    setIsPaying(false);
  };

  // Format currency
  const formatCurrency = val => `LKR ${Number(val || 0).toLocaleString()}`;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-10 items-start min-h-screen">
      
      <div className="flex-1 max-w-lg w-full bg-white shadow-xl rounded-xl p-6 mb-6 md:mb-0">
        <h2 className="text-lg font-bold mb-4 text-primary">Campaign Details</h2>
        <img src={campaign.image?.[0]} alt={campaign.title} className="w-full h-52 object-cover rounded-lg mb-4" />
        <div className="text-xl font-bold mb-1">{campaign.title}</div>
        <div className="text-gray-500 text-sm mb-2">{campaign.description?.[0]}</div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Goal:</span>
          <span>{formatCurrency(campaign.goalAmount)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Raised:</span>
          <span>{formatCurrency(campaign.collectedAmount)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-gray-200 px-2 py-1 rounded text-xs">Category: {campaign.category}</span>
          {campaign.isEmergency && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold text-xs">Emergency</span>
          )}
        </div>
      </div>

      
      <form
        onSubmit={handleDonate}
        className="flex-1 max-w-lg w-full bg-white shadow-xl rounded-xl p-8 flex flex-col gap-4"
        autoComplete="off"
      >
        <h2 className="text-lg font-bold mb-4">Donate to this Campaign</h2>
        <div>
          <label className="block mb-1 font-medium">Amount (Min LKR 100)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="100"
            required
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
            placeholder="Enter Amount"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Cardholder Name</label>
          <input
            type="text"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Name as on Card"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Card Number</label>
          <input
            type="text"
            maxLength={16}
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value.replace(/\D/, ''))}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Card Number"
            required
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Exp Month</label>
            <input
              type="text"
              maxLength={2}
              value={expMonth}
              onChange={e => setExpMonth(e.target.value.replace(/\D/, ''))}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="MM"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Exp Year</label>
            <input
              type="text"
              maxLength={2}
              value={expYear}
              onChange={e => setExpYear(e.target.value.replace(/\D/, ''))}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="YY"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">CVC</label>
            <input
              type="text"
              maxLength={3}
              value={cvc}
              onChange={e => setCVC(e.target.value.replace(/\D/, ''))}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="CVC"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Message (optional)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            rows={2}
            placeholder="Support message"
          />
        </div>
        <div className="flex items-center gap-2">
  <button
    type="button"
    aria-pressed={isAnonymous}
    onClick={() => setIsAnonymous(v => !v)}
    className={`w-12 h-6 rounded-full transition-colors duration-200
      ${isAnonymous ? "bg-green-500" : "bg-gray-300"}
      flex items-center`}
    style={{ padding: "2px" }}
  >
    <span
      className={`
        h-5 w-5 rounded-full bg-white shadow
        transition-transform duration-200
        ${isAnonymous ? "translate-x-6" : ""}
      `}
    />
  </button>
  <label className="text-sm text-gray-600 select-none">Donate anonymously</label>
</div>
        <button
          type="submit"
          disabled={isPaying || !canDonate}
          className="w-full mt-2 py-3 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary-dull transition disabled:opacity-60"
        >
          {canDonate ? (isPaying ? "Processing..." : "Donate Now") : "Login to Donate"}
        </button>
      </form>
    </div>
  );
};

export default Payment;
