import {
  INPUT_CHANGE,
  FETCH_COUNTRIES,
  FETCH_CITIES
} from './types';

export const inputValueChange = (value) => dispatch => {
  dispatch({
    type: INPUT_CHANGE,
    payload: value
  })
}

export const fetchCountries = () => dispatch => {
  fetch('https://api.openaq.org/v1/countries')
  .then(res => res.json())
  .then(res => {
    const results = res.results;
    if(results.length) {
      const countries = results.map(result => ({
        name: result.name,
        code: result.code
      }));
      //console.log(countries);
      dispatch({
        type: FETCH_COUNTRIES,
        list: countries
      });
    }
  })
}

const parameter = 'pm25';
const requestLimit = 1000;

export const fetchCities = (countryCode) => dispatch => {
  fetch('https://api.openaq.org/v1/measurements?country=' + countryCode + '&parameter=' + parameter + '&limit=' + requestLimit)
  .then(res => res.json())
  .then(res => {
    const results = res.results;
    if(results.length) {
      //mapping fetch data
      const list = results.map(result => ({
        name: result.city,
        value: result.value
      }))
      //console.log(list);
      
      const byCityGroupedList = [];
      //grouping measurements by cities
      list.forEach(item => {
        const existing = byCityGroupedList.filter(v => {
          return v.name === item.name;
        });
        if (existing.length) {
          const existingIndex = byCityGroupedList.indexOf(existing[0]);
          byCityGroupedList[existingIndex].value = byCityGroupedList[existingIndex].value.concat(item.value);
        } else {
          if (typeof item.value == 'number')
            item.value = [item.value];
          byCityGroupedList.push(item);
        }
      });
      //average of measurements for every city
      byCityGroupedList.forEach(item => {
        const sum = item.value.reduce((prev, next) => next += prev);
        const avg = sum/item.value.length;
        item.value = avg;
      })
      //sort by highest pollution
      byCityGroupedList.sort((a,b) => {
        return a.value < b.value ? 1 : -1
      })

      const cityArray = byCityGroupedList.slice(0,10);

      cityArray.forEach(item => {
        //fetch for search result of the city
        fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&utf8=&origin=*&format=json&srqiprofile=classic&srlimit=1&srsearch=' + item.name)
        .then(res => res.json())
        .then(res => {
          const search = res.query.search[0].title;
          //fetch descriptions for every city
          const url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&titles=' + search;
          fetch(url)
          .then(res => res.json())
          .then(res => {      
            const pages = res.query.pages;
            const description = pages[Object.keys(pages)[0]].extract;
            item.description = description;
            //fetch images
            fetch('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=1000&format=json&origin=*&titles=' + search)
            .then(res => res.json())
            .then(res => {
              const pages = res.query.pages;
              const image = pages[Object.keys(pages)[0]].thumbnail.source;
              item.image = image;
              dispatch({
                type:FETCH_CITIES,
                cities: cityArray
              });
            })
            .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
      })
      //console.log(cityArray)
    }
  })
}
