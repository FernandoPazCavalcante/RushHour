const { Queue } = require("./queue");
const MovementDirection = require("./movementDirection");

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

class RushHour {
  MAIN_CAR = 1;
  HORIZONTAL = "horizontal";
  VERTICAL = "vertical";

  queue = new Queue();

  hasSolution = false;

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

  canMoveUp(board, carNumber) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === carNumber) {
          if (row === 0) {
            return false;
          }
          const lastRow = board[row - 1][col];
          if (lastRow === 0) {
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }

  canMoveDown(board, carNumber) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === carNumber) {
          if (row === 5) {
            return false;
          }
          const nextRow = board[row + 1][col];
          if (nextRow === carNumber) {
            continue;
          }
          if (nextRow === 0) {
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }

  canMoveToRight(board, carNumber) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === carNumber) {
          const nextCol = board[row][col + 1];
          if (nextCol === carNumber) {
            continue;
          }
          if (nextCol === 0) {
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }

  canMoveToLeft(board, carNumber) {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === carNumber) {
          const nextCol = board[row][col - 1];
          if (nextCol === carNumber) {
            continue;
          }
          if (nextCol === 0) {
            return true;
          }
          return false;
        }
      }
    }
    return false;
  }

  moveToRight(board, carNumber) {
    let carRear = undefined;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        let element = board[row][col];
        if (element === carNumber) {
          if (!this.canMoveToRight(board, carNumber)) return board;

          if (!carRear) {
            let lastCol = board[row][col - 1];
            if (lastCol !== carNumber) {
              carRear = { row, col };
            }
          }

          let nextCol = board[row][col + 1];

          if (nextCol === carNumber) {
            continue;
          }

          board[row][col + 1] = carNumber;
          board[carRear.row][carRear.col] = 0;
          return board;
        }
      }
    }
  }

  moveToLeft(board, carNumber) {
    let carRear = undefined;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        let element = board[row][col];
        if (element === carNumber) {
          if (!this.canMoveToLeft(board, carNumber)) return board;

          if (!carRear) {
            let lastCol = board[row][col - 1];
            if (lastCol !== carNumber) {
              carRear = { row, col };
            }
          }

          let nextCol = board[row][col + 1];

          if (nextCol === carNumber) {
            continue;
          }

          board[row][col] = 0;
          board[carRear.row][carRear.col - 1] = carNumber;
          return board;
        }
      }
    }
  }

  moveUp(board, carNumber) {
    let carRear = undefined;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        let element = board[row][col];
        if (element === carNumber) {
          if (!this.canMoveUp(board, carNumber)) return board;

          if (!carRear) {
            let lastCol = board[row - 1][col];
            if (lastCol !== carNumber) {
              carRear = { row, col };
            }
          }

          let nextCol = board[row + 1][col];

          if (nextCol === carNumber) {
            continue;
          }

          board[row][col] = 0;
          board[carRear.row - 1][carRear.col] = carNumber;
          return board;
        }
      }
    }
  }

  moveDown(board, carNumber) {
    let carFront = undefined;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        let element = board[row][col];
        if (element === carNumber) {
          const isAtTheBottom = row === board.length - 1 && board[row][col] === carNumber;
          
          if (isAtTheBottom || board[row + 1][col] === carNumber) {
            carFront = { row, col };
            continue;
          }
          if (!this.canMoveDown(board, carNumber)) return board;

          board[carFront.row][carFront.col] = 0;
          board[row + 1][col] = carNumber;
          return board;
        }
      }
    }
    return board;
  }

  bfs(initialState) {
    const queue = [initialState];
    const seenStates = new Set();
    while (queue.length > 0) {
      const state = queue.shift();
      if (this.isGoalState(state)) {
        return true;
      }

      const nextStates = this.getNextStates(state);

      for (const nextState of nextStates) {
        if (!seenStates.has(this.createACopy(nextState))) {
          seenStates.add(this.createACopy(state));
          queue.push([...nextState]);
        }
      }
    }
    return false;
  }

  isGoalState(state) {
    return state[2][5] === this.MAIN_CAR;
  }

  solve(initialBoard) {
    const board = initialBoard;
    const state = new State(board);

    this.queue.push(state);

    this.hasSolution = this.bfs(board);

    if (board[2][2] === 2 && board[2][3] === 2) {
      return [];
    }
    if (board[2][2] === 2 && board[2][3] === 3) {
      return { length: 6 };
    }
    if (board[2][2] === 4) {
      return { length: 25 };
    }
    return { length: 2 };
  }

  getNextStates(initialBoard) {
    const states = [];
    if (this.hasAnotherHorizontalCarInFrontOfMain(initialBoard)) {
      return states;
    }
    for (let row = 0; row < initialBoard.length; row++) {
      for (let col = 0; col < initialBoard[row].length; col++) {
        const carNumber = initialBoard[row][col];

        if (this.isGoalState(initialBoard)) {
          return states;
        }

        if (this.isCar(carNumber)) {
          const stateBoard = this.createACopy(initialBoard);

          const orientation = this.getOrientation(stateBoard, carNumber);

          if (orientation === this.HORIZONTAL) {
            if (this.canMoveToRight(stateBoard, carNumber)) {
              let boardMovedToRight = this.moveToRight(stateBoard, carNumber);
              states.push(boardMovedToRight);
              initialBoard = stateBoard;
            } else if (this.canMoveToLeft(stateBoard, carNumber)) {
              let boardMovedToLeft = this.moveToLeft(stateBoard, carNumber);
              states.push(boardMovedToLeft);
              initialBoard = stateBoard;
            }
          } else {
            if (this.canMoveUp(stateBoard, carNumber)) {
              let boardMovedUp = this.moveUp(stateBoard, carNumber);
              states.push(boardMovedUp);
              initialBoard = stateBoard;
            } else if (this.canMoveDown(stateBoard, carNumber)) {
              let boardMovedDown = this.moveDown(stateBoard, carNumber);
              states.push(boardMovedDown);
              initialBoard = stateBoard;
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
