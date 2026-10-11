# Voice Battleship ✈️

A two-player airplane battle game built with React, Vite, and Firebase. Players place airplanes on a 10×10 grid and try to destroy their opponent's airplanes by attacking their cells.

## Features

- 🎮 Two-player gameplay
- 🗺️ Two 10×10 game boards
- ✈️ Three airplanes per player
- 🎲 Random airplane placement
- 🎯 Hit and miss detection
- 💥 An airplane is destroyed when its head is hit
- 🏆 Winner notification when the game ends
- 🔥 Firebase Realtime Database integration for synchronizing game state

## Tech Stack

- React
- JavaScript
- Vite
- Firebase Realtime Database
- CSS

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Git (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

### 2. Open the project folder

```bash
cd voice-battleship
```

### 3. Install dependencies

```bash
npm install
```

This installs the packages listed in `package.json`, including Vite.

### 4. Configure Firebase

Create or configure a Firebase project and set up Realtime Database. Make sure the application uses the correct Firebase configuration and database URL.

If your project uses environment variables, create a `.env` file using the variable names expected by your Firebase configuration code. Do not commit private credentials or secrets.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173/`.

## Troubleshooting

**Error: `'vite' is not recognized as an internal or external command`**

Run the following commands from the project directory:

```bash
npm install
npm run dev
```

If the error persists, check that `vite` is listed in `package.json` and that the installation completed successfully.

## Future Improvements

- Voice-controlled gameplay
- Improved game interface
- Additional game modes

## License

No license has been specified yet.
