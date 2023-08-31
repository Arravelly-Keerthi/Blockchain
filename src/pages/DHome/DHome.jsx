import React, { useEffect, useState,  useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import 'bootstrap/dist/css/bootstrap.css';
import { AgentAddressContext } from '../../App';
import Layout from '../../components/Layout'


const HomePage = () => {
  const agentContractAddress = useContext(AgentAddressContext);
  const [name, setName] = useState();
  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const parameterValue = queryParams.get('designation'); 
    const designation = parseInt(parameterValue);
    //console.log(designation);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);
  const getPatientData=async()=>{
    try{
    var key=await signer.getAddress();
    key=key.toLowerCase();
    const result=await contractWithSigner.get_patient(key);
    setName(result[0]);
    }
    catch(error){
       console.log(error);
    }
  }
  const getDoctorData = async () => {
    try {
      var key = await signer.getAddress();
      key = key.toLowerCase();
      const result = await contractWithSigner.get_doctor(key);
      setName(result[0]);
    } catch (error) {
      console.log("Error: ",error);
    }
  };

  useEffect(() => {
    if(designation===0) getPatientData();
    else getDoctorData();
  }, []);
  return (
    <div>
    {name ? (
      <>
        
          <h1 className="text-center">Home Page</h1>
          <Layout designation={designation} />
      </>
    ) : (
      'loading'
    )}
  </div>
    
  );
};

export default HomePage;
