import React, { useState, useEffect, useCallback } from 'react';

type CellValue = number | null;
type Board = CellValue[][];
type CellStatus = 'given' | 'user' | 'error';

interface Cell {
    value: CellValue;
    status: CellStatus;
    isSelected: boolean;
}

interface GameState {
    board: Cell[][];
    solution: Board;
    isComplete: boolean;
    selectedCell: [number, number] | null;
}

const SudokuGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        board: [],
        solution: [],
        isComplete: false,
        selectedCell: null
    });

    const generateCompleteBoard = (): Board => {
        const board: Board = Array(9).fill(null).map(() => Array(9).fill(null));

        const isValid = (board: Board, row: number, col: number, num: number): boolean => {
            for (let x = 0; x < 9; x++) {
                if (board[row][x] === num) return false;
            }

            for (let x = 0; x < 9; x++) {
                if (board[x][col] === num) return false;
            }

            const startRow = row - (row % 3);
            const startCol = col - (col % 3);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i + startRow][j + startCol] === num) return false;
                }
            }

            return true;
        };

        const fillBoard = (board: Board): boolean => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === null) {
                        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                        for (const num of numbers) {
                            if (isValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (fillBoard(board)) return true;
                                board[row][col] = null;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        fillBoard(board);
        return board;
    };

    const createPuzzle = (completeBoard: Board): Cell[][] => {
        const puzzle = completeBoard.map(row => row.slice());
        const cellsToRemove = 40;

        for (let i = 0; i < cellsToRemove; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            } while (puzzle[row][col] === null);

            puzzle[row][col] = null;
        }

        return puzzle.map(row =>
            row.map(value => ({
                value,
                status: value !== null ? 'given' as CellStatus : 'user' as CellStatus,
                isSelected: false
            }))
        );
    };

    const initializeGame = useCallback(() => {
        const solution = generateCompleteBoard();
        const board = createPuzzle(solution);

        setGameState({
            board,
            solution,
            isComplete: false,
            selectedCell: null
        });
    }, []);

    const validateBoard = (board: Cell[][]): Cell[][] => {
        const newBoard = board.map(row => row.map(cell => ({ ...cell, status: cell.status === 'given' ? 'given' as CellStatus : 'user' as CellStatus })));

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = newBoard[row][col];
                if (cell.value !== null && cell.status === 'user') {
                    let hasConflict = false;

                    for (let c = 0; c < 9; c++) {
                        if (c !== col && newBoard[row][c].value === cell.value) {
                            hasConflict = true;
                            break;
                        }
                    }

                    if (!hasConflict) {
                        for (let r = 0; r < 9; r++) {
                            if (r !== row && newBoard[r][col].value === cell.value) {
                                hasConflict = true;
                                break;
                            }
                        }
                    }

                    if (!hasConflict) {
                        const startRow = Math.floor(row / 3) * 3;
                        const startCol = Math.floor(col / 3) * 3;
                        for (let r = startRow; r < startRow + 3; r++) {
                            for (let c = startCol; c < startCol + 3; c++) {
                                if ((r !== row || c !== col) && newBoard[r][c].value === cell.value) {
                                    hasConflict = true;
                                    break;
                                }
                            }
                            if (hasConflict) break;
                        }
                    }

                    if (hasConflict) {
                        cell.status = 'error';
                    }
                }
            }
        }

        return newBoard;
    };

    const checkComplete = (board: Cell[][]): boolean => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col].value === null || board[row][col].status === 'error') {
                    return false;
                }
            }
        }
        return true;
    };

    const handleCellClick = (row: number, col: number) => {
        if (gameState.board[row][col].status === 'given') return;

        setGameState(prev => ({
            ...prev,
            selectedCell: [row, col],
            board: prev.board.map((r, rIdx) =>
                r.map((cell, cIdx) => ({
                    ...cell,
                    isSelected: rIdx === row && cIdx === col
                }))
            )
        }));
    };

    const handleNumberInput = (num: number) => {
        if (!gameState.selectedCell) return;

        const [row, col] = gameState.selectedCell;
        if (gameState.board[row][col].status === 'given') return;

        setGameState(prev => {
            const newBoard = prev.board.map(r => r.map(c => ({ ...c })));
            newBoard[row][col].value = newBoard[row][col].value === num ? null : num;

            const validatedBoard = validateBoard(newBoard);
            const isComplete = checkComplete(validatedBoard);

            return {
                ...prev,
                board: validatedBoard,
                isComplete
            };
        });
    };

    const handleClear = () => {
        if (!gameState.selectedCell) return;

        const [row, col] = gameState.selectedCell;
        if (gameState.board[row][col].status === 'given') return;

        setGameState(prev => {
            const newBoard = prev.board.map(r => r.map(c => ({ ...c })));
            newBoard[row][col].value = null;

            return {
                ...prev,
                board: validateBoard(newBoard)
            };
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameState.selectedCell) return;

            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                handleNumberInput(num);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState.selectedCell]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const getCellClassName = (cell: Cell, row: number, col: number) => {
        let className = 'w-10 h-10 border border-gray-300 flex items-center justify-center text-lg font-bold cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm ';

        if (row % 3 === 0) className += 'border-t-2 border-t-gray-600 ';
        if (col % 3 === 0) className += 'border-l-2 border-l-gray-600 ';
        if (row === 8) className += 'border-b-2 border-b-gray-600 ';
        if (col === 8) className += 'border-r-2 border-r-gray-600 ';

        if (cell.status === 'given') {
            className += 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 ';
        } else if (cell.status === 'error') {
            className += 'bg-gradient-to-br from-blue-200 to-blue-300 text-gray-600 ring-2 ring-blue-400 ';
        } else {
            className += 'bg-white text-blue-600 ';
        }

        if (cell.isSelected) {
            className += 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-800 ring-2 ring-blue-400 ';
        }

        if (cell.status !== 'given') {
            className += 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 ';
        }

        return className;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-700 drop-shadow-sm">
                    Sudoku
                </h1>
            </div>

            {gameState.isComplete && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-200 to-blue-300 border-2 border-blue-400 rounded-xl shadow-lg mx-auto max-w-md">
                    <p className="text-gray-700 font-bold text-lg text-center">
                        🎉 Congratulations! You solved the puzzle! 🎉
                    </p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row justify-center items-start gap-8 max-w-7xl mx-auto">

                <div className="flex-shrink-0">
                    <div className="p-3 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl shadow-lg">
                        <div className="grid grid-cols-9 gap-1 bg-white p-2 rounded-lg">
                            {gameState.board.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={getCellClassName(cell, rowIndex, colIndex)}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                    >
                                        {cell.value || ''}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 min-w-80">

                    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Number Input</h2>
                        <p className="text-gray-600 text-sm mb-4 text-center">
                            Click a cell and use number keys 1-9, or tap the buttons below
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 hover:scale-110 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                                    onClick={() => handleNumberInput(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-lg rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                            onClick={handleClear}
                        >
                            Clear Cell
                        </button>
                    </div>

                    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Game Controls</h2>
                        <button
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xl rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            onClick={initializeGame}
                        >
                            New Game
                        </button>
                    </div>

                    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
                        <h2 className="text-xl font-bold text-blue-600 mb-3 text-center">How to Play</h2>
                        <div className="text-gray-700 text-sm space-y-2">
                            <p>• Fill each row, column, and 3×3 box with digits 1-9</p>
                            <p>• Each digit must appear exactly once in each row, column, and box</p>
                            <p>• Click a cell to select it, then enter a number</p>
                            <p>• Use keyboard numbers 1-9 or click the number buttons</p>
                            <p>• Press Backspace/Delete or click Clear to remove numbers</p>
                        </div>
                    </div>

                    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200">
                        <h2 className="text-xl font-bold text-gray-700 mb-3 text-center">Game Status</h2>
                        <div className="text-gray-600 text-sm space-y-1">
                            <p>Selected: {gameState.selectedCell ? `Row ${gameState.selectedCell[0] + 1}, Col ${gameState.selectedCell[1] + 1}` : 'None'}</p>
                            <p>Status: {gameState.isComplete ? '✅ Complete!' : '🎯 In Progress'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SudokuGame;
