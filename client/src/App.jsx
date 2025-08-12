import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllCampaign from './pages/AllCampaign'
import CampaignCategory from './pages/CampaignCategory'
import CampaignDetails from './pages/CampaignDetails'
import MyDonation from './pages/MyDonation'
import PatientLogin from './components/patient/PatientLogin'
import PatientLayout from './pages/patient/PatientLayout'
import AddCampaign from './pages/patient/AddCampaign'
import CampaignList from './pages/patient/CampaignList'
import CampaignDetailPage from './pages/patient/CampaignDetailPage'
import AdminLogin from './components/Admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import Overview from './pages/admin/Overview'
import Campaign_List from './pages/admin/Campaign_List'
import Campaign_DetailPage from './pages/admin/Campaign_DetailPage'
import Add_Address from './pages/patient/Add_Address'
import AddBankAccount from './pages/patient/AddBankAccount'
import Favorite from './pages/Favorite'
import Over_view from './pages/patient/Over_view'
import PatientRequest from './pages/admin/PatientRequest'
import CampaignHistory from './pages/admin/CampaignHistory'
import PatientList from './pages/admin/PatientList'
import Payment from './pages/Payment'
import DonorList from './pages/admin/DonorList'
import DonorDetail from './pages/admin/DonorDetail'
import MyRequest from './pages/patient/MyRequest.Jsx'
import DonationHistory from './pages/admin/DonationHistory'
import CampaignDonations from './pages/patient/CampaignDonations'
import PatientDetail from './pages/admin/PatientDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import UserRequest from './pages/admin/UserRequest'

const App = () => {

  const isAdminPath = useLocation().pathname.includes("admin")
  const isPatientPath = useLocation().pathname.includes("patient")
  const {showPatientLogin, isPatient, isAdmin} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {(isPatientPath || isAdminPath) ? null : <Navbar />} 
      {showPatientLogin ? <Login/> : null}


      <Toaster/>

      <div className={`${(isPatientPath || isAdminPath) ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/donate' element={<AllCampaign/>} />
          <Route path='/donate/:category' element={<CampaignCategory/>} />
          <Route path='/donate/:category/:id' element={<CampaignDetails/>} />
          <Route path='/donate/pay/:id' element={<Payment/>} />
          <Route path='/favourite' element={<Favorite/>} />
          <Route path='/my-donation' element={<MyDonation/>} />
          <Route path='/patient' element={isPatient ? <PatientLayout/> : <PatientLogin/>}>
            <Route index element={isPatient ? <AddCampaign/> : null}/>
            <Route path='overview' element={<Over_view/>}/>
            <Route path='add-address' element={<Add_Address/>}/>
            <Route path='add-bank' element={<AddBankAccount/>}/>
            <Route path='My-Campaign/:id' element={<CampaignDetailPage/>}/>
            <Route path='donations' element={<CampaignDonations/>}/>
            <Route path='My-Request' element={<MyRequest/>}/>
          </Route>
          <Route path='/admin' element={isAdmin ? <AdminLayout/> : <AdminLogin/>}>
            <Route index element={isAdminPath ? <Overview/> : null}/>
            <Route path='campaign-list' element={<Campaign_List/>}/>
            <Route path='campaign-list/:id' element={<Campaign_DetailPage/>}/>
            <Route path='campaign-history' element={<CampaignHistory/>}/>
            <Route path='user-request' element={<UserRequest/>}/>
            <Route path='patient-request' element={<PatientRequest/>}/>
            <Route path='patient-details' element={<PatientList/>}/>
            <Route path='patient-details/:id' element={<PatientDetail/>}/>
            <Route path='donar-details' element={<DonorList/>}/>
            <Route path="donor-details/:id" element={<DonorDetail />} />
            <Route path="donations-history" element={<DonationHistory />} />
          </Route>
          
        </Routes>
      </div>
      {!(isPatientPath || isAdminPath) && <Footer />}
    </div>
  )
}

export default App