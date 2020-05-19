const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const shortId = require('shortid')


// signup


// exports.signup = (req, res) => {
//     // console.log('REQ BODY ON SIGNUP', req.body);
//     const { name, email, password } = req.body;

//     User.findOne({ email }).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: 'Este Email ya esta en registrado'
//             });
//         }
//     });

//     let newUser = new User({ name, email, password });

//     newUser.save((err, success) => {
//         if (err) {
//             console.log('SIGNUP ERROR', err);
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json({
//             message: 'Registro Completado! Ya puedes iniciar Sesión'
//         });
//     });
// };


exports.signup = (req, res) => {
    // console.log(req.body);
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Este E-mail ya esta en uso.'
            });
        }

        const { name, email, password } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;

        let newUser = new User({ name, email, password, profile, username });
        newUser.save((err, success) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            // res.json({
            //     user: success
            // });
            res.json({
                message: 'Registro Completado!, Porfavor inicia Sesion'
            });
        });
    });
};


// Sign in


exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Usuario con ese email no existe porfavor REGISTRATE'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'El E-mail y la contraseña no coinciden!'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id,username,name, email, role } = user;

        return res.json({
            token,
            user: { _id,username,name, email, role }
        });
    });
};

/// signout

exports.signout = (req,res) => {
    res.clearCookie('token');
    res.json({
        message: 'Haz Salido de la Sesión'
    })
}



/// little helpers

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET // req.user._id
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};


exports.adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};


/// auth middlewares

exports.authMiddlewares = (req,res,next) => {
    const authUserId = req.user._id;
    User.findById({_id: authUserId}).exec((err,user) => {
        if (err || !user) {
            return res.status(400).json({
                error:'Usuario no encontrado!'
            })
        } 
        req.profile = user
        next()
    })
}
// admin Middleware

exports.adminMiddlewares = (req,res,next) => {
    const adminUserId = req.user._id;
    User.findById({_id: adminUserId}).exec((err,user) => {
        if (err || !user) {
            return res.status(400).json({
                error:'Usuario no encontrado!'
            })
        } 
        if(user.role !== 1){
            return res.status(400).json({
                error:'Recursos de administrador. Acceso Negado'
            })
        }
        req.profile = user
        next()
    })
}

