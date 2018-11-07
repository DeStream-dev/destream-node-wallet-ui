"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var walletController_1 = require("./walletController");
var services_1 = require("./services");
var angular = require("angular");
var App;
(function (App) {
    var app = angular.module("WalletApp", []).
        controller("WalletController", walletController_1.WalletController).
        service("errorService", services_1.Services.ErrorService);
})(App || (App = {}));
//# sourceMappingURL=app.js.map