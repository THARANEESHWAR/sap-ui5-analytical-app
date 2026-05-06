sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.Charts", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("charts").attachPatternMatched(this._onMatched, this);
        },

        _onMatched: function () {
            var oModel = new JSONModel();
            oModel.loadData("data/mockData.json");
            oModel.attachRequestCompleted(function () {
                var aAllSales = oModel.getData().sales || [];
                this._loadCharts(aAllSales);
            }.bind(this));
        },

        _groupBy: function (arr, key) {
            return arr.reduce(function (acc, item) {
                var k = item[key];
                if (!acc[k]) { acc[k] = []; }
                acc[k].push(item);
                return acc;
            }, {});
        },

        _sumSales: function (items) {
            return items.reduce(function (s, i) { return s + (i.amount || 0); }, 0);
        },

        _loadCharts: function (aAllSales) {
            sap.ui.require([
                "sap/viz/ui5/controls/VizFrame",
                "sap/viz/ui5/data/FlattenedDataset",
                "sap/viz/ui5/controls/common/feeds/FeedItem"
            ], function (VizFrame, FlattenedDataset, FeedItem) {
                this._renderCategoryBreakdown(aAllSales, VizFrame, FlattenedDataset, FeedItem);
                this._renderStatusBreakdown(aAllSales, VizFrame, FlattenedDataset, FeedItem);
                this._renderSalesRep(aAllSales, VizFrame, FlattenedDataset, FeedItem);
            }.bind(this));
        },

        _renderCategoryBreakdown: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            var oByCategory = this._groupBy(aAllSales, "category");
            var sumSales = this._sumSales.bind(this);
            var aData = Object.keys(oByCategory).map(function (c) {
                return { category: c, sales: sumSales(oByCategory[c]) };
            });

            var oVizFrame = new VizFrame({
                width: "100%", height: "380px", vizType: "pie",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Category", value: "{category}" }],
                    measures: [{ name: "Sales", value: "{sales}" }],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "size", type: "Measure", values: ["Sales"] }),
                    new FeedItem({ uid: "color", type: "Dimension", values: ["Category"] })
                ],
                vizProperties: { title: { text: "Sales by Category" }, plotArea: { dataLabel: { visible: true } } }
            });
            oVizFrame.setModel(new JSONModel(aData));
            var oContainer = this.byId("chartCategory");
            if (oContainer) { oContainer.removeAllItems(); oContainer.addItem(oVizFrame); }
        },

        _renderStatusBreakdown: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            var oByStatus = this._groupBy(aAllSales, "status");
            var aData = Object.keys(oByStatus).map(function (s) {
                return { status: s, count: oByStatus[s].length };
            });

            var oVizFrame = new VizFrame({
                width: "100%", height: "380px", vizType: "donut",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Status", value: "{status}" }],
                    measures: [{ name: "Count", value: "{count}" }],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "size", type: "Measure", values: ["Count"] }),
                    new FeedItem({ uid: "color", type: "Dimension", values: ["Status"] })
                ],
                vizProperties: { title: { text: "Orders by Status" }, plotArea: { dataLabel: { visible: true } } }
            });
            oVizFrame.setModel(new JSONModel(aData));
            var oContainer = this.byId("chartStatus");
            if (oContainer) { oContainer.removeAllItems(); oContainer.addItem(oVizFrame); }
        },

        _renderSalesRep: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            var oBySalesRep = this._groupBy(aAllSales, "salesRep");
            var sumSales = this._sumSales.bind(this);
            var aData = Object.keys(oBySalesRep).map(function (rep) {
                return {
                    salesRep: rep,
                    sales: sumSales(oBySalesRep[rep]),
                    orders: oBySalesRep[rep].length
                };
            }).sort(function (a, b) { return b.sales - a.sales; });

            var oVizFrame = new VizFrame({
                width: "100%", height: "380px", vizType: "bar",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Sales Rep", value: "{salesRep}" }],
                    measures: [{ name: "Sales", value: "{sales}" }, { name: "Orders", value: "{orders}" }],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "valueAxis", type: "Measure", values: ["Sales"] }),
                    new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Sales Rep"] })
                ],
                vizProperties: { title: { text: "Performance by Sales Rep" }, plotArea: { dataLabel: { visible: false } } }
            });
            oVizFrame.setModel(new JSONModel(aData));
            var oContainer = this.byId("chartSalesRep");
            if (oContainer) { oContainer.removeAllItems(); oContainer.addItem(oVizFrame); }
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("analyticalListPage");
        }
    });
});
