import React from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';

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
                <Bar
                    data={this.state.chartData}
                    // width={100}
                    // height={50}
                    options={{
                        title:{
                            display: this.props.displayTitle,
                            text: this.props.displayText,
                            fontSize: 25
                        },
                        legend: {
                            display: true,
                            position: this.props.legendPosition
                        }
                    }}
                />
            </div>
        )
    }
}

export default Chart;