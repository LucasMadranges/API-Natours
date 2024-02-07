const {Tour} = require('./../models/tourModel');
const {query} = require("express");

async function getAllTours(req, res) {
    try {
        // BUILD QUERY
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])
        const query = await Tour.find(queryObj);

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
    deleteTour
}