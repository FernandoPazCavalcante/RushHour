const { Queue } = require("../src/queue");

describe("Rush Hour test", () => {
  var queue = new Queue();

  beforeEach(() => {
    queue = new Queue();
  });

  it("should be defined", () => {
    var queue = new Queue();
    expect(queue).toBeDefined();
  });

  it("should start an empty queue", () => {
    expect(queue.isEmpty()).toBe(true);
  });

  it("should not be empty after on push", () => {
    queue.push("test");

    expect(queue.isEmpty()).toBe(false);
  });

  it("will throw error when pop when is empty", () => {
    var popEmpty = () => queue.pop();
    expect(popEmpty).toThrow(new Error("Queue is empty."));
  });

  it("should be empty when one push and one pop", () => {
    queue.push("test");
    queue.pop();

    expect(queue.isEmpty()).toBe(true);
  });

  it("should not be empty when two pushes and one pop", () => {
    queue.push("test");
    queue.push("test1");
    queue.pop();

    expect(queue.isEmpty()).toBe(false);
  });
});
