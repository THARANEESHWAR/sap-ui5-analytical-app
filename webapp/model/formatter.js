sap.ui.define([], function () {
    "use strict";

    return {
        formatCurrency: function (sValue) {
            if (!sValue) {
                return "";
            }
            return "$" + parseFloat(sValue).toLocaleString("en-US");
        },

        formatAmount: function (nValue) {
            if (nValue === undefined || nValue === null) {
                return "";
            }
            return "$" + Number(nValue).toLocaleString("en-US");
        },

        formatPercentage: function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2) + "%";
        },

        formatDate: function (oDate) {
            if (!oDate) {
                return "";
            }
            var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
                pattern: "MMM dd, yyyy"
            });
            return oDateFormat.format(oDate);
        },

        statusStateMap: function (sStatus) {
            var mStatusMap = {
                "Completed": "Success",
                "Pending": "Warning",
                "Failed": "Error",
                "In Progress": "Information"
            };
            return mStatusMap[sStatus] || "None";
        }
    };
});
