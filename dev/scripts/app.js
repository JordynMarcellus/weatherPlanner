import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Chart from './Chart.js';

class App extends React.Component {
  componentDidMount(){
    console.log('mounted');
    axios.get('http://api.wunderground.com/api/28cbe1ca6cde9931/history_20160405/q/CA/San_Francisco.json')
    .then((res) => {
      console.log(res.data);
    })
  }
  render() {
    return (
      <div>
        <Chart legendPosition='bottom'/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


//get user input of the day of travel and location
//pull weather history from wunderground for the day but from previous years and location of the place
//display as 24hrs - maybe for a few years
//add google directions