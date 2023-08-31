import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { AgentAddressContext } from '../../App';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import 'bootstrap/dist/css/bootstrap.css';
import Layout from '../../components/Layout';

const PatientHomePage = () => {
  const agentContractAddress = useContext(AgentAddressContext);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState(0); // Assuming 0 is for patients
  // You can add more states for patient-specific data if needed

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);

  const getPatientData = async () => {
    try {
      var key = await signer.getAddress();
      key = key.toLowerCase();
      const result = await contractWithSigner.get_patient(key);
      setName(result[0]);
      // Set other patient-specific data states if needed
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getPatientData();
  }, []);

  return (
    <div>
      {name ? (
        <>
          <h1 className="text-center">Patient Home Page</h1>
          <Layout designation={designation} hideDashboard />
          {/* Render patient-specific components and data here */}
        </>
      ) : (
        'loading'
      )}
    </div>
  );
};

export default PatientHomePage;
