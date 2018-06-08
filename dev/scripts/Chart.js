import React from 'react';
import {Bar, Line, Pie, Doughnut, HorizontalBar} from 'react-chartjs-2';

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
                        responsive: true,
                        maintainAspectRatio: false,
                        hover:{
                            mode: 'nearest',
                            intersect: true
                        },
                        tooltips:{
                            mode: 'index',
                            intersect: false
                        },
                        title:{
                            display: this.props.displayTitle,
                            text: `Weather trends for ${this.props.displayText.city}, ${this.props.displayText.prov} on ${this.props.dateTitle}`,
                            fontSize: 25,
                            fontColor: "white"
                        },
                        legend: {
                            display: true,
                            position: this.props.legendPosition
                        },
                        scales: {
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Temperature in Celsius',
                                    fontColor: "white",
                                    fontSize: 20
                                },
                                ticks: {
                                    fontColor: "white",
                                    stepSize: 1
                                }
                            }],
                            xAxes: [{
                                display: true,
                                scaleLabel:{
                                    display: true,
                                    labelString: 'Hours of day',
                                    fontColor: "white",
                                    fontSize: 20
                                },
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