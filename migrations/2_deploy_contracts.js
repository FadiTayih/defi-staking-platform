const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts) {
    // Deploy Mock Tether Contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed(); // Use .deployed() not .deploy()

    // Deploy RWD Contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed(); // Use .deployed() not .deploy()

    // Deploy DecentralBank Contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed(); // Use .deployed() not .deploy()

    // Transfer all the RWD tokens to the Decentral bank 
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    // Transfer 100 Tether tokens to the investor
    await tether.transfer(accounts[1], '100000000000000000000');

}