

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');


require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) =>{

    let tether, rwd, decentralBank

    function tokens(number){
        return web3.utils.toWei(number, 'ether')
    }

    before(async () =>{
        // Load Contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // Transfer all tokens to DecentralBank (1 Million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        // Transfer 100 mock Tethers to the customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () =>{
        it('matches name successfully', async () =>{
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token')
        })
    })

    describe('Reward Token Deployment ', async () =>{
        it('matches name successfully', async () =>{
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Decentral Bank Deployment ', async () =>{
        it('matches name successfully', async () =>{
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async () =>{
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

        describe('Yield Farming', async () =>{
            it('rewards tokens for staking', async () =>{
                let result
                // check Investor balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'Customer mock wallet before staking 100 tokens')

                // Check Staking for Customer of 100 tokens
                await tether.approvel(decentralBank.address,tokens('100'), {from: customer})
                await decentralBank.depositeToken(tokens('100'), {from : customer})

                // Check updatd customer balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('0'), 'Customer mock wallet after staking 100 tokens')

                // Check the udpated balance of the Decentral Bank
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('100'), 'Decentrail bank mock wallet after staking 100 token')


                // is staking balance
                result = await decentralBank.isStaked(customer)
                assert.equal(result.toString(),'true','Customer staking status')

                //Issues Tokens
                await decentralBank.issueToken({from : owner})

                //Ensure only owner can issue tokens
                await decentralBank.issueToken({from: customer}).should.be.rejected;

                //Unstaked Tokens
                await decentralBank.unstakedTokens({from: customer})

                // Check Unstaking balances

                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'Customer mock wallet after unstaking')


                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'Decentrail bank mock wallet after staking 100 token')


                result = await decentralBank.isStaked(customer)
                assert.equal(result.toString(),'false','Customer is no longer staking after unstaking')



            })


        })
    })

})