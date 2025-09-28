import { useState } from 'react'



const Statistics = (props) => {
  const { good, neutral, bad } = props
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <div>Good {good}</div>
      <div>Neutral {neutral}</div>
      <div>Bad {bad}</div>
      <div>All {all}</div>
      <div>Average {(good - bad) / all}</div>
      <div>Positive {good / all * 100} %</div>
    </div>
  )
}

const Button = ({ handleClick, text }) =>  (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App