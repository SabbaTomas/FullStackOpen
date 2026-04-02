// src/components/AnecdoteForm.jsx
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdoteAsync } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const contentRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = contentRef.current.value;
    // Usar el thunk que guarda en el backend
    dispatch(createAnecdoteAsync(content));
    dispatch(showNotification(`Anecdote created: "${content}"`, 5));
    contentRef.current.value = '';
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <input type="text" ref={contentRef} />
      <button type="submit">Add Anecdote</button>
    </form>
  );
};

export default AnecdoteForm;