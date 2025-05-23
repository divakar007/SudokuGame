# Sudoku Game

An interactive web-based Sudoku game built with **React** and **TypeScript**. It features full puzzle generation, move validation, and a user-friendly interface designed with Tailwind CSS.

## Features

- ✨ Generates valid, solvable Sudoku puzzles
- 🎯 Interactive 9x9 grid with real-time validation
- ⌨️ Keyboard and button input support
- 🔍 Highlights errors and selected cells
- 🎨 Clean and responsive UI with Tailwind CSS
- 🎲 Start new game with a click
- 📱 Mobile-friendly responsive design
- 🎮 Side-by-side layout for optimal gameplay

## Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: useState, useEffect, useCallback

## Project Structure

```
src/
├── App.tsx          # Main SudokuGame component
├── index.css        # Global styles with Tailwind
├── main.tsx         # Entry point for React app
└── components/      # Reusable UI components
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/sudoku-game.git
   cd sudoku-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the app**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## How to Play

1. **Select a cell** by clicking on any empty cell in the grid
2. **Enter numbers** using:
    - Number keys (1-9) on your keyboard
    - Click the number buttons on the right panel
3. **Clear cells** using:
    - Backspace or Delete keys
    - Click the "Clear Cell" button
4. **Win the game** by filling all cells correctly following Sudoku rules:
    - Each row must contain digits 1-9 exactly once
    - Each column must contain digits 1-9 exactly once
    - Each 3×3 box must contain digits 1-9 exactly once

## Game Controls

- **New Game**: Generate a fresh puzzle
- **Number Input**: 3×3 grid of number buttons (1-9)
- **Clear Cell**: Remove number from selected cell
- **Keyboard Support**: Full keyboard navigation and input

## Features in Detail

### Puzzle Generation
- Algorithmically generates complete, valid Sudoku solutions
- Removes numbers strategically to create solvable puzzles
- Adjustable difficulty (currently set to medium)

### Real-time Validation
- Instantly highlights conflicting numbers in red/blue
- Validates rows, columns, and 3×3 boxes
- Prevents invalid moves while allowing exploration

### User Interface
- Light blue, white, and gray color scheme
- Smooth animations and hover effects
- Glass-morphism design elements
- Responsive layout for all screen sizes

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS preprocessing

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

The main game logic is contained in a single React component with the following key functions:

- `generateCompleteBoard()` - Creates a valid Sudoku solution
- `createPuzzle()` - Removes numbers to create the puzzle
- `validateBoard()` - Checks for conflicts and errors
- `handleNumberInput()` - Processes user input
- `checkComplete()` - Determines if puzzle is solved

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-
