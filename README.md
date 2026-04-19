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

4. Open the local Vite URL shown in the terminal.
5. Drag and drop your `.tcx` file into the UI and choose the desired running type.

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

## Notes

- The repository no longer contains the legacy .NET console application.
- The frontend app runs from `src/` and uses Vite + React.
