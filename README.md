# TcxConverter

A React-based web interface for converting Garmin `.tcx` activity files into structured `.json` output.

## Requirements

- [Node.js](https://nodejs.org/) 18+ or compatible runtime
- `npm` 10+ or Yarn

## Usage

1. Open a terminal in the `src/` folder.
2. Install dependencies:

```bash
cd src
npm install
```

3. Start the app:

```bash
npm run dev
```

## Web Dashboard

A React-based web interface is available to effortlessly convert files directly in your browser.
1. Make sure you are in the `src/` folder and run `npm run dev` to start the app.
2. Drag and drop your `.tcx` file into the UI.
3. Select your **Running Type** (e.g. *Outdoor* or *Treadmill*).
4. The file will be parsed internally and downloaded safely using the format: `{yyyy}-{MM}-{dd}-{runningType}.json`.

## Project Structure

```
TcxConverter/
├── src/                 ← frontend application root
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── public/
│   └── src/             ← React app source files
└── README.md
```
