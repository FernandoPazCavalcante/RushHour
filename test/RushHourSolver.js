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

  it.skip("should be defined", async () => {
    const rushHourSolver = (await deployRushHourSolverFixture()).rushHourSolver;

    expect(rushHourSolver).to.not.be.null;
    expect(await rushHourSolver.helloWorld()).to.be.equal("Hello world");
  });

  it.skip("should return two steps", async () => {
    const { rushHourSolver } = await loadFixture(deployRushHourSolverFixture);
    const mainCar = 1;

    const tx = await rushHourSolver.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, mainCar, mainCar, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    await tx.wait();
    const resultSteps = await rushHourSolver.getResultSteps();
    expect(resultSteps.length).to.be.equal(2);
  });

  it.skip("should return six steps", async () => {
    const { rushHourSolver } = await loadFixture(deployRushHourSolverFixture);

    const tx = await rushHourSolver.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [1, 1, 2, 3, 0, 0],
      [0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    await tx.wait();
    const resultSteps = await rushHourSolver.getResultSteps();

    expect(resultSteps.length).to.be.equal(6);
  });

  it("should verify hash", async () => {
    const { rushHourSolver } = await loadFixture(deployRushHourSolverFixture);
    const tx = await rushHourSolver.setSeenStates([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [1, 1, 2, 3, 0, 0],
      [0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    await tx.wait();

    const hash = await rushHourSolver.getHash([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [1, 1, 2, 3, 0, 0],
      [0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    const stateAlreadyExists = await rushHourSolver.seenStates(hash);

    expect(stateAlreadyExists).to.be.equal(true);
  })
});
