const Course = ({course}) => {

const Header = ({course}) => {
  return <h2>{course}</h2>
}

const Part = ({name, exercises}) => {
  return <p>{name} {exercises}</p>
}

const Content = ({parts}) => {

return (
    <div>
        {parts.map((part, index) => (
            <Part key={index} name={part.name} exercises={part.exercises} />
        ))}
    </div>)
}

const Total = ({parts}) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0);
    return <h3>Total of {total} exercises</h3>
}

    return (
        console.log(course),
         console.log(course[0].name),
        
    <div>
      <Header course={course[0].name} />
      <Content parts={course[0].parts}/>
      <Total parts={course[0].parts} />
      <Header course={course[1].name} />
      <Content parts={course[1].parts}/>
      <Total parts={course[1].parts} />
    </div>
    )
}

export default Course