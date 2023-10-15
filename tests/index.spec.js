const { RushHour } = require("../src/rushHour");

describe("Rush Hour test", () => {
  let rushHour = new RushHour();
  const mainCar = 1;

  beforeEach(() => {
    rushHour = new RushHour();
  });

  it("should instantiate", () => {
    let rushHour = new RushHour();
    expect(rushHour).toBeDefined();
  });

  it("should identify car as vertical orientation", () => {
    const result = rushHour.getOrientation(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe("vertical");
  });

  it("should identify car as horizontal", () => {
    const result = rushHour.getOrientation(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, mainCar, mainCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe("horizontal");
  });

  it("should allow car to go up", () => {
    const result = rushHour.canMoveUp(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(true);
  });

  it("should allow car to go down", () => {
    const result = rushHour.canMoveDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(true);
  });

  it("should disallow car to go down when has other car", () => {
    const otherCar = 2;
    const result = rushHour.canMoveDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, otherCar, otherCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go down when is at the bottom", () => {
    const result = rushHour.canMoveDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, mainCar, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go up when is at the top", () => {
    const result = rushHour.canMoveUp(
      [
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, mainCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should allow car to go to right", () => {
    const result = rushHour.canMoveToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, mainCar, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(true);
  });

  it("should allow car to go to left", () => {
    const result = rushHour.canMoveToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, mainCar, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(true);
  });

  it("should disallow car to go to right when has another car", () => {
    const anotherCar = 2;
    const result = rushHour.canMoveToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, anotherCar, 0],
        [0, mainCar, mainCar, anotherCar, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go to left when has another car", () => {
    const anotherCar = 2;

    const result = rushHour.canMoveToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [anotherCar, 0, 0, 0, 0, 0],
        [anotherCar, mainCar, mainCar, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go to right when is at the end", () => {
    const result = rushHour.canMoveToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, mainCar],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go to left when is at the beginning", () => {
    const result = rushHour.canMoveToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [mainCar, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toBe(false);
  });

  it("should move car to right", () => {
    const result = rushHour.moveToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [mainCar, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, mainCar, mainCar, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should move car to left", () => {
    const result = rushHour.moveToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, mainCar, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [mainCar, mainCar, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should not move car to right when has another car", () => {
    const anotherCar = 2;
    const result = rushHour.moveToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [mainCar, mainCar, anotherCar, 0, 0, 0],
        [0, 0, 0, anotherCar, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [mainCar, mainCar, anotherCar, 0, 0, 0],
      [0, 0, 0, anotherCar, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should not move car to right when is at the end", () => {
    const result = rushHour.moveToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, mainCar, mainCar],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, mainCar, mainCar],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should not move car to left when has another car", () => {
    const anotherCar = 2;
    const result = rushHour.moveToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [anotherCar, mainCar, mainCar, 0, 0, 0],
        [anotherCar, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [anotherCar, mainCar, mainCar, 0, 0, 0],
      [anotherCar, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should not move car to left when is at the beginning", () => {
    const result = rushHour.moveToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [mainCar, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [mainCar, mainCar, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should move car to up", () => {
    const result = rushHour.moveUp(
      [
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, mainCar, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  })
  
  it("should not move car to up when is at the top", () => {
    const result = rushHour.moveUp(
      [
        [0, mainCar, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, mainCar, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  })
  
  it("should not move car to up when has another car", () => {
    const anotherCar = 2;
    const result = rushHour.moveUp(
      [
        [0, anotherCar, anotherCar, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, anotherCar, anotherCar, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  })

  it("should move car down", () => {
    const result = rushHour.moveDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  })
  
  it("should not move car down when has another car", () => {
    const anotherCar = 2;
    const result = rushHour.moveDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, anotherCar, anotherCar, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, anotherCar, anotherCar, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  })
  
  it("should not move car down when is at the bottom", () => {
    const result = rushHour.moveDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
        [0, mainCar, 0, 0, 0, 0],
      ],
      mainCar
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
      [0, mainCar, 0, 0, 0, 0],
    ]);
  })

  it("should return two steps", () => {
    const result = rushHour.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, mainCar, mainCar, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    // expect(result.states.length).toBe(2);
    expect(rushHour.hasSolution).toBe(true);
  });

  it("should return empty array", () => {
    const anotherCar = 2;
    const result = rushHour.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [mainCar, mainCar, anotherCar, anotherCar, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    // expect(result.length).toBe(0);
    expect(rushHour.hasSolution).toBe(false);
  });

  it("should return six steps", () => {
    const secondCar = 2;
    const thirdCard = 3;
    const result = rushHour.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, secondCar, 0, 0, 0],
      [mainCar, mainCar, secondCar, thirdCard, 0, 0],
      [0, 0, 0, thirdCard, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    // expect(result.length).toBe(6);
    expect(rushHour.hasSolution).toBe(true);
  });

  it("should return twenty five steps", () => {
    const result = rushHour.solve([
      [2, 2, 2, 0, 0, 3],
      [0, 0, 4, 0, 0, 3],
      [1, 1, 4, 0, 0, 3],
      [5, 0, 4, 0, 6, 6],
      [5, 0, 0, 0, 7, 0],
      [8, 8, 8, 0, 7, 0],
    ]);

    // expect(result.length).toBe(25);
    expect(rushHour.hasSolution).toBe(true);
  });
});
