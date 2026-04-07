namespace TcxConverter.Models;

public class Activity
{
    public string Sport { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public double TotalTimeSeconds { get; set; }
    public double DistanceMeters { get; set; }
    public int Calories { get; set; }
    public int AverageHeartRate { get; set; }
    public int MaximumHeartRate { get; set; }
    public List<Trackpoint> Trackpoints { get; set; } = new();
}

public class Trackpoint
{
    public string Time { get; set; } = string.Empty;
    public double DistanceMeters { get; set; }
    public int HeartRate { get; set; }
}
