const {task} = require('hardhat/config')

task("interact-fundme", "与fundMe合约交互获取")
.addParam("address", "fundMe contract address")
.setAction(async (args, hre) => {
        const contractFactory = await ethers.getContractFactory("FundMe");
        const fundMe = await contractFactory.attach(args.address);

        // 获取hardhat里配置好的账户
        const [firstAccount, secondAccount] = await ethers.getSigners();
    
        // 使用第一个账户进行Fund操作
        const firstAccountTx = await fundMe.fund({value: ethers.parseEther("0.2")});
        await firstAccountTx.wait();
         
        // 获取并打印此时合约中的余额
        const contractBalance = await ethers.provider.getBalance(fundMe.target);
        console.log(`1_Balance of the contract is ${contractBalance}`);
    
        // 使用第二个账户进行Fund操作
        const secondAccountTx = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.1")});
        await secondAccountTx.wait();
    
        // 获取并打印此时合约中的余额
        const contractBalance2 = await ethers.provider.getBalance(fundMe.target);
        console.log(`2_Balance of the contract is ${contractBalance2}`);
    
        // 查看FundMe合约中mapping情况
        const amountInWei = await fundMe.fundersToAmount(firstAccount.address); // 等待异步调用完成
        const firstAccountbalanceInFundMe = ethers.formatEther(amountInWei.toString()); // 转为字符串
        console.log(`firstAccountbalanceInFundMe is ${firstAccountbalanceInFundMe } Eth`)
        const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address);
        console.log(`secondAccountbalanceInFundMe is ${secondAccountbalanceInFundMe } Wei`)
});