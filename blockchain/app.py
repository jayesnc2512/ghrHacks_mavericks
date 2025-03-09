from flask import Flask, request, jsonify
from web3 import Web3
import json

app = Flask(__name__)

# Connect to Ethereum Blockchain
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

# Load contract address and ABI
with open("contract_address.txt", "r") as file:
    contract_address = file.read().strip()

with open("contract_abi.json", "r") as file:
    contract_abi = json.load(file)

contract = w3.eth.contract(address=contract_address, abi=contract_abi)
my_address = "0xD320883Fd406900D4283740772E82849B65a30e8"
private_key = "0x7bfd603c67bd06bd5f8e63d38e8b7e9a8db12e1bb379c0ab1c782532af5cc848"  # Replace with your 

@app.route("/")  # Add this route
def home():
    return "Welcome to the Blockchain Report API!", 200


@app.route("/add_report", methods=["POST"])
def add_report():
    data = request.json
    title = data["title"]
    content = data["content"]

    nonce = w3.eth.get_transaction_count(my_address)
    transaction = contract.functions.addReport(title, content).build_transaction({
        "chainId": 1337,
        "from": my_address,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("20", "gwei"),
    })

    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
    txn_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)

    return jsonify({"message": "Report added!", "transaction_hash": txn_receipt.transactionHash.hex()}), 200

@app.route("/get_report/<int:report_id>", methods=["GET"])
def get_report(report_id):
    report = contract.functions.getReport(report_id).call()
    return jsonify({
        "id": report[0],
        "title": report[1],
        "content": report[2],
        "timestamp": report[3],
        "author": report[4]
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
