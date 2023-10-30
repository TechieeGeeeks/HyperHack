
# Cross-Chain Lending and Borrowing DApp

<img src="https://github.com/TechieeGeeeks/HyperHack/assets/99035115/c92a05b9-0262-4b67-b3fa-684710c76585" alt="Project Logo" height="500">


## Table of Contents

- [Introduction](#introduction)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Setup](#setup)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Features](#features)

## Introduction

Welcome to the Cross-Chain Lending and Borrowing DApp, a revolutionary decentralized application that simplifies lending and borrowing for NFTs across various blockchain networks. This DApp addresses common challenges faced by NFT owners seeking loans on multiple chains.

## Demo

For a detailed explanation of how this DApp works, please refer to the following demo videos:

- [Project Explanation](https://www.loom.com/share/548ee6cca5d14c4c843915d80b1468fd?sid=fbf4f047-5c22-4b5d-8215-7f6ce2b8f033)
- [Cross-Chain Lending and Borrowing Demo](https://www.loom.com/share/d61eec9f61714308929ec46007c8e1a9?sid=16788416-02d9-4681-a578-b869a468a965)
- [Setting Up the Project](https://www.loom.com/share/d77d02468bb24e1b829491cb81ed4470?sid=6ee5b2b3-9b9a-45be-88d7-c44ccbb818ab)


These videos provide an in-depth understanding of the project, including setup instructions and an overview of its features.

## Usage

Our DApp simplifies the process of lending and borrowing NFTs across various blockchain networks. You can deposit NFTs on any chain, accumulate borrowing power, and withdraw tokens from any available chain. Loan repayment can also be done on any chain.

## Features

- **Multi-Chain NFT Deposit:** Deposit NFTs on multiple chains.
- **Multi-Chain Borrowing Power:** Accumulate borrowing power across chains.
- **Multi-Chain Token Withdrawal:** Withdraw tokens from any available chain.
- **Multi-Chain Loan Repayment:** Repay loans on any chain.

## Core Features Using HyperLane Messaging

### 1. Deposit NFT

The `depositNFT` function allows users to deposit NFTs on multiple chains available on HyperLane. When a user deposits an NFT, the smart contract calculates its worth and adds it to their borrowing power, which can be used to borrow tokens on any chain. Suppose a user deposits NFTs on multiple chains to take a massive loan, then their borrowing power is incremented.

```solidity
// Solidity code for depositNFT function
function depositNFT(address tokenContractAddress, uint256 tokenID) external ownerOnly {
   
    // After satisfying all conditions

    // Give borrowing power on all chains using HyperLane messaging
    for (uint32 i = 0; i < chainIds.length; i++) {
        if (block.chainid != chainIds[i]) {
            uint32 chainId = chainIds[i];
            uint256 fee = IBridge(bridge).quoteFeeAddBorrowingPowerSend(chainId);
            IBridge(bridge).AddBorrowingPowerSend{value: fee}(
                chainId,
                DUSD_LOAN_AMOUNT,
                msg.sender,
                msg.sender,
                chainAddress[i]
            );
        }
    }
}
```

### 2. Withdraw Tokens

The `withdrawTokens` function allows users to withdraw tokens using their borrowing power. When tokens are withdrawn, the user's borrowing power is reduced. Tokens can be withdrawn from any chain, and when tokens are withdrawn, all chains will get notified, and the user's borrowing power will be reduced on all chains.

```solidity

function withDrawTokens() external {

    // After satisfying all conditions

        // Remove borrowing power on all chains using HyperLane messaging
        for (uint i = 0; i < chainIds.length; i++) {
            if (block.chainid != chainIds[i]) {
                uint32 chainId = chainIds[i];
                uint256 fee = IBridge(bridge).quoteFeeRemoveBorrowingPowerSend(chainId);
                IBridge(bridge).RemoveBorrowingPowerSend{value: fee}(
                    chainId,
                    loanDUSD,
                    msg.sender,
                    msg.sender,
                    chainAddress[i]
                );
            }
        }
    }
}
```

### 3. Repay Loan

The `repayLoan` function allows users to repay their loans and regain ownership of their NFTs. To repay a loan, the user must specify the borrower's address. The loan can be repaid on any chain; there are no conditions for it. When the loan is paid, the user will get ownership of all NFTs back.

```solidity

function repayLoan(address _borrower) external {

    // After satisfying all conditions

   // Now tell all chains to give back NFT ownership using HyperLane messaging
    for (uint256 i = 0; i < chainIds.length; i++){
            // Except this chain, execute the call for all two remaining chains
            if(block.chainid != chainIds[i]){
                uint32 chainId = chainIds[i];
                uint256 fee = IBridge(bridge).quoteFeeGiveBackNFTOwnership(chainId);
                IBridge(bridge).GiveBackOwnershipOfNFTOnAllChains{value:fee}(
                    chainId,
                    0, // Dummy Number
                    _borrower, 
                    msg.sender,
                    chainAddress[i] 
                );
            }
        }
    }
}
```

This DApp opens up limitless possibilities for cross-chain NFT lending and borrowing.
