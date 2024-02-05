const express = require('express');
const fs = require("fs");
const morgan = require("morgan");

const app = express();
const port = 8000;

// MIDDLEWARES
app.use(morgan('dev'))
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// ROUTE HANDLERS
function getAllTours(req, res) {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        },
    })
}

function getTour(req, res) {
    const id = req.params.id * 1;

    const tour = tours.find((el) => el.id === id)

    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    })
}

function createTour(req, res) {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body)

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            }
        })
    })
}

function updateTour(req, res) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

function deleteTour(req, res) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID',
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

function getAllUsers(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

function createUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

function getuser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

function updateUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

function deleteUser(req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

// ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour)
// Same as :
// app.get("/api/v1/tours", getAllTours)
// app.post('/api/v1/tours', createTour)

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour)
// Same as :
// app.get("/api/v1/tours/:id", getTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

app.route('/api/v1/users').get(getAllUsers).post(createUser)

app.route('/api/v1/users/:id').get(getuser).patch(updateUser).delete(deleteUser)

// STARTING SERVER
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});