import mongoose from "mongoose"

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const dbName = 'phonebook'

const url = `mongodb+srv://latribudemicalle1480_db_user:${password}@cluster0.ysf0nfk.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
        return Person.find({}).then((persons) => {
            console.log('phonebook:')
            persons.forEach((person) => {
              console.log(`${person.name} ${person.number}`)
            })
            return mongoose.connection.close()
          })
        }   

    if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })
      return person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        return mongoose.connection.close()
      })
    }

        console.log('Please provide both name and number: node mongo.js <password> <name> <number>')
    return mongoose.connection.close()
  })
  .catch((err) => {
    console.error('connection error', err)
    process.exit(1)
 
  })