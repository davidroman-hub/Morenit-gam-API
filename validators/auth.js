const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('El nombre es requerido'),
    check('email')
        .isEmail()
        .withMessage('Necesita haber un E-mail Válido'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña necesita ser de almenos 6 caracteres')
];

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Necesita haber un E-mail Válido'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña necesita ser de almenos 6 caracteres')
];

exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Necesita haber un E-mail Válido'),
        
];

exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('La contraseña necesita ser de almenos 6 caracteres')
];

