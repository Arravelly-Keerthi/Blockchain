import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';
import { AgentAddressContext } from '../App';
import { Badge, message } from 'antd';
import './Layout.css';
import { userMenu, doctorMenu } from '../Data/data';

const Layout = ({ designation }) => {
  const [name, setName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const agentContractAddress = useContext(AgentAddressContext);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
  const signer = provider.getSigner();
  const contractWithSigner = contract.connect(signer);

  const getDoctorData = async () => {
    try {
      var key = await signer.getAddress();
      key = key.toLowerCase();
      const result = await contractWithSigner.get_doctor(key);
      setName(result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout Successful');
      // window.ethereum.request({ method: 'eth_logout' });
    navigate('/login');
  };

  const SidebarMenu = designation === 0 ? userMenu : doctorMenu;

  return (
    <div className="main">
      <div className="layout">
        <div className="sidebar">
          <div className="logo">
            <h6 className="text-light">DOC APP</h6>
            <hr />
          </div>
          <div className="menu">
            {SidebarMenu.map((menu, index) => (
              <div
                key={index}
                className={`menu-item ${location.pathname === menu.path && 'active'}`}
              >
                <i className={menu.icon}></i>
                <Link to={menu.path}>{menu.name}</Link>
              </div>
            ))}
            <div className="menu-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content" onClick={() => navigate('/notification')}>
              <Badge count={1}>
                <i className="fa-solid fa-bell"></i>
              </Badge>
              <Link to="/profile">{name}</Link>
            </div>
          </div>
          <div className="body">{name}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;


// import React,{useState,useEffect,useContext} from "react";

// import { adminMenu, userMenu,doctorMenu } from "./../Data/data";
// import './Layout.css';
// import { ethers } from 'ethers';
// import Agent from '../artifacts/contracts/Agent.sol/Agent.json';
// import 'bootstrap/dist/css/bootstrap.css';
// import { AgentAddressContext } from '../App';
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import { Badge, message } from "antd";
// const Layout = ({designation}) => {
//   const [name,setName]=useState();

//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const agentContractAddress = useContext(AgentAddressContext);
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const contract = new ethers.Contract(agentContractAddress, Agent.abi, provider);
//   const signer = provider.getSigner();
//   const contractWithSigner = contract.connect(signer);
//   const getDoctorData = async () => {
//     try {
//       var key = await signer.getAddress();
//       key = key.toLowerCase();
//       const result = await contractWithSigner.get_doctor(key);
//      // console.log( parseInt(result[3]));
//       setName(result[0]);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     getDoctorData();
//   }, []);
//   const handleLogout = () => {
//     localStorage.clear();
//     message.success("Logout Successfully");
//     navigate("/login");
//   };

  
//   const SidebarMenu = designation===0?userMenu:doctorMenu;
//   return (
//     <>
//       <div className="main">
//         <div className="layout">
//           <div className="sidebar">
//             <div className="logo">
//               <h6 className="text-light">DOC APP</h6>
//               <hr />
//             </div>
//             <div className="menu">
//               {SidebarMenu.map((menu) => {
//                 const isActive = location.pathname === menu.path;
//                 return (
//                   <>
//                     <div className={`menu-item ${isActive && "active"}`}>
//                       <i className={menu.icon}></i>
//                       <Link to={menu.path}>{menu.name}</Link>
//                     </div>
//                   </>
//                 );
//               })}
//               <div className={`menu-item `} onClick={handleLogout}>
//                 <i className="fa-solid fa-right-from-bracket"></i>
//                 <Link to="/login">Logout</Link>
//               </div>
//             </div>
//           </div>
//           <div className="content">
//             <div className="header">
//               <div className="header-content" style={{ cursor: "pointer" }}>
//                 <Badge
//                   count={1}
//                   onClick={() => {
//                     navigate("/notification");
//                   }}
//                 >
//                   <i class="fa-solid fa-bell"></i>
//                 </Badge>

//                 <Link to="/profile">{name}</Link>
//               </div>
//             </div>
//             <div className="body">{name}</div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Layout;
