import {
  INPUT_CHANGE,
  FETCH_COUNTRIES,
  FETCH_CITIES
} from '../actions/types';

const initialState = {
  countries: [],
  inputValue: '',
  allowedCountries: [
    'Poland',
    'Germany',
    'Spain',
    'France'
  ],
  cities: []
}

export default function (state = initialState, action) {
  switch(action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        inputValue: action.payload
      }
    case FETCH_COUNTRIES:
      return {
        ...state,
        countries: action.list
      }
    case FETCH_CITIES:
      return {
        ...state,
        cities: action.cities
      }
    default:
      return state;
  }
}