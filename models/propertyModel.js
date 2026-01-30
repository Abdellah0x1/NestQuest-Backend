const mongoose = require('mongoose');



//mongoose schema

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Property must have a title'],
        maxlength: 40,
        trim: true,
    },
    type: {
        type: String,
        enum: ['sale', 'rent'],
        required: [true, 'Property must be for sale or rent']
    },
    bedrooms: {
        type: Number,
        requird: [true, 'Please specify bedrooms']
    },
    bathrooms: {
        type:Number,
        required: [true, 'please specify bathrooms']
    },
    area: {
        type: Number,
        required: [true, 'Please specify area size']
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [1 , 'rating must be above 1.0'],
        max: [5, 'rating must be below 5.0']
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Property must have a description'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'property must have a price'],
    },
    imageCover: {
        type: String,
        trim: true
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            required: [true, 'property must have coordinates']
        }
    }
},{
    toJSON: {virtuals:true}
}
)


propertySchema.virtual('pricePerSqM').get(function(){
    return Math.round(this.price/this.area)
})


const Property = mongoose.model('Property',propertySchema);

module.exports = Property;