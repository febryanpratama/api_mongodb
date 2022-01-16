const router = require('express').Router()
const User = require('../model/user')
const verify = require('./verifytoken')

router.get('/', verify, (req, res) => {
    res.send(req.user)
        // User.findByIdAndRemove({_id: req.user})
})

module.exports = router