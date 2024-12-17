const {task} = require('hardhat/config')

task("deploy-fundme", "部署合约用脚本").setAction(async (args, hre) => {
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

        // if (hre.network.config.chainId == 11155111 && process.env.ETHER_SCAN_API_KEY) {
        //     // console.log('wait for 5 block comfirm...');
        //     // await fundMe.deploymentTransaction().wait(5);
        //     // await fundMeDeploy(fundMe.target);
        //     console.log('skip contract verify1');
        // } else {
        //     console.log('skip contract verify2');
        // }
});

async function fundMeDeploy(address) {
    await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
    });
}