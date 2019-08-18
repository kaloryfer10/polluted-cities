import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  fetchCountries
} from '../actions/ContentActions';

import AutoCompleteTextInput from '../components/AutoCompleteTextInput';
import City from '../components/City';

class PollutedCities extends Component {
  componentDidMount() {
    this.props.fetchCountries();
  }
  
  render() {
    return (
      <div>
        <h1 className="title">Most polluted cities</h1>
        <AutoCompleteTextInput />
        {this.props.content.cities && this.props.content.cities.length ? 
          <div className="cities">
            {this.props.content.cities.map((city, index) => {
              return <City 
                key={index}
                city={city}
              /> 
            })}
          </div>
          : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  content: state.Content
})

export default connect(mapStateToProps, {
  fetchCountries,
})(PollutedCities);