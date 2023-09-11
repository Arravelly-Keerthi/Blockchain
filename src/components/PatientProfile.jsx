import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';
import 'bootstrap/dist/css/bootstrap.css';
import { AgentAddressContext } from '../App';
import { format } from 'date-fns';


const PatientProfile = () => {
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
        var key = await signer.getAddress();
        key = key.toLowerCase();

        const contractWithSigner = contract.connect(signer);

        // Assuming the contract returns an object with named fields
        const result = await contractWithSigner.get_patient(key);

        // Access the fields directly
        //let name, dateOfBirth, email, mobileNo, alternateNo, houseaddress ;
        const name = result[0];
        const dateOfBirth = result[1];
        const email = result[2];
        // Replace JavaScript number with BigNumber
        const mobileNo = result[3];
        const alternateNo = result[4];

        const houseaddress = result[5];
        const parsedDateOfBirth = new Date(dateOfBirth); // Parse the string into a Date object

// Format the Date object as needed (e.g., "MM/dd/yyyy")
        const formattedDate = format(parsedDateOfBirth, 'MM/dd/yyyy');
        //console.log(formattedDate);
        // Update the patientInfo state with retrieved data
        setPatientInfo({
          name,
          formattedDate,
          email,
          mobileNo,
          alternateNo,
          address: houseaddress, // Adjust the field name if needed
        });
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    //Make sure that the field names in the result object match the field names you are trying to access in your code. Adjust the field names in the destructuring assignment as needed to match the contract's data structure.



    fetchData();
  }, []);

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
                    <td>{patientInfo.formattedDate}</td>
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
