sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createODataModel: function (sServiceUrl) {
            var oModel = new sap.ui.model.odata.v4.ODataModel({
                serviceUrl: sServiceUrl,
                synchronizationMode: "None",
                operationMode: "Server"
            });
            return oModel;
        }
    };
});
