const {Tour} = require('./../models/tourModel');
const {query} = require("express");

function aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}

async function getAllTours(req, res) {
    try {
        // BUILD QUERY
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])

        // ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        let query = Tour.find(JSON.parse(queryStr));

        // SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // FIELDS LIMITING
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // PAGINATION
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 100;
        const skip = (page - 1) * limit;

        if (req.query.page) {
            const numTours = await Tour.countDocuments();

            if (skip >= numTours) throw new Error('This page does not exist');
        }

        query = query.skip(skip).limit(limit);

        // EXECUTE QUERY
        const tours = await query;

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

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours
}