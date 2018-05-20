import React from 'react';
import {Bar, Line, Pie, Doughnut} from 'react-chartjs-2';

class Chart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chartData: this.props.chartData
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            chartData: nextProps.chartData
        })
    }


    render(){
        return(
            <div className='chart'>
                <Line
                    data={this.state.chartData}
                    // width={100}
                    // height={50}
                    options={{
                        maintainAspectRatio: true,
                        title:{
                            display: this.props.displayTitle,
                            text: this.props.displayText,
                            fontSize: 25,
                            fontColor: "white"
                        },
                        legend: {
                            display: true,
                            position: this.props.legendPosition
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontColor: "white",
                                    stepSize: 1
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontColor: "white",
                                    stepSize: 1
                                }
                            }]
                        }
                    }}
                />
            </div>
        )
    }
}

export default Chart;