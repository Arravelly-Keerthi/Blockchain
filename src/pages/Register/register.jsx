import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TextEncoder } from 'text-encoding';
import { AgentAddressContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import { create } from 'ipfs-http-client';
import DatePicker from 'react-datepicker';
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.css';

const Register = () => {
    const agentContractAddress = useContext(AgentAddressContext);
    const [name, setName] = useState('');
   
    const [speciality, setSpeciality] = useState();
    const [experience,setExperience]=useState(0);
    const [fees,setFees]=useState();
    const [email, setEmail] = useState();
    const [mobileNo, setMobileNo] = useState();
    const [alternateNo, setAlternateNo] = useState();
    const [address, setAddress] = useState();
    const [insuranceName, setInsuranceName] = useState();
    const [deductibilities, setDeductibilities] = useState();
    const [validity, setValidity] = useState();
    const [dateOfBirth,setDateOfBirth]=useState();
    const [designation, setDesignation] = useState("2");
    const [showAlert, setShowAlert] = useState(false);
    const [alertinfo, setAlertinfo] = useState(false);


    const history = useNavigate();

    const Buffer = (str) => {
        return new Uint8Array([...str].map((char) => char.charCodeAt(0)));
    };
    const ipfs = create({
        host: 'localhost',
        port: 5001,
        protocol: 'http',
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    var ipfshash = '';

    const handleAlert1Click = () => {
        setShowAlert(true); // Show the alert
    };

    const handleAlert1Close = () => {
        setShowAlert(false); // Hide the alert
    };
    const handleAlert2Click = () => {
        setAlertinfo(true); // Show the alert
    };

    const handleAlert2Close = () => {
        setAlertinfo(false); // Hide the alert
    };

   
    const NavigateD = (parameters) => {
        history(`/Dhome?${new URLSearchParams(parameters).toString()}`);
    }
    const NavigateP=(paremeters)=>{
        history('/Phome');
    }

    const addPatient = async () => {
        try {
            let publicKey = await signer.getAddress();
            var reportTitle = `Name: ${name}Public Key: ${publicKey}`;
            function stringToUint8Array(str) {
                const encoder = new TextEncoder();
                return encoder.encode(str);
            }
            const buffer = stringToUint8Array(reportTitle);
            const res = await ipfs.add(buffer); // Upload the buffer to IPFS
            ipfshash = res.cid.toString();
            // Get the IPFS hash
            
            const result = await contractWithSigner.add_patient(name,dateOfBirth,email,mobileNo,alternateNo,address,insuranceName,deductibilities,validity, ipfshash);
           // console.log(result);
             NavigateP({designation:0});
            
        } catch (error) {
            console.log("Error: ", error);
            alert("Something went wrong!!!");
            //window.location.reload();
        }
    };
    
const handleDoctor=async(values)=>{
    try{
        const selectedTimings = JSON.stringify(values.timings);
        const result=await contractWithSigner.add_doctor(values.fullName,values.phone,values.email,values.website,values.address,speciality,values.experience,values.feesPerConsultation,selectedTimings);   
        NavigateD({designation:1});
     }
     catch(error){
         alert("Something went wrong!!!");
         console.log("Error: ",error);
         //window.location.reload();
     }
}
 /*   async function addAgent() {
        // console.log(name);
        setDesignation(parseInt(designation));
        const signer = provider.getSigner();
        let publicKey = await signer.getAddress();
        publicKey = publicKey.toLowerCase();
        //  console.log("PK:" + publicKey);

        var validPublicKey = true;
        var validAgent = true;
        var PatientList = 0;
        var DoctorList = 0;
        // var InsurerList = 0;
        try {
            var result = await contract.get_patient_list();
            PatientList = result;
            result = await contract.get_doctor_list();
            DoctorList = result;
               var result = await contract.get_insurer_list();
                var InsurerList = result; 
            if (validPublicKey === false) {
                handleAlert1Click();
            }
            else {
                for (var j = 0; j < PatientList.length; j++) {
                    if (publicKey === PatientList[j]) {
                        validAgent = false;
                    }
                }
                for (j = 0; j < DoctorList.length; j++) {
                    if (publicKey === DoctorList[j]) {
                        validAgent = false;
                    }
                }
                   for (j = 0; j < InsurerList.length; j++) {
                       if (publicKey === InsurerList[j]) {
                           validAgent = false;
                       }
                   }
                //  console.log(validAgent);
                if (validAgent === true) {
                    handleAlert1Close();
                    handleAlert2Close();
                    //    console.log(designation);
                    if (designation === "0") {
                        var reportTitle = `Name: ${name}Public Key: ${publicKey}`;
                        function stringToUint8Array(str) {
                            const encoder = new TextEncoder();
                            return encoder.encode(str);
                        }
                        const buffer = stringToUint8Array(reportTitle);
                         const response = await fetch('http://localhost:5001/api/v0/add?stream-channels=true&progress=false', {
                              method: 'POST',
                              mode: 'non-cors',
                              headers: {
                                  'Access-Control-Allow-Origin': 'http://localhost:3000'
                              },
                              body: buffer // include the request body if required
                          });
                        const result = await ipfs.add(buffer); // Upload the buffer to IPFS
                        ipfshash = result.cid.toString();
                        // Get the IPFS has
                        //  console.log("IPFS hash:", ipfshash);
                        await addPatient();
                    }
                    else {
                    //    await addDoctor();
                    }
                }
                else {
                    handleAlert2Click();
                }

            }
            return false;
        }
        catch (error) {
            console.log("Error: ", error)
        }
    }*/
    return (

        <div>
            <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
                <div className="container-fluid">

                    <div className="navbar-header">

                        <Link className="navbar-brand" to={'/'}>Electronic Health Records</Link>
                       {/* <Link className="navbar-brand" to={'/'}>Login</Link>
                        <Link className="navbar-brand" to={'/register'}>Register</Link>*/}
                    </div>
{/*
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to="/" >Login</Link>
                            </li>
                            <li className="active">
                                <Link to="/register">Register</Link>
                            </li>
                        </ul>
                    </div>*/
}
                </div>

            </nav>

            <div className="decide">
                {designation === "2" && (
                    <div className="confirm">
                        <button className='DB' onClick={(e) => setDesignation("1")}>DOCTOR</button>
                        <button className='PB' onClick={(e) => setDesignation("0")}>PATIENT</button>
                    </div>
                )}
                {designation === "1" &&
                    (<div className="doctor">
                        <Form layout="vertical" onFinish={handleDoctor} className="m-3">
                        <h4 className="">Personal Details : </h4>
                    <Row gutter={20}>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item
                          label="Full Name"
                          name="fullName"
                          required
                          rules={[{ required: true }]}
                          
                        >
                          <Input type="text" placeholder="your full name" value={name} onChange={(e) => setName(e.target.value)}  />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item
                          label="Phone No"
                          name="phone"
                          required
                          rules={[{ required: true }]}
                        >
                          <Input type="text" placeholder="your contact no"   />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item
                          label="Email"
                          name="email"
                          required
                          rules={[{ required: true }]}
                        >
                          <Input type="email" placeholder="your email address" value={email}
                                                onChange={(e) => setEmail(e.target.value)}  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                                title="Please enter a valid email address"

/>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Website" name="website">
                          <Input type="text" placeholder="your website" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item
                          label="Address"
                          name="address"
                          required
                          rules={[{ required: true }]} 
                        >
                          <Input type="text" placeholder="your clinic address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <h4>Professional Details :</h4>
                    <Row gutter={20}>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item>
                          <label for="designation" className="control-label col-sm-2">Speciality:</label>
                          <div className="col-sm-8">
                              <select className="form-control" id="designation" required value={speciality} onChange={(e) => setSpeciality(e.target.value)}>

                                  <option value="Cardiology">Cardiology</option>
                                  <option value="Pediatrics">Pediatrics</option>
                                  <option value="Surgery (General Surgery)">Surgery (General Surgery)</option>
                                  <option value="Dermatology">Dermatology</option>
                                  <option value="Obstetrics and Gynecology (OB/GYN)">Obstetrics and Gynecology (OB/GYN)</option>
                                  <option value="Orthopedics">Orthopedics</option>
                                  <option value="Neurology">Neurology</option>
                                  <option value="Ophthalmology">Ophthalmology</option>
                                  <option value="Gastroenterology">Gastroenterology</option>
                                  <option value="Endocrinology">Endocrinology</option>
                                  <option value="Nephrology">Nephrology</option>
                                  <option value="Pulmonology">Pulmonology</option>
                                  <option value="Oncology">Oncology</option>
                                  <option value="Psychiatry">Psychiatry</option>
                                  <option value="Radiology">Radiology</option>
                                  <option value="Anesthesiology">Anesthesiology</option>
                                  <option value="Rheumatology">Rheumatology</option>
                                  <option value="Infectious Diseases">Infectious Diseases</option>
                                  <option value="Allergy and Immunology">Allergy and Immunology</option>
                                  <option value="Emergency Medicine">Emergency Medicine</option>
                                  <option value="Hematology">Hematology</option>
                                  <option value="Physical Medicine and Rehabilitation">Physical Medicine and Rehabilitation</option>
                                  <option value="Urology">Urology</option>
                                  <option value="Gynecologic Oncology">Gynecologic Oncology</option>
                                  <option value="Neonatology">Neonatology</option>


                              </select>
                          </div>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item
                          label="Experience"
                          name="experience"
                          required
                          rules={[{ required: true }]}
                        >
                          <Input type="text" placeholder="your experience" value={experience} onChange={(e) => setExperience(e.target.value)}  />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item
                          label="Fees Per Consultation"
                          name="feesPerConsultation"
                          required
                          rules={[{ required: true }]}
                        >
                          <Input type="text" placeholder="your fees" value={fees} onChange={(e) => setFees(e.target.value)}  />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Timings" name="timings" required>
                          <TimePicker.RangePicker format="HH:mm" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={24} lg={8}></Col>
                      <Col xs={24} md={24} lg={8}>
                        <button className="btn btn-primary form-btn" type="submit">
                          Submit
                        </button>
                      </Col>
                    </Row> </Form></div>)}
                {designation === "0" && (
                    <div className="patient"><div className="container">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="text-center">Please enter your details to register.</h3>
                            </div>
                            <div className="panel-body">
                                <h4>BASIC INFORMATION</h4>
                                <div className="row">
                                    {showAlert && (
                                        <div className="alert alert-warning col-sm-8 col-sm-offset-2">
                                            <strong>Warning!</strong> Invaid public key. Please enter a valid public key to register.
                                        </div>
                                    )}
                                    {alertinfo && (
                                        <div className="alert alert-info col-sm-8 col-sm-offset-2">
                                            <strong>Info!</strong> User already registered. Please check your details.
                                        </div>
                                    )}

                                </div>

                                <form name="registerForm" className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" for="name">Name:</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="name" placeholder="Enter name" name="Name" required autofocus value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                    </div>


                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="dateOfBirth">Date of Birth:</label>
                                        <div className="col-sm-8">
                                            {/* Use DatePicker component instead of input */}
                                            <DatePicker
                                                id="dateOfBirth"
                                                className="form-control"
                                                placeholderText="Select Date of Birth"
                                                selected={dateOfBirth} // Bind selected date to state
                                               onChange={(date) => setDateOfBirth(date)} // Handle date change
                                                dateFormat="MM/dd/yyyy" // Format of the displayed date
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                required
                                            />
                                        </div>
                                    </div>


                                  

                                </form>

                                <h4>CONTACT INFORMATION</h4>

                                <form name="registerForm" className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="name">Email:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="name"
                                                placeholder="Enter Email"
                                                name="Email"
                                                required

                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                                title="Please enter a valid email address"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="ID">Mobile number:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="tel" // Use "tel" type for mobile numbers
                                                className="form-control"
                                                id="Ph.no"
                                                placeholder="Enter Phone number"
                                                name="number"
                                                required
                                                value={mobileNo}
                                                onChange={(e) => setMobileNo(e.target.value)}
                                                pattern="[0-9]{10}" // Use regular expression to validate 10-digit numbers
                                                title="Please enter a valid 10-digit mobile number"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="ID">Alternate Mobile number:</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="tel" // Use "tel" type for mobile numbers
                                                className="form-control"
                                                id="AltPh.no"
                                                placeholder="Enter Alternate Phone number"
                                                name="number"
                                                required
                                                value={alternateNo}
                                                onChange={(e) => setAlternateNo(e.target.value)}
                                                pattern="[0-9]{10}" // Use regular expression to validate 10-digit numbers
                                                title="Please enter a valid 10-digit mobile number"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label col-sm-2" for="address">Address:</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="address" placeholder="Enter Address" name="address" required value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </div>
                                    </div>


                                </form>
                                <h4>Insurance Information</h4>
                                <form>

                                    <div className="form-group">
                                        <label className="control-label col-sm-2" for="address">Insurance Company Name:</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="ICN" placeholder="Enter Insurance Company Name" name="Company name" required value={insuranceName} onChange={(e) => setInsuranceName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="deductibilities">Amount in Rupees:</label>
                                        <div className="col-sm-8">
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="deductibilities"
                                                    placeholder="Enter amount in rupees"
                                                    name="amount"
                                                    required
                                                    value={deductibilities}
                                                    onChange={(e) => setDeductibilities(e.target.value)}
                                                />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">₹</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="validity">Validity:</label>
                                        <div className="col-sm-8">
                                            {/* Use DatePicker component instead of input */}
                                            <DatePicker
                                                id="validity"
                                                className="form-control"
                                                placeholderText="Enter Validity of the insurance"
                                                selected={validity} // Bind selected date to state
                                                onChange={(date) => setValidity(date)} // Handle date change
                                                dateFormat="MM/dd/yyyy" // Format of the displayed date
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                required
                                            />
                                        </div>
                                    </div>


                                </form>

                                <div className="text-center">
                                    <button className="btn btn-primary btn-lg" onClick={addPatient}>Register</button>
                                </div>
                            </div>
                        </div>

                        <hr />

                    </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Register;
