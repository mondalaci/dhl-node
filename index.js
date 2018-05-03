const fs = require('fs');
const soap = require('soap');
const format = require('xml-formatter');
const lookup = require('country-data').lookup;

function wsdlRequest(wsdlUrl, method, auth, req) {
    return new Promise((resolve, reject) => {
        const res = {};
        soap.createClient(wsdlUrl, function(err, client) {
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

            client[method](req, function(err, response) {
                if (err) {
                    reject(err);
                }
                res.response = response;
                resolve(res);
            });

            res.requestXml = format(client.lastRequest);
        });
    });
}

module.exports = {
    rateRequest: function(wsdlUrl, auth, req) {
        return wsdlRequest(wsdlUrl, 'getRateRequest', auth, req);
    },
    shippingRequest: function(wsdlUrl, auth, req) {
        return wsdlRequest(wsdlUrl, 'createShipmentRequest', auth, req);
    },
    trackingRequest: function(wsdlUrl, auth, req) {
        return wsdlRequest(wsdlUrl, 'trackShipmentRequest', auth, req);
    },
    getIsoDateTime: function() {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const offsetAbs = Math.abs(offset);
        const offsetSign = offset / offsetAbs;
        const offsetSignChar = offsetSign < 0 ? '-' : '+';
        const offsetHoursAbs = Math.floor(offsetAbs / 60);
        const offsetHoursSigned = offsetSign * offsetHoursAbs;
        const offsetMinutesAbs = offsetAbs % 60;
        return `${d.getUTCFullYear()}-\
${(d.getUTCMonth()+1).toString().padStart(2, 0)}-\
${d.getUTCDate().toString().padStart(2,0)}T\
${d.getUTCHours().toString().padStart(2,0)}:\
${d.getUTCMinutes().toString().padStart(2,0)}:\
${d.getUTCSeconds().toString().padStart(2,0)}GMT\
${offsetSignChar}\
${offsetHoursAbs.toString().padStart(2,0)}:\
${offsetMinutesAbs.toString().padStart(2,0)}`;
    },
    getMessageReference: function() {
        return Array(32).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
    },
    countryToCode: function(country) {
        return lookup.countries({name: country})[0].alpha2;
    }
};
