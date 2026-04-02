// src/components/AnecdoteList.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdoteAsync } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes);
  const filter = useSelector(state => state.filter);
  const dispatch = useDispatch();

   const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  const handleVote = (id, content) => {
    dispatch(voteAnecdoteAsync(id));
    dispatch(showNotification(`You voted for '${content}'`, 5));
  };

  return (
    <ul>
      {filteredAnecdotes.map(anecdote => (
        <li key={anecdote.id}>
          {anecdote.content} ({anecdote.votes})
          <button onClick={() => handleVote(anecdote.id, anecdote.content)}>Vote</button>
        </li>
      ))}
    </ul>
  );
};

export default AnecdoteList;