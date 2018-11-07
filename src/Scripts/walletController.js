"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var WalletController = /** @class */ (function () {
    function WalletController($scope, $http, errorService, $timeout) {
        this.$scope = $scope;
        this.$http = $http;
        this.errorService = errorService;
        this.$timeout = $timeout;
        this.Api = "http://localhost:56864/api/Wallet/";
        this.AccountName = "account 0";
        this.Satoshis = 0.00000001;
        $scope.loading = true;
        $scope.wallets = [];
        $scope.vm = this;
        this.loadWalletFiles();
    }
    WalletController.prototype.showCreateWalletModal = function () {
        this.$scope.newWallet = new CreateWalletModel();
        $("#modalCreateWallet").modal("show");
    };
    WalletController.prototype.createWallet = function () {
        var _this = this;
        this.$scope.loading = true;
        var cpy = angular.copy(this.$scope.newWallet);
        this.$http.post(this.Api + "create", cpy).then(function (res) {
            if (res.data) {
                _this.$scope.newWallet.mnemonic = res.data;
                _this.loadWalletFiles();
            }
            _this.$scope.loading = false;
        }, function (err) {
            _this.$scope.newWallet.walletCreationError = _this.errorService.getErrorMessage(err);
            _this.$scope.loading = false;
        });
    };
    WalletController.prototype.showSendDstModal = function (wallet) {
        this.currentWallet = angular.copy(wallet);
        this.$scope.sendDst = new SendDstModel();
        $("#sendDstModal").modal("show");
    };
    WalletController.prototype.sendDst = function () {
        var _this = this;
        this.$scope.loading = true;
        var cpy = angular.copy(this.$scope.sendDst);
        cpy.walletName = this.currentWallet.walletName;
        cpy.accountName = this.AccountName;
        this.$http.post(this.Api + "build-transaction", cpy).then(function (res) {
            var builTransactionResult = res.data;
            if (res.data) {
                _this.$http.post(_this.Api + "send-transaction", builTransactionResult).then(function (res) {
                    _this.$timeout(function () {
                        _this.$scope.loading = false;
                        _this.$scope.sendDst.sent = true;
                        _this.loadWalletFiles();
                        _this.$scope.sendDst.transactionId = builTransactionResult.transactionId;
                    }, 8000);
                }, function (err) {
                    console.error(err);
                    _this.$scope.loading = false;
                    _this.$scope.sendDst.sendDstError = _this.errorService.getErrorMessage(err);
                });
            }
        }, function (err) {
            console.error(err);
            _this.$scope.sendDst.sendDstError = _this.errorService.getErrorMessage(err);
            _this.$scope.loading = false;
        });
    };
    WalletController.prototype.loadWalletFiles = function () {
        var _this = this;
        this.$scope.loading = true;
        this.$http.get(this.Api + "files").then(function (res) {
            var walletFiles = res.data;
            if (walletFiles && walletFiles.walletsFiles.length) {
                var wallets_1 = new Array();
                var _loop_1 = function (i) {
                    _this.$timeout(function () {
                        var value = walletFiles.walletsFiles[i];
                        var walletName = value.substr(0, value.indexOf(".wallet"));
                        _this.$http.get(_this.Api + "addresses?WalletName=" + walletName + "&AccountName=" + _this.AccountName).then(function (res) {
                            var wallet = new WalletModel();
                            wallet.walletName = walletName;
                            if (res.data) {
                                wallet.addresses = res.data.addresses.filter(function (x) { return !x.isChange; });
                            }
                            _this.$http.get(_this.Api + "balance?WalletName=" + walletName + "&AccountName=" + _this.AccountName).then(function (res) {
                                if (res.data && res.data.balances) {
                                    var balance = res.data.balances[0];
                                    wallet.amountConfirmed = balance.amountConfirmed * _this.Satoshis;
                                    wallet.amountUnconfirmed = balance.amountUnconfirmed * _this.Satoshis;
                                    wallets_1.push(wallet);
                                    if (wallets_1.length == walletFiles.walletsFiles.length) {
                                        _this.$scope.wallets = wallets_1;
                                        _this.$scope.loading = false;
                                    }
                                }
                            }, function (err) {
                                console.error(err);
                                _this.$scope.loading = false;
                                _this.$scope.error = _this.errorService.getErrorMessage(err);
                            });
                        }, function (err) {
                            console.error(err);
                            _this.$scope.loading = false;
                            _this.$scope.error = _this.errorService.getErrorMessage(err);
                        });
                    }, 100);
                };
                for (var i = 0; i < walletFiles.walletsFiles.length; i++) {
                    _loop_1(i);
                }
            }
            else {
                _this.$scope.loading = false;
            }
        }, function (err) {
            _this.$scope.error = _this.errorService.getErrorMessage(err);
            _this.$scope.loading = false;
            _this.$scope.filesLoadFailed = true;
            console.error(err);
        });
    };
    WalletController.prototype.showRecoverWalletModal = function () {
        this.$scope.recoverWalletObject = new RecoverWalletModel();
        $("#recoverWalletModal").modal("show");
    };
    WalletController.prototype.recoverWallet = function () {
        var _this = this;
        this.$scope.loading = true;
        var cpy = angular.copy(this.$scope.recoverWalletObject);
        this.$http.post(this.Api + "recover", cpy).then(function (res) {
            _this.$timeout(function () {
                _this.$scope.loading = false;
                _this.$scope.recoverWalletObject.recovered = true;
                _this.loadWalletFiles();
            }, 8000);
        }, function (err) {
            console.error(err);
            _this.$scope.loading = false;
            _this.$scope.recoverWalletObject.recoverError = _this.errorService.getErrorMessage(err);
        });
    };
    return WalletController;
}());
exports.WalletController = WalletController;
var WalletFilesModel = /** @class */ (function () {
    function WalletFilesModel() {
        this.walletsFiles = [];
    }
    return WalletFilesModel;
}());
var WalletModel = /** @class */ (function () {
    function WalletModel() {
        this.amountConfirmed = 0;
        this.amountUnconfirmed = 0;
    }
    return WalletModel;
}());
var WalletAddressesResponseModel = /** @class */ (function () {
    function WalletAddressesResponseModel() {
        this.addresses = [];
    }
    return WalletAddressesResponseModel;
}());
var WalletAddressModel = /** @class */ (function () {
    function WalletAddressModel() {
        this.isUsed = false;
        this.isChange = false;
    }
    return WalletAddressModel;
}());
var WalletBalanceResponseModel = /** @class */ (function () {
    function WalletBalanceResponseModel() {
    }
    return WalletBalanceResponseModel;
}());
var WalletBalance = /** @class */ (function () {
    function WalletBalance() {
        this.amountConfirmed = 0;
        this.amountUnconfirmed = 0;
    }
    return WalletBalance;
}());
var CreateWalletModel = /** @class */ (function () {
    function CreateWalletModel() {
    }
    return CreateWalletModel;
}());
var SendDstModel = /** @class */ (function () {
    function SendDstModel() {
    }
    return SendDstModel;
}());
var BuildTransactionResponse = /** @class */ (function () {
    function BuildTransactionResponse() {
    }
    return BuildTransactionResponse;
}());
var RecoverWalletModel = /** @class */ (function () {
    function RecoverWalletModel() {
    }
    return RecoverWalletModel;
}());
//# sourceMappingURL=walletController.js.map