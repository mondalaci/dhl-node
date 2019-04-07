# dhl-node

A node client that implements DHL Express Global Web Services which is a SOAP API.

In specific, this client implements the RateRequest, ShipmentRequest, and TrackingRequest operations.

The ShipmentDeleteRequest and DocumentRetrieve operations are not implemented by this client, although they should be trivial to add based on the [API documentation](doc/DHL_Express_Global_Web_Services_-_Developer_Guide_V3.1.pdf).
