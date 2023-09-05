import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Agent from '../artifacts/contracts/Agent.sol/Agent.json';
import { AgentAddressContext } from '../App';
import { Badge, message } from 'antd';
import './Layout.css';
import { patientMenu } from '../Data/data'; // Import patient menu
import classNames from 'classnames'; // Import classNames library

const PatientLayout = ({ isPatient }) => {
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
    navigate('/login');
  };

  const SidebarMenu = patientMenu;

  const layoutClassName = classNames('layout', {
    'patient-layout': isPatient,
  });

  return (
    <div className="main">
      <div className={layoutClassName}>
        <div className="sidebar">
          <div className="logo">
            <h6 className="text-light">PATIENT APP</h6>
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
            {/* Add Insurances menu item */}
            <div
              className={`menu-item ${location.pathname === '/insurances' && 'active'}`}
            >
              <i className="fa-solid fa-shield-check"></i>
              <Link to="/insurances">Insurances</Link>
            </div>
            <div className="menu-item">
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/Patient">Give Access</Link>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div className="header-content" onClick={() => navigate('/notification')}>
              <Badge count={1}>
                <i className="fa-solid fa-bell"></i>
              </Badge>
              <Link to="/Patient">{name}</Link>
            </div>
          </div>
          <div className="body">{name}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientLayout;
