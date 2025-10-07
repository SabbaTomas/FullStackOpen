import  axios  from "axios";

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (capital) => {   
    const apiKey = import.meta.env.VITE_SOME_KEY
    const request = axios.get(`${baseUrl}?q=${capital}&appid=${apiKey}&units=metric`)
    return request.then(response => response.data)
}

export default { getWeather }