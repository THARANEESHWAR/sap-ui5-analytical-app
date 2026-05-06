sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter"
], function (Controller, JSONModel, formatter) {
    "use strict";

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.AnalyticalListPage", {
        formatter: formatter,

        onInit: function () {
            var oModel = new JSONModel({
                varianceData: [
                    { metric: "Total Sales", actual: "$1,234,567", target: "$1,100,000", variance: "$134,567", variancePercent: "+12.2%", status: "Above Target", statusState: "Success" },
                    { metric: "Total Orders", actual: "2,456", target: "2,300", variance: "156", variancePercent: "+6.8%", status: "Above Target", statusState: "Success" },
                    { metric: "Avg Order Value", actual: "$502", target: "$478", variance: "$24", variancePercent: "+5.0%", status: "Above Target", statusState: "Success" },
                    { metric: "Customer Retention", actual: "94%", target: "95%", variance: "-1%", variancePercent: "-1.1%", status: "Below Target", statusState: "Warning" }
                ]
            });
            this.getView().setModel(oModel);
            this._loadCharts();
        },

        _loadCharts: function () {
            // Charts will be rendered here
            // This is a placeholder for chart rendering logic
        },

        onRefresh: function () {
            this.getView().getModel().refresh();
        },

        onNavigateToList: function () {
            this.getOwnerComponent().getRouter().navTo("listReport");
        }
    });
});
