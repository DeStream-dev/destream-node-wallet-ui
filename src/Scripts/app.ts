import { WalletController } from "./walletController"
import { Services } from "./services"
import angular = require("angular");

module App {
    var app = angular.module("WalletApp", []).
        controller("WalletController", WalletController).
        service("errorService", Services.ErrorService);
}