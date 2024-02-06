const app = require('./app');
const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

console.log(process.env)

// STARTING SERVER
const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});