// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract RushHourSolver {
    enum Orientation {
        Horizontal,
        Vertical
    }

    enum MovementDirection {
        None,
        Up,
        Right,
        Down,
        Left
    }
    struct Step {
        uint8 carId;
        MovementDirection direction;
    }
    struct State {
        uint8[6][6] board;
        Step step;
    }

    struct Path {
        State lastState;
        Step[] steps;
    }

    function helloWorld() public pure returns (string memory) {
        return "Hello world";
    }

    function solve(
        uint8[6][6] memory board
    ) external view returns (Step[] memory) {
        return bfs(board);
    }

    function bfs(
        uint8[6][6] memory board
    ) private view returns (Step[] memory) {
        Path[] memory queue = new Path[](1000);
        State memory initialState = State(
            board,
            Step(0, MovementDirection.None)
        );
        Step[] memory initialSteps = new Step[](1);
        initialSteps[0] = Step(0, MovementDirection.None);

        Path memory initialPath = Path(initialState, initialSteps);

        queue[0] = initialPath;

        bytes32[] memory seenStates = new bytes32[](1300);

        uint256 queueSize = 1;
        uint256 seenStatesSize = 0;
        uint256 nextQueueItem = 0;

        while (queueSize > nextQueueItem) {
            console.log("------------------------");
            console.log("gasLeft: ", gasleft());
            console.log(nextQueueItem);
            // Path memory path = queue[nextQueueItem];
            // State memory lastState = queue[nextQueueItem].lastState;

            console.log("isGoalState gasLeft: ", gasleft());
            if (isGoalState(queue[nextQueueItem].lastState.board)) {
                console.log("achieve goal state");

                return queue[nextQueueItem].steps;
            }

            console.log("getNextStates gasLeft: ", gasleft());
            State[] memory nextStates = getNextStates(
                queue[nextQueueItem].lastState.board
            );

            for (uint8 i = 0; i < nextStates.length; i++) {
                bytes32 stateAsHash = getHash(nextStates[i].board);

                if (!stateAsHashExists(seenStates, stateAsHash)) {
                    printState(nextStates[i]);
                    seenStates[seenStatesSize] = stateAsHash;
                    seenStatesSize++;

                    Step[] memory steps = new Step[](
                        queue[nextQueueItem].steps.length + 1
                    );

                    for (
                        uint256 index = 0;
                        index < queue[nextQueueItem].steps.length;
                        index++
                    ) {
                        steps[index] = queue[nextQueueItem].steps[index];
                    }
                    steps[queue[nextQueueItem].steps.length] = nextStates[i]
                        .step;

                    queue[queueSize] = Path(nextStates[i], steps);
                    queueSize++;
                }
            }
            nextQueueItem++;
            console.log("nextStates.length: ", nextStates.length);
            console.log("------------------------");
        }
        return new Step[](0);
    }

    function printState(State memory state) private pure {
        for (uint256 row = 0; row < 6; row++) {
            string memory a = Strings.toString(state.board[row][0]);
            string memory b = Strings.toString(state.board[row][1]);
            string memory c = Strings.toString(state.board[row][2]);
            string memory d = Strings.toString(state.board[row][3]);
            string memory e = Strings.toString(state.board[row][4]);
            string memory f = Strings.toString(state.board[row][5]);

            console.log(string(abi.encodePacked(a, b, c, d, e, f)));
        }
        console.log("");
    }

    function isGoalState(uint8[6][6] memory board) private pure returns (bool) {
        return board[2][5] == 1;
    }

    function getStatesSteps(
        State[] memory states
    ) private pure returns (Step[] memory) {
        Step[] memory steps = new Step[](states.length - 1);
        for (uint8 i = 1; i < states.length; i++) {
            steps[i - 1] = states[i].step;
        }
        return steps;
    }

    function getNextStates(
        uint8[6][6] memory initialBoard
    ) private view returns (State[] memory) {
        State[] memory states = new State[](13);

        console.log("getNextStates: ", gasleft());

        uint stateCount = 0;
        for (uint8 row = 0; row < 6; row++) {
            for (uint8 col = 0; col < 6; col++) {
                uint8 carNumber = initialBoard[row][col];

                if (isCar(carNumber)) {
                    console.log("is car: ", gasleft());
                    Orientation orientation = getOrientation(
                        initialBoard,
                        row,
                        col,
                        carNumber
                    );

                    if (orientation == Orientation.Horizontal) {
                        console.log("moving horizontal: ", gasleft());
                        bool boardChanged = false;
                        uint8[6][6] memory boardMovedToRight;

                        (boardMovedToRight, boardChanged) = moveCarToRight(
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );
                        if (boardChanged) {
                            states[stateCount] = State(
                                boardMovedToRight,
                                Step(carNumber, MovementDirection.Right)
                            );
                            stateCount++;
                        }

                        uint8[6][6] memory boardMovedToLeft;
                        (boardMovedToLeft, boardChanged) = moveCarToLeft(
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );
                        if (boardChanged) {
                            states[stateCount] = State(
                                boardMovedToLeft,
                                Step(carNumber, MovementDirection.Left)
                            );
                            stateCount++;
                        }
                    } else {
                        bool boardChanged;

                        uint8[6][6] memory boardMovedUp;

                        (boardMovedUp, boardChanged) = moveCarUp(
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );
                        if (boardChanged) {
                            states[stateCount] = State(
                                boardMovedUp,
                                Step(carNumber, MovementDirection.Up)
                            );
                            stateCount++;
                        }
                        uint8[6][6] memory boardMovedDown;
                        (boardMovedDown, boardChanged) = moveCarDown(
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );
                        if (boardChanged) {
                            states[stateCount] = State(
                                boardMovedDown,
                                Step(carNumber, MovementDirection.Down)
                            );
                            stateCount++;
                        }
                    }
                }
            }
        }

        uint statesToDelete = states.length - stateCount;

        assembly {
            mstore(states, sub(mload(states), statesToDelete))
        }
        return states;
    }

    function copyBoard(
        uint8[6][6] memory boardToCopy
    ) private pure returns (uint8[6][6] memory) {
        uint8[6][6] memory board;
        for (uint8 row = 0; row < 6; row++) {
            for (uint8 col = 0; col < 6; col++) {
                board[row][col] = boardToCopy[row][col];
            }
        }
        return board;
    }

    function isCar(uint8 carNumber) private pure returns (bool) {
        return carNumber > 0;
    }

    function getOrientation(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (Orientation) {
        uint8 lastCol;
        uint8 nextCol;

        if (col < 5) {
            nextCol = board[row][col + 1];
        }

        if (col > 0) {
            lastCol = board[row][col - 1];
        }

        if (nextCol == carNumber || lastCol == carNumber) {
            return Orientation.Horizontal;
        }
        return Orientation.Vertical;
    }

    function moveCarToRight(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (uint8[6][6] memory, bool) {
        if (canMoveToRight(board, row, col)) {
            uint8[6][6] memory boardCopied = copyBoard(board);

            boardCopied[row][col + 1] = carNumber;

            if (col > 1 && boardCopied[row][col - 2] == carNumber) {
                boardCopied[row][col - 2] = 0;
            } else {
                boardCopied[row][col - 1] = 0;
            }
            return (boardCopied, true);
        }
        return (board, false);
    }

    function canMoveToRight(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private pure returns (bool) {
        return col < 5 && board[row][col + 1] == 0;
    }

    function moveCarToLeft(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (uint8[6][6] memory, bool) {
        if (canMoveToLeft(board, row, col)) {
            uint8[6][6] memory boardCopied = copyBoard(board);

            boardCopied[row][col - 1] = carNumber;
            if (col < 4 && boardCopied[row][col + 2] == carNumber) {
                boardCopied[row][col + 2] = 0;
            } else {
                boardCopied[row][col + 1] = 0;
            }

            return (boardCopied, true);
        }
        return (board, false);
    }

    function canMoveToLeft(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private pure returns (bool) {
        return col > 0 && board[row][col - 1] == 0;
    }

    function moveCarUp(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (uint8[6][6] memory, bool) {
        if (canMoveUp(board, row, col)) {
            uint8[6][6] memory boardCopied = copyBoard(board);

            if (row < 4 && boardCopied[row + 2][col] == carNumber) {
                boardCopied[row + 2][col] = 0;
            } else {
                boardCopied[row + 1][col] = 0;
            }

            boardCopied[row - 1][col] = carNumber;
            return (boardCopied, true);
        }
        return (board, false);
    }

    function canMoveUp(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private pure returns (bool) {
        return row > 0 && board[row - 1][col] == 0;
    }

    function moveCarDown(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal view returns (uint8[6][6] memory, bool) {
        if (canMoveDown(board, row, col)) {
            uint8[6][6] memory boardCopied = copyBoard(board);

            if (row > 1 && boardCopied[row - 2][col] == carNumber) {
                boardCopied[row - 2][col] = 0;
            } else {
                boardCopied[row - 1][col] = 0;
            }

            boardCopied[row + 1][col] = carNumber;
            return (boardCopied, true);
        }
        return (board, false);
    }

    function canMoveDown(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private view returns (bool) {
        return row < 5 && board[row + 1][col] == 0;
    }

    function getHash(uint8[6][6] memory board) private pure returns (bytes32) {
        return keccak256(abi.encode(board));
    }

    function stateAsHashExists(
        bytes32[] memory seenStates,
        bytes32 stateAsHash
    ) private pure returns (bool) {
        for (uint256 index = 0; index < seenStates.length; index++) {
            if (seenStates[index] == stateAsHash) {
                return true;
            }
        }
        return false;
    }
}
