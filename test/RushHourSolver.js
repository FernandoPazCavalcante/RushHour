const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Rush Hour test", () => {
  async function deployRushHourSolverFixture() {
    const [owner] = await ethers.getSigners();

    const RushHourSolver = await ethers.getContractFactory("RushHourSolver");
    const rushHourSolver = await RushHourSolver.deploy();

    return { rushHourSolver, owner };
  }

  it("should be defined", async () => {
    const rushHourSolver = (await deployRushHourSolverFixture()).rushHourSolver;

    expect(rushHourSolver).to.not.be.null;
    expect(await rushHourSolver.helloWorld()).to.be.equal("Hello world");
  });

  it("should return two steps", async () => {
    const { rushHourSolver } = await loadFixture(deployRushHourSolverFixture);
    const mainCar = 1;

    const result = await rushHourSolver.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, mainCar, mainCar, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    expect(result.length).to.be.equal(2);
  });
});
