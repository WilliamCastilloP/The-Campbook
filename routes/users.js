const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapper = require('../helpers/wrapper');
const { registerForm, register, loginForm, login, logout } = require('../controllers/users');


router.route('/register')
    .get(registerForm)
    .post(wrapper(register))

router.route('/login')
    .get(loginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), login)

router.get('/logout', logout)

module.exports = router;