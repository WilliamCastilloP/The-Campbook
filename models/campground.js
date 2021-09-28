const { func } = require('joi');
const mongoose = require('mongoose');
const {cloudinary} = require('../cloudinary');
const Review = require('./review')
const Schema = mongoose.Schema; 

const ImageSchema = new Schema({
        url: String,
        filename: String 
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema ({
    title: String,
    price: Number, 
    images: [ImageSchema],
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    description: String, 
    location: String,
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    likes: {
        type: Schema.Types.ObjectId, 
        ref: 'Like'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

CampgroundSchema.post('findOneAndDelete', async function(campground) {
    if (campground.images) {
      for (const img of campground.images) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }
  });
module.exports = mongoose.model('Campground', CampgroundSchema);

