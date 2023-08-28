import React, { useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { TextEncoder } from 'text-encoding';
import "./patient.css";
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import { create } from 'ipfs-http-client';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { AgentAddressContext } from '../../App';



const Patient =  () => {
    const agentContractAddress= useContext(AgentAddressContext);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [toggleRecordsButton, setToggleRecordsButton] = useState(0);
    const [recordHash, setRecordHash] = useState('');
    const [patientData, setPatientData] = useState({});
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [showError, setShowError] = useState(false);
    const [selectedDoctorIndex,setSelectedDoctorIndex]=useState('');
    const [alertinfo,setAlertinfo]=useState(false);
    const [accessedDoctorList, setAccessedDoctorList] = useState([]);
    const [record,setRecord]=useState(false);
    const [recordsData, setRecordsData] = useState('');
    
    const handleSelectChange = (event) => {
        const selectedValue=event.target.value;
        setSelectedDoctor(selectedValue);
        const selectedIndex = doctorList.findIndex((doctor) => doctor === selectedValue);
       
        setSelectedDoctorIndex(selectedIndex);

    };
     

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);

    const signer =  provider.getSigner();
    const contractWithSigner = contract.connect(signer);
useEffect(()=>{
    const fetchData= async ()=>{
        var key= await signer.getAddress();

        key=key.toLowerCase();
    
        var a = "";
        var b = 0;
        var ailments = [];
        // print patient details and insurer details (if exists). If insurer does not exist show the buy insurance panel
      //  console.log("Getting Patient Data");
        try {
            const result = await contractWithSigner.get_patient(key);
        //    console.log("Patient Data Result: " + result);
            a = result[0];
            b = result[1];
            ailments = result[2];
            
            //setInsurerAddress(result[3]);
         //   console.log("RecordHash: ",result[4]);
            setRecordHash(result[4]);
            setName(a);
            setAge(b.toNumber());
        }
        catch (error) {
            console.log("Error: ", error);
        }
        // print out the doctors to share emr
        var DoctorList = 0;
      //  console.log("Getting Doctor List");
        try {
            const result = await contractWithSigner.get_doctor_list();
           // console.log(result);
            DoctorList = result;
            //setDoctorList([]);
            for (var i = 0; i < DoctorList.length; i++) {
                const value = await contractWithSigner.get_doctor(DoctorList[i]);
                [a, b] = value;
             //   console.log(a);
                setDoctorList((prevDoctorList) => [...prevDoctorList, a]);
            }
        }
        catch (error) {
            console.log("Error", error);
        }
        // print out the doctors who have access
        try {
            var doctorAddressList = 0;
            var result =await  contractWithSigner.get_accessed_doctorlist_for_patient(key);
            doctorAddressList = result;
         //   console.log(result);
            const updatedAccessDoc = [];
            for (var i=0;i<doctorAddressList.length;i++) {
              //  console.log(doctorAddressList);
                
                  const value =await  contractWithSigner.get_doctor(doctorAddressList[i]);
                  [a, b] = value;
              //    console.log(a);
                  
                  // Generate dummy data for the new row
                  const newRow = {
                    cell1: a,
                    cell2: doctorAddressList[i],
                  };
              
                  // Add the new row to the array
                  updatedAccessDoc.push(newRow);
              
                  // Update the state with the modified accessDoc array
                  setAccessedDoctorList(updatedAccessDoc);
                  
                
              }
              
              
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }
    fetchData();
    
},[]);
   
   
 function showRecords(element) {
    if (toggleRecordsButton % 2 === 0) {
        fetchRecordsData();
        setToggleRecordsButton(prevToggle => prevToggle + 1);
        setRecord(true);
      } else {
        setRecord(false);
        setToggleRecordsButton(prevToggle => prevToggle - 1);
      }

}
const fetchRecordsData = () => {
   // console.log(recordHash);
    const url = `http://localhost:8080/ipfs/${recordHash}`;
    axios.get(url)
      .then(response => {
        setRecordsData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };



 async function giveAccess() {
    
    try{
      
     const result=await contractWithSigner.get_doctor_list();
     var doctorToBeAdded=result[selectedDoctorIndex];
     
     try{
        const gasLimit = 1000000;

         await contractWithSigner.permit_access(doctorToBeAdded,{gasLimit});
     //    console.log(gasLimit);
        const updatedAccessDoc = [...accessedDoctorList];
        // Generate dummy data for the new row
        const newRow = {
            cell1: selectedDoctor,
            cell2: doctorToBeAdded,
        };

        // Add the new row to the array
        updatedAccessDoc.push(newRow);

        // Update the state with the modified accessDoc array
        setAccessedDoctorList(updatedAccessDoc);

     }
     catch(error){
        console.log("Error: ",error);
     }
    }
    catch(error){
        setAlertinfo(true);
        console.log("Error: ",error);
    }
    
}

async function revokeAccess(event) {
    const row = event.target.closest('tr');
    const index = row.rowIndex;
    const docKey = row.cells[1].innerText;
    //console.log(docKey);
    try {
        const gasLimit = 1000000;
        await contractWithSigner.revoke_access(docKey,{gasLimit});
        const updatedTableData = [...doctorList];
        // Remove the row at the specified index
        updatedTableData.splice(index, 1);
        setDoctorList(updatedTableData);
        window.location.reload();

    }
    catch (error) {
        setShowError(true);
        console.log("Error: ", error);
    }

}
if(name===""||age===""||recordHash===""){
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

                            <div className="text-center">
                                <h5>Your records are stored here: http://localhost:8080/ipfs/<span id="recordsHash">{recordHash}</span></h5>
                                <button type="submit" className="btn btn-info btn-lg" onClick={showRecords}>{toggleRecordsButton % 2 === 0 ? 'View Medical Records' : 'Hide Medical Records'}</button>
                              
                            </div>
                            {record&&<pre id="records"  >
                              {recordsData};
                            </pre>}

                        </div>
                    </div>

                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="text-center">Share your Medical Record</h3>
                </div>
                <div className="panel-body">
                    <div className="row">
                        {alertinfo&&<div className="alert alert-info col-sm-8 col-sm-offset-2" >
                            <strong>Info!</strong> The doctor already has access to your records. Revoke access or wait for time duration to end to continue.
                        </div>}
                    </div>


                    <form className="form-horizontal" action="/action_page.php">
                        <div className="form-group">
                            <label for="permitDoctorList" className="control-label col-sm-2">Doctor:</label>
                            <div className="col-sm-8">
                                <select className="form-control" id="permitDoctorList" onChange={handleSelectChange} value={selectedDoctor}>
                                    <option value="">--Please Select</option>
                                    {doctorList.map((doctor, index) => (
                                        <option key={index} value={doctor}>
                                            {doctor}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                    </form>
                    <div className="text-center">
                        <button onClick={giveAccess} className="btn btn-primary btn-lg">Submit</button>
                    </div>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="text-center">Current EMR access holders</h3>
                </div>
                <div className="panel-body">
                    <div className="row align-items-center">
                        {showError && <div className="alert alert-danger col-sm-8 col-sm-offset-2" >
                            <strong>Notice!</strong> The access could not be revoked. Please retry or contact admin.
                        </div>}
                    </div>
                    <div className="row">
                        <div className="col-sm-offset-1 col-sm-10">
                            {accessedDoctorList.length > 0 && (
                                <table id="accessDoc" className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th> Doctor</th>
                                            <th className="publicKeyDoctor"> Public Key</th>
                                            <th>Revoke access</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accessedDoctorList.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.cell1}</td>
                                                <td>{row.cell2}</td>
                                                <td>
                                                    <button onClick={revokeAccess} className="btn btn-danger">
                                                        Revoke Access
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {accessedDoctorList.length === 0 && <p>No rows to display.</p>}


                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
);
};

export default Patient;