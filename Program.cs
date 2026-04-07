using System.Text.Json;
using TcxConverter.Parsers;

// ── Locate Activities folder ───────────────────────────────────────────────────
var activitiesDir = Path.Combine(Directory.GetCurrentDirectory(), "Activities");

if (!Directory.Exists(activitiesDir))
{
    Console.WriteLine($"Error: 'Activities' folder not found at {activitiesDir}");
    Console.WriteLine("Create an 'Activities' folder next to where you run the app and put your .tcx files inside.");
    return 1;
}

var tcxFiles = Directory.GetFiles(activitiesDir, "*.tcx", SearchOption.TopDirectoryOnly);

if (tcxFiles.Length == 0)
{
    Console.WriteLine($"No .tcx files found in: {activitiesDir}");
    return 0;
}

Console.WriteLine($"Found {tcxFiles.Length} .tcx file(s) in '{activitiesDir}'");
Console.WriteLine();

// ── JSON options (shared) ──────────────────────────────────────────────────────
var options = new JsonSerializerOptions
{
    WriteIndented        = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

// ── Process each file ─────────────────────────────────────────────────────────
int success = 0, failed = 0;

foreach (var tcxPath in tcxFiles)
{
    var outputPath = Path.ChangeExtension(tcxPath, ".json");
    try
    {
        Console.WriteLine($"[{success + failed + 1}/{tcxFiles.Length}] Parsing: {Path.GetFileName(tcxPath)}");
        var activity = TcxParser.Parse(tcxPath);

        var json = JsonSerializer.Serialize(activity, options);
        await File.WriteAllTextAsync(outputPath, json);

        var fileSizeKb = new FileInfo(outputPath).Length / 1024.0;
        Console.WriteLine($"  ✓ Written → {Path.GetFileName(outputPath)} ({fileSizeKb:F1} KB)");
        success++;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"  ✗ Failed: {ex.Message}");
        failed++;
    }

    Console.WriteLine();
}

Console.WriteLine($"Done. {success} converted, {failed} failed.");
return failed > 0 ? 1 : 0;
