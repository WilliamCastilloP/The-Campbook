const express = require('express');
const router = express.Router();
const wrapper = require('../helpers/wrapper.js')
const { authenticate } = require('passport');
const { isLoggedIn, isOwner, validateCamp } = require('../middleware');
const { index, newForm, create, show, editForm, update, destroy, searchMap } = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/thecampbook', (req, res) => {
    res.render('home');
});

router.route('/')
    .get(wrapper(index))
    .post(
        isLoggedIn,
        upload.array('image'), 
        validateCamp, 
        wrapper(create)
    );

router.get('/new', 
    isLoggedIn, 
    newForm 
);

router.route('/:id')
    .get(wrapper(show))
    .put(
        isLoggedIn, 
        isOwner, 
        upload.array('image'),
        validateCamp, 
        wrapper(update)
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapper(destroy)
    );

router.get('/:id/edit', 
    isLoggedIn, 
    isOwner, 
    wrapper(editForm)
);

module.exports = router;