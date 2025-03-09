from web3 import Web3
import json

# Connect to Ethereum
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

# Load the deployed contract ABI and address
with open("contract_address.txt", "r") as file:
    contract_address = file.read().strip()

with open("contract_abi.json", "r") as file:
    abi = json.load(file)

# Connect to the contract
contract = w3.eth.contract(address=contract_address, abi=abi)

# Get a document by ID (example: ID = 1)
report_id = 1  # Replace with the report ID you want to fetch
name, ipfs_hash, timestamp = contract.functions.getReport(report_id).call()

print(f"Document Name: {name}")
print(f"IPFS Hash: {ipfs_hash}")
print(f"Retrieve from: https://ipfs.io/ipfs/{ipfs_hash}")
