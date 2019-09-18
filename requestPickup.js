#!/usr/bin/env node
const fs = require('fs');
const format = require('xml-formatter');
const auth = require('./auth');
const dhl = require('./index');

const req = {
    MessageId: 2364878234817650001982134234,
    PickUpShipment: {
        ShipmentInfo: {
            ServiceType:'U',
            Billing: {
                ShipperAccountNumber: 140582622,
                ShippingPaymentType: 'S',
            },
            UnitOfMeasurement: 'SI',
        },
        PickupTimestamp: '2019-09-26T12:59:00 GMT+01:00',
        PickupLocationCloseTime: '17:00',
        SpecialPickupInstruction: 'Collect at reception',
        PickupLocation: 'Receptoin',
        InternationalDetail: {
            Commodities: {
                NumberOfPieces: 1,
                Description: 'Computer Parts',
            }
        },
        Ship: {
            Shipper: {
                Contact: {
                    PersonName: 'Topaz',
                    CompanyName: 'DHL Express',
                    PhoneNumber: '+31 6 53464291',
                    EmailAddress: 'Topaz.Test@dhl.com',
                    MobilePhoneNumber: '+31 6 53464291',
                },
                Address: {
                    StreetLines: 'GloWS',
                    City: 'Eindhoven',
                    PostalCode: '5657 ES',
                    CountryCode: 'NL',
                }
            },
            Recipient: {
                Contact: {
                    PersonName: 'Jack Jones',
                    CompanyName: 'J and J Company',
                    PhoneNumber: '+44 25 77884444',
                    EmailAddress: 'jack@jjcompany.com',
                    MobilePhoneNumber: '+44 5 88648666',
                },
                Address: {
                    StreetLines: 'Penny lane',
                    City: 'Liverpool',
                    PostalCode: 'AA21 9AA',
                    CountryCode: 'GB',
                }
            }
        },
        Packages: {
            RequestedPackages: { // number="1">
                attributes: {
                    number: 1,
                },
                Weight: '12.0',
                Dimensions: {
                    Length: 70,
                    Width: 21,
                    Height: 44,
                },
                CustomerReferences: 'My-PU-Call-1',
            }
        }
    }
};

(async function() {
    const res = await dhl.testRequestPickup(auth, req);
    console.log(JSON.stringify(res.response, null, 4));
    fs.writeFileSync('requestPickup.request.xml', format(res.requestXml));
    fs.writeFileSync('requestPickup.response.xml', res.responseXml);
})();
