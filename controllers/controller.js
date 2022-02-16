'use strict';

const properties = require('../package.json');
const userApi = require('../services/user');

var controllers = {
    about: (req, res) => {
        console.log("about");

        var aboutInfo = {
            name: properties.name,
            version: properties.version,
        };
        res.json(aboutInfo);
    },

    register: (req, res) => {
        console.log("register");
        userApi.register(req, res, (err, info) => {
            if (err)
                res.send(err);
            res.json(info);
        });
    },
};

module.exports = controllers;