// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Land.sol";

contract LandRegistration {

    struct User {
        address id;
        string password;
        string nationalId;
        bool isActive;
    }

    mapping(address => User) private mUsers;

    address private adminId;
    string private adminPwd;
    address[] private users;
    address[] private lands;

    event addLandEvent(address token, address owner);

    constructor() {
        adminId = msg.sender;
        adminPwd = "admin";
    }

    function isAdmin() public view returns (bool){
        return adminId == msg.sender;
    }

    function addUser(string memory _password, string memory _nationalId) public {
        require(mUsers[msg.sender].id == address(0), "User already registered");
        User storage u = mUsers[msg.sender];
        u.id = msg.sender;
        u.password = _password;
        u.nationalId = _nationalId;

        users.push(msg.sender);
    }

    function getAllUsers() public view returns (User[] memory)  {
        User[] memory u = new User[](users.length);
        for (uint i = 0; i < users.length; i++) {
            u[i] = (mUsers[users[i]]);
        }
        return u;
    }

    function verifyUser(address _id) public {
        mUsers[_id].isActive = true;
    }

    function changePassword(string memory _password) public {
        if (msg.sender == adminId) {
            adminPwd = _password;
        } else {
            mUsers[msg.sender].password = _password;
        }
    }

    function isValidUser() public view returns (uint) {
        if (adminId == msg.sender)
            return 1;
        else if (mUsers[msg.sender].id != address(0))
            return 2;
        else return 0;
    }


    function login(string memory pwd) public view returns (uint){
        if (msg.sender == adminId) {
            if (keccak256(abi.encodePacked(pwd)) == keccak256(abi.encodePacked(adminPwd)))
                return 100;

                // admin login successfully
            else
                return 99; // incorrect admin password
        }
        else {
            if (mUsers[msg.sender].id == address(0)) return 0; // user not registered
            if (keccak256(abi.encodePacked(pwd)) == keccak256(abi.encodePacked(mUsers[msg.sender].password))) {
                if (mUsers[msg.sender].isActive)
                    return 1; // user login successfully
                else return 11;
            }
            else return 9; // incorrect password
        }
    }

    function addLand(string memory _pId) public {
        Land land = new Land(_pId);
        lands.push(address(land));

        emit addLandEvent(address(land), msg.sender);
    }

    function getALlLands() public view returns (address[] memory){
        return lands;
    }


}
