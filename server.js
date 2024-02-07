const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

const app = require('./app');
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