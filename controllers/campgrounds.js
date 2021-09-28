const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeo= require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeo({ accessToken: mbxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});  
    res.render('campgrounds/index', { campgrounds });
};

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.create = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.camp.location,
        limit: 1
    }).send()
    const camp = new Campground(req.body.camp);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save(); 
    console.log(camp)
    req.flash('success', "Cool! You've created a new camp!");
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.show = async (req, res) => {
    const id = req.params.id;
    const camp = await (await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }
    }).populate('author'));
    if(!camp) {
        req.flash('error', 'This camp does not exist!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp });
};

module.exports.editForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
};

module.exports.update = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.camp.location,
        limit: 1
    }).send()
    const camp = await Campground.findByIdAndUpdate(req.params.id, {...req.body.camp});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }))
    camp.images.push(...imgs)
    camp.geometry = geoData.body.features[0].geometry;
    await camp.save();
if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({$pull: {images: {filename: {$in:req.body.deleteImages}}}});
console.log(camp)  
}

    req.flash('success', "All Right!! You've updated this camp.");
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.destroy = async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "You've deleted a camp.");
    res.redirect('/campgrounds')
};