const jwt = require('jsonwebtoken')

function JWTverify(req, res, next) {

    jwt.verify(req.params.token, 'priyanshu', (err, result) => {
        if (err) {
            res.json({
                message: 'invalid token'
            })
        } else {
            req.body = result
            next();

        }
    })
}
module.exports=JWTverify;