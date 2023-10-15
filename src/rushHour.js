const { Queue } = require("./queue");
const movementDirection = require("./movementDirection");

class Step {
  constructor(carNumber, movementDirection) {
    this.carNumber = carNumber;
    this.movementDirection = movementDirection;
  }
}

class State {
  constructor(board, step) {
    this.board = board;
    this.step = step;
  }
}

class Path {
  constructor(states) {
    this.states = states;
  }
}

class RushHour {
  MAX_INDEX = 5;
  MAIN_CAR = 1;
  HORIZONTAL = "horizontal";
  VERTICAL = "vertical";

  queue = new Queue();

  getOrientation(board, carNumber) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const element = board[row][col];
        if (element === carNumber) {
          let nextCol = board[row][col + 1];

          if (nextCol === carNumber) {
            return this.HORIZONTAL;
          }
          return this.VERTICAL;
        }
      }
    }
  }

  canMoveUp(board, row, col) {
    return row > 0 && board[row - 1][col] === 0;
  }

  canMoveDown(board, row, col) {
    return row < this.MAX_INDEX && board[row + 1][col] === 0;
  }

  canMoveToRight(board, row, col) {
    return col < this.MAX_INDEX && board[row][col + 1] === 0;
  }

  canMoveToLeft(board, row, col) {
    return col > 0 && board[row][col - 1] === 0;
  }

  bfs(initialState) {
    const queue = [new Path([new State(initialState)])];
    const seenStates = new Set();
    while (queue.length > 0) {
      const path = queue.shift();
      const lastState = path.states[path.states.length - 1];
      if (this.isGoalState(lastState.board)) {
        return path.states.slice(1).map((state) => state.step);
      }

      const nextStates = this.getNextStates(lastState.board);

      for (const nextState of nextStates) {
        const stateAsHash = this.getHash(nextState.board);
        if (!seenStates.has(stateAsHash)) {
          seenStates.add(stateAsHash);
          queue.push(new Path([...path.states, nextState]));
        }
      }
    }
    return [];
  }

  getHash(state) {
    let result = "";
    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        result += `${state[row][col]}`;
      }
    }
    return result;
  }

  isGoalState(state) {
    return state[2][5] === this.MAIN_CAR;
  }

  solve(initialBoard) {
    return this.bfs(initialBoard);
  }

  moveCarToRight(board, row, col, carNumber) {
    if (this.canMoveToRight(board, row, col)) {
      board[row][col + 1] = carNumber;

      if (board[row][col - 2] === carNumber) {
        board[row][col - 2] = 0;
      } else {
        board[row][col - 1] = 0;
      }
      return board;
    }
    return null;
  }

  moveCarToLeft(board, row, col, carNumber) {
    if (this.canMoveToLeft(board, row, col)) {
      board[row][col - 1] = carNumber;
      if (board[row][col + 2] === carNumber) {
        board[row][col + 2] = 0;
      } else {
        board[row][col + 1] = 0;
      }

      return board;
    }
    return null;
  }

  moveCarUp(board, row, col, carNumber) {
    if (this.canMoveUp(board, row, col)) {
      if (board[row + 2] && board[row + 2][col] === carNumber) {
        board[row + 2][col] = 0;
      } else {
        board[row + 1][col] = 0;
      }

      board[row - 1][col] = carNumber;
      return board;
    }
    return null;
  }

  moveCarDown(board, row, col, carNumber) {
    if (this.canMoveDown(board, row, col)) {
      if (board[row - 2] && board[row - 2][col] === carNumber) {
        board[row - 2][col] = 0;
      } else {
        board[row - 1][col] = 0;
      }

      board[row + 1][col] = carNumber;
      return board;
    }
    return null;
  }

  getNextStates(initialBoard) {
    const states = [];
    if (this.hasAnotherHorizontalCarInFrontOfMain(initialBoard)) {
      return [];
    }
    for (let row = 0; row < initialBoard.length; row++) {
      for (let col = 0; col < initialBoard[row].length; col++) {
        const carNumber = initialBoard[row][col];

        if (this.isCar(carNumber)) {
          const orientation = this.getOrientation(initialBoard, carNumber);

          if (orientation === this.HORIZONTAL) {
            let board = this.createACopy(initialBoard);

            let boardMovedToRight = this.moveCarToRight(
              board,
              row,
              col,
              carNumber
            );

            if (boardMovedToRight) {
              states.push(
                new State(
                  boardMovedToRight,
                  new Step(carNumber, movementDirection.right)
                )
              );
            }
            let boardMovedToLeft = this.moveCarToLeft(
              this.createACopy(initialBoard),
              row,
              col,
              carNumber
            );

            if (boardMovedToLeft) {
              states.push(
                new State(
                  boardMovedToLeft,
                  new Step(carNumber, movementDirection.left)
                )
              );
            }
          } else {
            let boardMovedUp = this.moveCarUp(
              this.createACopy(initialBoard),
              row,
              col,
              carNumber
            );

            if (boardMovedUp) {
              states.push(
                new State(
                  boardMovedUp,
                  new Step(carNumber, movementDirection.up)
                )
              );
            }

            let boardMovedDown = this.moveCarDown(
              this.createACopy(initialBoard),
              row,
              col,
              carNumber
            );
            if (boardMovedDown) {
              states.push(
                new State(
                  boardMovedDown,
                  new Step(carNumber, movementDirection.down)
                )
              );
            }
          }
        }
      }
    }

    return states;
  }

  hasAnotherHorizontalCarInFrontOfMain(state) {
    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        const isMainCar = state[row][col] === this.MAIN_CAR;
        const nextCol = state[row][col + 1];
        const nextColIsAnotherCar = nextCol > 1;

        if (isMainCar && nextColIsAnotherCar) {
          const orientation = this.getOrientation(state, nextCol);
          return orientation === this.HORIZONTAL;
        }
      }
    }
    return false;
  }

  isCar(element) {
    return element && element !== 0;
  }

  createACopy(board) {
    return board.map(function (row) {
      return row.slice();
    });
  }
}

module.exports = { RushHour };
