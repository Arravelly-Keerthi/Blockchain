import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TextEncoder } from 'text-encoding';
import "./doctor.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import { create } from 'ipfs-http-client';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { AgentAddressContext } from '../../App';
import Record from '../Record/record';

export default function Doctor() {
  const agentContractAddress = useContext(AgentAddressContext);
  const recordsRef = useRef(null);

  const [alertdanger, setAlertdanger] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [toggleRecordsButton, setToggleRecordsButton] = useState(0);
  const [data, setData] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [patientList, setPatientList] = useState([]);
  const [showThem, setShowThem] = useState(false);

  const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
  });

  var ailmentsDict = {};
  ailmentsDict[0] = "Common Flu";
  ailmentsDict[1] = "Viral Infection";
  ailmentsDict[2] = "Cancer";
  ailmentsDict[3] = "Tumor";
  ailmentsDict[4] = "Covid-19";
  ailmentsDict[5] = "Heart-Disorder";
  ailmentsDict[6] = "Other";


  var docName = "";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);

  useEffect(() => {
    fetchData();
    fetchPatients();
  }, []);
  const fetchData = async () => {
    var key = await signer.getAddress();
    key = key.toLowerCase();
    const result = await contractWithSigner.get_doctor(key);
    setName(result[0]);
    setAge(result[1].toNumber());
  }

  const showRecords = async (element, index) => {
    const table = document.getElementById("viewPatient").getElementsByTagName("tbody")[0];
    const publicKeyPatient = table.rows[index].cells[1].innerHTML;
    setPatientAddress(publicKeyPatient);
   // console.log(publicKeyPatient);
    if (toggleRecordsButton % 2 === 0) {
      try {
        const result = await contractWithSigner.get_hash(publicKeyPatient);
        const ipfsHash = result.toString();

        const response = await axios.get(`http://localhost:8080/ipfs/${ipfsHash}`);

        setData(response.data);
        if (recordsRef.current) recordsRef.current.innerHTML = data;
        setShowThem(true);

      } catch (error) {
        console.log("Error: ", error);
      }

      setToggleRecordsButton(toggleRecordsButton + 1);
      element.target.value = "Hide Records";
      element.target.className = "btn btn-danger";
    } else {
      const row = table.rows[index + 1];
      row.style.display = "none";
      setToggleRecordsButton(toggleRecordsButton - 1);
      element.target.value = "View Records";
      element.target.className = "btn btn-success";
    }
  };

  const fetchPatients = async () => {
    var key = await signer.getAddress();
    key = key.toLowerCase();
    try {
      const patientAddressList = await contractWithSigner.get_accessed_patientlist_for_doctor(key);
      const patients = [];

      for (let i = 0; i < patientAddressList.length; i++) {
        const patientAddress = patientAddressList[i];
       // console.log(patientAddress);
        const value = await contractWithSigner.get_patient(patientAddress);
        const [a, b] = value;

        patients.push({
          a,
          patientAddress,
        });
      }

      setPatientList(patients);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const getDateTime =  () => {
     function AddZero(num) {
      return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    var now = new Date();
    var strDateTime = [[AddZero(now.getDate()),
    AddZero(now.getMonth() + 1),
    now.getFullYear()].join("/"),
    [AddZero(now.getHours()),
    AddZero(now.getMinutes())].join(":"),
    now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    return strDateTime;
  }

  const submitDiagnosis = async (diagnosisValue, comments, index) => {
    var table = document.getElementById("viewPatient");
   // console.log(patientAddress);
    setDiagnosis(parseInt(diagnosisValue));

 //   console.log(diagnosis);
    var diagnosed = ailmentsDict[diagnosis];


    const oldRecords = recordsRef.current.innerHTML;
   var time=await getDateTime();
    console.log(time);
    var newRecords =
      `Diagnosed By : ${docName}
Diagnosis Time : ${time}
Diagnosis : ${diagnosed}
Comments : ${comments}
        
`
    var updatedRecords = oldRecords + newRecords;
    if (!isNaN(diagnosis)) {

      try {
        const result = await ipfs.add(updatedRecords);
        
        const ipfshash = result.path;
        try {
          const gasLimit=100000;
          const val = await contractWithSigner.insurance_claim(patientAddress, diagnosis, ipfshash,{gasLimit});
          alert("Your diagnosis has been submitted.");
          // delete content row
          setShowThem(false);
          // delete main row of corresponding content row
          table.deleteRow(index+1);
        }
        catch (error) {
          setAlertdanger(true);
          console.log("Error: ", error);
        }
      }
      catch (error) {
        console.log("Error: ", error);
      }

    }
    else {
      alert("Select a diagnosis");
    }
   
   

    
  }
  /////////////////////////////////////////
  if(name===""||age===""){
    return (
        <div>The page is loading......
          Kindly refresh the page!!
        </div>
    )
  
}

  return (
    <div>
      <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
        <div className="container-fluid">

          <div className="navbar-header">
            
            <Link className="navbar-brand" to={"/"}>Electronic Health Records</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li>
                <Link to={"/index"}>Logout</Link>
              </li>
            </ul>
          </div>

        </div>

      </nav>

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
                    <td id="name">{name}</td>
                  </tr>
                  <tr>
                    <th>Age:</th>
                    <td id="age">{age}</td>
                  </tr>
                </table>
              </div>
            </div>

          </div>
        </div>


        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="text-center">Accessible EMRs</h3>
          </div>
          <div className="panel-body">
            <div className="row">
              {alertdanger && <div className="alert alert-danger col-sm-8 col-sm-offset-2">
                <strong>Notice!</strong> Could not access records. Access might have been revoked. Contact admin or patient.
              </div>}
            </div>
            <div className="row align-items-center">
              <div className="col-sm-offset-1 col-sm-10">
                <table id="viewPatient" className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th className="publicKeyPatient">Public Key</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientList.map((patient, index) => (
                      <React.Fragment key={index}>
                        <tr >
                          <td>{patient.a}</td>
                          <td className="publicKeyPatient">{patient.patientAddress}</td>
                          <td>
                            <button className="btn btn-success" onClick={(event) => showRecords(event, index)} id="viewRecordsButton">
                              View records
                            </button>
                          </td>
                        </tr>
                        {showThem && <tr>
                          <td colSpan="3"> {/* Assuming you want the record component to span across all columns */}
                            <Record publicKeyPatient={patientAddress} recordsRef={recordsRef} data={data} submitDiagnosis={submitDiagnosis} index={index} />
                          </td>
                        </tr>}
                      </React.Fragment>

                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
