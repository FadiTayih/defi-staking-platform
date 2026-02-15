import React, {Component} from 'react';
import './App.css';
import NavBar from './NavBar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main';
import PracticelsSettings from './PracticlesSetting';

class App extends Component{

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
        // Store contracts as class properties instead of state
        this.tether = null
        this.rwd = null
        this.decentralBank = null
    }

    async UNSAFE_componentWillMount(){
        await this.loadweb3()
        await this.loadBlockchainData()
    }

    async loadweb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            // Replace deprecated enable() with eth_requestAccounts
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' })
            } catch (error) {
                console.error("User denied account access")
            }
        } else if (window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        } else{
            window.alert('No ethereum browser detected! Check out MetaMask!')
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        
        if (!accounts || accounts.length === 0) {
            window.alert('Please connect your wallet!')
            this.setState({loading: false})
            return
        }
        
        console.log('Connected account:', accounts[0])
        this.setState({account: accounts[0]})
        const networkId = await web3.eth.net.getId()
        console.log('Network ID:', networkId)
        
        // Load Tether Contract
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            this.tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            console.log('Tether contract created:', this.tether)
            console.log('Tether has methods?', !!this.tether.methods)
            console.log('Tether address:', tetherData.address)
            try {
                let tetherBalance = await this.tether.methods.balanceOf(accounts[0]).call()
                console.log('Raw tetherBalance from contract:', tetherBalance)
                console.log('TetherBalance as string:', tetherBalance.toString())
                console.log('Converted with fromWei:', web3.utils.fromWei(tetherBalance.toString(), 'ether'))
                this.setState({tetherBalance: tetherBalance.toString()})
            } catch (error) {
                console.error('Error details:', error)
                window.alert('Error fetching Tether balance')
            }
        } else {
            window.alert('Error! Tether contract not deployed to the network')
            this.setState({loading: false})
            return
        }

        // Load RWD Contract
        const RWDData = RWD.networks[networkId]
        if(RWDData){
            this.rwd = new web3.eth.Contract(RWD.abi, RWDData.address)
            console.log('RWD contract created:', this.rwd)
            console.log('RWD address:', RWDData.address)
            try {
                let rwdBalance = await this.rwd.methods.balanceOf(accounts[0]).call()
                this.setState({rwdBalance: rwdBalance.toString()})
            } catch (error) {
                console.error('Error fetching RWD balance:', error)
                window.alert('Error fetching RWD balance')
            }
        } else {
            window.alert('Error! RWD contract not deployed to the network')
            this.setState({loading: false})
            return
        }

        // Load DecentralBank Contract
        const DecentralBankData = DecentralBank.networks[networkId]
        if(DecentralBankData){
            this.decentralBank = new web3.eth.Contract(DecentralBank.abi, DecentralBankData.address)
            console.log('DecentralBank contract created:', this.decentralBank)
            console.log('DecentralBank address:', DecentralBankData.address)
            try {
                let stakingBalance = await this.decentralBank.methods.stakingBalance(accounts[0]).call()
                this.setState({stakingBalance: stakingBalance.toString()})
            } catch (error) {
                console.error('Error fetching staking balance:', error)
                window.alert('Error fetching staking balance')
            }
        } else {
            window.alert('Error! DecentralBank contract not deployed to the network')
            this.setState({loading: false})
            return
        }

        this.setState({loading: false})
        console.log('All contracts loaded successfully')
    }

    // Staking function 
    stakeToken = (amount) => {
        console.log('stakeToken called with amount:', amount)
        
        // Validation
        if (!this.tether || !this.tether.methods) {
            console.error('Tether contract not properly loaded:', this.tether)
            window.alert('Tether contract not loaded yet! Please wait or refresh the page.')
            return
        }
        
        if (!this.decentralBank || !this.decentralBank.methods) {
            console.error('DecentralBank contract not properly loaded:', this.decentralBank)
            window.alert('DecentralBank contract not loaded yet! Please wait or refresh the page.')
            return
        }

        if (!this.decentralBank._address) {
            console.error('DecentralBank address not available')
            window.alert('DecentralBank address not available!')
            return
        }
        
        console.log('All validations passed, proceeding with transaction...')
        console.log('Approving', amount, 'for', this.decentralBank._address)
        
        this.setState({loading: true})
        
        // Fixed: Changed 'approve' to 'approvel' to match the contract typo
        this.tether.methods.approvel(this.decentralBank._address, amount)
            .send({from: this.state.account})
            .on('transactionHash', (hash) => {
                console.log('Approval transaction hash:', hash)
                // Fixed: Changed to 'depositeToken' (singular, with typo 'e')
                this.decentralBank.methods.depositeToken(amount)
                    .send({from: this.state.account})
                    .on('transactionHash', (hash) => {
                        console.log('Deposit transaction hash:', hash)
                        this.setState({loading: false})
                    })
                    .on('error', (error) => {
                        console.error('Deposit error:', error)
                        window.alert('Deposit transaction failed!')
                        this.setState({loading: false})
                    })
            })
            .on('error', (error) => {
                console.error('Approval error:', error)
                window.alert('Approval transaction failed!')
                this.setState({loading: false})
            })
    }

    // Unstaking function 
    unstakeToken = () => {
        console.log('unstakeToken called')
        
        if (!this.decentralBank || !this.decentralBank.methods) {
            console.error('DecentralBank contract not properly loaded:', this.decentralBank)
            window.alert('DecentralBank contract not loaded yet! Please wait or refresh the page.')
            return
        }
        
        console.log('Proceeding with unstaking...')
        this.setState({loading: true})
        
        // Fixed: Changed to 'unstakedTokens' (with 'ed')
        this.decentralBank.methods.unstakedTokens()
            .send({from: this.state.account})
            .on('transactionHash', (hash) => {
                console.log('Unstaking transaction hash:', hash)
                this.setState({loading: false})
            })
            .on('error', (error) => {
                console.error('Unstaking error:', error)
                window.alert('Unstaking transaction failed!')
                this.setState({loading: false})
            })
    }

    render() {
        let content
        if(this.state.loading){
            content = <p id='loader' className='text-center' style={{margin:'30px'}}>LOADING....</p>
        } else {
            content = <Main 
                tetherBalance={this.state.tetherBalance}
                rwdBalance={this.state.rwdBalance}
                stakingBalance={this.state.stakingBalance}
                stakeToken={this.stakeToken} 
                unstakeToken={this.unstakeToken}
            />
        }
        
        return (
            <div className='App' style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <PracticelsSettings />
                </div>
                <NavBar account={this.state.account} />
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px',minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;