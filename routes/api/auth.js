const express = require('express')
const bcrypt = require('bcryptjs')
var cookie = require('cookie-parser')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')

// getting setting
const settings = require('../../config/settings')

const router = express.Router()

const Person = require('./../../models/shipwreck')

router.use(cookie())

// Route to register a user. URL : /api/auth/register
router.post('/data', async (req, res) => {
    try {
      const { recrd, vesslterms, feature_type, chart, latdec, londec, gp_quality, depth, sounding_type, history, quasou, watlev, coordinates, password } = req.body;
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newShipwreck = new Shipwreck({
        recrd,
        vesslterms,
        feature_type,
        chart,
        latdec,
        londec,
        gp_quality,
        depth,
        sounding_type,
        history,
        quasou,
        watlev,
        coordinates,
        password: hashedPassword
      });
  
      await newShipwreck.save();
      res.status(201).send(newShipwreck);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });
// Route to login a user. URL : /api/auth/login
router.post('/login', (req, res) => {
    username = req.body.username
    password = req.body.password // 123456

    // check if username is already in collection.
    Person
        .findOne({username: req.body.username})
        .then(person => {
            if (person) {
                // compare the password
                bcrypt
                    .compare(password, person.password)
                    .then(
                        (isCompared) => {
                            if(isCompared) {
                                // res.cookie('session_id', '123')
                                // res.send('Login Success')
                                
                                // generate JWT
                                const payload = {
                                    id: person.id, 
                                    name: person.name,
                                    username: person.username
                                }
                                
                                // jsonwebtoken method used to create token.
                                jsonwt.sign(
                                    payload,
                                    settings.secret,
                                    {expiresIn: 3600},
                                    (err, token) => {
                                        console.log(err)
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token
                                        })
                                    }
                                )
                            }
                            else {
                                res.status(401).send('Password is not correct')
                            }
                        }
                    )
                    .catch()
            } else {
                res.status(400).send('Username is not there.')
            }
        })

})

// function validateCookie(req, res, next) {
//     const {cookies} = req;

//     if('session_id' in cookies) {
//         if(cookies.session_id == 123) {
//             next()
//         }else{
//             res.status(403).send('Not Authorized')
//         }
//     }
// }

// Private route to get all user details
router.get(
    '/get',
    passport.authenticate('jwt', { session: false }), // middleware from passport-jwt
    async(req, res) => {
    let people_un = []
    const cursor = await Person.find()
    cursor.forEach((person) => {
        people_un.push(person.username)
    })
    res.send(people_un)
})

module.exports = router