import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';



const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const input = document.querySelector('#search-box');

input.addEventListener('input', debounce(onCountry, DEBOUNCE_DELAY));


function onCountry(evt){
    evt.preventDefault();
    const inputCountry = input.value.trim();
    if(inputCountry === ''){
      return;
    }
    fetchCountries(inputCountry)
    .then(country => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (country.length === 1){
renderCountryInfo(country);
      } else if (country.length >= 2 && country.length <= 10){
        renderCountryList(country)
      } else if (country.length > 10){
        tooManyCountries()
      }
    }).catch(noSuchCountry);
    
};

function noSuchCountry(error) {
  Notiflix.Notify.warning('Oops, there is no country with that name');
}
function tooManyCountries() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function renderCountryList(country) {
  const markUpList = country
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list" src='${flags.svg}' width="100" alt='${name.official}'>
        <h2 class="country-list__header">${name.official}</h2>
        </li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markUpList);
}

function renderCountryInfo([{ name, flags, capital, population, languages }]) {
  const markUpInfo = ` <ul class="country-info__list list">
            <li class="country-info">
              <img class="country-info" src="${flags.svg}" width="200" alt="${name.official}">
              <h2 class="country-info">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-info__name">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-info__name">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-info__name">Languages: </span>${Object.values(
              languages
            ).join(', ')}</li>
        </ul>`;
  countryInfo.insertAdjacentHTML('beforeend', markUpInfo);
}