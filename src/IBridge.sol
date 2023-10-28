// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBridge {
    function quoteFeeAddBorrowingPowerSend(uint32 destination) external view returns (uint256);
    function quoteFeeRemoveBorrowingPowerSend(uint32 destination) external view returns (uint256);
    function quoteFeeGiveBackNFTOwnership(uint32 destination) external view returns (uint256);
    function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external;
    function AddBorrowingPowerSend(uint32 _destination, uint256 _DUSD_AMOUNT, address _borrower, address _refundAddress, address _destinationBridge) external payable;
    function RemoveBorrowingPowerSend(uint32 _destination, uint256 _DUSD_AMOUNT, address _borrower, address _refundAddress, address _destinationBridge) external payable;
    function GiveBackOwnershipOfNFTOnAllChains(uint32 _destination, uint256 _DUMMY_NUMBER, address _borrower, address _refundAddress, address _destinationBridge) external payable ;
}