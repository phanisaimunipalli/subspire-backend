const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const config = require('../config/config')
const request = require('request');

const downloadJwk =  (token) => {

    return new Promise((resolve, reject) => {

        request({ url: config.jwkUrl, json: true }, (error, response, body) => {

            if (!error && response.statusCode === 200) {

                resolve(body);

            } else {
                reject(error);
            }

        });

    });

}

//Verify token.
const verify = async (token) => {

    return new Promise((resolve, reject) => {

        //Download jwkt from aws.
        downloadJwk(token).then((body) => {

            let pems = {};
            let keys = body['keys'];

            for (let i = 0; i < keys.length; i++) {

                //Convert each key to PEM
                let key_id = keys[i].kid;
                let modulus = keys[i].n;
                let exponent = keys[i].e;
                let key_type = keys[i].kty;
                let jwk = { kty: key_type, n: modulus, e: exponent };
                let pem = jwkToPem(jwk);

                pems[key_id] = pem;

            }

            //validate the token
            let decodedJwt = jwt.decode(token, { complete: true });

            //If is not valid.
            if (!decodedJwt)
                resolve(false);

            let kid = decodedJwt.header.kid;
            let pem = pems[kid];

            if (!pem)
                resolve(false);

            jwt.verify(token, pem, (err, payload) => {

                if (err)
                    resolve(false);
                else
                    resolve(true);

            });

        }).catch((err) => {
            reject(false);
        })

    });

}

module.exports = {verify}
