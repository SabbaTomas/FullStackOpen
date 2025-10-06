import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Numbers from './components/Numbers'
import personsService from './services/persons'
import Confirm from './components/confirm'
import Alert from './components/alert'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [okMessage, setOkMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updateNumber(newName)
        // Eliminar ConfirmMsg aquí para que no se muestre el mensaje de confirmación al actualizar
      }
    } else {
      personsService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          ConfirmMsg(setOkMessage, returnedPerson)
        })
        .catch(() => {
          setErrorMessage('Failed to add person. Please try again.')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const updateNumber = (name) => {
    const person = persons.find(p => p.name === name)
    const changedPerson = { ...person, number: newNumber }

    personsService
      .update(person.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        ConfirmMsg(setOkMessage, returnedPerson)
      })
      .catch(() => {
        setErrorMessage(`Information of ${person.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== person.id))
      })
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons

  const handleDelete = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    if (window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Confirm message={okMessage} />
      <Alert message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Numbers 
        personsToShow={personsToShow} 
        person={persons} 
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App

function ConfirmMsg(setOkMessage, returnedPerson) {
  setOkMessage(`Added ${returnedPerson.name}`)
  setTimeout(() => {
    setOkMessage(null)
  }, 5000)
}