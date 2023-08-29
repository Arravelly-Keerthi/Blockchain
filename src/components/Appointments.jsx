// src/components/DoctorAppointments.js

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
    // Fetch the list of patients who have given access to the doctor
    // Update the patientList state
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
