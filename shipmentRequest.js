#!/usr/bin/env node
import fs from 'node:fs';
import format from 'xml-formatter';
import auth from './auth.js';
import {getIsoDateTimeGmt, testShipmentRequest} from './index.js';

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
            LabelTemplate: 'ECOM26_84_001',
        },
        ShipTimestamp: getIsoDateTimeGmt(),
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
            ExportDeclaration: {
                InvoiceDate: '2022-10-10',
                ExportLineItems: {
                    ExportLineItem: [
                        {
                            CommodityCode: '8471.60.2000',
                            ItemNumber: 1,
                            Quantity: 5,
                            QuantityUnitOfMeasurement: 'PCS',
                            ItemDescription: 'Item name',
                            UnitPrice: 10,
                            NetWeight: 1,
                            GrossWeight: 1,
                            ManufacturingCountryCode: 'HU',
                        },
                    ],
                },
                OtherCharges: {
                    OtherCharge: {
                        ChargeValue: 10,
                        ChargeType: 'DELIV',
                    },
                },
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
                },
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
                },
            },
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
                CustomerReferences: 'TEST CZ-IT',
            },
        },
    },
};

const res = await testShipmentRequest(auth, req);
console.log(JSON.stringify(res.response, null, 4));
fs.writeFileSync('shipmentRequest.request.xml', format(res.requestXml));
fs.writeFileSync('shipmentRequest.response.xml', res.responseXml);
const graphicImage = Buffer.from(res.response.LabelImage[0].GraphicImage, 'base64');
fs.writeFileSync('shipmentRequest.response.pdf', graphicImage);
