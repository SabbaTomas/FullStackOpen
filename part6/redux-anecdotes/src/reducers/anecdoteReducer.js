import {createSlice} from '@reduxjs/toolkit';
import anecdotesService from '../services/anecdotes';

/* const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
] */

const initialState = []

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const updated = state.map(a =>
        a.id === action.payload
          ? { ...a, votes: a.votes + 1 }
          : a
      )
      return updated.sort((a, b) => b.votes - a.votes)
    },
    createAnecdote(state, action) {
      return [...state, action.payload].sort((a, b) => b.votes - a.votes);
    },
    setAnecdotes(state, action) {
      state.length = 0;
      action.payload.forEach(anecdote => state.push(anecdote));
      return state.sort((a, b) => b.votes - a.votes);
    }
  }
})

export const createAnecdoteAsync = (content) => async (dispatch) => {
  const newAnecdote = await anecdotesService.create(content);
  dispatch(createAnecdote(newAnecdote));
};

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdotesService.getAll();
  dispatch(setAnecdotes(anecdotes));
};

export const voteAnecdoteAsync = (id) => async (dispatch, getState) => {
  const state = getState();
  const anecdote = state.anecdotes.find(a => a.id === id);
  if (anecdote) {
    const updated = { ...anecdote, votes: anecdote.votes + 1 };
    await anecdotesService.update(id, updated);
    dispatch(voteAnecdote(id));
  }
};

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdotesSlice.actions;
export default anecdotesSlice.reducer;
