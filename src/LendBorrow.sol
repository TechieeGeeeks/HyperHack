// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/* Imports Here */
import {IBridge} from "./IBridge.sol";
import {IERC721} from "@openzeppelin/contracts@4.4.0/token/ERC721/IERC721.sol";
import {DUSD} from "./DUSD.sol";

contract LendBorrow {

    /* State Variables */
    address public immutable i_owner;
    address payable public bridge;
   
    DUSD dusdContract;
    
    address public DAO_CONTRACT_ADDRESS;

    // Using it so that user can get back his NFT after repaying loan
    mapping(address => OriginalToken[]) public ownerOfOrignalTokens;

    // Using it for tracking borrowing power on multichain
    mapping(address => uint256) public borrowingPowerInUSD;

    // Using it cause at time of repying we will check if the borrower has a loan or not
    mapping(address => uint256) public addressToAssociatedLoan;

    /* Using it so that in future anyone can liquidate the nft just with token id and contract address if conditions are met
    mapping(bytes32 => uint256) public bytes32OfTokenToAssociatedLoan;*/

    // Using it for deposit NFT check means we are only allowing blue chip nfts so only this listed tokens can take loan
    mapping(address=>mapping(uint256=>uint256)) public contractAddressToTokenIdToDUSDBorrowableAmount;

    mapping(bytes32=>uint256)public bytes32OfTokenToFloorPriceOfTokenAtTimeOfDepositing;

     /*Custom Errors */
    error LendBorrow_AddressIsNotOwner_Error();
    error LendBorrow_AddressIsNotBridge_Error();
    error LendBorrow_BridgeAlreadyExists_Error();
    error LendBorrow_ContractIsNotAllowedToPullToken();
    error LendBorrow_TokenDoesNotHaveWorthInContrat();
    error LendBorrow_UserDoesNotHaveBorrowingPower();
    error LendBorrow_NFTDoesNotLendOnThisChain();
    error LendBorrow_UserDoesNotHaveSufficientTokensToBurn();
    error LendBorrow_UserDoesNotHaveAnyLoanPending();
    error LendBorrow_AdminCouldNotWithdrawMoney();
    error LendBorrow_AddressShouldNotBeEqualToZero();

        /*
    43113 => Avalanche
    11155111 => Sepolia
    80001 => Mumbai 
    97 => BSC Testnet
    */
    uint32[2] public chainIds  = [11155111,80001];
    address[2] public chainAddress;

        /* Type Declarations */
    struct OriginalToken {
        address tokenAddress;
        uint256 tokenId;
    }

    event Received(address indexed sender, uint256 indexed amount);

    modifier ownerOnly {
        require(msg.sender == i_owner,"LendBorrow_AddressIsNotOwner_Error");
         _;
    }

    modifier bridgeOnly {
        require(msg.sender == bridge,"LendBorrow_AddressIsNotBridge_Error");
         _;
    }

    /* Constructor */
    constructor() {
        i_owner = msg.sender;
        DAO_CONTRACT_ADDRESS = msg.sender;
        dusdContract =new DUSD();
    }


    function setBridgeContractsForChains( address _bridgeOfAvalanche ,address _bridgeOfPolygon) external ownerOnly{
        chainAddress[0] = _bridgeOfAvalanche;
        chainAddress[1] = _bridgeOfPolygon;
    }

    function setBridgeNativeChain(address payable _bridge) external ownerOnly{
        if (bridge != address(0)) {
            revert LendBorrow_BridgeAlreadyExists_Error();
        }
        bridge = _bridge;
    }

    /* todo:Chainlink Floor price of nft Data Feed for mainnet Doing it manually for now */
    function floorPriceOfNFT(address tokenContractAddress, uint256 tokenID, uint256 DUSD_NFT_WORTH) public ownerOnly returns(uint256){
        bytes32 tokenBytes32Value = calculateBytes32ValueFromToken(tokenID,tokenContractAddress);

        bytes32OfTokenToFloorPriceOfTokenAtTimeOfDepositing[tokenBytes32Value] = DUSD_NFT_WORTH;
        return(DUSD_NFT_WORTH);

    }

    function setTokenValue(address tokenContractAddress, uint256 tokenID) internal {
        bytes32 bytesValue = calculateBytes32ValueFromToken(tokenID, tokenContractAddress);
        uint256 DUSDBorrowableAmount = (bytes32OfTokenToFloorPriceOfTokenAtTimeOfDepositing[bytesValue] * 70) / 100;
        contractAddressToTokenIdToDUSDBorrowableAmount[tokenContractAddress][tokenID] = DUSDBorrowableAmount;
    }

    // Native Chain function only
    function depositNFT(address tokenContractAddress, uint256 tokenID) external ownerOnly{

        /* Floor Price must be ready */
        setTokenValue(tokenContractAddress,tokenID);

        /* Dev replace this function with actual security check in future */
        if(contractAddressToTokenIdToDUSDBorrowableAmount[tokenContractAddress][tokenID]==0){
            revert LendBorrow_TokenDoesNotHaveWorthInContrat();
        }

        // Check if the contract is allowed to pull NFT
        if (
            IERC721(tokenContractAddress).getApproved(tokenID) != address(this)
        ) {
            revert LendBorrow_ContractIsNotAllowedToPullToken();
        }


        // Transfer NFT ownership to this contract
        IERC721(tokenContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenID
        );

        // Stroing the ownership of NFT in array
        OriginalToken memory newToken = OriginalToken(tokenContractAddress, tokenID);
        ownerOfOrignalTokens[msg.sender].push(newToken);

        /*// Now store the borrowers details
        ownerOfOrignalTokens[msg.sender] = OriginalToken(
            tokenContractAddress,
            tokenID
        );*/

        /* Nft floor Price Work is remaining below uint will be populated by Floor price of nft which will be returned by Chainlink and then convert it into USD then apply all HF and stuff and i will get final DUSD_LOAN_AMOUNT*/
        uint256 DUSD_LOAN_AMOUNT = contractAddressToTokenIdToDUSDBorrowableAmount[tokenContractAddress][tokenID];

        // Update the borrowing power on native chain
        borrowingPowerInUSD[msg.sender] += DUSD_LOAN_AMOUNT;

        // Giving borrowing power on all chain
        for (uint32 i = 0; i < chainIds.length; i++){
            // Except this chain execute call for all two remaining chains
            if(block.chainid != chainIds[i]){
                uint32 chainId = chainIds[i];
                uint256 fee = IBridge(bridge).quoteFeeAddBorrowingPowerSend(chainId);
                IBridge(bridge).AddBorrowingPowerSend{value:fee}(
                    chainId,
                    DUSD_LOAN_AMOUNT,// msg.sender can get this much DUSD
                    msg.sender, // Who will get this DUSD
                    msg.sender, // Refund Address
                    chainAddress[i]
                );
            }
        }
    }

    // Doing For Native Chain
    function withDrawTokens() external {
        // Check if the Borrower has borrowing power or not
        if(borrowingPowerInUSD[msg.sender]==0){
            revert LendBorrow_UserDoesNotHaveBorrowingPower();
        }

        // Get the borowing power and mint usd on that borrowers address
        uint256 loanDUSD = borrowingPowerInUSD[msg.sender];
        DUSD(dusdContract).mint(msg.sender,loanDUSD);

        if(ownerOfOrignalTokens[msg.sender].length != 0){
            makeReadyToAcceptLoanAmountWhenTokensWherePulledFromMainChain(msg.sender,loanDUSD);
        }else{
            //Reset the borrowing power
            borrowingPowerInUSD[msg.sender]=0;

            addressToAssociatedLoan[msg.sender]=loanDUSD;
            // Removing borrowing power on all chain
            for (uint i = 0; i < chainIds.length; i++){
                // Except this chain execute call for all two remaining chains
                if(block.chainid != chainIds[i]){
                    uint32 chainId = chainIds[i];
                    uint256 fee = IBridge(bridge).quoteFeeRemoveBorrowingPowerSend(chainId);
                    IBridge(bridge).RemoveBorrowingPowerSend{value:fee}(
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

    function addBorrowingPowerByBridge(address borrowerAddress,uint256 DUSD_AMOUNT) external bridgeOnly {
        // Update the borrowing power on native chain
        borrowingPowerInUSD[borrowerAddress] += DUSD_AMOUNT;
    }

    function removeBorrowingPowerByBridge(address borrowerAddress) external bridgeOnly {
          
        // Check if the Borrower has borrowing power or not
        uint256 loanDUSD = borrowingPowerInUSD[borrowerAddress];
        if(loanDUSD==0){
            revert LendBorrow_UserDoesNotHaveBorrowingPower();
        }

        //Reset the borrowing power
        borrowingPowerInUSD[borrowerAddress]=0;

        // Ok we removed the borrowing power but check if the borrower lended the nft on this chain only? if yes then we have to manipulate other mappings too
        if(ownerOfOrignalTokens[borrowerAddress].length != 0){
            makeReadyToAcceptLoanAmountWhenTokensWherePulledFromOtherChain(borrowerAddress,loanDUSD);
        }

    }

    function makeReadyToAcceptLoanAmountWhenTokensWherePulledFromMainChain(address borrowerAddress, uint256 loanDUSD) internal{

        // Associate Loan with borrowers address
        addressToAssociatedLoan[borrowerAddress]=loanDUSD;

        //Reset the borrowing power
        borrowingPowerInUSD[msg.sender]=0;

        addressToAssociatedLoan[msg.sender]=loanDUSD;

        // Removing borrowing power on all chain
        for (uint256 i = 0; i < chainIds.length; i++){
            // Except this chain execute call for all two remaining chains
            if(block.chainid != chainIds[i]){
                uint32 chainId = chainIds[i];
                uint256 fee = IBridge(bridge).quoteFeeRemoveBorrowingPowerSend(chainId);
                IBridge(bridge).RemoveBorrowingPowerSend{value:fee}(
                    chainId,
                    loanDUSD,
                    msg.sender, 
                    msg.sender,
                    chainAddress[i] 
                );
            }
        }

    }

    function makeReadyToAcceptLoanAmountWhenTokensWherePulledFromOtherChain(address borrowerAddress, uint256 loanDUSD) internal{
        // Associate Loan with borrowers address
        addressToAssociatedLoan[borrowerAddress]=loanDUSD;

    }

    function repayLoan(address _borrower) external {
        if(_borrower == address(0)){
            revert LendBorrow_AddressShouldNotBeEqualToZero();
        }
        if (ownerOfOrignalTokens[_borrower].length == 0) {
            revert LendBorrow_NFTDoesNotLendOnThisChain();
        }
        if (addressToAssociatedLoan[_borrower] < 0) {
            revert LendBorrow_UserDoesNotHaveAnyLoanPending();
        }
        uint256 loanToPay = addressToAssociatedLoan[_borrower];

        if (DUSD(dusdContract).balanceOf(_borrower) < loanToPay - 1) {
            revert LendBorrow_UserDoesNotHaveSufficientTokensToBurn();
        }
        DUSD(dusdContract).burn(_borrower, loanToPay);

        // Move NFT back to msg.msg.sender
        OriginalToken[] storage tokens = ownerOfOrignalTokens[_borrower];
        uint256 tokenCount = tokens.length;

        for (uint256 i = 0; i < tokenCount; i++) {
            IERC721(tokens[i].tokenAddress).safeTransferFrom(
                address(this),
                msg.sender,
                tokens[i].tokenId
            );
        }
    /* todo: Dev Update => if the guy has deposited NFT from multiple contracts then we need one more interchain call to give back all NFT ownerships  */

    addressToAssociatedLoan[_borrower] = 0;

    // Clear the array for the specified borrower
    delete ownerOfOrignalTokens[_borrower];

    // Now tell all chains to give back NFT ownerships
    for (uint256 i = 0; i < chainIds.length; i++){
            // Except this chain execute call for all two remaining chains
            if(block.chainid != chainIds[i]){
                uint32 chainId = chainIds[i];
                uint256 fee = IBridge(bridge).quoteFeeGiveBackNFTOwnership(chainId);
                IBridge(bridge).GiveBackOwnershipOfNFTOnAllChains{value:fee}(
                    chainId,
                    0, // Dummy Number
                    msg.sender, 
                    msg.sender,
                    chainAddress[i] 
                );
            }
        }
}


    function liquidateNFTByTransferingTheOwnerShipToDaoContract(uint256 token_id,address tokenContractAddress) internal returns(string memory ){
        // We need 3 DAO contracts on 3 chains but right now i am using a normal EOA address to move my NFT
        // Move NFT back to msg.msg.sender

        IERC721(tokenContractAddress).safeTransferFrom(
            address(this),
            DAO_CONTRACT_ADDRESS,
            token_id
        );
        return("NFT Liauidated");
    }

    function tryToLiquidateNFT(uint256 token_id , address tokenContractAddress) external returns(string memory){

        bytes32 bytes32OftokenAndTokenContractAddress = calculateBytes32ValueFromToken(token_id,tokenContractAddress);

        uint256 NFTValueAtTimeOfDeposit = bytes32OfTokenToFloorPriceOfTokenAtTimeOfDepositing[bytes32OftokenAndTokenContractAddress];

        uint256 NFTValueRightNow = NFTValueAtTimeOfDeposit - (NFTValueAtTimeOfDeposit / 10);

        uint256 healthFactor = NFTValueAtTimeOfDeposit/NFTValueRightNow;

        if(healthFactor>1){
            string memory status = liquidateNFTByTransferingTheOwnerShipToDaoContract(token_id,tokenContractAddress);
            return status;
        }else{
            return("Token Cannot Be Liquidated");
        }

    }

    function calculateBytes32ValueFromToken(uint256 token_id , address tokenContractAddress) internal pure returns(bytes32){
        bytes32 bytes32OfTokenIdAndTokenAddress = bytes32(abi.encode(token_id,tokenContractAddress));
        return(bytes32OfTokenIdAndTokenAddress);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function pullMoney() external ownerOnly{
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        if(!success){
            revert LendBorrow_AdminCouldNotWithdrawMoney();
        }
    }

    function giveERC20TokensBalanceOfBorrower(address _borrower) external view returns(uint256){
        return DUSD(dusdContract).balanceOf(_borrower);
    }

    function giveBackNftOwnerShipOnAllChains(address _borrower)external bridgeOnly {

        if(_borrower == address(0)){
                revert LendBorrow_AddressShouldNotBeEqualToZero();
            }
        
        // First remove the Associated loan for address of borrower 
        addressToAssociatedLoan[_borrower] = 0;

        // Now check if there is any NFT Deposited on this chain if there is not NFT deposited then simply return 
        if (ownerOfOrignalTokens[_borrower].length == 0) {
                return;
            }

        // Move NFT back to msg.msg.sender
        OriginalToken[] storage tokens = ownerOfOrignalTokens[_borrower];
        uint256 tokenCount = tokens.length;

        for (uint256 i = 0; i < tokenCount; i++) {
                IERC721(tokens[i].tokenAddress).safeTransferFrom(
                    address(this),
                    _borrower,
                    tokens[i].tokenId
                );
        }
        
        // Clear the array for the specified borrower
        delete ownerOfOrignalTokens[_borrower];
        
    }

    /*@dev Test function to repay loan wont be included in Production*/
    function mintTokenForPayingLoan(uint256 _dusdAmount) public{
        DUSD(dusdContract).mint(msg.sender,_dusdAmount);
    }

}
