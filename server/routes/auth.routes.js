const Router = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const router = new Router();
const authMiddleware = require('../middleware/auth.middleware')
const dbCon = require("../services/dbCon")

router.post('/registration',
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 6').isLength({min:3, max:6})
    ],
    async (req, res) => {
        try {
            
            const errors = validationResult(req);
            if(!errors.isEmpty()) return res.status(404).json({message: 'Uncorrect request', errors})
            
            const {email, password} = req.body;

            //TODO заменить волженность
            dbCon.get('select 1 as userCreated from users u where u.email =  ?', email, async (err, result) => {
                if (err) console.log(err)
                else {
                    if(result) return res.status(400).json({message: `User with email ${email} already exist`});
                    else {
                        const hashPassword = await bcrypt.hash(password, 8);
                        dbCon.run('insert into users(email, password)  values(?, ?)', email, hashPassword, (err) => {
                            if (err) console.log(err)
                        })
                        return res.json({message: 'User was created'});
                    }
                }
            })

        } catch (error) {
            console.log(error)
            res.send({message: "server error"})
        }
});

router.post('/login', 
    [
        check('email', 'Uncorrect email').isEmail(),
        check('password', 'Password must be longer than 3 and shorter than 6').isLength({min:3, max:6})
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);

            if(!errors.isEmpty()) return res.status(404).json({message: 'Uncorrect email or password', errors})
 
            const {email, password} = req.body;

            //TODO заменить волженность
            dbCon.get('select u.user_id as user_id, u.password as password, u.email as email from users u where u.email =  ?', email, async (err, result) => {
                if (err) console.log(err)
                else {
                    if(result){
                        const isPassValid = bcrypt.compareSync(password, result.password);

                        if(isPassValid){
                            const token = jwt.sign({id: result.user_id}, config.get('secretKey'), {expiresIn: '1h'});
                            return res.json({
                                token,
                                user: {
                                    id: result.user_id,
                                    email: result.email
                                }
                            })
                        } 
                        return res.status(400).json({message: 'Invalid password'})
                    } else return res.status(404).json({message: `User not found`});
                }
            })    
            
        } catch (error) {
            console.log(error)
            res.send({message: "server error"})
        }
});

router.get('/auth', authMiddleware,
    async (req, res) => {

        try {

            //TODO заменить волженность 
            dbCon.get('select u.user_id as user_id, u.email as email from users u where u.user_id =  ?', req.user.id, async (err, result) => {
                if (err) console.log(err)
                else {
                    if(result){
                        const token = jwt.sign({id: result.user_id}, config.get("secretKey"), {expiresIn: "1h"})
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
            res.send({message: "Server error"})
        }
    })

module.exports = router;