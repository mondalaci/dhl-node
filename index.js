const fs = require('fs');
const soap = require('soap');
const format = require('xml-formatter');
const lookup = require('country-data').lookup;

module.exports = {
    shippingRequest: function(url, auth, req) {
        return new Promise((resolve, reject) => {
            const res = {};
            soap.createClient(url, function(err, client) {
                if (auth.username === undefined) {
                    reject('No username specified');
                }

                if (auth.password === undefined) {
                    reject('No password specified');
                }

                const wsSecurity = new soap.WSSecurity(auth.username, auth.password)
                client.setSecurity(wsSecurity);

                client.on('response', responseXml => {
                    res.responseXml = responseXml;
                });

                client.createShipmentRequest(req, function(err, response) {
                    if (err) {
                        reject(err);
                    }
                    res.response = response;
                    resolve(res);
                });

                res.requestXml = format(client.lastRequest);
            });
        });
    },
    getIsoDateTime: function() {
        return (new Date).toISOString();
    },
    getMessageReference: function() {
        return Array(32).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
    },
    countryToCode: function(country) {
        return lookup.countries({name: 'France'})[0].alpha2;
    }
};
