import './App.css';
import Index from './pages/Index/index';
import Register from './pages/Register/register';
import Patient from './pages/Patient/patient';
import Doctor from './pages/Doctor/doctor';
import DHome from './pages/DHome/DHome';
import PHome from './pages/PHome/patient'
import Appointments from './components/Appointments';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext } from 'react';
import DoctorProfile from './components/DoctorProfile';
export const AgentAddressContext = createContext();

function App() {
  const agentAddress="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
 
  return (
    <AgentAddressContext.Provider value={agentAddress}>
    <div>
      
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path="/register" element={<Register/>} />
        <Route path="/patient" element={<Patient/>}/>
        <Route path='/Dhome' element={<DHome/>}/>
        <Route path='/Phome' element={<PHome/>}/>
        <Route path='/doctor-appointments' element={<Appointments/>}/>
        <Route path="/doctor/profile/:userId" element={<DoctorProfile />} />
      </Routes>
   
    </div>
    </AgentAddressContext.Provider>    
  );
}

export default App;
