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

    struct Neighbor {
        State[] states;
        uint8 movesFound;
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

    function solve(uint8[6][6] memory board) external {
        bfs(board);
    }

    mapping(bytes32 => bool) public seenStates;
    Step[] private resultSteps;

    function getResultSteps() public view returns (Step[] memory) {
        return resultSteps;
    }

    function bfs(uint8[6][6] memory board) private {
        Neighbor memory neighbor = Neighbor(new State[](13), 0);

        Path[] memory queue = new Path[](1000);
        State memory initialState = State(
            board,
            Step(0, MovementDirection.None)
        );
        Step[] memory initialSteps = new Step[](1);
        initialSteps[0] = Step(0, MovementDirection.None);

        Path memory initialPath = Path(initialState, initialSteps);

        queue[0] = initialPath;

        uint256 queueSize = 1;
        uint256 seenStatesSize = 0;
        uint256 nextQueueItem = 0;

        while (queueSize > nextQueueItem) {
            console.log("------------------------");
            console.log("gasLeft: ", gasleft());
            console.log("queueSize: ", queueSize);
            console.log("nextQueueItem: ", nextQueueItem);

            // Path memory path = queue[nextQueueItem];
            // State memory lastState = queue[nextQueueItem].lastState;
            console.log("getNextStates gasLeft: ", gasleft());
            getNextStates(queue[nextQueueItem].lastState.board, neighbor);

            for (uint8 i = 0; i < neighbor.movesFound; i++) {
                printState(neighbor.states[i]);
                bytes32 stateAsHash = getHash(neighbor.states[i].board);

                if (!seenStates[stateAsHash]) {
                    seenStates[stateAsHash] = true;
                    seenStatesSize++;

                    if (isGoalState(queue[nextQueueItem].lastState.board)) {
                        for (
                            uint256 index = 1;
                            index < queue[nextQueueItem].steps.length;
                            index++
                        ) {
                            resultSteps.push(queue[nextQueueItem].steps[index]);
                        }
                    }

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
                    steps[queue[nextQueueItem].steps.length] = neighbor
                        .states[i]
                        .step;

                    queue[queueSize] = Path(neighbor.states[i], steps);
                    queueSize++;
                }
            }
            console.log("loop: ", nextQueueItem);
            console.log("neighbors: ", neighbor.movesFound);
            nextQueueItem++;
            console.log("------------------------");
        }
    }

    function setSeenStates(uint8[6][6] memory board) public returns (bytes32) {
        bytes32 hash = getHash(board);
        seenStates[hash] = true;
        return hash;
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
        uint8[6][6] memory initialBoard,
        Neighbor memory neighbor
    ) private view {
        neighbor.movesFound = 0;

        for (uint8 row = 0; row < 6; row++) {
            for (uint8 col = 0; col < 6; col++) {
                uint8 carNumber = initialBoard[row][col];

                if (isCar(carNumber)) {
                    Orientation orientation = getOrientation(
                        initialBoard,
                        row,
                        col,
                        carNumber
                    );

                    if (orientation == Orientation.Horizontal) {
                        bool boardChanged = false;

                        boardChanged = moveCarToRight(
                            neighbor.states,
                            neighbor.movesFound,
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );
                        if (boardChanged) {
                            neighbor.movesFound++;
                        }

                        boardChanged = moveCarToLeft(
                            neighbor.states,
                            neighbor.movesFound,
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );

                        if (boardChanged) {
                            neighbor.movesFound++;
                        }
                    } else {
                        bool boardChanged;

                        boardChanged = moveCarUp(
                            neighbor.states,
                            neighbor.movesFound,
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );

                        if (boardChanged) {
                            neighbor.movesFound++;
                        }

                        boardChanged = moveCarDown(
                            neighbor.states,
                            neighbor.movesFound,
                            initialBoard,
                            row,
                            col,
                            carNumber
                        );

                        if (boardChanged) {
                            neighbor.movesFound++;
                        }
                    }
                }
            }
        }
    }

    function copyBoard(
        State[] memory states,
        uint8 statePosition,
        uint8[6][6] memory boardToCopy
    ) private pure {
        for (uint8 row = 0; row < 6; row++) {
            for (uint8 col = 0; col < 6; col++) {
                states[statePosition].board[row][col] = boardToCopy[row][col];
            }
        }
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
        State[] memory states,
        uint8 statePosition,
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (bool) {
        if (canMoveToRight(board, row, col)) {
            copyBoard(states, statePosition, board);

            states[statePosition].board[row][col + 1] = carNumber;

            if (
                col > 1 &&
                states[statePosition].board[row][col - 2] == carNumber
            ) {
                states[statePosition].board[row][col - 2] = 0;
            } else {
                states[statePosition].board[row][col - 1] = 0;
            }

            states[statePosition].step = Step(
                carNumber,
                MovementDirection.Right
            );

            return true;
        }
        return false;
    }

    function canMoveToRight(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private pure returns (bool) {
        return col < 5 && board[row][col + 1] == 0;
    }

    function moveCarToLeft(
        State[] memory states,
        uint8 statePosition,
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (bool) {
        if (canMoveToLeft(board, row, col)) {
            copyBoard(states, statePosition, board);

            states[statePosition].board[row][col - 1] = carNumber;
            if (
                col < 4 &&
                states[statePosition].board[row][col + 2] == carNumber
            ) {
                states[statePosition].board[row][col + 2] = 0;
            } else {
                states[statePosition].board[row][col + 1] = 0;
            }

            states[statePosition].step = Step(
                carNumber,
                MovementDirection.Left
            );

            return true;
        }
        return false;
    }

    function canMoveToLeft(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private pure returns (bool) {
        return col > 0 && board[row][col - 1] == 0;
    }

    function moveCarUp(
        State[] memory states,
        uint8 statePosition,
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal pure returns (bool) {
        if (canMoveUp(board, row, col)) {
            copyBoard(states, statePosition, board);
            if (
                row < 4 &&
                states[statePosition].board[row + 2][col] == carNumber
            ) {
                states[statePosition].board[row + 2][col] = 0;
            } else {
                states[statePosition].board[row + 1][col] = 0;
            }

            states[statePosition].board[row - 1][col] = carNumber;
            states[statePosition].step = Step(carNumber, MovementDirection.Up);
            return true;
        }
        return false;
    }

    function canMoveUp(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private pure returns (bool) {
        return row > 0 && board[row - 1][col] == 0;
    }

    function moveCarDown(
        State[] memory states,
        uint8 statePosition,
        uint8[6][6] memory board,
        uint8 row,
        uint8 col,
        uint8 carNumber
    ) internal view returns (bool) {
        if (canMoveDown(board, row, col)) {
            copyBoard(states, statePosition, board);

            if (
                row > 1 &&
                states[statePosition].board[row - 2][col] == carNumber
            ) {
                states[statePosition].board[row - 2][col] = 0;
            } else {
                states[statePosition].board[row - 1][col] = 0;
            }

            states[statePosition].board[row + 1][col] = carNumber;
            states[statePosition].step = Step(
                carNumber,
                MovementDirection.Down
            );
            return true;
        }
        return false;
    }

    function canMoveDown(
        uint8[6][6] memory board,
        uint8 row,
        uint8 col
    ) private view returns (bool) {
        return row < 5 && board[row + 1][col] == 0;
    }

    function getHash(uint8[6][6] memory board) public pure returns (bytes32) {
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
