//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FundMe {

    // 1. 创建一个收款函数
    // 2. 记录投资人并且查看
    // 3. 在锁定期内，达到目标值，生产商可以提款
    // 4. 在锁定期内，没有达到目标值，投资人在锁定期以后退款

    mapping (address => uint256) public fundersToAmount;

    uint256 public TARGET = 100 * 10*18;

    address owner;

    AggregatorV3Interface internal dataFeed;

    uint256 endTimeStamp;

    address fundTokenERC20Addr;

    bool public getFundSuccess = false;

    constructor() {
        dataFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
        owner = msg.sender;
        endTimeStamp = block.timestamp + 1800;
    }

    function fund() external payable {
        require(address(this).balance > TARGET, "target fund is already reached");
        require(block.timestamp < endTimeStamp, "fund time is over");
        fundersToAmount[msg.sender] = msg.value;
    } 

    function convertEthToUsd(uint256 amount) internal view returns(uint256) {
        uint256 nowPrice = uint256(getChainlinkDataFeedLatestAnswer())/ 10*8;
        return amount * nowPrice;
    }

    function getFund() external onlyowner {
        uint256 amount = address(this).balance;
        require(convertEthToUsd(amount) >= TARGET, "Target is not reached");
        fundersToAmount[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "tx is failed");
        getFundSuccess = true;
    }

    function changeOwner(address newOwner) external onlyowner {
        owner = newOwner;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function setFunderAmount(address funderAddr, uint256 amount) external {
        require(msg.sender == fundTokenERC20Addr, "you have no permission to use this function");
        fundersToAmount[funderAddr] = amount;
    }

    function setFundTokenERC20Addr(address _fundTokenERC20Addr) external onlyowner {
        fundTokenERC20Addr = _fundTokenERC20Addr;
    }

    modifier onlyowner () {
        require(owner == msg.sender, "you are not owner of this contract");
        _;
    }



}