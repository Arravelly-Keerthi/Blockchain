// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
 import "hardhat/console.sol";


contract Agent {
    
    struct patient {
    string name;
        string dateOfBirth;

        address[] doctorAccessList;
        uint[] diagnosis;
        string record;
        
        string email;
        string mobileNo; // Changed to uint
        string alternateNo; // Changed to uint
        string houseaddress;
        string insuranceName;
        uint deductibilities; // Changed to uint
        string validity;
}

struct doctor {
    string name;
    string speciality;
    string email;
    uint mobileNo;
    string clinicAddress;
    string website;
    uint experience;
    uint fees;
    
    address[] patientAccessList;
}
struct insurance{
    string company_name;
}
uint creditPool;

address[] public patientList;
address[] public doctorList;
address[] public insuranceList;

mapping (address => patient) patientInfo;
mapping (address => doctor) doctorInfo;
mapping(address => insurance) insuranceInfo;
mapping (address => address) Empty;
// might not be necessary
mapping (address => string) patientRecords;

function add_agent(string memory _name,  uint _designation, string memory _hash) public returns(string memory){
    address addr = msg.sender;
    
    if(_designation == 0){
        patient memory p;
        p.name = _name;
       
        p.record = _hash;
        patientInfo[msg.sender] = p;
        patientList.push(addr);
        return _name;
    }
   else if (_designation == 1){
        doctorInfo[addr].name = _name;
        doctorList.push(addr);
        return _name;
   }
   else if(_designation==2){
    insuranceInfo[addr].company_name=_name;
    insuranceList.push(addr);
    return _name;
   }
   else{
       revert();
   }
}

function add_patient(string memory _name,string memory _dateOfBirth,string memory _email,string memory _mobileNo,string memory _alternateNo,string memory _address,string memory _insuranceName,uint _deductibilities,string memory _validity,string memory _hash)public returns(string memory){
   address addr=msg.sender;
   patient memory p;
    p.name = _name;
    p.dateOfBirth=_dateOfBirth;
    p.email=_email;
    p.mobileNo=_mobileNo;
    p.alternateNo=_alternateNo;
    p.houseaddress=_address;
    p.insuranceName=_insuranceName;
    p.deductibilities=_deductibilities;
    p.validity=_validity;
    p.record = _hash;
    patientInfo[msg.sender] = p;
    patientList.push(addr);
    return _name;

}
function add_doctor(string memory _name,uint _mobileNo,string memory _email,string memory _website,string memory _address,string memory _speciality,uint _experience,uint _fees)public returns(string memory){
   address addr=msg.sender;
   doctor memory d;
    d.name = _name; 
    d.speciality=_speciality;
    d.email=_email;
    d.mobileNo=_mobileNo;
    d.clinicAddress=_address;
    d.website=_website;
    d.experience=_experience;
    d.fees=_fees;
  
   // d.record = _hash;
    doctorInfo[msg.sender] = d;
    doctorList.push(addr);
    return d.name;

}
function get_patient(address addr) view public returns (string memory, string memory, string memory, string memory, string memory,string memory) {
    return (
        patientInfo[addr].name,
        patientInfo[addr].dateOfBirth,
        patientInfo[addr].email,
        patientInfo[addr].mobileNo,
        patientInfo[addr].alternateNo,
        patientInfo[addr].houseaddress
    );
}


function get_doctor(address addr) view public returns (string memory,uint,string memory,uint ){
    // if(keccak256(doctorInfo[addr].name)==keccak256(""))revert();
   // console.log(doctorInfo[addr].name);
    return (doctorInfo[addr].name,doctorInfo[addr].experience,doctorInfo[addr].speciality,doctorInfo[addr].fees);
}

function get_insurance(address addr) view public returns (string memory){
    return (insuranceInfo[addr].company_name);
}

function get_patient_doctor_name(address paddr, address daddr) view public returns (string memory , string memory ){
    return (patientInfo[paddr].name,doctorInfo[daddr].name);
}

function permit_access(address addr) payable public {
   // require(msg.value == 1 ether);

   // creditPool += 1;
    
    doctorInfo[addr].patientAccessList.push(msg.sender);
    patientInfo[msg.sender].doctorAccessList.push(addr);
    
}


//must be called by doctor
function insurance_claim(address paddr, uint _diagnosis, string memory  _hash) public {
    bool patientFound = false;
    for(uint i = 0;i<doctorInfo[msg.sender].patientAccessList.length;i++){
        if(doctorInfo[msg.sender].patientAccessList[i]==paddr){
          //  payable(msg.sender).transfer(2 ether);
            //creditPool -= 2;
            patientFound = true;
            
        }
        
    }
    if(patientFound==true){
        set_hash(paddr, _hash);
        remove_patient(paddr, msg.sender);
    }else {
        revert();
    }

    bool DiagnosisFound = false;
    for(uint j = 0; j < patientInfo[paddr].diagnosis.length;j++){
        if(patientInfo[paddr].diagnosis[j] == _diagnosis)DiagnosisFound = true;
    }
}

    function remove_element_in_array(address[] storage Array, address addr) internal 
    {
        bool check = false;
        uint del_index = 0;
        for(uint i = 0; i<Array.length; i++){
            if(Array[i] == addr){
                check = true;
                del_index = i;
            }
        }
        if(!check) revert();
        else{
            if(Array.length == 1){
                delete Array[del_index];
            }
            else {
                Array[del_index] = Array[Array.length - 1];
                delete Array[Array.length - 1];

            }
            Array.pop();
        }
    }
    function remove_patient(address paddr, address daddr) public {
        remove_element_in_array(doctorInfo[daddr].patientAccessList, paddr);
        remove_element_in_array(patientInfo[paddr].doctorAccessList, daddr);
    }
    
    function get_accessed_doctorlist_for_patient(address addr) public view returns (address[] memory )
    { 
        address[] storage doctoraddr = patientInfo[addr].doctorAccessList;
        return doctoraddr;
    }
    function get_accessed_patientlist_for_doctor(address addr) public view returns (address[] memory )
    {
        return doctorInfo[addr].patientAccessList;
    }

    
    function revoke_access(address daddr) public payable{
        remove_patient(msg.sender,daddr);
      //  payable(msg.sender).transfer(2 ether);
       // creditPool -= 2;
    }

    function get_patient_list() public view returns(address[] memory ){
        return patientList;
    }

    function get_doctor_list() public view returns(address[] memory ){
        return doctorList;
    }

    function get_hash(address paddr) public view returns(string memory ){
        return patientInfo[paddr].record;
    }

    function set_hash(address paddr, string memory _hash) internal {
        patientInfo[paddr].record = _hash;
    }
    struct AppointmentSlot {
    uint256 startTime;
    uint256 endTime;
    address patient;
    bool isBooked;
}

mapping(address => AppointmentSlot[])doctorAppointments;

function addAppointmentSlot(uint256 _startTime, uint256 _endTime) public {
    require(_startTime < _endTime, "Invalid time range");
    doctorAppointments[msg.sender].push(AppointmentSlot(_startTime, _endTime, address(0), false));
}

function getDoctorAppointments(address _doctor) public view returns (AppointmentSlot[] memory) {
    return doctorAppointments[_doctor];
}

function bookAppointment(address _doctor, uint256 _slotIndex) public {
    AppointmentSlot storage slot = doctorAppointments[_doctor][_slotIndex];
    require(!slot.isBooked, "Appointment already booked");
    slot.isBooked = true;
    slot.patient = msg.sender;
}
}

