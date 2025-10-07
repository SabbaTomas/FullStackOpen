const Country = ({ country, onShowCountry }) => {
  return (
    <li>
      {country.name.common}{" "}
      <button onClick={() => onShowCountry(country)}>Show</button>
    </li>
  )
}
export default Country