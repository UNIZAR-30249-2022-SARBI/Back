'use strict';

const controller = require('../controllers/controller');

module.exports = (app) => {
    app.route('/about').get(controller.about);
    app.post('/register', controller.register);
};