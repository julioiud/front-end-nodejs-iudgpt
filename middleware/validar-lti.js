const { response, request } = require('express')
const oauth = require('oauth-sign');

const CONSUMER_KEY = process.env.CONSUMER_KEY; // Recibido del LMS
const CONSUMER_SECRET = process.env.CONSUMER_SECRET; // Recibido del LMS


const validarLti= (req = request, res = response, next) => {
    const consumerKey = req.body.oauth_consumer_key

    if(!consumerKey) {
        res.status(422).send('Se esperada consumer Key');
        return;
    }
    const isValid = 
        consumerKey === CONSUMER_KEY
        //&& consumerSecret === consumer_secret

    if (!isValid) {
        res.status(400).send('Invalid LTI request');
        return;
    }
    next()
}

module.exports = {
    validarLti
}