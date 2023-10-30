
# Cross Chain Lending and Borrowing DApp

![Project Logo](link_to_logo_or_image.png)

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

Welcome to the Cross Chain Lending and Borrowing DApp, a revolutionary decentralized application that simplifies lending and borrowing for NFTs across various blockchain networks. This DApp addresses common challenges faced by NFT owners seeking loans on multiple chains.

## Demo

For a detailed explanation of how this DApp works, please refer to the following demo videos:

- [Cross Chain Lending and Borrowing Demo](https://www.loom.com/share/d61eec9f61714308929ec46007c8e1a9?sid=16788416-02d9-4681-a578-b869a468a965)
- [Setting Up the Project](https://www.loom.com/share/d77d02468bb24e1b829491cb81ed4470?sid=6ee5b2b3-9b9a-45be-88d7-c44ccbb818ab)
- [Project Explanation](https://www.loom.com/share/548ee6cca5d14c4c843915d80b1468fd?sid=fbf4f047-5c22-4b5d-8215-7f6ce2b8f033)

These videos provide an in-depth understanding of the project, including setup instructions and an overview of its features.

## Usage

Our DApp simplifies the process of lending and borrowing NFTs across various blockchain networks. You can deposit NFTs on any chain, accumulate borrowing power, and withdraw tokens from any available chain. Loan repayment can also be done on any chain.

## Features

- **Multi-Chain NFT Deposit:** Deposit NFTs on multiple chains.
- **Multi-Chain Borrowing Power:** Accumulate borrowing power across chains.
- **Multi-Chain Token Withdrawal:** Withdraw tokens from any available chain.
- **Multi-Chain Loan Repayment:** Repay loans on any chain.

## Core Features

### 1. Deposit NFT

The `depositNFT` function allows users to deposit NFTs on multiple blockchain networks. When a user deposits an NFT, the DApp calculates its worth and adds it to their borrowing power, which can be used to borrow tokens.

```solidity
// Solidity code for depositNFT function
function depositNFT(address tokenContractAddress, uint256 tokenID) external ownerOnly {
    // Check if the NFT has worth in the contract
    if (contractAddressToTokenIdToDUSDBorrowableAmount[tokenContractAddress][tokenID] == 0) {
        revert LendBorrow_TokenDoesNotHaveWorthInContrat();
    }
    
    // Check if the contract is allowed to pull the NFT
    if (IERC721(tokenContractAddress).getApproved(tokenID) != address(this)) {
        revert LendBorrow_ContractIsNotAllowedToPullToken();
    }

    // Transfer NFT ownership to this contract
    IERC721(tokenContractAddress).transferFrom(msg.sender, address(this), tokenID);

    // Store the ownership of NFT in the array
    OriginalToken memory newToken = OriginalToken(tokenContractAddress, tokenID);
    ownerOfOrignalTokens[msg.sender].push(newToken);

    // Calculate DUSD loan amount and update borrowing power
    uint256 DUSD_LOAN_AMOUNT = contractAddressToTokenIdToDUSDBorrowableAmount[tokenContractAddress][tokenID];
    borrowingPowerInUSD[msg.sender] += DUSD_LOAN_AMOUNT;

    // Give borrowing power on all chains
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

The `withdrawTokens` function allows users to withdraw tokens using their borrowing power. When tokens are withdrawn, the user's borrowing power decreases.

```solidity
// Solidity code for withdrawTokens function
function withDrawTokens() external {
    // Check if the borrower has borrowing power
    if (borrowingPowerInUSD[msg.sender] == 0) {
        revert LendBorrow_UserDoesNotHaveBorrowingPower();
    }

    // Get the borrowing power and mint DUSD on the borrower's address
    uint256 loanDUSD = borrowingPowerInUSD[msg.sender];
    DUSD(dusdContract).mint(msg.sender, loanDUSD);

    if (ownerOfOrignalTokens[msg.sender].length != 0) {
        makeReadyToAcceptLoanAmountWhenTokensWherePulledFromMainChain(msg.sender, loanDUSD);
    } else {
        // Reset the borrowing power
        borrowingPowerInUSD[msg.sender] = 0;
        addressToAssociatedLoan[msg.sender] = loanDUSD;
        
        // Remove borrowing power on all chains
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

The `repayLoan` function allows users to repay their loans and regain ownership of their NFTs. To repay a loan, the user must specify the borrower's address.

```solidity
// Solidity code for repayLoan function
function repayLoan(address _borrower) external {
    if (_borrower == address(0)) {
        revert LendBorrow_AddressShouldNotBeEqualToZero();
    }

    if (ownerOfOrignalTokens[_borrower].length == 0) {
        revert LendBorrow_NFTDoesNotLendOnThisChain();
    }

    if (addressToAssociatedLoan[_borrower] < 0) {
        revert LendBorrow_UserDoesNotHaveAnyLoanPending();
    }

    uint256 loanToPay = addressToAssociatedLoan[_borrower];

    if (DUSD(dusdContract

).transferFrom(msg.sender, address(this), loanToPay)) {
        DUSD(dusdContract).burn(loanToPay);

        // Transfer NFT ownership back to the borrower
        for (uint256 i = 0; i < ownerOfOrignalTokens[_borrower].length; i++) {
            IERC721(ownerOfOrignalTokens[_borrower][i].contractAddress).transferFrom(address(this), _borrower, ownerOfOrignalTokens[_borrower][i].tokenId);
        }

        // Reset the borrower's borrowing power
        borrowingPowerInUSD[_borrower] = 0;
        addressToAssociatedLoan[_borrower] = 0;
    }
}
```

This DApp opens up limitless possibilities for cross-chain NFT lending and borrowing.
