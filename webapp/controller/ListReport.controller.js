sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "../model/formatter"
], function (Controller, JSONModel, Filter, FilterOperator, BusyIndicator, formatter) {
    "use strict";

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.ListReport", {
        formatter: formatter,

        onInit: function () {
            this._oRawData = null;

            // Load mock data from JSON file
            var oModel = new JSONModel();
            oModel.loadData("data/mockData.json");
            oModel.attachRequestCompleted(function () {
                this._oRawData = oModel.getData();
                this._initViewModel();
            }.bind(this));
        },

        _initViewModel: function () {
            var aAllSales = (this._oRawData && this._oRawData.sales) || [];
            var aRegions = (this._oRawData && this._oRawData.regions) || [];
            var aProducts = (this._oRawData && this._oRawData.products) || [];

            var oViewModel = new JSONModel({
                sales: aAllSales,
                allSales: aAllSales,
                regions: aRegions,
                products: aProducts,
                selectedRegions: [],
                selectedProducts: [],
                dateFrom: null,
                dateTo: null,
                kpiTotalSales: this._formatCurrency(this._sumAmount(aAllSales)),
                kpiTotalOrders: aAllSales.length.toLocaleString("en-US"),
                kpiAvgOrderValue: this._formatCurrency(
                    aAllSales.length ? Math.round(this._sumAmount(aAllSales) / aAllSales.length) : 0
                ),
                kpiCustomerCount: this._countUnique(aAllSales, "customer").toLocaleString("en-US"),
                kpiTotalSalesTrend: "+12.5%",
                kpiTotalOrdersTrend: "+8.3%",
                kpiAvgOrderValueTrend: "+4.1%",
                kpiCustomerCountTrend: "+15.2%"
            });
            this.getView().setModel(oViewModel);
        },

        _sumAmount: function (aSales) {
            return aSales.reduce(function (sum, item) { return sum + (item.amount || 0); }, 0);
        },

        _countUnique: function (aSales, sField) {
            return new Set(aSales.map(function (item) { return item[sField]; })).size;
        },

        _formatCurrency: function (nValue) {
            return "$" + nValue.toLocaleString("en-US");
        },

        _applyFilters: function () {
            var oModel = this.getView().getModel();
            if (!oModel) { return; }

            var aAllSales = oModel.getProperty("/allSales") || [];
            var aSelectedRegions = oModel.getProperty("/selectedRegions") || [];
            var aSelectedProducts = oModel.getProperty("/selectedProducts") || [];
            var sSearch = this._sSearch || "";

            var aFiltered = aAllSales.filter(function (item) {
                var bRegion = !aSelectedRegions.length || aSelectedRegions.indexOf(item.region) !== -1;
                var bProduct = !aSelectedProducts.length || aSelectedProducts.indexOf(item.product) !== -1;
                var bSearch = !sSearch || [item.region, item.product, item.customer, item.salesRep, item.status]
                    .some(function (v) { return v && v.toLowerCase().indexOf(sSearch.toLowerCase()) !== -1; });
                return bRegion && bProduct && bSearch;
            });

            oModel.setProperty("/sales", aFiltered);
            oModel.setProperty("/kpiTotalSales", this._formatCurrency(this._sumAmount(aFiltered)));
            oModel.setProperty("/kpiTotalOrders", aFiltered.length.toLocaleString("en-US"));
            oModel.setProperty("/kpiAvgOrderValue", this._formatCurrency(
                aFiltered.length ? Math.round(this._sumAmount(aFiltered) / aFiltered.length) : 0
            ));
            oModel.setProperty("/kpiCustomerCount", this._countUnique(aFiltered, "customer").toLocaleString("en-US"));
        },

        onRefresh: function () {
            BusyIndicator.show(0);
            setTimeout(function () {
                this._applyFilters();
                BusyIndicator.hide();
            }.bind(this), 500);
        },

        onNavigateToAnalytics: function () {
            this.getOwnerComponent().getRouter().navTo("analyticalListPage");
        },

        onFilterChange: function () {
            this._applyFilters();
        },

        onSearch: function (oEvent) {
            this._sSearch = oEvent.getParameter("query") || oEvent.getSource().getValue();
            this._applyFilters();
        },

        onExport: function () {
            var oModel = this.getView().getModel();
            var aSales = oModel ? oModel.getProperty("/sales") : [];
            var csvEscape = function (val) {
                var s = String(val === undefined || val === null ? "" : val);
                if (s.indexOf(",") !== -1 || s.indexOf('"') !== -1 || s.indexOf("\n") !== -1) {
                    return '"' + s.replace(/"/g, '""') + '"';
                }
                return s;
            };
            var sHeader = "ID,Date,Region,Product,Category,Quantity,Amount,Status,Sales Rep,Customer\n";
            var sRows = aSales.map(function (item) {
                return [item.id, item.date, item.region, item.product, item.category,
                        item.quantity, item.amount, item.status, item.salesRep, item.customer]
                    .map(csvEscape).join(",");
            }).join("\n");
            var sCSV = sHeader + sRows;
            var oBlob = new Blob([sCSV], { type: "text/csv;charset=utf-8;" });
            var sUrl = URL.createObjectURL(oBlob);
            var oLink = document.createElement("a");
            oLink.href = sUrl;
            oLink.download = "sales_data.csv";
            oLink.click();
            URL.revokeObjectURL(sUrl);
        },

        onColumnSettings: function () {
            var oTable = this.byId("salesTable");
            if (oTable) {
                sap.m.MessageToast.show("Column settings: " + oTable.getColumns().length + " columns available");
            }
        },

        onItemPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oCtx = oItem.getBindingContext();
            var sId = oCtx.getProperty("id");
            this.getOwnerComponent().getRouter().navTo("objectPage", { id: sId });
        }
    });
});
