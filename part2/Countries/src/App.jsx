import React, { useState, useEffect } from 'react';
import countryService from './services/countryService'
import Filter from './components/Filter'
import Country from './components/Country'
import CountryDetail from './components/CountryDetail'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    console.log(event.target.value)
    setSelectedCountry(null);
  }
  
  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

   const handleShowCountry = (country) => {
    setSelectedCountry(country);
  }

   if (selectedCountry) {
    return (
      <div>
        <h1>Countries</h1>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
        <button onClick={() => setSelectedCountry(null)}>Back</button>
        <CountryDetail country={selectedCountry} />
      </div>
    );
  }

  return (
    <div>
      <h1>Countries</h1>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      {filteredCountries.length > 10 ? (
        <p>Please specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <CountryDetail country={filteredCountries[0]} />
      ) : (
        <ul>
          {filteredCountries.map(country => (
            <Country key={country.name.common} country={country} onShowCountry={handleShowCountry} />
          ))}
        </ul>
      )}
    </div>
  )}

export default App
