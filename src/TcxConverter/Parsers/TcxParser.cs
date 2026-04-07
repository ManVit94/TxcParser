using System.Globalization;
using System.Xml.Linq;
using TcxConverter.Models;

namespace TcxConverter.Parsers;

public static class TcxParser
{
    // Garmin XML namespaces
    private static readonly XNamespace Ns  = "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2";
    private static readonly XNamespace Ns3 = "http://www.garmin.com/xmlschemas/ActivityExtension/v2";

    private static double ParseDouble(string? s) =>
        double.Parse(s ?? "0", CultureInfo.InvariantCulture);

    private static int ParseInt(string? s) =>
        int.Parse(s ?? "0", CultureInfo.InvariantCulture);

    public static Activity Parse(string filePath)
    {
        Console.WriteLine($"Reading: {filePath}");
        var doc = XDocument.Load(filePath);

        var activityEl = doc.Root!
            .Element(Ns + "Activities")!
            .Element(Ns + "Activity")!;

        var lapEl = activityEl.Element(Ns + "Lap")!;

        // --- Activity-level fields ---
        var sport    = activityEl.Attribute("Sport")?.Value ?? string.Empty;
        var id       = activityEl.Element(Ns + "Id")?.Value ?? string.Empty;
        var start    = lapEl.Attribute("StartTime")?.Value ?? string.Empty;
        var totalSec = ParseDouble(lapEl.Element(Ns + "TotalTimeSeconds")?.Value);
        var dist     = ParseDouble(lapEl.Element(Ns + "DistanceMeters")?.Value);
        var calories = ParseInt(lapEl.Element(Ns + "Calories")?.Value);
        var avgHr    = ParseInt(lapEl.Element(Ns + "AverageHeartRateBpm")?.Element(Ns + "Value")?.Value);
        var maxHr    = ParseInt(lapEl.Element(Ns + "MaximumHeartRateBpm")?.Element(Ns + "Value")?.Value);

        // --- Trackpoints ---
        var trackpoints = lapEl
            .Element(Ns + "Track")!
            .Elements(Ns + "Trackpoint")
            .Select(tp => new Trackpoint
            {
                Time           = tp.Element(Ns + "Time")?.Value ?? string.Empty,
                DistanceMeters = ParseDouble(tp.Element(Ns + "DistanceMeters")?.Value),
                HeartRate      = ParseInt(tp.Element(Ns + "HeartRateBpm")?.Element(Ns + "Value")?.Value)
            })
            .ToList();

        Console.WriteLine($"Parsed {trackpoints.Count} trackpoints.");

        return new Activity
        {
            Sport              = sport,
            Id                 = id,
            StartTime          = start,
            TotalTimeSeconds   = totalSec,
            DistanceMeters     = dist,
            Calories           = calories,
            AverageHeartRate   = avgHr,
            MaximumHeartRate   = maxHr,
            Trackpoints        = trackpoints
        };
    }
}
