import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { AgentAddressContext } from '../App';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';

const DoctorAppointments = () => {
  const agentContractAddress = useContext(AgentAddressContext);
  const [patientList, setPatientList] = useState([]);
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);

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
  }, []);

  return (
    <div>
      <h1>Doctor Appointments</h1>
      <ul>
        {patientList.map((patient, index) => (
          <li key={index}>{patient.a}</li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
