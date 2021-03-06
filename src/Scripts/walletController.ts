﻿import { Services } from "./services";

import angular = require("angular");

export class WalletController implements ng.IController {
    private readonly Api: string = "http://localhost:56864/api/Wallet/";
    private readonly AccountName = "account 0";
    private readonly Satoshis = 0.00000001;


    constructor(private $scope: IWalletScope, private $http: ng.IHttpService, private errorService: Services.ErrorService,
        private $timeout: ng.ITimeoutService) {
        $scope.loading = true;
        $scope.wallets = [];
        $scope.vm = this;
        this.loadWalletFiles();
    }

    showCreateWalletModal() {
        this.$scope.newWallet = new CreateWalletModel();
        ($("#modalCreateWallet") as any).modal("show");
    }

    createWallet() {
        this.$scope.loading = true;
        let cpy = angular.copy(this.$scope.newWallet);
        this.$http.post<string>(this.Api + "create", cpy).then(res => {
            if (res.data) {
                this.$scope.newWallet.mnemonic = res.data;
                this.loadWalletFiles();
            }
            this.$scope.loading = false;

        }, err => {
            this.$scope.newWallet.walletCreationError = this.errorService.getErrorMessage(err);
            this.$scope.loading = false;
        });
    }

    private currentWallet: WalletModel;

    showSendDstModal(wallet: WalletModel) {
        this.currentWallet = angular.copy(wallet);
        this.$scope.sendDst = new SendDstModel();
        ($("#sendDstModal") as any).modal("show");
    }

    sendDst() {
        this.$scope.loading = true;
        let cpy = angular.copy(this.$scope.sendDst);
        cpy.walletName = this.currentWallet.walletName;
        cpy.accountName = this.AccountName;
        this.$http.post<BuildTransactionResponse>(this.Api + "build-transaction", cpy).then(res => {
            let builTransactionResult = res.data;
            if (res.data) {
                this.$http.post(this.Api + "send-transaction", builTransactionResult).then(res => {
                    this.$timeout(() => {
                        this.$scope.loading = false;
                        this.$scope.sendDst.sent = true;
                        this.loadWalletFiles();
                        this.$scope.sendDst.transactionId = builTransactionResult.transactionId;
                    }, 8000);

                }, err => {
                    console.error(err);
                    this.$scope.loading = false;
                    this.$scope.sendDst.sendDstError = this.errorService.getErrorMessage(err);
                });
            }
        }, err => {
            console.error(err);
            this.$scope.sendDst.sendDstError = this.errorService.getErrorMessage(err);
            this.$scope.loading = false;
        });
    }

    loadWalletFiles() {
        this.$scope.loading = true;
        this.$http.get<WalletFilesModel>(this.Api + "files").then(res => {

            let walletFiles = res.data;
            if (walletFiles && walletFiles.walletsFiles.length) {
                let wallets = new Array<WalletModel>();
                for (let i = 0; i < walletFiles.walletsFiles.length; i++) {
                    this.$timeout(() => {
                        let value = walletFiles.walletsFiles[i];
                        let walletName: string = value.substr(0, value.indexOf(".wallet"));

                        this.$http.get<WalletAddressesResponseModel>(this.Api + "addresses?WalletName=" + walletName + "&AccountName=" + this.AccountName).then(res => {
                            var wallet = new WalletModel();
                            wallet.walletName = walletName;
                            if (res.data) {
                                wallet.addresses = res.data.addresses.filter(x => !x.isChange);
                            }
                            this.$http.get<WalletBalanceResponseModel>(this.Api + "balance?WalletName=" + walletName + "&AccountName=" + this.AccountName).then(res => {
                                if (res.data && res.data.balances) {
                                    var balance = res.data.balances[0];
                                    wallet.amountConfirmed = balance.amountConfirmed * this.Satoshis;
                                    wallet.amountUnconfirmed = balance.amountUnconfirmed * this.Satoshis;
                                    wallets.push(wallet);
                                    if (wallets.length == walletFiles.walletsFiles.length) {
                                        this.$scope.wallets = wallets;
                                        this.$scope.loading = false;
                                    }
                                }
                            }, err => {
                                console.error(err);
                                this.$scope.loading = false;
                                this.$scope.error = this.errorService.getErrorMessage(err);
                            });
                        }, err => {
                            console.error(err);
                            this.$scope.loading = false;
                            this.$scope.error = this.errorService.getErrorMessage(err);
                        });
                    }, 100);
                }
            }
            else {
                this.$scope.loading = false;
            }
        }, err => {
            this.$scope.error = this.errorService.getErrorMessage(err);
            this.$scope.loading = false;
            this.$scope.filesLoadFailed = true;
            console.error(err);
        });
    }

    showRecoverWalletModal() {
        this.$scope.recoverWalletObject = new RecoverWalletModel();
        ($("#recoverWalletModal") as any).modal("show");
    }

    recoverWallet() {
        this.$scope.loading = true;
        var cpy = angular.copy(this.$scope.recoverWalletObject);
        this.$http.post(this.Api + "recover", cpy).then(res => {
            this.$timeout(() => {
                this.$scope.loading = false;
                this.$scope.recoverWalletObject.recovered = true;
                this.loadWalletFiles();
            }, 8000);
        }, err => {
            console.error(err);
            this.$scope.loading = false;
            this.$scope.recoverWalletObject.recoverError = this.errorService.getErrorMessage(err);
        })
    }


}

interface IWalletScope extends ng.IScope {
    title: string;
    loading: boolean;
    wallets: Array<WalletModel>;
    error: string;
    filesLoadFailed: boolean;
    newWallet: CreateWalletModel;
    sendDst: SendDstModel;
    recoverWalletObject: RecoverWalletModel;
    vm: WalletController;
}

class WalletFilesModel {
    walletsPath: string;
    walletsFiles: string[] = [];
}

class WalletModel {
    walletName: string;
    amountConfirmed: number = 0;
    amountUnconfirmed: number = 0;
    addresses: WalletAddressModel[];

}

class WalletAddressesResponseModel {
    addresses: WalletAddressModel[] = [];
}

class WalletAddressModel {
    address: string;
    isUsed: boolean = false;
    isChange: boolean = false;
}

class WalletBalanceResponseModel {
    balances: WalletBalance[];
}

class WalletBalance {
    accountName: string;
    amountConfirmed: number = 0;
    amountUnconfirmed: number = 0;
}

class CreateWalletModel {
    walletCreationError: string;
    name: string;
    password: string;
    mnemonic: string;
}

class SendDstModel {
    walletName: string;
    password: string;
    amount: number;
    destinationAddress: string;
    accountName: string;
    sent: boolean;
    sendDstError: string;
    transactionId: string;
}

class BuildTransactionResponse {
    hex: string;
    transactionId: string;
}

class RecoverWalletModel {
    password: string;
    mnemonic: string;
    name: string;
    creationDate: Date;
    recovered: boolean;
    recoverError: string;
}