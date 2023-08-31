import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { AgentAddressContext } from '../App';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';
import './DoctorProfile.css';
const DoctorProfile = () => {
  const agentContractAddress = useContext(AgentAddressContext);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [fees, setFees] = useState("");
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);

  const fetchDoctorData = async () => {
    try {
      const doctorAddress = await signer.getAddress();
      const result = await contractWithSigner.get_doctor(doctorAddress);
      const [doctorName, doctorAge, doctorSpeciality, doctorFees] = result;

      setName(doctorName);
      setAge(doctorAge.toString());
      setSpeciality(doctorSpeciality);
      setFees(doctorFees.toString());
    } catch (error) {
      console.log("Error fetching doctor's data: ", error);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  return (
    <div className="doctor-profile">
      <h1>Doctor Profile</h1>
      <div className="doctor-details">
        <p>Name: {name}</p>
        <p>Age: {age}</p>
        <p>Speciality: {speciality}</p>
        <p>Fees: {fees}</p>
      </div>
    </div>
  );
};

export default DoctorProfile;
