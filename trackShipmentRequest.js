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

let url = 'https://wsbexpress.dhl.com/sndpt/glDHLExpressTrack?WSDL';

let args = {
    trackingRequest: {
        TrackingRequest: {
            Request: {
                ServiceHeader: {
                    MessageTime: getIsoDateTime(),
                    MessageReference: getMessageReference()
                }
            },
            AWBNumber: {
                ArrayOfAWBNumberItem: [3898464710]
            },
            LevelOfDetails: 'ALL_CHECK_POINTS',
            PiecesEnabled: 'B'
        }
    }
};

soap.createClient(url, function(err, client) {
    let wsSecurity = new soap.WSSecurity(auth.username, auth.password)
    client.setSecurity(wsSecurity);

    client.on('response', response => {
        fs.writeFileSync('trackShipmentRequest.response.xml', response);
    });

    client.trackShipmentRequest(args, function(err, response) {
        console.log(JSON.stringify(response, null, 4));
    });

    fs.writeFileSync('trackShipmentRequest.request.xml', format(client.lastRequest));
});
