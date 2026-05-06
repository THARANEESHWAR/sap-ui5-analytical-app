sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/models"
], function (Controller, JSONModel, models) {
    "use strict";

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.App", {
        onInit: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            oRouter.attachRoutePatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("name");
            // Route-specific logic can be added here
        }
    });
});
