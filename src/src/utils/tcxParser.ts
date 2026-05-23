export interface Trackpoint {
  time: string;
  distanceMeters?: number;
  heartRate: number;
}

export interface Activity {
  sport: string;
  id: string;
  startTime: string;
  totalTimeSeconds: number;
  distanceMeters: number;
  calories: number;
  averageHeartRate: number;
  maximumHeartRate: number;
  trackpoints: Trackpoint[];
  runningType: 'Treadmill' | 'Outdoor';
}

export function parseTcx(
  xmlText: string,
  runningType: 'Treadmill' | 'Outdoor' = 'Treadmill',
  treadmillDistanceMeters?: number
): Activity {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");

  // Basic error handling if the upload isn't valid XML
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error("Invalid XML document.");
  }

  // Define a helper to safely get elements regardless of namespace prefixes
  const getEl = (parent: Element | Document, tagName: string): Element | null => {
    // In DOMParser, getting elements by tag name can be namespace sensitive.
    // We'll use a lenient approach by stripping namespaces if needed or jumping straight to localName
    const elements = parent.getElementsByTagNameNS("*", tagName);
    if (elements.length > 0) return elements[0];

    const regularElements = parent.getElementsByTagName(tagName);
    return regularElements.length > 0 ? regularElements[0] : null;
  };

  const getEls = (parent: Element | Document, tagName: string): Element[] => {
    let elements = parent.getElementsByTagNameNS("*", tagName);
    if (elements.length === 0) {
      elements = parent.getElementsByTagName(tagName);
    }
    return Array.from(elements);
  };

  const parseNum = (val: string | null | undefined): number => {
    if (!val) return 0;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const activityEl = getEl(doc, "Activity");
  if (!activityEl) {
    throw new Error("Could not find <Activity> inside the TCX file.");
  }

  const lapEl = getEl(activityEl, "Lap");
  if (!lapEl) {
    throw new Error("Could not find <Lap> inside the <Activity>.");
  }

  // --- Activity-level fields ---
  const sport = activityEl.getAttribute("Sport") || "";
  const idEl = getEl(activityEl, "Id");
  const id = idEl?.textContent || "";
  const startTime = lapEl.getAttribute("StartTime") || "";

  const totalSecEl = getEl(lapEl, "TotalTimeSeconds");
  const totalSec = parseNum(totalSecEl?.textContent);

  const distEl = getEl(lapEl, "DistanceMeters");
  const dist = parseNum(distEl?.textContent);

  const caloriesEl = getEl(lapEl, "Calories");
  const calories = parseNum(caloriesEl?.textContent);

  const avgHrEl = getEl(lapEl, "AverageHeartRateBpm");
  const avgHrValueEl = avgHrEl ? getEl(avgHrEl, "Value") : null;
  const avgHr = parseNum(avgHrValueEl?.textContent);

  const maxHrEl = getEl(lapEl, "MaximumHeartRateBpm");
  const maxHrValueEl = maxHrEl ? getEl(maxHrEl, "Value") : null;
  const maxHr = parseNum(maxHrValueEl?.textContent);

  // --- Trackpoints ---
  const isTreadmill = runningType === 'Treadmill';
  const trackEls = getEls(lapEl, "Trackpoint");
  const trackpoints: Trackpoint[] = trackEls.map(tp => {
    const timeEl = getEl(tp, "Time");

    let hrVal = 0;
    const hrEl = getEl(tp, "HeartRateBpm");
    if (hrEl) {
      const hrValueEl = getEl(hrEl, "Value");
      hrVal = parseNum(hrValueEl?.textContent);
    }

    const point: Trackpoint = {
      time: timeEl?.textContent || "",
      heartRate: hrVal
    };

    // For Outdoor activities, keep per-trackpoint distance (from GPS).
    // For Treadmill, distance is meaningless per-point — strip it.
    if (!isTreadmill) {
      const tpDistEl = getEl(tp, "DistanceMeters");
      point.distanceMeters = parseNum(tpDistEl?.textContent);
    }

    return point;
  });

  // Treadmill distance is user-provided (override) because GPS-derived
  // values from the TCX file are unreliable on a treadmill.
  const finalDistance = isTreadmill && treadmillDistanceMeters != null
    ? treadmillDistanceMeters
    : dist;

  return {
    sport,
    runningType,
    id,
    startTime,
    totalTimeSeconds: totalSec,
    distanceMeters: finalDistance,
    calories,
    averageHeartRate: avgHr,
    maximumHeartRate: maxHr,
    trackpoints
  };
}
