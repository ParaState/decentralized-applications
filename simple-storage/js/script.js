/* Don't modify */
var abi = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
var bytecode = '608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604e5780636d4ce63c146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820c25af45c42c01588809d8cd09c19adf172a81cde693d4c7ac17859b447f9ca6c0029';
var cAddr = '0xd658629fd8e5d9b712e529b7abcc8ddfaa97aed9';
/* Don't modify */

var instance = null;
window.addEventListener('web3Ready', function() {
    var contract = web3.ss.contract(abi);
    instance = contract.at(cAddr);
});


function getBlockNumber() {
    try {
        web3.ss.getBlockNumber(function(error, blockNumber) {
            if (!error) {
                document.getElementById("block_number_output").innerHTML = "Block number: " + blockNumber;
            }
        });
    } catch (err) {
        document.getElementById("block_number_output").innerHTML = err;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitBlock(_tx_hash) {
    var ready_to_break = false;
    while (true) {
        if (ready_to_break == false) {
            web3.ss.getTransactionReceipt(_tx_hash, function(err, res_rec) {
                if (!err) {
                    if (res_rec != null && res_rec != undefined) {
                        console.log(JSON.stringify(res_rec));
                        Toastify({
                            avatar: "https://avatars.githubusercontent.com/u/78342518?s=200&v=4",
                            text: "Success",
                            duration: 8000,
                            destination: "http://scan.parastate.io/tx/" + _tx_hash,
                            newWindow: true,
                            close: true,
                            gravity: "top", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            backgroundColor: "linear-gradient(to right, #BB9402, #eab903)",
                            stopOnFocus: false, // Prevents dismissing of toast on hover
                            onClick: function() {} // Callback after click
                        }).showToast();
                        ready_to_break = true;
                    } else {
                        console.log("Waiting for transaction receipt");
                    }
                } else {
                    ready_to_break = true;
                }
            });
            await sleep(1000);
        } else {
            break;
        }
    }
}

function storeData() {
    var number = document.getElementById("number_input").value;
    instance.set(number, function(error, response) {
        if (!error) {
            Toastify({
                avatar: "https://avatars.githubusercontent.com/u/78342518?s=200&v=4",
                text: "Transaction sent, please wait ...",
                duration: 5000,
                destination: "http://scan.parastate.io/tx/" + response,
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                backgroundColor: "linear-gradient(to right, #0000ff, #009fd8)",
                stopOnFocus: false, // Prevents dismissing of toast on hover
                onClick: function() {} // Callback after click
            }).showToast();
            waitBlock(response);
        } else {
            document.getElementById("store_data_output").innerHTML = error;
        }

    });
}

function retrieveData() {
    instance.get(function(e, data) {
        document.getElementById("retrieve_data_output").innerHTML = "Data retrieved: " + data;
    });
}

