# dhl-node

A node client that implements the MyDHL API which is based on SOAP.

See the [API documentation](doc/DHL_EXPRESS_MyDHL_API_-_Developer_Guide_-_v1.1.pdf) and the [valid values](doc/Reference_Data.xlsx) of various fields.

This client implements the `RateRequest`, `RequestPickup`, `ShipmentRequest`, and `TrackingRequest` requests. Run `npm i`, then run the scripts of these requests to test them.

## Authentication

DHL provides a test account and a live account when giving access. Both of these accounts have an associated username, password, and an account number. You can copy `auth.sample.js` as `auth.js`, and replace its values with the actual values of your test account to be able to use the scripts of this repo.
