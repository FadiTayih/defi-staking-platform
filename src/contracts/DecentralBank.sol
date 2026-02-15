
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;


    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;


    constructor(RWD _rwd,Tether _tether) public{
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;

    }
    // Staking function
    function depositeToken(uint _amount) public {
        // Require staking amount to be greater than 0
        require(_amount >0, 'Amount cannot be less than 0');
        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender,address(this), _amount);


        // Update the staking balance
        stakingBalance[msg.sender] += _amount;


        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update staking balance
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake tokens
    function unstakedTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance can not be less than zero');

        // transfer the amount to the specified contract address from our bank
        tether.transfer(msg.sender,balance);

        // resetting the staking balance
        stakingBalance[msg.sender] = 0;

        // update the staking status
        isStaked[msg.sender] = false;

    }

    // Issue reware tokens
    function issueToken() public {
        // require the owner to only issue the tokens
        require(msg.sender == owner, 'Caller must be owner');
        for(uint i=0; i<stakers.length;i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9;
            if(balance > 0){
                 rwd.transfer(recipient,balance);
            }
        }
    }
    



}