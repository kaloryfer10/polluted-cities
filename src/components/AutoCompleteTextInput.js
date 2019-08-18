import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  inputValueChange,
  fetchCities
} from '../actions/ContentActions';

class AutoCompleteTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      isAllowed: false
    }
  }

  componentDidMount() {
    const {inputValue} = this.props.content;
    this.checkAllowed(inputValue);
  }

  onTextChange(e) {
    const {countries} = this.props.content;
    const value = e.target.value;
    this.props.inputValueChange(value);
    let suggestions = [];
    if(value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = countries.filter(v => regex.test(v.name));
      suggestions = suggestions.map(suggestion => suggestion.name);
      this.checkAllowed(value);
    }
    this.setState({
      suggestions
    });
  }

  onSubmit(e) {
    const {countries, inputValue} = this.props.content;
    e.preventDefault();
    const foundCountry = countries.find(element => {
      if(element.name === inputValue) {
        return element;
      }
      return false;
    })
    const code = foundCountry.code;
    this.props.fetchCities(code);
  }

  checkAllowed(value) {
    const {allowedCountries} = this.props.content;
    if(allowedCountries.includes(value)) {
      this.setState({
        isAllowed: true
      });
    } else {
      this.setState({
        isAllowed: false
      });
    }
  }

  selectSuggestion(e) {
    const value = e.target.innerText;
    this.checkAllowed(value);
    this.props.inputValueChange(value);
    this.setState({
      suggestions: []
    });
  }

  render() {
    const {suggestions, isAllowed} = this.state;
    return (
      <div className="form-wrapper">
        <form className="form">
          <input
            type="text"
            name="country-name"
            id="country-name"
            placeholder="Country"
            autoComplete="off"
            value={this.props.content.inputValue}
            onChange={e => this.onTextChange(e)}
          ></input>
          {suggestions && suggestions.length ?
            <ul>
            {
              suggestions.map((suggestion, index) => {
              return <li key={index} onClick={e => this.selectSuggestion(e)}>{suggestion}</li>
            })}  
            </ul>
          : null}
          
          {isAllowed ? <button type="submit" className="btn" onClick={(e) => this.onSubmit(e)}>Get it</button> : <button type="submit" className="btn disabled" disabled>Get it</button>}
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  content: state.Content
})

export default connect(mapStateToProps, {
  inputValueChange,
  fetchCities
})(AutoCompleteTextInput);