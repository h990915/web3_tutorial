// const {ethers} = require("hardhat");

async function main() {
    // 获取所有的 Signers（账户）
    const [deployer] = await ethers.getSigners(); // 解构第一个账户作为部署者
    console.log(`Deploying contract with the account: ${deployer.address}`);
    
    // 获取部署者账户余额
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Deployer balance in ETH: ${ethers.formatEther(balance)} ETH`);

    const fundMeFactory = await ethers.getContractFactory("FundMe");
    const fundMe = await fundMeFactory.deploy();
    await fundMe.waitForDeployment();
    console.log(`fundme contracts is deployed successfully, current address is ${fundMe.target}`);
    console.log('hre.network.config.chainId', hre.network.config.chainId);
    if (hre.network.config.chainId == 11155111 && process.env.ETHER_SCAN_API_KEY) {
        // console.log('wait for 5 block comfirm...');
        // await fundMe.deploymentTransaction().wait(5);
        // await fundMeDeploy(fundMe.target);
        console.log('skip contract verify1');
    } else {
        console.log('skip contract verify2');
    }

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
    console.log(`firstAccountbalanceInFundMe is ${firstAccountbalanceInFundMe }`)
    const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address);
    console.log(`secondAccountbalanceInFundMe is ${secondAccountbalanceInFundMe }`)


    
}

async function fundMeDeploy(address) {
    await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
    });
}

main().then().catch((error) => {
    console.error(error);
    process.exit(1);
});