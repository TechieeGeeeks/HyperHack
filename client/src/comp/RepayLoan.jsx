import React, { useState } from "react";

const RepayLoan = ({ signer, mainConfig, chainId }) => {
  const [addressToCheck, setAddressToCheck] = useState("");
  const [associatedLoan, setAssociatedLoan] = useState(null);
  const [tokenAmountToMint, setTokeAmountToMint] = useState("");
  const [dusdBalance, setDUSDBalance] = useState("");
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [addressOfOwner, setAddressOfOwner] = useState("");

  const checkAssociatedLoan = async () => {
    try {
      // Call the contract's addressToAssociatedLoan function to get the associated loan of the provided address
      const associatedLoan = await mainConfig.lendBorrow.addressToAssociatedLoan(
        addressToCheck
      );
      const associatedLoanInDecimal = parseInt(associatedLoan._hex, 16);
      setAssociatedLoan(associatedLoanInDecimal);
    } catch (error) {
      console.error("Error checking associated loan:", error);
    }
  };

  const mintWRC20Tokens = async () => {
    try {
      const tx = await mainConfig.lendBorrow.mintTokenForPayingLoan(
        tokenAmountToMint
      );
      console.log("DUSD tokens minted successfully.");
    } catch (error) {
      console.error("Error minting DUSD tokens:", error);
    }
  };

  const checkDUSDBalance = async () => {
    try {
      // Call the contract's borrowingPowerInUSD function to get the borrowing power of the provided address
      const addressToCheck = await signer.getAddress();
      const dusdAmount = await mainConfig.lendBorrow.giveERC20TokensBalanceOfBorrower(
        addressToCheck
      );
      const dusdAmountInDecimal = parseInt(dusdAmount._hex, 16);
      setDUSDBalance(dusdAmountInDecimal);
      console.log(
        `DUSD Balance for address ${addressToCheck}: ${dusdAmountInDecimal}`
      );
      // You can display the borrowing power or perform any other actions as needed.
    } catch (error) {
      console.error("Error checking borrowing power:", error);
    }
  };

  const repayLoan = async () => {
    try {
      // Ensure that the borrower's address is provided
      if (!borrowerAddress) {
        console.error("Please enter the borrower's address.");
        return;
      }

      // Call the 'repayLoan' function from your contract to repay the loan
      const tx = await mainConfig.lendBorrow.repayLoan(borrowerAddress);
      await tx.wait();

      console.log("Loan repaid successfully.");
    } catch (error) {
      console.error("Error repaying the loan:", error);
    }
  };

  const checkOwnerOftNFT = async () => {
    try {
      const addressOfNFTOwner = await mainConfig.basicNFT.ownerOf(tokenId);
      setAddressOfOwner(addressOfNFTOwner);
      console.log(`Owner Of NFT is  ${addressOfOwner}`);
      // You can display the borrowing power or perform any other actions as needed.
    } catch (error) {
      console.error("Error checking borrowing power:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {(chainId === 80001 && (
        <h1 className="text-xl text-center text-white mt-12">
          Active Chain is{" "}
          <span className="font-semibold text-red-500">Polygon</span>
        </h1>
      )) ||
        (chainId === 11155111 && (
          <h1 className="text-xl text-center text-white mt-12">
            Active Chain is{" "}
            <span className="font-semibold text-red-500">Sepolia</span>
          </h1>
        ))}

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          Check Associated Loan
        </h2>
        <p className="text-subtitleColor">
          Associated Loan for Address {addressToCheck}:{" "}
          <span className="text-white font-medium">{associatedLoan}</span>
        </p>
        <input
          type="text"
          placeholder="Enter Address to Check"
          value={addressToCheck}
          onChange={(e) => setAddressToCheck(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button
          onClick={checkAssociatedLoan}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Check Loan
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          DUSD Token Balance is {dusdBalance}
        </h2>
        <button
          onClick={checkDUSDBalance}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Check DUSD Balance
        </button>
      </div>

      <h1 className="text-xl text-center text-red-500 mt-12">
        If You Dont have tokens to repay Loan you can mint from below but its
        only for testing will remove on Production
      </h1>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          Mint DUSD Tokens To Pay Loan
        </h2>
        <input
          type="text"
          placeholder="Loan Amount"
          value={tokenAmountToMint}
          onChange={(e) => setTokeAmountToMint(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button
          onClick={mintWRC20Tokens}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Mint DUSD
        </button>
      </div>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">
          Repay a Loan
        </h2>
        <input
          type="text"
          placeholder="Borrower's Address"
          value={borrowerAddress}
          onChange={(e) => setBorrowerAddress(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button onClick={repayLoan} className="bg-cardBg rounded-lg px-4 py-1">
          Repay Loan
        </button>
      </div>

      <h1 className="text-xl text-center text-white mt-12">
        <span className="font-semibold text-red-500">
          Waiting For Multi Chain call approx 3mins
        </span>
        <br />
        <span className="font-semibold text-green-500">
          Now You Can switch chain to check if you still have associated loan or
          not
        </span>
        <br />
        <span className="font-semibold text-green-500">
          And Also your balance of Dusd tokens must also be deducted
        </span>
      </h1>

      <div className="shadow-[0.8px_0.8px_1px_1px_rgba(143,255,106,1)] flex flex-col gap-3 text-center p-5 px-6 max-w-6xl rounded-lg mx-auto mt-12">
        <h2 className="font-semibold text-xl text-primaryColor">Check Owner</h2>
        <p className="subtitleColor text-primaryColor">
          Owner of NFT is {addressOfOwner}
        </p>
        <input
          type="text"
          placeholder="Token Id to Check"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="border border-subtitleColor focus:outline-none bg-transparent rounded-lg px-4 py-1"
        />
        <button
          onClick={checkOwnerOftNFT}
          className="bg-cardBg rounded-lg px-4 py-1"
        >
          Check Owner
        </button>
      </div>
      
    </div>
  );
};

export default RepayLoan;
