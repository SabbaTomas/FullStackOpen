// src/components/AnecdoteForm.jsx

import { useDispatch } from 'react-redux';
import { createAnecdoteAsync } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';
import { useField } from '../hooks';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const content = name.value;
    dispatch(createAnecdoteAsync(content));
    dispatch(showNotification(`Anecdote created: "${content}"`, 5));
    name.reset();
  };

  const name = useField('text');

  return (
    
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <input 
        type={name.type}
        value={name.value}
        onChange={name.onChange}
      />
      <button type="submit">Add Anecdote</button>
      <button type="button" onClick={name.reset}>Clear</button>
    </form>
  );
};

export default AnecdoteForm;