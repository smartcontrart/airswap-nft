const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swappy Unit", () => {
  let snapshotId;
  let deployer;
  let anyone;
  let swappy;

  beforeEach(async () => {
    snapshotId = await ethers.provider.send("evm_snapshot");
  });

  afterEach(async () => {
    await ethers.provider.send("evm_revert", [snapshotId]);
  });

  before(async () => {
    [deployer, anyone] = await ethers.getSigners();
    swappy = await ethers.deployContract("Swappy");
  });

  describe("Unit test", async () => {
    it("constructor sets default values", async () => {
      expect(await swappy.name()).to.be.equal("Swappy");
    });

    it("deployer can set the base URI", async () => {
      await swappy.connect(deployer).mint(anyone);
      await swappy.connect(deployer).setBaseURI("baseURI/");
      expect(await swappy.tokenURI(0)).to.equal("baseURI/0");
    });

    it("anyone cannot set the base URI", async () => {
      await expect(
        swappy.connect(anyone).setBaseURI("anyone'sURI/")
      ).to.be.revertedWithCustomError(swappy, "OwnableUnauthorizedAccount");
    });

    it("deployer can mint a Swappy", async () => {
      expect(await swappy.connect(deployer).mint(anyone)).to.emit(
        swappy,
        "Mint"
      );
    });

    it("deployer can batchMint Swappies", async () => {
      await swappy.connect(deployer).batchMint([anyone, anyone]);
      expect(
        await swappy.connect(anyone).balanceOf(anyone.address)
      ).to.be.equal(2);
    });

    it("anyone cannot mint a Swappy", async () => {
      await expect(
        swappy.connect(anyone).mint(anyone)
      ).to.be.revertedWithCustomError(swappy, "OwnableUnauthorizedAccount");
    });

    it("anyone cannot batchMint Swappies", async () => {
      await expect(
        swappy.connect(anyone).batchMint([anyone, anyone])
      ).to.be.revertedWithCustomError(swappy, "OwnableUnauthorizedAccount");
    });

    it("anyone can burn its Swappy", async () => {
      await swappy.connect(deployer).mint(anyone);
      await expect(swappy.connect(anyone).burn(0)).to.emit(swappy, "Burn");
    });

    it("anyone can batchBurn its Swappies", async () => {
      await swappy.connect(deployer).batchMint([anyone, anyone]);
      await swappy.connect(anyone).batchBurn([0, 1]);
      expect(await swappy.connect(anyone).balanceOf(anyone.address)).to.equal(
        0
      );
    });

    it("tokenId increments consecutively as expected", async () => {
      expect(await swappy.tokenId()).to.equal(0);
      await swappy.connect(deployer).mint(anyone);
      expect(await swappy.tokenId()).to.equal(1);
      await swappy.connect(deployer).batchMint([anyone, anyone]);
      expect(await swappy.tokenId()).to.equal(3);
    });
  });
});
