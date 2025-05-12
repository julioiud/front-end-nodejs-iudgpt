const { response, request } = require('express')
const oauth = require('oauth-sign');

const CONSUMER_KEY = process.env.CONSUMER_KEY; // Recibido del LMS
const CONSUMER_SECRET = process.env.CONSUMER_SECRET; // Recibido del LMS


const validarLti= (req = request, res = response, next) => {
    const consumerKey = "12984~6XM9LymryF49GuV8vceCEKDLFEMcuLXTERaK2KJYHxEyyDkTw7TzaLfTQUkRxF6X"

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
