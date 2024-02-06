const app = require('./app');
const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

// STARTING SERVER
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});