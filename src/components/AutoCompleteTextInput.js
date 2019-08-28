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
      indexActive: -1,
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

  onKeyUp(e) {  
    const {indexActive,suggestions} = this.state;
    
    switch(e.keyCode) {
      case 38: //arrow-up
        if(indexActive >=0 )
          this.setState({ indexActive: indexActive - 1})
        break;
      case 40: //arrow-down
        if(indexActive >= -1 && indexActive < suggestions.length -1)
          this.setState({ indexActive: indexActive + 1})
        break;
      case 13: //enter
        if(indexActive > -1) {
          this.props.inputValueChange(suggestions[indexActive]);
          this.setState({suggestions: [], indexActive: -1})
          this.checkAllowed(suggestions[indexActive])
        }
        break;
      default:
        this.setState({indexActive: -1})
        
    }
  }

  onMouseOver(e) {
    e.preventDefault();
    this.setState({indexActive: null})
  }

  render() {
    const {suggestions, isAllowed, indexActive} = this.state;
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
            onKeyUp={e => this.onKeyUp(e)}
          ></input>
          {suggestions && suggestions.length ?
            <ul>
            {
              suggestions.map((suggestion, index) => {
              return <li key={index} onMouseMove={e => this.onMouseOver(e)} style={index === indexActive ? {background: 'rgba(0,0,0,0.1)'} : {}} onClick={e => this.selectSuggestion(e)}>{suggestion}</li>
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