# TcxConverter

A client-side React app that converts Garmin `.tcx` activity files into structured `.json` — runs entirely in your browser, no file uploads, no server.

**Live app:** [manvit94.github.io/TxcParser](https://manvit94.github.io/TxcParser/)

## Features

- Drag & drop or click to select a `.tcx` file
- Choose activity type — **Outdoor** or **Treadmill** — via a modal dialog
- Activity summary preview (distance, time, calories, avg/max HR) shown before download
- JSON downloaded locally with the filename `{yyyy}-{MM}-{dd}-{ActivityType}.json`
- All parsing happens on-device; your data never leaves the browser

## Usage

1. Open the [live app](https://manvit94.github.io/TxcParser/).
2. Drag & drop your `.tcx` file onto the drop zone, or click to browse.
3. Click **Convert to JSON** and select the activity type in the dialog.
4. Review the activity summary, then click **Download JSON**.

## JSON Output

```json
{
  "sport": "Running",
  "runningType": "Outdoor",
  "id": "2024-03-15T07:30:00.000Z",
  "startTime": "2024-03-15T07:30:00.000Z",
  "totalTimeSeconds": 3600,
  "distanceMeters": 10000,
  "calories": 650,
  "averageHeartRate": 152,
  "maximumHeartRate": 178,
  "trackpoints": [
    {
      "time": "2024-03-15T07:30:00.000Z",
      "distanceMeters": 0,
      "heartRate": 120
    }
  ]
}
```

> Note: only the first `<Lap>` element is used for summary metrics. Multi-lap TCX files will show stats for the first lap only.

## Development

```bash
cd src
npm install
npm run dev
```

Requires Node.js 18+ and npm 10+.

## Build & Deploy

The app builds into the `docs/` folder, which GitHub Pages serves from the `master` branch.

```bash
cd src
npm run build   # outputs to ../docs/
```

Push `docs/` to `master` to update the live site. The base URL is `/TxcParser/` (set in `vite.config.ts`).

## Project Structure

```
TcxConverter/
├── src/                    ← frontend root
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── public/
│   └── src/
│       ├── App.tsx
│       ├── App.css
│       └── utils/
│           └── tcxParser.ts
├── docs/                   ← built output served by GitHub Pages
└── README.md
```
