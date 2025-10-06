const Numbers = ({ personsToShow, handleDelete }) => {
  console.log(personsToShow);
  
  return (
    <ul>
      {personsToShow.map(person => 
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>eliminar</button>
        </li>
      )}
    </ul>
  )
}

export default Numbers