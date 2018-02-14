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
    RequestedShipment: {
        ShipmentInfo: {
            DropOffType: 'REQUEST_COURIER',
            ServiceType: 'Q',
            Account: auth.accountNumber,
            Currency: 'EUR',
            UnitOfMeasurement: 'SI',
            PackagesCount: 1,
            LabelType: 'PDF',
            LabelTemplate: 'ECOM26_84_001'
        },
        ShipTimestamp: '2018-02-15T09:30:47GMT+01:00',
        PickupLocationCloseTime: '16:12',
        SpecialPickupInstruction: 'fragile items',
        PickupLocation: 'west wing 3rd Floor',
        PaymentInfo: 'DDP',
        InternationalDetail: {
            Commodities: {
                NumberOfPieces: 1,
                Description: 'ppps sd',
                CountryOfManufacture: 'CZ',
                Quantity: 1,
                UnitPrice: 10,
                CustomsValue: 1,
            },
            Content: 'NON_DOCUMENTS',
        },
        Ship: {
            Shipper: {
                Contact: {
                    PersonName: 'John Smith',
                    CompanyName: 'DHL',
                    PhoneNumber: '003932423423',
                    EmailAddress: 'John.Smith@dhl.com',
                },
                Address: {
                    StreetLines: 'V Parku 2308/10',
                    City: 'Prague',
                    PostalCode: '14800',
                    CountryCode: 'CZ',
                }
            },
            Recipient: {
                Contact: {
                    PersonName: 'Jane Smith',
                    CompanyName: 'Deutsche Post DHL',
                    PhoneNumber: '004922832432423',
                    EmailAddress: 'Jane.Smith@dhl.de',
                },
                Address: {
                    StreetLines: 'Via Felice Matteucci 2',
                    City: 'Firenze',
                    PostalCode: '50127',
                    CountryCode: 'IT',
                }
            }
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1
                },
                InsuredValue: 10,
                Weight: 9,
                Dimensions: {
                    Length: 46,
                    Width: 34,
                    Height: 31,
                },
                CustomerReferences: 'TEST CZ-IT'
            }
        }
    },
};

soap.createClient(url, function(err, client) {
    let wsSecurity = new soap.WSSecurity(auth.username, auth.password)
    client.setSecurity(wsSecurity);

    client.on('response', response => {
        fs.writeFileSync('shipmentRequest.response.xml', response);
    });

    client.createShipmentRequest(args, function(err, response) {
        console.log(JSON.stringify(response, null, 4));
    });

    fs.writeFileSync('shipmentRequest.request.xml', format(client.lastRequest));
});
