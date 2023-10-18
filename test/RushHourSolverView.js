const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Rush Hour test", () => {
  async function deployRushHourSolverFixture() {
    const [owner] = await ethers.getSigners();

    const RushHourSolver = await ethers.getContractFactory(
      "RushHourSolverView"
    );
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

  it("should return six steps", async () => {
    const { rushHourSolver } = await loadFixture(deployRushHourSolverFixture);

    const result = await rushHourSolver.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [1, 1, 2, 3, 0, 0],
      [0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    expect(result.length).to.be.equal(6);
  });

  it.skip("should return twenty five steps", async () => {
    const { rushHourSolver } = await loadFixture(deployRushHourSolverFixture);

    const result = await rushHourSolver.solve([
      [2, 2, 2, 0, 0, 3],
      [0, 0, 4, 0, 0, 3],
      [1, 1, 4, 0, 0, 3],
      [5, 0, 4, 0, 6, 6],
      [5, 0, 0, 0, 7, 0],
      [8, 8, 8, 0, 7, 0],
    ]);

    expect(result.length).to.be.equal(25);
  });
});
