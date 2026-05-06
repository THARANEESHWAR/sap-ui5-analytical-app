sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "../model/formatter"
], function (Controller, JSONModel, BusyIndicator, formatter) {
    "use strict";

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.ListReport", {
        formatter: formatter,

        onInit: function () {
            var oModel = new JSONModel({
                sales: [
                    { date: "2025-05-01", region: "North", product: "Product A", quantity: 100, amount: "$10,000", status: "Completed", statusState: "Success" },
                    { date: "2025-05-02", region: "South", product: "Product B", quantity: 80, amount: "$8,500", status: "Completed", statusState: "Success" },
                    { date: "2025-05-03", region: "East", product: "Product C", quantity: 120, amount: "$14,000", status: "Pending", statusState: "Warning" },
                    { date: "2025-05-04", region: "West", product: "Product A", quantity: 90, amount: "$9,500", status: "Completed", statusState: "Success" },
                    { date: "2025-05-05", region: "North", product: "Product D", quantity: 110, amount: "$12,000", status: "Completed", statusState: "Success" }
                ],
                regions: [
                    { region: "North" },
                    { region: "South" },
                    { region: "East" },
                    { region: "West" }
                ],
                products: [
                    { product: "Product A" },
                    { product: "Product B" },
                    { product: "Product C" },
                    { product: "Product D" }
                ],
                selectedRegions: [],
                selectedProducts: [],
                dateFrom: new Date(2025, 4, 1),
                dateTo: new Date(2025, 4, 31)
            });
            this.getView().setModel(oModel);
        },

        onRefresh: function () {
            BusyIndicator.show(0);
            setTimeout(function () {
                BusyIndicator.hide();
                this.getView().getModel().refresh();
            }.bind(this), 1000);
        },

        onNavigateToAnalytics: function () {
            this.getOwnerComponent().getRouter().navTo("analyticalListPage");
        },

        onFilterChange: function () {
            // Apply filters to the data
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            // Implement search logic
        },

        onExport: function () {
            // Implement export to Excel functionality
        },

        onColumnSettings: function () {
            // Implement column customization
        }
    });
});
