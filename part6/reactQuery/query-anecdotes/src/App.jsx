import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdotesService from './services/anecdotesService'
import { NotificationContext } from './context/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const { setNotification } = useContext(NotificationContext)

  const result = useQuery(
    {
      queryKey: ['anecdotes'],
      queryFn: anecdotesService.getAll,
      refetchOnWindowFocus: false,
      retry: false
    }
  )

  const voteMutation = useMutation(
    {
      mutationFn: anecdotesService.update,
      onSuccess: (updatedAnecdote) => {
        queryClient.setQueryData(['anecdotes'], (old) =>
          old.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a)
        )
        setNotification(`You voted for '${updatedAnecdote.content}'`, 5)
      }
    }
  )

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    voteMutation.mutate(updatedAnecdote)
  }

  if (result.isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (result.isError) {
    return <div>Anecdote service unavailable due to server problems</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
