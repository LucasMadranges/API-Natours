const app = require('./app');

// STARTING SERVER
const port = 8000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});