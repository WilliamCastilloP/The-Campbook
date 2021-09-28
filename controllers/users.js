const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return (err);
            req.flash('success', `Hi ${username}, Welcome to The Campbook!`);
            res.redirect('/campgrounds');
        }) 
    } catch (e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('users/login')
};

module.exports.login = (req, res) => {
    const {username} = req.body;
    req.flash('success', `Hey there ${username}, Welcome back`);
    const back = req.session.backTo || '/campgrounds';
    delete req.session.backTo;
    res.redirect(back);
};

module.exports.logout = (req, res) => {
    const {username} = req.user;
    req.logOut();
    req.flash('success', `See you soon ${username.toUpperCase()}`)
    res.redirect('/campgrounds');
};


