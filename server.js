const mongoose = require('mongoose')
const app = require('./app');
const dotenv = require('dotenv')
const {connect} = require("mongoose");

dotenv.config({
    path: './.env'
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {}).then(() => {
    console.log('DB connexion successfull');
}).catch((error) => {
    console.log(`Error: ${error}`)
});

// STARTING SERVER
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
}); 