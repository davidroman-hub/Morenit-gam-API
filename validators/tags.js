const { check } = require('express-validator');

exports.tagCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('El nombre es requerido')
]
