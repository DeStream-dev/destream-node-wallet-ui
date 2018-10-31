const api: string = "http://localhost:56864/api";
let WalletName: string = null;
const AccountName: string = "account 0";

function CheckWallet() {
    fetch(api +'/Wallet/files').then(response => response.json().then(json => {
        console.log(json.walletsFiles);
        console.log(json.walletsFiles.includes("DeStreamUiWallet.wallet.json"));
        if (json.walletsFiles.includes("DeStreamUiWallet.wallet.json")) {
            console.log("Changed");
            WalletName = "DeStreamUiWallet";
        }
        
        ToggleLayout();
    })).catch(() => ToggleLayout());    
}

function ToggleLayout() {
    console.log("WalletName " + WalletName);
    if (WalletName == null) {
        document.getElementById("Login").hidden = false;
        document.getElementById("WalletInfo").hidden = true;
    }
    else {
        document.getElementById("Login").hidden = true;
        document.getElementById("WalletInfo").hidden = false;
    }
}

CheckWallet();

function UpdateBalance() {
    if (WalletName == null)
        return;

    fetch(api + '/Wallet/balance?WalletName=' + WalletName + '&AccountName=' + AccountName)
        .then(response => response.json()
            .then(json => {
                document.getElementById("TotalValue").textContent = json.balances.pop().amountConfirmed.toString() + " DST";
            }));
}

UpdateBalance();

function SendTransaction(destinationAddress: string, amount: number) {
    if (WalletName == null)
        return;

    fetch(api + '/Wallet/build-transaction', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: "DeStreamStakingWallet0120181025TaAnRaAl210430550017E774KM50",
            WalletName: WalletName,
            accountName: AccountName,
            destinationAddress: destinationAddress,
            amount: amount
        })
    }).then(response => {
        response.json().then(json => {
            console.log(json);
            fetch(api + '/Wallet/send-transaction', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hex: json.hex
                })
            }).then(response => response.json().then(json => console.log(json)));
        });
    });
}

// SendTransaction("DULup2cXdyQ2KSH1oCNR8EnFacZL4KYufa", 1000);

function RecieveTransaction() {
    if (WalletName == null)
        return;

    return fetch(api + '/Wallet/unusedaddress?WalletName=' + WalletName + '&AccountName=' + AccountName).then(response => response.json());
}

// RecieveTransaction();

function CreateWallet(password: string) {
    fetch(api + '/Wallet/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: password,
            name: "TestWallet"
        })
    }).then(response => response.json().then(json => console.log(json)));
}

function CreateWalletClick() {
    if (WalletName != null)
        return;
    
    WalletName = "DeStreamUiWallet";
    
    CreateWallet(document.getElementById("NewPassword").textContent);

    ToggleLayout();
}

// CreateWallet("password");

function RecoverWallet(mnemonic: string, password: string, name: string, creationDate: Date) {
   
    fetch(api + '/Wallet/recover', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mnemonic: mnemonic,
            password: password,
            name: name,
            creationDate: creationDate
        })
    }).then(response => response.json().then(json => console.log(json)));
}

function RecoverWalletClick() {
    if (WalletName != null)
        return;

    WalletName = "DeStreamUiWallet";
    
    RecoverWallet(document.getElementById("Mnemonic").textContent, 
        document.getElementById("RecoverPassword").textContent, 
        WalletName, 
        new Date(document.getElementById("CreationDate").textContent));
    
    ToggleLayout();
}

// RecoverWallet("outside work atom eyebrow remain genuine wing glass vacant fossil catalog story", "password", "TestWallet", new Date(2018, 10, 1));

function ProcessRecieveTransaction() {
    if (WalletName == null)
        return;

    let dialog = document.getElementById('RecieveDialog');
    RecieveTransaction().then(address => dialog.textContent = "Recieve addres:" + address);
    dialog.hidden = false;
}

// ProcessRecieveTransaction();

function ProcessSendDialog() {
    if (WalletName == null)
        return;

    let dialog = document.getElementById('SendDialog');
    dialog.hidden = false;
}

// ProcessSendDialog();

function SendTransactionClick() {
    SendTransaction(document.getElementById("SendAddress").textContent, Number(document.getElementById("SendAmount").textContent));
}