#!/usr/bin/env node
const fs = require('fs');
const format = require('xml-formatter');
const auth = require('./auth');
const dhl = require('./index');

const req = {
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
        ShipTimestamp: dhl.getIsoDateTimeGmt(),
        PickupLocationCloseTime: '23:59',
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

(async function() {
    const wsdlUrl = 'https://wsbexpress.dhl.com/sndpt/expressRateBook?WSDL';
    const res = await dhl.shippingRequest(wsdlUrl, auth, req);
    console.log(JSON.stringify(res.response, null, 4));
    fs.writeFileSync('shipmentRequest.request.xml', format(res.requestXml));
    fs.writeFileSync('shipmentRequest.response.xml', res.responseXml);
    const graphicImage = Buffer.from(res.response.LabelImage[0].GraphicImage, 'base64');
    fs.writeFileSync('shipmentRequest.response.pdf', graphicImage);
})();
