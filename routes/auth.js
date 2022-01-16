const router = require('express').Router()
const bcrypt = require('bcryptjs');
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation/auth.validation')

// Validation 


router.post('/register', async(req, res) => {

    // Validate in here

    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //checking already email

    const emailExist = await User.findOne({ email: req.body.email })

    if (emailExist) return res.status(400).send({
        message: "Email alreadry Exist"
    })

    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const saveUser = await user.save()
        res.send({ user: user.__id })
    } catch (err) {
        res.status(400).send({
            message: err || "Some Error while try create data"
        })
    }
})

router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send({
        message: "Email Or Password Wrong"
    })

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('invalid Password')

    // create assign token

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: '20s'
    })
    res.header('auth-token', token).send(token)
        // res.send('Logged In')
})

module.exports = router