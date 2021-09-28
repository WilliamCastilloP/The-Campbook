const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
   useNewUrlParser:true,
   useCreateIndex:true,
   useUnifiedTopology:true 
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
    console.log('Database Connected!')
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB  = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60240f00433576bbddeeab3d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price,
            geometry: {
              type:'Point',
              coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/dpr59qtfp/image/upload/v1618882801/Yelpcamp/rswrnhabjklag4vvnyoc.jpg',
                  filename: 'Yelpcamp/rswrnhabjklag4vvnyoc'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})