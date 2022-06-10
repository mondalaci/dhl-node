#!/usr/bin/env node
import fs from 'node:fs';
import format from 'xml-formatter';
import auth from './auth.js';
import {getIsoDateTime, getMessageReference, trackingRequest} from './index.js';

const req = {
    trackingRequest: {
        TrackingRequest: {
            Request: {
                ServiceHeader: {
                    MessageTime: getIsoDateTime(),
                    MessageReference: getMessageReference(),
                },
            },
            AWBNumber: {
                ArrayOfAWBNumberItem: [3898464710],
            },
            LevelOfDetails: 'ALL_CHECK_POINTS',
            PiecesEnabled: 'B',
        },
    },
};

const res = await trackingRequest(auth, req);
console.log(JSON.stringify(res.response, null, 4));
fs.writeFileSync('trackingRequest.response.xml', res.responseXml);
fs.writeFileSync('trackingRequest.request.xml', format(res.requestXml));
