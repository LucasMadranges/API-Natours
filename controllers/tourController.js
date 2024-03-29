const {Tour} = require('./../models/tourModel');
const {query} = require("express");
const {APIFeatures} = require('./../utils/apiFeatures')

function aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

async function getAllTours(req, res) {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().paginate();
        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            },
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: `Invalid data receive: ${error}`
        })
    }
}

async function getTour(req, res) {
    try {
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: `Invalid data receive: ${error}`
        })
    }
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

async function updateTour(req, res) {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: `Invalid data update: ${error}`
        })
    }
}

async function deleteTour(req, res) {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: `Invalid data delete: ${error}`
        })
    }
}

async function getTourStats(req, res) {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: {$toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {avgPrice: 1}
            },
            /*{
                $match: {_id: {$ne: 'EASY'}}
            }*/
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: `Invalid data received stats: ${error}`
        })
    }
}

async function getMonthlyPlan(req, res) {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0,
                }
            },
            {
                $sort: {numTourStarts: -1}
            },
            /*{
                $limit: 6
            }*/
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: `Invalid data received monthly: ${error}`
        })
    }
}

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
}