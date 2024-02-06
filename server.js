const mongoose = require('mongoose')
const app = require('./app');
const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connexion successfull');
});

// STARTING SERVER
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});