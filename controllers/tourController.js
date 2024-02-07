const {Tour} = require('./../models/tourModel');

function getAllTours(req, res) {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        /*results: tours.length,
        data: {
            tours
        },*/
    })
}

function getTour(req, res) {
    const id = req.params.id * 1;

    /*const tour = tours.find((el) => el.id === id)

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    })*/
}

async function createTour(req, res) {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: `Invalid data sent: ${error}`
        })
    }
}

function updateTour(req, res) {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    })
}

function deleteTour(req, res) {
    res.status(204).json({
        status: 'success',
        data: null
    })
}

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour
}