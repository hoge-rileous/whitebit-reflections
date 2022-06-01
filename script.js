  async getData () {

    var hogeBalance = ethers.BigNumber.from(0);
    var totalHogeTransferred = ethers.BigNumber.from(0);
    let transactions = await this.getTransactions("1","latest");
    let length = transactions.length;
    //Gather transactions in bundles of 10,0000
    while (length == 10000) {
        let lastTx = transactions[9999];
        console.log(lastTx);
        const nextStart = parseInt(lastTx.blockNumber) + 1;
        let res = await this.getTransactions(nextStart, "latest");
        transactions = transactions.concat(res);
        length = res.length;
    }

    console.log("processing ", transactions.length, "transactions");

    //Process transactions
    for (let transaction of transactions) {
        var tempVal = ethers.BigNumber.from(transaction.value);
        if (transaction.to == "0x39f6a6c85d39d5abad8a398310c52e7c374f2ba3") {
            totalHogeTransferred = totalHogeTransferred.add(tempVal.mul(98).div(100));
        } else if (transaction.from == "0x39f6a6c85d39d5abad8a398310c52e7c374f2ba3") {
            totalHogeTransferred = totalHogeTransferred.sub(tempVal);
        } else {
            console.log("Don't know how to process:", transaction)
        }
    }
    await fetch('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xfad45e47083e4607302aa43c65fb3106f1cd7607&address=0x39f6a6c85d39d5abad8a398310c52e7c374f2ba3&tag=latest&apikey=WHIV2FAKITRJUY67GSV6SY8SYNTMJQ4VHH')
            .then(async (response2) => {
                const data2 = await response2.json();
                hogeBalance = ethers.BigNumber.from(data2.result);
                
            });

    const reflections = hogeBalance.sub(totalHogeTransferred);
    this.setState({totalHogeTransferred, hogeBalance, reflections});
  }
