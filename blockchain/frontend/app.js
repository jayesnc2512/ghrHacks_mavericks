const pinataApiKey = "2b3bc97dcee172987299";  // Replace with your Pinata API Key
const pinataSecretApiKey = "91f13f0fed40ff2ace327e7f867157365cc55d7fdfd60077594994f8fb187c09";  // Replace with your Pinata Secret Key

const web3 = new Web3("http://127.0.0.1:7545");  // Ganache provider
const contractAddress = "0xbA00d14468178055Bc6edE062186c7f4D570ECc4";  // Replace with deployed contract address
const contractABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "reportId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }, { "indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "ReportAdded", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_ipfsHash", "type": "string" }, { "internalType": "string", "name": "_name", "type": "string" }], "name": "addReport", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_reportId", "type": "uint256" }], "name": "getReport", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "ipfsHash", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reportCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "reports", "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "ipfsHash", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }];  

const contract = new web3.eth.Contract(contractABI, contractAddress);
const userAccount = "0xD320883Fd406900D4283740772E82849B65a30e8";  // Replace with your account address

// 📌 Upload file to Pinata (IPFS)
async function uploadToIPFS() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                "pinata_api_key": pinataApiKey,
                "pinata_secret_api_key": pinataSecretApiKey,
                "Content-Type": "multipart/form-data"
            }
        });

        if (response.data && response.data.IpfsHash) {
            const ipfsHash = response.data.IpfsHash;
            document.getElementById("ipfsHash").innerText = "IPFS Hash: " + ipfsHash;
            console.log("Uploaded successfully. IPFS Hash:", ipfsHash);
            localStorage.setItem("ipfsHash", ipfsHash);
        } else {
            console.error("Unexpected response from Pinata:", response.data);
            alert("Failed to upload to IPFS (unexpected response)");
        }
    } catch (error) {
        console.error("IPFS Upload Error:", error.response ? error.response.data : error.message);
        alert("Error uploading to IPFS: " + JSON.stringify(error.response ? error.response.data : error.message));
    }
}

// 📝 Store IPFS Hash on Blockchain
async function storeOnBlockchain() {
    const reportName = document.getElementById("reportName").value;
    const ipfsHash = localStorage.getItem("ipfsHash");  // Retrieve stored IPFS hash

    if (!reportName || !ipfsHash) {
        alert("Please enter a name and upload a file first!");
        return;
    }
    console.log("Available Methods:", contract.methods);

    try {
        const gasEstimate = await contract.methods.addReport( reportName,ipfsHash).estimateGas({ from: userAccount });

        const tx = await contract.methods.addReport(reportName,ipfsHash).send({
            from: userAccount,
            gas: gasEstimate
        });

        document.getElementById("storeResult").innerText = "Transaction Hash: " + tx.transactionHash;
        console.log("Stored on blockchain! Tx:", tx.transactionHash);
    } catch (error) {
        console.error("Blockchain Error:", error);
        alert("Failed to store report on blockchain");
    }
}

// 🔍 Retrieve Report from Blockchain
async function retrieveReport() {
    const reportId = document.getElementById("reportId").value;
    if (!reportId) {
        alert("Enter a report ID!");
        return;
    }

    try {
        const result = await contract.methods.getReport(reportId).call();
        const reportName = result[0];
        const ipfsHash = result[1];

        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${reportName}`;
        document.getElementById("retrievedReport").innerHTML = `
            <h3>${reportName}</h3>
            <p>IPFS Hash: ${ipfsHash}</p>
            <a href="${ipfsUrl}" target="_blank">View on IPFS</a>
        `;
    } catch (error) {
        console.error("Retrieval Error:", error);
        alert("Failed to retrieve report");
    }
}
