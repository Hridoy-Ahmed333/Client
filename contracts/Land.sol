// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Land {

    struct LandData {
        address token;
        address owner;
        address[] owners;
        string propertyId;
    }

    LandData private landData;

    constructor(string memory _pId) {
        landData.owner = msg.sender;
        landData.owners.push(msg.sender);
        landData.token = address(this);
        landData.propertyId = _pId;
    }

    function getLandData() public view returns (LandData memory){
        return landData;
    }

    function updateOwner(address _owner) public {
        landData.owner = _owner;
        landData.owners.push(_owner);
    }

}
