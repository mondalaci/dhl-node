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

const liveUrlPrefix = 'https://wsbexpress.dhl.com/gbl';
const testUrlPrefix = 'https://wsbexpress.dhl.com/sndpt';
const liveExpressRateBookUrl = `${liveUrlPrefix}/expressRateBook?WSDL`;
const testExpressRateBookUrl = `${testUrlPrefix}/expressRateBook?WSDL`;
const liveGlDhlExpressTrackUrl = `${liveUrlPrefix}/glDHLExpressTrack?WSDL`;
const testGlDhlExpressTrackUrl = `${testUrlPrefix}/glDHLExpressTrack?WSDL`;

module.exports = {
    rateRequest: function(auth, req) {
        return wsdlRequest(liveExpressRateBookUrl, 'getRateRequest', auth, req);
    },
    shipmentRequest: function(auth, req) {
        return wsdlRequest(liveExpressRateBookUrl, 'createShipmentRequest', auth, req);
    },
    trackingRequest: function(auth, req) {
        return wsdlRequest(liveGlDhlExpressTrackUrl, 'trackShipmentRequest', auth, req);
    },
    testRateRequest: function(auth, req) {
        return wsdlRequest(testExpressRateBookUrl, 'getRateRequest', auth, req);
    },
    testShipmentRequest: function(auth, req) {
        return wsdlRequest(testExpressRateBookUrl, 'createShipmentRequest', auth, req);
    },
    testTrackingRequest: function(auth, req) {
        return wsdlRequest(testGlDhlExpressTrackUrl, 'trackShipmentRequest', auth, req);
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
