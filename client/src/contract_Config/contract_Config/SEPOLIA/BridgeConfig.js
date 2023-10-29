const BridgeContractAddressOnSepolia = "0x03Cea3f786EC921E3DEC7C21Ba0024a017798e90";

const BridgeContractABIOnSepolia = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_mailbox",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_igp",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_lendBorrow",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_destination",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "_DUSD_AMOUNT",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_refundAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_destinationBridge",
				"type": "address"
			}
		],
		"name": "AddBorrowingPowerSend",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_destination",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "_DUMMY_NUMBER",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_refundAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_destinationBridge",
				"type": "address"
			}
		],
		"name": "GiveBackOwnershipOfNFTOnAllChains",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_destination",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "_DUSD_AMOUNT",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_refundAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_destinationBridge",
				"type": "address"
			}
		],
		"name": "RemoveBorrowingPowerSend",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_origin",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "_sender",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "_message",
				"type": "bytes"
			}
		],
		"name": "handle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "igp",
		"outputs": [
			{
				"internalType": "contract IInterchainGasPaymaster",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lendBorrow",
		"outputs": [
			{
				"internalType": "contract LendBorrow",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mailbox",
		"outputs": [
			{
				"internalType": "contract IMailbox",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "destination",
				"type": "uint32"
			}
		],
		"name": "quoteFeeAddBorrowingPowerSend",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "destination",
				"type": "uint32"
			}
		],
		"name": "quoteFeeGiveBackNFTOwnership",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "destination",
				"type": "uint32"
			}
		],
		"name": "quoteFeeRemoveBorrowingPowerSend",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

module.exports = {BridgeContractAddressOnSepolia,BridgeContractABIOnSepolia}