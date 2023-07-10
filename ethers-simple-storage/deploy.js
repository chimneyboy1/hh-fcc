const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  // compile them in our code
  // compile them separately
  // http://127.0.0.1:7545

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  //   const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  //   let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //     encryptedJson,
  //     process.env.PRIVATE_KEY_PASSWORD
  //   );
  //   wallet = await wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  const deployedReceipt = await contract.deployed();
  console.log(`Contract Address: ${contract.address}`);
  // Get Number

  const currentFavortiteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavortiteNumber.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait();
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite Number is: ${updatedFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
