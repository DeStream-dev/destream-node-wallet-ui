"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Services;
(function (Services) {
    var ErrorService = /** @class */ (function () {
        function ErrorService() {
            this.CommonErrorMessage = "Error happened.";
        }
        ErrorService.prototype.getDefaultErrorMessage = function () {
            return this.CommonErrorMessage;
        };
        ErrorService.prototype.getErrorMessage = function (error, useDefaultErrorMessageIfNull) {
            if (useDefaultErrorMessageIfNull === void 0) { useDefaultErrorMessageIfNull = true; }
            if (error && error.data && error.data.errors)
                return error.data.errors[0].message;
            else if (useDefaultErrorMessageIfNull)
                return this.CommonErrorMessage;
        };
        return ErrorService;
    }());
    Services.ErrorService = ErrorService;
})(Services = exports.Services || (exports.Services = {}));
//# sourceMappingURL=services.js.map