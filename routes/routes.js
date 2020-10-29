const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

const { ensureAuthenticated, forwardAuthenticated } = require('../auth.js');

router.get('/login', forwardAuthenticated, (req, res) => res.render('login/login.ejs'))
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    req.user.contacts.sort( compare );
    res.render('dashboard.ejs', { user: req.user })
}
)


router.post('/editcontact', ensureAuthenticated, (req, res) => {
  console.log(req.body)
    var obj = {name: req.body.name, phonenum: req.body.phone, email: req.body.email, id: parseInt( req.body.id)}


    User.updateOne({'_id' : req.user.id, "contacts.id": obj.id}, {"$set": {
        'contacts.$.name': obj.name,
        'contacts.$.phonenum': obj.phonenum,
        'contacts.$.email': obj.email,
    }}).then(e =>{

       console.log(e);
        res.redirect('/updatecontact')}).catch(err => console.log(err));

    });

router.get('/editcontact', ensureAuthenticated, (req, res) => {

res.render('editcontact.ejs', {contact: JSON.parse(req.query.data)});
})

router.post('/deletecontact', ensureAuthenticated, (req, res) => {
var phone = req.body.number;
User.update(
    { "_id" : req.user._id} ,
    { "$pull" : { "contacts" : { "phonenum" :  phone } } } ,
    { "multi" : false }
).then((d) => console.log(d)).catch(error => console.log(error))
res.redirect("/updatecontact")
})

router.get('/updatecontact', ensureAuthenticated, (req, res) => {


req.user.contacts.sort( compare );


    res.render('updation.ejs', { user: req.user })
});

router.get('/', (req, res) => {
    res.render('index.ejs', {'auth': req.isAuthenticated()});
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});


router.post('/login',  (req, res, next) => {


    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)

});

function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const name1 = a.name.toUpperCase();
    const name2 = b.name.toUpperCase();

    let comparison = 0;
    if (name1 > name2) {
      comparison = 1;
    } else if (name1 < name2) {
      comparison = -1;
    }
    return comparison;
  }

module.exports = router
