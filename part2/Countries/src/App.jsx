import React, { useState } from 'react';
import { useCountry } from './hooks'
import Filter from './components/Filter'
import CountryDetail from './components/CountryDetail'

function App() {
  const [filter, setFilter] = useState('')
  const { country, found } = useCountry(filter)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Countries</h1>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      
      {filter === '' && <p>search for a country</p>}
      
      {filter !== '' && !found && <p>not found</p>}
      
      {country && <CountryDetail country={country} />}
    </div>
  )
}

export default App