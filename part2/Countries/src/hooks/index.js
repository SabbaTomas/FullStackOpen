import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(false)

  useEffect(() => {
    console.log('🔍 useCountry triggered with name:', name)

    if (name.length === 0) {
      console.log('➡️ Name is empty, resetting...')
      setCountry(null)
      setFound(false)
      return
    }

    let cancelled = false
    const timer = setTimeout(() => {
      console.log('📡 Fetching from API:', name)
      
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then(response => {
          console.log('✅ Success! Data:', response.data[0])
          if (!cancelled) { 
            setCountry(response.data)  
            setFound(true)
          }
        })
        .catch((error) => {
          console.log('❌ Error:', error.message)
          if (!cancelled) { 
            setCountry(null)
            setFound(false)
          }
        })
    }, 500)

    return () => {
      console.log('🧹 Cleanup - cancelling request for:', name)
      cancelled = true
      clearTimeout(timer)
    }
  }, [name]) 

  return { country, found }
}