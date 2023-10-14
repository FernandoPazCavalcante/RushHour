const { RushHour } = require("../src/rushHour");

describe("Rush Hour test", () => {
  let rushHour = new RushHour();

  beforeEach(() => {
    rushHour = new RushHour();
  });

  it("should instantiate", () => {
    let rushHour = new RushHour();
    expect(rushHour).toBeDefined();
  });

  it("should identify car as vertical orientation", () => {
    const car = 1;

    const result = rushHour.getOrientation(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe("vertical");
  });

  it("should identify car as horizontal", () => {
    const car = 1;

    const result = rushHour.getOrientation(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, car, car, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe("horizontal");
  });

  it("should allow car to go up", () => {
    const car = 1;

    const result = rushHour.canGoUp(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(true);
  });

  it("should allow car to go down", () => {
    const car = 1;

    const result = rushHour.canGoDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(true);
  });

  it("should disallow car to go down when has other car", () => {
    const car = 1;
    const otherCar = 2;
    const result = rushHour.canGoDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, otherCar, otherCar, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go down when is at the bottom", () => {
    const car = 1;
    const result = rushHour.canGoDown(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, car, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go up when is at the top", () => {
    const car = 1;
    const result = rushHour.canGoUp(
      [
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, car, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should allow car to go to right", () => {
    const car = 1;

    const result = rushHour.canGoToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, car, car, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(true);
  });

  it("should allow car to go to left", () => {
    const car = 1;

    const result = rushHour.canGoToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, car, car, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(true);
  });

  it("should disallow car to go to right when has another car", () => {
    const car = 1;
    const anotherCar = 2;
    const result = rushHour.canGoToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, anotherCar, 0],
        [0, car, car, anotherCar, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go to left when has another car", () => {
    const car = 1;
    const anotherCar = 2;

    const result = rushHour.canGoToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [anotherCar, 0, 0, 0, 0, 0],
        [anotherCar, car, car, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go to right when is at the end", () => {
    const car = 1;
    const result = rushHour.canGoToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, car],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should disallow car to go to left when is at the beginning", () => {
    const car = 1;
    const result = rushHour.canGoToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [car, car, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toBe(false);
  });

  it("should move car to right", () => {
    const car = 1;
    const result = rushHour.goToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [car, car, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, car, car, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should move car to left", () => {
    const car = 1;
    const result = rushHour.goToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, car, car, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toStrictEqual([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [car, car, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);
  });

  it("should not move car to right when has another car", () => {
    const car = 1;
    const anotherCar = 2;
    const result = rushHour.goToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [car, car, anotherCar, 0, 0, 0],
        [0, 0, 0, anotherCar, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toStrictEqual([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [car, car, anotherCar, 0, 0, 0],
        [0, 0, 0, anotherCar, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]);
  });

  it("should not move car to right when is at the end", () => {
    const car = 1;
    const result = rushHour.goToRight(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, car],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toStrictEqual([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, car, car],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]);
  });

  it("should not move car to left when has another car", () => {
    const car = 1;
    const anotherCar = 2;
    const result = rushHour.goToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [anotherCar, car, car, 0, 0, 0],
        [anotherCar, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toStrictEqual([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [anotherCar, car, car, 0, 0, 0],
        [anotherCar, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]);
  });
  
  it("should not move car to left when is at the beginning", () => {
    const car = 1;
    const result = rushHour.goToLeft(
      [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [car, car, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ],
      car
    );

    expect(result).toStrictEqual([
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [car, car, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ]);
  });

  it("should return two steps", () => {
    const result = rushHour.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    expect(result.length).toBe(2);
  });

  it("should return empty array", () => {
    const result = rushHour.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [1, 1, 2, 2, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    expect(result.length).toBe(0);
  });

  it("should return six steps", () => {
    const result = rushHour.solve([
      [0, 0, 0, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [1, 1, 2, 3, 0, 0],
      [0, 0, 0, 3, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ]);

    expect(result.length).toBe(6);
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

    expect(result.length).toBe(25);
  });
});
