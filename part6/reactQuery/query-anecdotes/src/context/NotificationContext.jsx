import { createContext, useReducer } from 'react'

export const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  const setNotification = (message, seconds = 5) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    
    // Limpiar notificación después de N segundos
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, seconds * 1000)
  }

  const clearNotification = () => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }

  return (
    <NotificationContext.Provider value={{ notification, setNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
