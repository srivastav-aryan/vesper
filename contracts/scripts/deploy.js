import {ethers} from "hardhat"
import * as dotenv from "dotenv";
import * as fs from "fs-extra";

dotenv.config();

async function main() {
  const contractNames = [
    "accessControl",
   
    
  ];

 
  const provider = new ethers.JsonRpcProvider(process.env.GANACHE_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  let existingEnvData = "";
  try {
    existingEnvData = fs.readFileSync(".env", "utf8");
  } catch (error) {
    console.warn("No existing .env file found. Creating a new one.");
  }

  let newEnvData = "";

  for (const contractName of contractNames) {
    try {
      console.log(`🚀 Deploying ${contractName}...`);
      
      const Contract = await ethers.getContractFactory(contractName, wallet);
      const contract = await Contract.deploy();
      await contract.waitForDeployment();  

      const address = await contract.getAddress();
      console.log(`✅ ${contractName} deployed at: ${address}`);
      
      newEnvData += `${contractName.toUpperCase()}_ADDRESS=${address}\n`;
    } catch (error) {
      console.error(`❌ Error deploying ${contractName}:`, error);
      throw error;
    }
  }

  const updatedEnvData = existingEnvData + "\n" + newEnvData;
  fs.writeFileSync(".env", updatedEnvData);
  console.log("\n✅ All contract addresses saved to .env!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
