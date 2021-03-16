const { default: AdminBro } = require('admin-bro');
const { buildAuthenticatedRouter, buildRouter } = require('@admin-bro/express');
const express = require('express');
const argon2 = require('argon2');

require("dotenv").config()

const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const { User } = require('./users/userModel');

const buildAdminRouter = (admin) => {

    const router = buildAuthenticatedRouter(admin, {


        cookieName: 'ntd-app',
        cookiePassword: process.env.COOKIE_PASSWORD || "secret local development passphrase",
        

        authenticate: async (email, password) => {

            const user = await User.findOne({email});

            if (user && await argon2.verify(user.encryptedPassword, password)){
                return user.toJSON()
            }
            return null;
        },
    }, null, {
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    }
    
    )
    return router;
}

module.exports = buildAdminRouter;