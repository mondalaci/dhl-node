#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const soap = require('soap');
const format = require('xml-formatter');
const auth = require('./auth');

function getIsoDateTime() {
    return (new Date).toISOString();
}

function getMessageReference() {
    return Array(32).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
}

let url = 'https://wsbexpress.dhl.com/sndpt/expressRateBook?WSDL';

let args = {
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
                }
            },
            Packages: {
                RequestedPackages: {
                    attributes: {
                        number: '1',
                    },
                    Weight: {
                        Value: '2.0'
                    },
                    Dimensions: {
                        Length: '13',
                        Width: '12',
                        Height: '9'
                    }
                }
            },
            ShipTimestamp: '2018-02-14T12:00:00GMT-06:00',
            UnitOfMeasurement: 'SU',
            Content: 'NON_DOCUMENTS',
            DeclaredValue: '0000000200',
            DeclaredValueCurrecyCode: 'USD',
            PaymentInfo: 'DDP',
            Account: auth.accountNumber
        },
};

soap.createClient(url, function(err, client) {
    let wsSecurity = new soap.WSSecurity(auth.username, auth.password)
    client.setSecurity(wsSecurity);

    client.on('response', response => {
        fs.writeFileSync('rateRequest.response.xml', response);
    });

    console.log(client)
    client.getRateRequest(args, function(err, response) {
        console.log(JSON.stringify(response, null, 4));
    });

    fs.writeFileSync('rateRequest.request.xml', format(client.lastRequest));
});
