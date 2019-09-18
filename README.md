# dhl-node

A node client that implements the MyDHL API which is based on SOAP.

This client implements the `RateRequest`, `RequestPickup`, `ShipmentRequest`, and `TrackingRequest` requests. The related scripts of this repo allow you to easily test these requests, and adapt them to your needs.

See the [API documentation](doc/DHL_EXPRESS_MyDHL_API_-_Developer_Guide_-_v1.1.pdf) and the [valid values](doc/Reference_Data.xlsx) of various fields.

## Authentication

DHL provides a test account and a live account when giving access. Both of these accounts have an associated username, password, and an account number. You can copy `auth.sample.js` as `auth.js`, and replace its values with the actual values of your account to use the scripts of this repo.

Make sure to use the methods prefixed with `test` such as `testTrackingRequest()` when using your test credentials, and their prefixless version such as `trackingRequest()` when using your live credentials.
