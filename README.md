# Bsc-Explorer

- Detailed Blockchain Data for Binance Smart Chain (BSC) including the most recently mined blocks, transactions, and addresses.

# Page Site: [HERE](https://normalizex.github.io/bsc-explorer/build/)

---

# Stack

- Frontend:
  - Languages: <img src='https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white' style='vertical-align:middle' /><img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" style='vertical-align:middle' />
  - Libraries: <img src='https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB' style='vertical-align:middle' /><img src='https://img.shields.io/badge/web3.js-F16822?style=for-the-badge&logo=web3.js&logoColor=white' style='vertical-align:middle' /><img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" style='vertical-align:middle' />

# About Project:
> Why is there no backend and such a simple stack?
The answer is quite simple, through this site you connect to an **existing binance node**.
And all information is directly requested directly from the **node**.
Not every average user can run a server with their **1-2TB+** full node for full block processing.

# Pros and cons:
\+ **The advantage is that you directly request data from the node.**
> Which, in turn, is faster than the same bscscan, which stores full information about blocks in its databases and gives the user information from the database.
What does it mean? That the delay with the last block from the blockchain is approximately **~5 blocks.**
**And this is a lot!**
* *Only `tx` and `block` pages used web3 connection, `address` page used `bscscan api`.*

\- **It is not possible to directly request a "transaction list of an address" through the blockchain.**
> Blockchain only stores a chain of blocks, where some address moves coins or makes other interactions.

> To achieve the **"list of transactions of the address"** you need to save all transactions of the address in the database, as the same **bscscan** does, on this site it is used only for this purpose.