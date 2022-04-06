import jwt from 'jsonwebtoken';
import config from '../configs/config.js';

function auth(req, res, next){
    let token = req.get('token');
    if(!token) {
        res.json({msg: 'token not provided'})
    }
   
    const decoded = jwt.verify(token, 'secretkey');

    if(!decoded.login === config.ADMIN) {
        res.json({msg: 'not correct token provided'})
    }
    else {
        next()
    }
}

export default auth;