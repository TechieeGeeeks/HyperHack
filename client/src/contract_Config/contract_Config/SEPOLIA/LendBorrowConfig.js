const LendBorrowContractAddressOnSepolia = "0x371bD247EEfD1f36B562e35FdF549a2DDD71D8bE";

const LendBorrowContractABIOnSepolia =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "borrowerAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "DUSD_AMOUNT",
				"type": "uint256"
			}
		],
		"name": "addBorrowingPowerByBridge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenContractAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenID",
				"type": "uint256"
			}
		],
		"name": "depositNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenContractAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "DUSD_NFT_WORTH",
				"type": "uint256"
			}
		],
		"name": "floorPriceOfNFT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "giveBackNftOwnerShipOnAllChains",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "LendBorrow_AddressIsNotBridge_Error",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_AddressIsNotOwner_Error",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_AddressShouldNotBeEqualToZero",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_AdminCouldNotWithdrawMoney",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_BridgeAlreadyExists_Error",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_ContractIsNotAllowedToPullToken",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_NFTDoesNotLendOnThisChain",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_TokenDoesNotHaveWorthInContrat",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_UserDoesNotHaveAnyLoanPending",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_UserDoesNotHaveBorrowingPower",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "LendBorrow_UserDoesNotHaveSufficientTokensToBurn",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_dusdAmount",
				"type": "uint256"
			}
		],
		"name": "mintTokenForPayingLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pullMoney",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "borrowerAddress",
				"type": "address"
			}
		],
		"name": "removeBorrowingPowerByBridge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "repayLoan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bridge1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_bridge2",
				"type": "address"
			}
		],
		"name": "setBridgeContractsForChains",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_bridge",
				"type": "address"
			}
		],
		"name": "setBridgeNativeChain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenContractAddress",
				"type": "address"
			}
		],
		"name": "tryToLiquidateNFT",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withDrawTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "addressToAssociatedLoan",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "borrowingPowerInUSD",
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
		"inputs": [],
		"name": "bridge",
		"outputs": [
			{
				"internalType": "address payable",
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
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "bytes32OfTokenToFloorPriceOfTokenAtTimeOfDepositing",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "chainAddress",
		"outputs": [
			{
				"internalType": "address",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "chainIds",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "contractAddressToTokenIdToDUSDBorrowableAmount",
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
		"inputs": [],
		"name": "DAO_CONTRACT_ADDRESS",
		"outputs": [
			{
				"internalType": "address",
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
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "giveERC20TokensBalanceOfBorrower",
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
		"inputs": [],
		"name": "i_owner",
		"outputs": [
			{
				"internalType": "address",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ownerOfOrignalTokens",
		"outputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

module.exports = {LendBorrowContractAddressOnSepolia,LendBorrowContractABIOnSepolia}