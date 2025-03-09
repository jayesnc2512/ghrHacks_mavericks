// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReportContract {
    // Struct to store report details
    struct Report {
        string name; // Name of the document
        string ipfsHash; // IPFS hash where the document is stored
        uint timestamp; // Timestamp when the document was added
    }

    // Mapping from report ID to Report
    mapping(uint => Report) public reports;
    uint public reportCount = 0; // To keep track of the number of reports

    // Event for adding a new report
    event ReportAdded(uint reportId, string name, string ipfsHash, uint timestamp);

    // Function to add a new report
    function addReport(string memory _ipfsHash, string memory _name) public {
        reportCount++; // Increment report count
        reports[reportCount] = Report(_name, _ipfsHash, block.timestamp); // Store the report
        emit ReportAdded(reportCount, _name, _ipfsHash, block.timestamp); // Emit event
    }

    // Function to get the details of a report by its ID
    function getReport(uint _reportId) public view returns (string memory name, string memory ipfsHash, uint timestamp) {
        require(_reportId > 0 && _reportId <= reportCount, "Report ID does not exist.");
        Report memory r = reports[_reportId];
        return (r.name, r.ipfsHash, r.timestamp);
    }
}
