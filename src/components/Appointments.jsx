import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { AgentAddressContext } from '../App';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';

const DoctorAppointments = () => {
  const agentContractAddress = useContext(AgentAddressContext);
  const [patientList, setPatientList] = useState([]);
  
  const [appointments,setAppointments]=useState([]);
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
 const doctorAppointmets=async ()=>{
  try {
    const doctorAddress = await signer.getAddress();
    const doctorAppointments = await contract.getDoctorAppointments(doctorAddress);
    setAppointments(doctorAppointments);
    
  } catch (error) {
    console.error(error);
  }
 }
  const fetchPatients = async () => {
    try {
      const doctorAddress = await signer.getAddress();
      const patientAddressList = await contractWithSigner.get_accessed_patientlist_for_doctor(doctorAddress);
  
      const patients = [];
  
      for (let i = 0; i < patientAddressList.length; i++) {
        const patientAddress = patientAddressList[i];
        const value = await contractWithSigner.get_patient(patientAddress);
        const [patientName, patientAge] = value;
        
        patients.push({
          name: patientName,
          age: patientAge.toNumber(),
          address: patientAddress,
        });
      }
  
      setPatientList(patients);
    } catch (error) {
      console.log("Error fetching patients: ", error);
    }
  };
  

  useEffect(() => {
    fetchPatients();
    doctorAppointmets();
  }, []);
  

  return (
    <div>
      <h1>Doctor Appointments</h1>
      <ul>
        {patientList.map((patient, index) => (
          <li key={index}>{patient.a}</li>
        ))}
      </ul>
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map((slot, index) => (
          <li key={index}>
            {new Date(slot.startTime * 1000).toLocaleString()} -{' '}
            {new Date(slot.endTime * 1000).toLocaleTimeString()}{' '}
            {slot.isBooked && `Booked by: ${slot.patient}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
