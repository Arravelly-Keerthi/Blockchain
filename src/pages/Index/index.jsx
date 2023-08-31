import React ,{useState,useContext} from 'react';
import {ethers} from 'ethers';
import Agent from '../../artifacts/contracts/Agent.sol/Agent.json';
import Register from '../Register/register';
import { Link,useNavigate } from 'react-router-dom';
import { AgentAddressContext } from '../../App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Helmet } from 'react-helmet';




const Index = () => {
    const agentContractAddress= useContext(AgentAddressContext);
  //  console.log(agentContractAddress);
    const history=useNavigate();
const [alert,setAlert]=useState(false);
    const provider= new ethers.providers.Web3Provider(window.ethereum);
      const contract=new ethers.Contract(agentContractAddress,Agent.abi,provider);
      async function  login(){
        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        const publicKey = await signer.getAddress();    
        const Navigate=async(parameters)=>{
            history(`/Dhome?${new URLSearchParams(parameters).toString()}`)
        }   
        const NavigateP=async(parameters)=>{
            history(`/Phome?${new URLSearchParams(parameters).toString()}`)
        }     
    //     console.log(publicKey);
         try{
            var result =await contractWithSigner.get_patient_list();
            var PatientList = result;
            for (var i = 0; i < PatientList.length; i++) {
                if (publicKey.toLowerCase() === PatientList[i].toLowerCase()) {
                    NavigateP({designation:0});
                    return;
                }
            }
         } catch(error){
            console.log("Error: ",error);
         }
    
try{
    var result= await contractWithSigner.get_doctor_list();
    var DoctorList = result;
    for (var i = 0; i < DoctorList.length; i++) {
        if (publicKey.toLowerCase() === DoctorList[i].toLowerCase()) {
            Navigate({designation:1});
            return;
        }
    }

}
catch(error){
    console.log("Error: ",error);
}
    setAlert(true);
    //console.log("Invalid User!");
        
    }

  return (
  
      
    <div>
        <Helmet>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>
          <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
    <div className="container-fluid">
        
        <div className="navbar-header">
           
            <Link className="navbar-brand" to={'/'}>Electronic Health Records</Link>
            <Link className="navbar-brand" to={'/'} onClick={login}>Login</Link>
            <Link className="navbar-brand" to={'/register'}>Register</Link>
        </div>
        
       {/* <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
                <li className="active">
                    <Link to="/">Login</Link>
                </li>
                <li>
                   
                <Link to="/register">Register</Link>
                </li>
            </ul>
        </div>
  */}       
  </div>
    
</nav>

<div><div id="includedContent"></div></div>


<div className="container">
    <div className="panel panel-default">
        <div className="panel-heading"><h3 className="text-center">Welcome to Electronic Health Records</h3></div>
        <div className="panel-body">
            <div className="row">
                {alert&&<div className="alert alert-warning col-sm-8 col-sm-offset-2" >
                    <strong>Warning!</strong> Unregistered user. Click <Link to="/register">here</Link> to register. 
            
                </div>}
            </div>
            
            <form className="form-horizontal" name="loginForm">
                <div className="panel-heading"><h5 className="text-center">Login is Linked to your Metamask Account</h5></div>
                <div className="form-group">
                </div>
            </form>
            <div className="text-center">
                <button className="btn btn-primary btn-lg" onClick={login}>Login</button>
            </div>

        </div>
        <div className="panel-footer">
        </div>
    </div>
    
 
</div>
    </div>
  );
};

export default Index;
