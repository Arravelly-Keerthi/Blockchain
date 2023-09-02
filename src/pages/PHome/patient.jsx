import React, { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { AgentAddressContext } from '../../App';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import 'bootstrap/dist/css/bootstrap.css';
import PatientLayout from '../../components/PatientLayout';

const PatientHomePage = () => {
  const agentContractAddress = useContext(AgentAddressContext);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState(0); // Assuming 0 is for patients

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);

  const fetchData = async () => {
    try {
      var key = await signer.getAddress();
      key = key.toLowerCase();

      // Check the designation and call the appropriate function
      if (designation === 0) {
        const result = await contractWithSigner.get_patient(key);
        setName(result[0]);
      } else {
        const result = await contractWithSigner.get_doctor(key);
        setName(result[0]);
      }

      // Set other data states as needed
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [designation]); // Make sure to fetch data when designation changes

  return (
    <div>
      {name ? (
        <>
          <h1 className="text-center">Patient Home Page</h1>
          <PatientLayout isPatient />
          {/* Render patient-specific components and data here */}
        </>
      ) : (
        'loading'
      )}
    </div>
  );
};

export default PatientHomePage;
