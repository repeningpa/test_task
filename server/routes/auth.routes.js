const Router = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware')
const dbCon = require('../services/dbCon')

router.get('/auth', authMiddleware,
    async (req, res) => {

        try {

            //TODO заменить волженность 
            dbCon.get('select u.user_id as user_id, u.email as email from users u where u.user_id =  ?', req.user.id, async (err, result) => {
                if (err) console.log(err)
                else {
                    if(result){
                        const token = jwt.sign({id: result.user_id}, config.get('secretKey'), {expiresIn: '1h'})
                        return res.json({
                            token,
                            user: {
                                id: result.user_id,
                                email: result.email
                            }
                        })
                    } else return res.status(404).json({message: `User not found`});
                }
            })    


        } catch (e) {
            console.log(e)
            res.send({message: 'Server error'})
        }
    })

module.exports = router;