#!/usr/bin/env node
const fs = require('fs');
const format = require('xml-formatter');
const auth = require('./auth');
const dhl = require('./index');

const req = {
    trackingRequest: {
        TrackingRequest: {
            Request: {
                ServiceHeader: {
                    MessageTime: dhl.getIsoDateTime(),
                    MessageReference: dhl.getMessageReference()
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

(async function() {
    const res = await dhl.trackingRequest(auth, req);
    console.log(JSON.stringify(res.response, null, 4));
    fs.writeFileSync('trackingRequest.response.xml', res.responseXml);
    fs.writeFileSync('trackingRequest.request.xml', format(res.requestXml));
})();
