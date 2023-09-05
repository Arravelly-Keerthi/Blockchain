import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';
import 'bootstrap/dist/css/bootstrap.css';
import { AgentAddressContext } from '../App';

const PatientProfile= () => {
  const { patientAddress } = useParams(); // Get the patient's Ethereum address from the URL params
  const agentContractAddress = useContext(AgentAddressContext);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    mobileNo: '',
    alternateNo: '',
    address: '',
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);

        const result = await contractWithSigner.get_patient(patientAddress);

        // Assuming result is an array with patient data in the same order as stored
        const [name, dateOfBirth, email, mobileNo, alternateNo, address] = result;

        // Update the patientInfo state with retrieved data
        setPatientInfo({
          name,
          dateOfBirth,
          email,
          mobileNo,
          alternateNo,
          address,
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchData();
  }, [patientAddress, contract, provider]);

  return (
    <div>
      <h1 className="text-center">Patient Profile</h1>
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="text-center">Personal Information</h3>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-sm-offset-1 col-sm-10">
                <table className="table">
                  <tr>
                    <th>Name:</th>
                    <td>{patientInfo.name}</td>
                  </tr>
                  <tr>
                    <th>Date of Birth:</th>
                    <td>{patientInfo.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{patientInfo.email}</td>
                  </tr>
                  <tr>
                    <th>Mobile Number:</th>
                    <td>{patientInfo.mobileNo}</td>
                  </tr>
                  <tr>
                    <th>Alternate Number:</th>
                    <td>{patientInfo.alternateNo}</td>
                  </tr>
                  <tr>
                    <th>Address:</th>
                    <td>{patientInfo.address}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
