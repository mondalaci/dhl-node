const soap = require('soap');
const format = require('xml-formatter');
const lookup = require('country-data').lookup;

async function wsdlRequest(wsdlUrl, method, auth, req) {
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

            let clientMethod = client[method];
            if (method === 'PickUpRequest') {
                clientMethod = clientMethod.euExpressRateBook_providerServices_PickUpRequest_Port.PickUpRequest;
            }

            clientMethod(req, function(err, response) {
                const requestXml = format(client.lastRequest).replace(auth.password, '**********');
                if (err) {
                    err.requestXml = requestXml;
                    reject(err);
                } else {
                    res.requestXml = requestXml;
                    res.response = response;
                    resolve(res);
                }
            });
        });
    });
}

const liveUrlPrefix = 'https://wsbexpress.dhl.com/gbl';
const testUrlPrefix = 'https://wsbexpress.dhl.com/sndpt';
const liveExpressRateBookUrl = `${liveUrlPrefix}/expressRateBook?WSDL`;
const testExpressRateBookUrl = `${testUrlPrefix}/expressRateBook?WSDL`;

module.exports = {
    rateRequest: async function(auth, req) {
        const res = await wsdlRequest(liveExpressRateBookUrl, 'getRateRequest', auth, req);
        return res;
    },
    requestPickup: async function(auth, req) {
        return await wsdlRequest(`${liveUrlPrefix}/requestPickup?WSDL`, 'PickUpRequest', auth, req);
    },
    shipmentRequest: async function(auth, req) {
        return await wsdlRequest(liveExpressRateBookUrl, 'createShipmentRequest', auth, req);
    },
    trackingRequest: async function(auth, req) {
        return await wsdlRequest(`${liveUrlPrefix}/glDHLExpressTrack?WSDL`, 'trackShipmentRequest', auth, req);
    },
    testRateRequest: async function(auth, req) {
        return await wsdlRequest(testExpressRateBookUrl, 'getRateRequest', auth, req);
    },
    testRequestPickup: async function(auth, req) {
        return await wsdlRequest(`${testUrlPrefix}/requestPickup?WSDL`, 'PickUpRequest', auth, req);
    },
    testShipmentRequest: async function(auth, req) {
        return await wsdlRequest(testExpressRateBookUrl, 'createShipmentRequest', auth, req);
    },
    testTrackingRequest: async function(auth, req) {
        return await wsdlRequest(`${testUrlPrefix}/glDHLExpressTrack?WSDL`, 'trackShipmentRequest', auth, req);
    },
    getIsoDateTime: function() {
        return (new Date).toISOString();
    },
    getIsoDateTimeGmt: function(dateParam) {
        const date = dateParam || new Date();
        const offset = date.getTimezoneOffset();
        const offsetAbs = Math.abs(offset);
        const offsetSign = offset / offsetAbs;
        const offsetSignChar = offsetSign < 0 ? '-' : '+';
        const offsetHoursAbs = Math.floor(offsetAbs / 60);
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
        if (country === 'Vietnam') {
            country = 'Viet Nam';
        }
        return lookup.countries({name: country})[0].alpha2;
    }
};
