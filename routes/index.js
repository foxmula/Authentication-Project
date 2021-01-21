const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'))

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        name: req.user.name
    }))

router.get('/hidden', ensureAuthenticated, (req, res) =>
    res.render('hidden', {
        name: req.user.name
    }))
module.exports = router;

    