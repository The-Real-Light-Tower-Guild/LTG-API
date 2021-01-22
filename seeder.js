const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({path: './config/config.env'})

mongoose.connect(
    process.env.MONGO_URI,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true 
    }
)

// Once the Model are created add them here
//Grab the model
const User = require('./models/User')
//Read the User.json file in _data
const user = JSON.parse(fs.readFileSync(`${__dirname}/_data/_user.json`))

//Add the data into the database
const importData = async () => {
    try {
        await User.create(user)
        console.log('Data imported...'.green.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

//Delete the data fromthe database
const deleteData = async () => {
    try {
        await User.deleteMany()
        console.log('Data destoryed...'.red.inverse)
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === '-import'){
    importData()
}else if(process.argv[2] === '-delete'){
    deleteData()

}

