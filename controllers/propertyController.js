const Property = require('../models/propertyModel')
const APIFeatures = require('../utils/APIFeatures')
const catchAsync = require('../utils/catchAsync')


module.exports.aliasTopRated = (req,res,next)=> {
    req._query = {
        ...req.query,
        limit: '5',
        sort: '-rating',
        fields: 'title,price,area,rating,reviewsCount'
    }

    next()
}

module.exports.getAllProperties = catchAsync(async (req,res,next)=> {
        const features = new APIFeatures(Property.find(), req._query || req.query).filter().sort().limitFields().paginate()
        const properties = await features.query;
        res.status(200).json({
            status: 'success',
            results: properties.length,
            data: {
                properties
            }
        })
})

module.exports.getProperty = catchAsync(async (req,res,next)=> {
        const property = await Property.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                property
            }
        })
})


module.exports.addProperty =catchAsync(async (req,res,next)=> {
    const newProperty = await Property.create(req.body)
    res.status(200).json({
        status: 'success',
        data: {
            newProperty
        }
    })
})

module.exports.updateProperty = catchAsync(async (req,res,next)=> {
        const newProperty = await Property.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        })
        res.status(200).json({
            statis: 'success',
            data: {
                newProperty
            }
        })
})

module.exports.deleteProperty = catchAsync(async (req,res,next)=> {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        })
})


