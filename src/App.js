import './App.css';
import Index from './pages/Index/index';
import Register from './pages/Register/register';
import Patient from './pages/Patient/patient';
import Doctor from './pages/Doctor/doctor';
import DHome from './pages/DHome/DHome';
import Appointments from './components/Appointments';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext } from 'react';
export const AgentAddressContext = createContext();

function App() {
  const agentAddress=require('./Data/contract-address.json').contractAddress;
  //console.log(agentAddress);
  return (
    <AgentAddressContext.Provider value={agentAddress}>
    <div>
      
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path="/register" element={<Register/>} />
        <Route path="/patient" element={<Patient/>}/>
        <Route path='/home' element={<DHome/>}/>
        <Route path='/doctor-appointments' element={<Appointments/>}/>
        <Route path="/doctor/profile/:userId" element={<DoctorProfile />} />
      </Routes>
   
    </div>
    </AgentAddressContext.Provider>    
  );
}

export default App;
