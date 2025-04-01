//SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

//what should this do => 1. get hash and store it on blockchain

contract userDocuments{
    struct IPFSRecord{
        string ipfsHash;
        uint256 timestamp;
        address owner;
    }

    mapping(uint256 => IPFSRecord) public records;

    uint256 private recordCounter;

    mapping(address => uint256[]) private ownerRecords;

    event HashStored(uint256 indexed recordId,string ipfsHash , address indexed owner);
    event HashUpdated (uint256 indexed recordId,string ipfsHash);


    function storeHash(string memory _ipfsHash) public returns(uint256){
        require(bytes(_ipfsHash).length>0,"IPFS hash cannot be empty");
        uint256 recordId = recordCounter;
        recordCounter++;

        records[recordId] = IPFSRecord({
            ipfsHash : _ipfsHash,
            timestamp : block.timestamp,
            owner : msg.sender
        });
        ownerRecords[msg.sender].push(recordId);
        emit HashStored(recordId, _ipfsHash, msg.sender);
        return recordId;
    }

    function updateHash (uint256 _recordId, string memory _newIpfsHash) public{
        require (records[_recordId].owner != address(0),"Record does not exist");
        require(records[_recordId].owner == msg.sender,"Only the owner can update the hash");
        require(bytes(_newIpfsHash).length>0,"IPFS hash cannot be empty");
        records[_recordId].ipfsHash = _newIpfsHash;
        records[_recordId].timestamp = block.timestamp;
        emit HashUpdated(_recordId, _newIpfsHash);
    }
    function getRecord(uint256 _recordId) public view returns(IPFSRecord memory){
        require (records[_recordId].owner != address(0),"Record does not exist");
        return records[_recordId];
    }
    function getMyRecords() public view returns(uint256[] memory){
        return ownerRecords[msg.sender];
    }
    function getRecordCount() public view returns (uint256){
        return recordCounter;
    }
}