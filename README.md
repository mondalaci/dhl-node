# dhl-node

A node client that implements DHL Express Global Web Services which is based on SOAP.

In specific, this client implements the `RateRequest`, `ShipmentRequest`, and `TrackingRequest` requests.

The `ShipmentDeleteRequest` and `DocumentRetrieve` requests are not implemented by this client, but they should be trivial to add based on the [API documentation](doc/DHL_Express_Global_Web_Services_-_Developer_Guide_V3.1.pdf).

You can also check out [Reference_Data.xlsx](doc/Reference_Data.xlsx) which is another DHL document that contains the valid values of various fields.
