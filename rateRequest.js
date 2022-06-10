#!/usr/bin/env node
import fs from 'node:fs';
import format from 'xml-formatter';
import auth from './auth.js';
import {getIsoDateTimeGmt, testRateRequest} from './index.js';

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
        ShipTimestamp: getIsoDateTimeGmt(),
        UnitOfMeasurement: 'SU',
        Content: 'NON_DOCUMENTS',
        DeclaredValue: 200,
        DeclaredValueCurrecyCode: 'USD',
        PaymentInfo: 'DDP',
        Account: auth.accountNumber,
    },
};

const res = await testRateRequest(auth, req);
console.log(JSON.stringify(res.response, null, 4));
fs.writeFileSync('rateRequest.response.xml', res.responseXml);
fs.writeFileSync('rateRequest.request.xml', format(res.requestXml));
