sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    // Target ratios relative to actual (for demo/sample purposes)
    var TARGET_SALES_RATIO = 0.88;   // Target is 88% of actual
    var TARGET_ORDERS_RATIO = 0.92;  // Target is 92% of actual
    var TARGET_AOV_RATIO = 0.95;     // Target is 95% of actual

    return Controller.extend("com.tharaneeshwar.analyticalapp.controller.AnalyticalListPage", {

        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("data/mockData.json");
            oModel.attachRequestCompleted(function () {
                var aAllSales = oModel.getData().sales || [];
                this._buildViewModel(aAllSales);
                this._loadCharts(aAllSales);
            }.bind(this));
        },

        _sumAmount: function (arr) {
            return arr.reduce(function (s, i) { return s + (i.amount || 0); }, 0);
        },

        _buildViewModel: function (aAllSales) {
            // Compute variance analysis
            var nActualSales = this._sumAmount(aAllSales);
            var nTargetSales = Math.round(nActualSales * TARGET_SALES_RATIO);
            var nActualOrders = aAllSales.length;
            var nTargetOrders = Math.round(nActualOrders * TARGET_ORDERS_RATIO);
            var nAvgActual = nActualOrders ? Math.round(nActualSales / nActualOrders) : 0;
            var nAvgTarget = Math.round(nAvgActual * TARGET_AOV_RATIO);

            var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };
            var pct = function (a, t) {
                var v = Math.round(((a - t) / t) * 1000) / 10;
                return (v >= 0 ? "+" : "") + v + "%";
            };
            var state = function (a, t) { return a >= t ? "Success" : "Warning"; };
            var stText = function (a, t) { return a >= t ? "Above Target" : "Below Target"; };

            var oViewModel = new JSONModel({
                varianceData: [
                    {
                        metric: "Total Sales",
                        actual: fmt(nActualSales),
                        target: fmt(nTargetSales),
                        variance: fmt(nActualSales - nTargetSales),
                        variancePercent: pct(nActualSales, nTargetSales),
                        status: stText(nActualSales, nTargetSales),
                        statusState: state(nActualSales, nTargetSales)
                    },
                    {
                        metric: "Total Orders",
                        actual: String(nActualOrders),
                        target: String(nTargetOrders),
                        variance: String(nActualOrders - nTargetOrders),
                        variancePercent: pct(nActualOrders, nTargetOrders),
                        status: stText(nActualOrders, nTargetOrders),
                        statusState: state(nActualOrders, nTargetOrders)
                    },
                    {
                        metric: "Avg Order Value",
                        actual: fmt(nAvgActual),
                        target: fmt(nAvgTarget),
                        variance: fmt(nAvgActual - nAvgTarget),
                        variancePercent: pct(nAvgActual, nAvgTarget),
                        status: stText(nAvgActual, nAvgTarget),
                        statusState: state(nAvgActual, nAvgTarget)
                    },
                    {
                        metric: "Customer Retention",
                        actual: "94%",
                        target: "95%",
                        variance: "-1%",
                        variancePercent: "-1.1%",
                        status: "Below Target",
                        statusState: "Warning"
                    }
                ]
            });
            this.getView().setModel(oViewModel);
        },

        _loadCharts: function (aAllSales) {
            sap.ui.require([
                "sap/viz/ui5/controls/VizFrame",
                "sap/viz/ui5/data/FlattenedDataset",
                "sap/viz/ui5/controls/common/feeds/FeedItem"
            ], function (VizFrame, FlattenedDataset, FeedItem) {
                this._renderSalesTrend(aAllSales, VizFrame, FlattenedDataset, FeedItem);
                this._renderMarketShare(aAllSales, VizFrame, FlattenedDataset, FeedItem);
                this._renderTopProducts(aAllSales, VizFrame, FlattenedDataset, FeedItem);
                this._renderRegionPerformance(aAllSales, VizFrame, FlattenedDataset, FeedItem);
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

        _renderSalesTrend: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            // Group by month
            var oByMonth = {};
            aAllSales.forEach(function (item) {
                var sMonth = item.date.slice(0, 7); // YYYY-MM
                if (!oByMonth[sMonth]) { oByMonth[sMonth] = 0; }
                oByMonth[sMonth] += item.amount;
            });
            var aData = Object.keys(oByMonth).sort().map(function (m) {
                return { month: m, sales: oByMonth[m] };
            });

            var oVizFrame = new VizFrame({
                width: "100%",
                height: "380px",
                vizType: "line",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Month", value: "{month}" }],
                    measures: [{ name: "Sales", value: "{sales}" }],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "valueAxis", type: "Measure", values: ["Sales"] }),
                    new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Month"] })
                ],
                vizProperties: {
                    title: { text: "Monthly Sales Trend" },
                    plotArea: { dataLabel: { visible: false } }
                }
            });
            oVizFrame.setModel(new JSONModel(aData));

            var oContainer = this.byId("chartSalesTrend");
            if (oContainer) {
                oContainer.removeAllItems();
                oContainer.addItem(oVizFrame);
            }
        },

        _renderMarketShare: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            var oByRegion = this._groupBy(aAllSales, "region");
            var aData = Object.keys(oByRegion).map(function (r) {
                return { region: r, sales: oByRegion[r].reduce(function (s, i) { return s + i.amount; }, 0) };
            });

            var oVizFrame = new VizFrame({
                width: "100%",
                height: "380px",
                vizType: "donut",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Region", value: "{region}" }],
                    measures: [{ name: "Sales", value: "{sales}" }],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "size", type: "Measure", values: ["Sales"] }),
                    new FeedItem({ uid: "color", type: "Dimension", values: ["Region"] })
                ],
                vizProperties: {
                    title: { text: "Sales by Region" },
                    plotArea: { dataLabel: { visible: true } }
                }
            });
            oVizFrame.setModel(new JSONModel(aData));

            var oContainer = this.byId("chartMarketShare");
            if (oContainer) {
                oContainer.removeAllItems();
                oContainer.addItem(oVizFrame);
            }
        },

        _renderTopProducts: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            var oByProduct = this._groupBy(aAllSales, "product");
            var aData = Object.keys(oByProduct).map(function (p) {
                return {
                    product: p,
                    sales: oByProduct[p].reduce(function (s, i) { return s + i.amount; }, 0),
                    quantity: oByProduct[p].reduce(function (s, i) { return s + i.quantity; }, 0)
                };
            }).sort(function (a, b) { return b.sales - a.sales; });

            var oVizFrame = new VizFrame({
                width: "100%",
                height: "380px",
                vizType: "bar",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Product", value: "{product}" }],
                    measures: [
                        { name: "Sales", value: "{sales}" },
                        { name: "Quantity", value: "{quantity}" }
                    ],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "valueAxis", type: "Measure", values: ["Sales"] }),
                    new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Product"] })
                ],
                vizProperties: {
                    title: { text: "Top Products by Sales" },
                    plotArea: { dataLabel: { visible: true } }
                }
            });
            oVizFrame.setModel(new JSONModel(aData));

            var oContainer = this.byId("chartTopProducts");
            if (oContainer) {
                oContainer.removeAllItems();
                oContainer.addItem(oVizFrame);
            }
        },

        _renderRegionPerformance: function (aAllSales, VizFrame, FlattenedDataset, FeedItem) {
            var oByRegion = this._groupBy(aAllSales, "region");
            var aData = Object.keys(oByRegion).map(function (r) {
                var items = oByRegion[r];
                return {
                    region: r,
                    sales: items.reduce(function (s, i) { return s + i.amount; }, 0),
                    orders: items.length
                };
            });

            var oVizFrame = new VizFrame({
                width: "100%",
                height: "380px",
                vizType: "column",
                dataset: new FlattenedDataset({
                    dimensions: [{ name: "Region", value: "{region}" }],
                    measures: [
                        { name: "Sales", value: "{sales}" },
                        { name: "Orders", value: "{orders}" }
                    ],
                    data: { path: "/" }
                }),
                feeds: [
                    new FeedItem({ uid: "valueAxis", type: "Measure", values: ["Sales", "Orders"] }),
                    new FeedItem({ uid: "categoryAxis", type: "Dimension", values: ["Region"] })
                ],
                vizProperties: {
                    title: { text: "Region Performance" },
                    plotArea: { dataLabel: { visible: false } }
                }
            });
            oVizFrame.setModel(new JSONModel(aData));

            var oContainer = this.byId("chartRegionPerformance");
            if (oContainer) {
                oContainer.removeAllItems();
                oContainer.addItem(oVizFrame);
            }
        },

        onRefresh: function () {
            this.onInit();
        },

        onNavigateToList: function () {
            this.getOwnerComponent().getRouter().navTo("listReport");
        },

        onNavigateToCharts: function () {
            this.getOwnerComponent().getRouter().navTo("charts");
        }
    });
});
