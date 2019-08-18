import React, { Component } from 'react';

class City extends Component {
  render() {
    const {name, value, description, image} = this.props.city;
    const style = {
      backgroundImage: 'url(' + image + ')'
    }
    return (
      <div className="city-box">
        <div className="background" style={style}>
        </div>
        <div className="text hide-scrollbar">
          <h2 className="title">{name}</h2>
          <h3 className="pollution">{value.toFixed(2) + ' μg/m³'}</h3>
          <p className="description">{description}</p>
        </div>
      </div>
    );
  }
}

export default City;
