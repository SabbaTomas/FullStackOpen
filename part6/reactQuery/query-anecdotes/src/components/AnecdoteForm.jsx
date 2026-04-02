import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useContext } from 'react'
import anecdotesService from '../services/anecdotesService'
import { NotificationContext } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const contentRef = useRef()
  const queryClient = useQueryClient()
  const { setNotification } = useContext(NotificationContext)

  const createMutation = useMutation(
    {
      mutationFn: anecdotesService.create,
      onSuccess: (newAnecdote) => {
        queryClient.setQueryData(['anecdotes'], (old) => [...old, newAnecdote])
        setNotification(`New anecdote '${newAnecdote.content}' created!`, 5)
      },
      onError: (error) => {
        setNotification(`Creating anecdote failed: ${error.message}`, 5)
      }
    }
  )

  const onCreate = (event) => {
    event.preventDefault()
    const content = contentRef.current.value

    if (content.length < 5) {
      setNotification('Anecdote must be at least 5 characters', 5)
      return
    }

    createMutation.mutate(content)
    contentRef.current.value = ''
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input ref={contentRef} name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
