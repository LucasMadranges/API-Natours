const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const {Tour} = require('./../../models/tourModel')


dotenv.config({
    path: './.env'
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {}).then(() => {
    console.log('DB connexion successfull');
}).catch((error) => {
    console.log(`Error: ${error}`)
});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DATABASE
async function importData() {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

// DELETE ALL DATA FROM DATABASE
async function deleteData() {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}