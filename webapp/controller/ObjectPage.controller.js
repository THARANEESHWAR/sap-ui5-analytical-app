sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], function (Controller, JSONModel, formatter) {
    "use strict";

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.ObjectPage", {
        formatter: formatter,

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("objectPage").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sId = oEvent.getParameter("arguments").id;
            this._loadRecord(sId);
        },

        _loadRecord: function (sId) {
            var oModel = new JSONModel();
            oModel.loadData("data/mockData.json");
            oModel.attachRequestCompleted(function () {
                var aSales = oModel.getData().sales || [];
                var oRecord = aSales.find(function (item) { return String(item.id) === String(sId); }) || {};
                var oViewModel = new JSONModel({ record: oRecord });
                this.getView().setModel(oViewModel);
            }.bind(this));
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("listReport");
        }
    });
});
