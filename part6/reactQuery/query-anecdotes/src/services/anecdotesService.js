const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

const create = async (content) => {
  const newAnecdote = {
    content,
    votes: 0
  }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAnecdote)
  })
  if (!response.ok) {
    // Intentar obtener mensaje de error del servidor
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create anecdote')
    } catch {
      throw new Error('Content must be at least 5 characters long')
    }
  }
  return await response.json()
}

const update = async (updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedAnecdote)
  })
  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }
  return await response.json()
}

export default { getAll, create, update }