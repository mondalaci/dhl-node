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
    rateRequest: function(auth, req) {
        const wsdlUrl = 'https://wsbexpress.dhl.com:443/gbl/expressRateBook?WSDL';
        return wsdlRequest(wsdlUrl, 'getRateRequest', auth, req);
    },
    shipmentRequest: function(auth, req) {
        const wsdlUrl = 'https://wsbexpress.dhl.com:443/gbl/expressRateBook?WSDL';
        return wsdlRequest(wsdlUrl, 'createShipmentRequest', auth, req);
    },
    trackingRequest: function(auth, req) {
        const wsdlUrl = 'https://wsbexpress.dhl.com/sndpt/glDHLExpressTrack?WSDL';
        return wsdlRequest(wsdlUrl, 'trackShipmentRequest', auth, req);
    },
    testRateRequest: function(auth, req) {
        const wsdlUrl = 'https://wsbexpress.dhl.com/sndpt/expressRateBook?WSDL';
        return wsdlRequest(wsdlUrl, 'getRateRequest', auth, req);
    },
    testShipmentRequest: function(auth, req) {
        const wsdlUrl = 'https://wsbexpress.dhl.com/sndpt/expressRateBook?WSDL';
        return wsdlRequest(wsdlUrl, 'createShipmentRequest', auth, req);
    },
    getIsoDateTime: function() {
        return (new Date).toISOString();
    },
    getIsoDateTimeGmt: function() {
        const date = new Date();
        const offset = date.getTimezoneOffset();
        const offsetAbs = Math.abs(offset);
        const offsetSign = offset / offsetAbs;
        const offsetSignChar = offsetSign < 0 ? '-' : '+';
        const offsetHoursAbs = Math.floor(offsetAbs / 60);
        const offsetHoursSigned = offsetSign * offsetHoursAbs;
        const offsetMinutesAbs = offsetAbs % 60;
        return `${date.getUTCFullYear()}-\
${(date.getUTCMonth()+1).toString().padStart(2, 0)}-\
${date.getUTCDate().toString().padStart(2,0)}T\
${date.getUTCHours().toString().padStart(2,0)}:\
${date.getUTCMinutes().toString().padStart(2,0)}:\
${date.getUTCSeconds().toString().padStart(2,0)}GMT\
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
