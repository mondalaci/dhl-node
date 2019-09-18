#!/usr/bin/env node
const fs = require('fs');
const format = require('xml-formatter');
const auth = require('./auth');
const dhl = require('./index');

const req = {
    ClientDetail: {
    },
    RequestedShipment: {
        DropOffType: 'REQUEST_COURIER',
        Ship: {
            Shipper: {
                StreetLines: '1-16-24, Minami-gyotoku',
                City: 'Ichikawa-shi, Chiba',
                PostalCode: '272-0138',
                CountryCode: 'JP',
            },
            Recipient: {
                StreetLines: '63 RENMIN LU, QINGDAO SHI',
                City: 'QINGDAO SHI',
                PostalCode: '266033',
                CountryCode: 'CN',
            },
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1,
                },
                Weight: {
                    Value: 2,
                },
                Dimensions: {
                    Length: 13,
                    Width: 12,
                    Height: 9,
                },
            },
        },
        ShipTimestamp: dhl.getIsoDateTimeGmt(),
        UnitOfMeasurement: 'SU',
        Content: 'NON_DOCUMENTS',
        DeclaredValue: 200,
        DeclaredValueCurrecyCode: 'USD',
        PaymentInfo: 'DDP',
        Account: auth.accountNumber,
    },
};

(async function() {
    const res = await dhl.testRateRequest(auth, req);
    console.log(JSON.stringify(res.response, null, 4));
    fs.writeFileSync('rateRequest.response.xml', res.responseXml);
    fs.writeFileSync('rateRequest.request.xml', format(res.requestXml));
})();
