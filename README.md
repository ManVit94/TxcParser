# TcxConverter

A .NET console application that reads Garmin `.tcx` activity files, parses them into structured objects, and converts them to clean `.json` files.

## Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/download)

## Usage

1. Place your `.tcx` files inside the `Activities/` folder.
2. Run the converter from the project root:

```bash
dotnet run
```

Each `.tcx` file will produce a matching `.json` file in the same `Activities/` folder.

### Example

```
Activities/
├── run_morning.tcx   →   run_morning.json
├── run_evening.tcx   →   run_evening.json
```

Console output:

```
Found 2 .tcx file(s) in 'Activities'

[1/2] Parsing: run_morning.tcx
  ✓ Written → run_morning.json (243.1 KB)

[2/2] Parsing: run_evening.tcx
  ✓ Written → run_evening.json (180.4 KB)

Done. 2 converted, 0 failed.
```

## Output Format

Each `.json` file contains the following fields:

```json
{
  "sport": "Running",
  "id": "2026-04-05T08:52:12.000Z",
  "startTime": "2026-04-05T08:52:12.000Z",
  "totalTimeSeconds": 2067.906,
  "distanceMeters": 3855.59,
  "calories": 281,
  "averageHeartRate": 160,
  "maximumHeartRate": 171,
  "trackpoints": [
    {
      "time": "2026-04-05T08:52:12.000Z",
      "distanceMeters": 0.0,
      "heartRate": 108
    }
  ]
}
```

## Project Structure

```
TcxConverter/
├── Activities/          ← place .tcx files here (gitignored)
├── Models/
│   └── Activity.cs      ← output data model
├── Parsers/
│   └── TcxParser.cs     ← XML parser
├── Program.cs           ← entry point
└── TcxConverter.csproj
```

## Notes

- Activity data files (`.tcx` / `.json`) are excluded from version control via `.gitignore`.
- The parser supports the standard Garmin TCX schema (`TrainingCenterDatabase/v2`).
