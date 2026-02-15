import React, {Component} from 'react'

class AirDrop extends Component{

    constructor(props){
        super(props)
        this.state = {time: {}, seconds: 20}
        this.timer = 0
        this.startTimer = this.startTimer.bind(this)
        this.countDown = this.countDown.bind(this)
    }

    secondsToTime(secs){
        let hours, seconds, minutes
        hours = Math.floor(secs / (60 * 60))

        let divisor_for_minutes = secs % (60 * 60)
        minutes = Math.floor(divisor_for_minutes / 60)

        let divisor_for_seconds = divisor_for_minutes % 60
        seconds = Math.ceil(divisor_for_seconds)

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds,
        }
        return obj
    }

    componentDidMount(){
        let timeLeftVar = this.secondsToTime(this.state.seconds)
        this.setState({time: timeLeftVar})
    }

    componentDidUpdate(prevProps) {
        // Only start timer when stakingBalance changes and meets threshold
        if(prevProps.stakingBalance !== this.props.stakingBalance) {
            this.airdropReleaseTokens()
        }
    }

    startTimer(){
        if(this.timer === 0 && this.state.seconds > 0){
            this.timer = setInterval(this.countDown, 1000)
        }
    }

    countDown(){
        let seconds = this.state.seconds - 1
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })

        if(seconds === 0){
            clearInterval(this.timer)
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    airdropReleaseTokens() {
        let stakingB = this.props.stakingBalance
        // Changed to >= and convert to number for proper comparison
        if(Number(stakingB) >= 50000000000000000000){
            this.startTimer()
        }
    }

    render() {
        return(
            <div style={{color: 'black'}}>
                {this.state.time.h}h {this.state.time.m}m {this.state.time.s}s
            </div>
        )
    }
}

export default AirDrop;