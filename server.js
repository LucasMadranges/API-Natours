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

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
})
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Park Camper',
    price: 550,
})

testTour.save().then(doc => console.log(doc)).catch(error => console.log(error))

// STARTING SERVER
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
}); 