import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";

// ------------------------------------------------------------
// 1. Timeline marker settings (dynamic radius)
// ------------------------------------------------------------
const MIN_RADIUS = 2;
const MAX_RADIUS = 50;
const RADIUS_GROWTH_YEARS = 90;

const createCustomIcon = (color, radius) => {
  const svgSize = 120;
  const center = svgSize / 2;
  const svg = `
    <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${center}" cy="${center}" r="6" fill="${color}" stroke="none" />
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${color}" stroke-width="2.5" opacity="0.6" />
    </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [svgSize, svgSize],
    className: "custom-marker-glow",
    popupAnchor: [0, -svgSize / 2],
  });
};

// ------------------------------------------------------------
// 2. Radar marker icon (black)
// ------------------------------------------------------------
const createRadarIcon = (radius = 12) => {
  const svgSize = 80;
  const center = svgSize / 2;
  const svg = `
    <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${center}" cy="${center}" r="5" fill="#000000" stroke="#000000" stroke-width="2" />
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#000000" stroke-width="2" opacity="0.8" />
    </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [svgSize, svgSize],
    className: "radar-marker",
    popupAnchor: [0, -svgSize / 2],
  });
};

// Frequency range mapping for band types
const bandFrequencyMap = {
  "L-Band": "1-2 GHz",
  "S-Band": "2-4 GHz",
  "X-Band": "8-12 GHz",
  "UHF": "300 MHz - 1 GHz",
  "C-Band": "4-8 GHz",
  "Ku-Band": "12-18 GHz",
  "Ka-Band": "26-40 GHz",
  "Not Publicly Specified": "Not specified",
  "UWB": "Ultra-wideband",
  "EO/IR": "Electro-optical/Infrared",
  "Pulse-Doppler": "Pulse-Doppler (frequency varies)",
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ------------------------------------------------------------
// 3. Timeline configuration
// ------------------------------------------------------------
const LANES_PER_THEME = 12;
const LANE_SPACING = 0.25;
const DATE_THRESHOLD_DAYS = 100;
const themeBaseY = {
  Energy: 10.0,
  Military: 8.8,
  "Heritage & Archaeology": 7.6,
  "Conservation & Environment": 6.4,
  "Governance & Territory": 5.2,
  "Infrastructure & Technology": 4.0,
  Resistance: 2.8,
};
const yRange = [1.5, 11.2];

// Fixed plot date range – start at 1920
const PLOT_START = new Date("1920-01-01").getTime();
const PLOT_END = new Date("2028-01-01").getTime();
const STEP_MS = 3600000; // 1 hour

// Ordered themes list (used for traces and the mobile legend)
const orderedThemes = [
  "Energy",
  "Military",
  "Heritage & Archaeology",
  "Conservation & Environment",
  "Governance & Territory",
  "Infrastructure & Technology",
  "Resistance",
];

export default function TimelinePage() {
  const plotRef = useRef(null);
  const plotReady = useRef(false);
  const [theme, setTheme] = useState("dark");
  const [mapCenter, setMapCenter] = useState([31.7683, 35.2137]);
  const [mapZoom, setMapZoom] = useState(6);
  const [error, setError] = useState(null);

  // Main timeline data
  const [allPoints, setAllPoints] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [animationDate, setAnimationDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [clickedInfo, setClickedInfo] = useState("");
  const [minYearGlobal, setMinYearGlobal] = useState(null);
  const [maxYearGlobal, setMaxYearGlobal] = useState(null);

  // Radar data
  const [radarPoints, setRadarPoints] = useState([]);
  const [visibleRadarMarkers, setVisibleRadarMarkers] = useState([]);
  const [radarDate, setRadarDate] = useState(null);
  const [minRadarDate, setMinRadarDate] = useState(null);
  const [maxRadarDate, setMaxRadarDate] = useState(null);
  const [radarInfo, setRadarInfo] = useState("");

  // OSM raster overlay (Stamen Toner – roads & labels)
  const [showOSMOverlay, setShowOSMOverlay] = useState(false);
  const [osmOverlayOpacity, setOsmOverlayOpacity] = useState(0.6);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper functions
  const getMarkerColor = (themeName) => {
    const colors = {
      Energy: "rgb(250,15,5)",
      Military: "rgb(255,255,240)",
      "Heritage & Archaeology": "rgb(255,255,0)",
      "Conservation & Environment": "rgb(0,245,10)",
      "Governance & Territory": "rgb(0,10,245)",
      "Infrastructure & Technology": "rgb(128,128,128)",
      Resistance: "rgb(143,0,207)",
    };
    return colors[themeName] || "rgb(200,200,200)";
  };

  const colorToHex = (rgbColor) => {
    const match = rgbColor.match(/\d+/g);
    if (!match) return "#888888";
    const [r, g, b] = match.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const formatDateForSlider = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // ------------------------------------------------------------
  // Radar CSV loading
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const response = await fetch("/data/radarlist.csv?v=2");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const rows = result.data.filter(
              (row) => row["Date Installed"] && row.Latitude && row.Longitude
            );
            const points = [];
            let min = null,
              max = null;
            const tempPoints = [];
            rows.forEach((row) => {
              const dateStr = row["Date Installed"];
              const year = parseInt(dateStr);
              if (!isNaN(year)) {
                const date = new Date(`${year}-01-01T00:00:00Z`);
                const lat = parseFloat(row.Latitude);
                const lng = parseFloat(row.Longitude);
                if (!isNaN(lat) && !isNaN(lng)) {
                  tempPoints.push({
                    lat,
                    lng,
                    name: row.Name,
                    bandType: row["Band Type"],
                    purpose: row["Description of Purpose"],
                    jurisdiction: row.Jurisdiction,
                    operator: row.Operator,
                    area: row.Area,
                    usedBy: row["Used by Which Institutes"],
                    brand: row["Company/Brand"],
                    status: row.Status,
                    notes: row["Notes on Dates"],
                    source: row["Source URL"],
                    originalDate: date,
                  });
                }
              }
            });
            tempPoints.sort((a, b) => {
              if (a.originalDate.getTime() !== b.originalDate.getTime())
                return a.originalDate - b.originalDate;
              return a.name.localeCompare(b.name);
            });
            let lastDate = null;
            let sameDateCount = 0;
            tempPoints.forEach((p) => {
              const dateTime = p.originalDate.getTime();
              if (lastDate === dateTime) {
                sameDateCount++;
              } else {
                sameDateCount = 0;
                lastDate = dateTime;
              }
              const offsetMs = sameDateCount * 3600000;
              const newDate = new Date(dateTime + offsetMs);
              p.date = newDate;
              p.year = newDate.getUTCFullYear();
              if (min === null || newDate < min) min = newDate;
              if (max === null || newDate > max) max = newDate;
              points.push(p);
            });
            setRadarPoints(points);
            if (min && max) {
              setMinRadarDate(min);
              setMaxRadarDate(max);
              setRadarDate(new Date(PLOT_START));
            }
          },
          error: (err) => setError("Radar CSV parse error: " + err.message),
        });
      } catch (err) {
        setError("Failed to load radarlist.csv: " + err.message);
      }
    };
    fetchRadarData();
  }, []);

  // Update radar markers and info
  useEffect(() => {
    if (!radarDate || radarPoints.length === 0) {
      setVisibleRadarMarkers([]);
      setRadarInfo("");
      return;
    }
    const filtered = radarPoints.filter((p) => p.date <= radarDate);
    setVisibleRadarMarkers(filtered);
    if (filtered.length > 0) {
      const latest = filtered.reduce((prev, curr) =>
        curr.date > prev.date ? curr : prev
      );

      let bandDisplay = latest.bandType;
      if (latest.bandType && latest.bandType !== "Not Publicly Specified") {
        if (latest.bandType.includes("&")) {
          const bands = latest.bandType.split(/\s*&\s*/);
          const freqParts = bands.map((b) => {
            const trimmed = b.trim();
            const freq = bandFrequencyMap[trimmed];
            return freq ? `${trimmed} (${freq})` : trimmed;
          });
          bandDisplay = freqParts.join(" + ");
        } else {
          const freq = bandFrequencyMap[latest.bandType];
          if (freq) bandDisplay = `${latest.bandType} (${freq})`;
        }
      }

      const infoHtml = `<strong>${latest.name}</strong><br>
                        <strong>Year installed:</strong> ${latest.date.getUTCFullYear()}<br>
                        <strong>Band Type:</strong> ${bandDisplay}<br>
                        <strong>Purpose:</strong> ${latest.purpose}<br>
                        <strong>Jurisdiction:</strong> ${latest.jurisdiction}<br>
                        <strong>Operator:</strong> ${latest.operator}<br>
                        <strong>Status:</strong> ${latest.status}<br>
                        <a href="${latest.source}" target="_blank">Source</a>`;
      setRadarInfo(infoHtml);
    } else {
      setRadarInfo("");
    }
  }, [radarDate, radarPoints]);

  // ------------------------------------------------------------
  // Main timeline loading
  // ------------------------------------------------------------
  useEffect(() => {
    if (!plotRef.current) return;

    const parseDateMain = (dmy) => {
      if (!dmy) return null;
      const parts = dmy.split("/");
      if (parts.length !== 3) return null;
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`);
    };

    const addHorizontalJitter = (events, windowDays = 10) => {
      if (events.length === 0) return events;
      const sorted = [...events].sort((a, b) => a.date - b.date);
      const result = [];
      let i = 0;
      while (i < sorted.length) {
        const cluster = [sorted[i]];
        let j = i + 1;
        while (
          j < sorted.length &&
          (sorted[j].date - sorted[i].date) / (1000 * 3600 * 24) <= windowDays
        ) {
          cluster.push(sorted[j]);
          j++;
        }
        const spanDays = windowDays;
        const step = cluster.length === 1 ? 0 : spanDays / (cluster.length - 1);
        cluster.forEach((ev, idx) => {
          const offsetDays = -spanDays / 2 + idx * step;
          const jittered = new Date(ev.date.getTime() + offsetDays * 86400000);
          result.push({ ...ev, jitteredDate: jittered });
        });
        i = j;
      }
      return result;
    };

    const fetchData = async () => {
      try {
        const response = await fetch("/data/timeline.csv");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const rows = result.data.filter((row) => row.Date && row.Theme);
            if (rows.length === 0) {
              setError("No valid rows");
              return;
            }

            const pointsList = [];
            let globalMin = null,
              globalMax = null;
            let minYear = Infinity,
              maxYear = -Infinity;

            const traces = [];
            for (const themeName of orderedThemes) {
              const themeRows = rows.filter((r) => r.Theme === themeName);
              if (themeRows.length === 0) continue;

              let eventsForLanes = themeRows
                .map((row) => ({
                  date: parseDateMain(row.Date),
                  row: row,
                }))
                .filter((ev) => ev.date !== null);
              if (eventsForLanes.length === 0) continue;

              eventsForLanes = addHorizontalJitter(eventsForLanes, 10);

              eventsForLanes.forEach((ev) => {
                const d = ev.date.getTime();
                const year = ev.date.getFullYear();
                if (globalMin === null || d < globalMin) globalMin = d;
                if (globalMax === null || d > globalMax) globalMax = d;
                if (year < minYear) minYear = year;
                if (year > maxYear) maxYear = year;
                pointsList.push({
                  lat: parseFloat(ev.row.Latitude),
                  lng: parseFloat(ev.row.Longitude),
                  theme: themeName,
                  label: ev.row.Label,
                  description: ev.row.Description,
                  source: ev.row.Source,
                  jurisdiction: ev.row.Jurisdiction,
                  area: ev.row.Area || ev.row.area || ev.row["Area"] || "",
                  date: ev.date,
                  year: year,
                });
              });

              const assignLanes = (events) => {
                const lanes = Array(LANES_PER_THEME)
                  .fill()
                  .map(() => ({ lastDate: null }));
                const assignments = [];
                const sorted = events.map((ev, idx) => ({ ...ev, originalIndex: idx }));
                sorted.sort((a, b) => a.date - b.date);
                for (const ev of sorted) {
                  let selectedLane = -1;
                  for (let i = 0; i < LANES_PER_THEME; i++) {
                    if (lanes[i].lastDate === null) {
                      selectedLane = i;
                      break;
                    }
                    const daysDiff =
                      (ev.date - lanes[i].lastDate) / (1000 * 60 * 60 * 24);
                    if (daysDiff >= DATE_THRESHOLD_DAYS) {
                      selectedLane = i;
                      break;
                    }
                  }
                  if (selectedLane === -1) {
                    let oldestIdx = 0;
                    for (let i = 1; i < LANES_PER_THEME; i++) {
                      if (lanes[i].lastDate < lanes[oldestIdx].lastDate)
                        oldestIdx = i;
                    }
                    selectedLane = oldestIdx;
                  }
                  assignments[ev.originalIndex] = selectedLane;
                  lanes[selectedLane].lastDate = ev.date;
                }
                return assignments;
              };

              const laneIndices = assignLanes(
                eventsForLanes.map((ev) => ({ date: ev.date }))
              );

              const xDates = eventsForLanes.map((ev) =>
                ev.jitteredDate.toISOString().slice(0, 10)
              );
              const baseY = themeBaseY[themeName];
              const yValues = eventsForLanes.map(
                (ev, idx) => baseY + laneIndices[idx] * LANE_SPACING
              );
              const texts = eventsForLanes.map(
                (ev) =>
                  `Date: ${ev.row.Date}<br>Label: ${ev.row.Label}<br>Group: ${ev.row.Theme}<br>Jurisdiction: ${ev.row.Jurisdiction}<br>Area: ${ev.row.Area}`
              );
              const customdata = eventsForLanes.map((ev) => ({
                lat: parseFloat(ev.row.Latitude),
                lng: parseFloat(ev.row.Longitude),
                theme: ev.row.Theme,
                jurisdiction: ev.row.Jurisdiction,
                area: ev.row.Area,
                date: ev.row.Date,
                description: `<strong>${ev.row.Label}</strong><br><strong>Date:</strong> ${ev.row.Date}<br><strong>Jurisdiction:</strong> ${ev.row.Jurisdiction}<br><strong>Area:</strong> ${ev.row.Area}<br><strong>Coordinates:</strong> ${ev.row.Latitude}, ${ev.row.Longitude}<br>${ev.row.Description}<br><a href="${ev.row.Source}" target="_blank">Source</a>`,
              }));

              traces.push({
                x: xDates,
                y: yValues,
                text: texts,
                customdata: customdata,
                mode: "markers",
                type: "scatter",
                name: themeName,
                marker: { size: 8, color: getMarkerColor(themeName) },
                hovertemplate: "%{text}<extra></extra>",
                showlegend: !isMobile,
              });
            }

            setAllPoints(pointsList);
            setMinYearGlobal(minYear);
            setMaxYearGlobal(maxYear);
            if (globalMin && globalMax) {
              const minD = new Date(globalMin);
              const maxD = new Date(globalMax);
              setMinDate(minD);
              setMaxDate(maxD);
              setAnimationDate(minD);
            }

            if (traces.length === 0) {
              setError("No traces generated");
              return;
            }

            const fixedShapes = [
              {
                type: "line",
                x0: "1948-05-14",
                x1: "1948-05-14",
                y0: 0,
                y1: 1,
                yref: "paper",
                line: { color: "#9afc97", width: 0.7, dash: "dash" },
              },
              {
                type: "line",
                x0: "1967-06-05",
                x1: "1967-06-05",
                y0: 0,
                y1: 1,
                yref: "paper",
                line: { color: "#9afc97", width: 0.7, dash: "dash" },
              },
              {
                type: "line",
                x0: "1995-09-28",
                x1: "1995-09-28",
                y0: 0,
                y1: 1,
                yref: "paper",
                line: { color: "#9afc97", width: 0.7, dash: "dash" },
              },
              {
                type: "line",
                x0: "2023-10-07",
                x1: "2023-10-07",
                y0: 0,
                y1: 1,
                yref: "paper",
                line: { color: "#9afc97", width: 0.7, dash: "dash" },
              },
            ];

            const layout = {
              xaxis: {
                type: "date",
                range: ["1920-01-01", "2028-01-01"],
                rangemode: "normal",
                showgrid: false,
                linecolor: theme === "light" ? "#333333" : "#aaaaaa",
                tickfont: {
                  size: isMobile ? 8 : 10,
                },
                tickangle: isMobile ? -45 : 0,
                automargin: true,
              },
              yaxis: { visible: false, range: yRange },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: {
                color: theme === "light" ? "#1a1a1a" : "#f0f0f0",
                family: "Inter, sans-serif",
              },
              legend: {
                orientation: "v",
                traceorder: "normal",
                font: {
                  color: theme === "light" ? "#1a1a1a" : "#f0f0f0",
                },
                x: 1.02,
                xanchor: "left",
                ...(isMobile && { display: false }),
              },
              margin: {
                l: isMobile ? 0 : 20,
                r: isMobile ? 0 : 20,   // ← changed from 80 to 20
                t: 10,
                b: isMobile ? 60 : 50,
              },
              hoverlabel: {
                bgcolor:
                  theme === "light"
                    ? "rgba(220,220,220,0.7)"
                    : "rgba(30,30,30,0.7)",
                bordercolor: "#9afc97",
                font: { size: 10 },
                align: "left",
                namelength: -1,
              },
              shapes: fixedShapes,
              annotations: [
                {
                  x: "1948-05-14",
                  y: 1.03,
                  yref: "paper",
                  text: "1948",
                  showarrow: false,
                  font: { color: "#9afc97", size: 10 },
                  xanchor: "center",
                },
                {
                  x: "1967-06-05",
                  y: 1.03,
                  yref: "paper",
                  text: "1967",
                  showarrow: false,
                  font: { color: "#9afc97", size: 10 },
                  xanchor: "center",
                },
                {
                  x: "1995-09-28",
                  y: 1.03,
                  yref: "paper",
                  text: "1995",
                  showarrow: false,
                  font: { color: "#9afc97", size: 10 },
                  xanchor: "center",
                },
                {
                  x: "2023-10-07",
                  y: 1.03,
                  yref: "paper",
                  text: "2023",
                  showarrow: false,
                  font: { color: "#9afc97", size: 10 },
                  xanchor: "center",
                },
              ],
            };
            const config = {
              displayModeBar: false,
              responsive: true,
              scrollZoom: true,
              dragmode: "pan",
              doubleClick: "reset+autosize",
            };

            Plotly.purge(plotRef.current);
            Plotly.newPlot(plotRef.current, traces, layout, config);

            const plotDiv = plotRef.current;
            plotDiv.oncontextmenu = (e) => e.preventDefault();

            plotReady.current = true;
            setError(null);

            plotDiv.on("plotly_click", (data) => {
              const point = data.points[0];
              if (point && point.customdata) {
                const { lat, lng, description } = point.customdata;
                if (!isNaN(lat) && !isNaN(lng)) {
                  setMapCenter([lat, lng]);
                  setMapZoom(13);
                }
                if (description) setClickedInfo(description);
              }
            });
          },
          error: (err) => setError("CSV parse error: " + err.message),
        });
      } catch (err) {
        setError("Failed to load CSV: " + err.message);
      }
    };
    fetchData();
    return () => {
      if (plotRef.current) Plotly.purge(plotRef.current);
      plotReady.current = false;
    };
  }, [theme, isMobile]);

  // Update map markers based on animation date
  useEffect(() => {
    if (!animationDate || allPoints.length === 0) {
      setVisibleMarkers([]);
      setClickedInfo("");
      return;
    }
    const filtered = allPoints.filter((p) => p.date <= animationDate);
    setVisibleMarkers(filtered);

    if (filtered.length > 0) {
      const latest = filtered.reduce((prev, curr) =>
        curr.date > prev.date ? curr : prev
      );
      const description = `<strong>${latest.label}</strong><br>
                          <strong>Date:</strong> ${latest.date.toLocaleDateString()}<br>
                          <strong>Jurisdiction:</strong> ${latest.jurisdiction}<br>
                          <strong>Area:</strong> ${latest.area}<br>
                          ${latest.description}<br>
                          <a href="${latest.source}" target="_blank">Source</a>`;
      setClickedInfo(description);
    } else {
      setClickedInfo("");
    }
  }, [animationDate, allPoints]);

  // Update vertical lines
  useEffect(() => {
    if (!plotReady.current || !plotRef.current) return;
    try {
      const fixedShapes = [
        {
          type: "line",
          x0: "1948-05-14",
          x1: "1948-05-14",
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "#9afc97", width: 0.7, dash: "dash" },
        },
        {
          type: "line",
          x0: "1967-06-05",
          x1: "1967-06-05",
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "#9afc97", width: 0.7, dash: "dash" },
        },
        {
          type: "line",
          x0: "1995-09-28",
          x1: "1995-09-28",
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "#9afc97", width: 0.7, dash: "dash" },
        },
        {
          type: "line",
          x0: "2023-10-07",
          x1: "2023-10-07",
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: "#9afc97", width: 0.7, dash: "dash" },
        },
      ];

      if (animationDate) {
        const dateStr = formatDateForSlider(animationDate);
        const timelineColor = theme === "light" ? "#2c6e2c" : "#9afc97";
        fixedShapes.push({
          type: "line",
          x0: dateStr,
          x1: dateStr,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: timelineColor, width: 0.5, dash: "solid" },
        });
      }

      if (minRadarDate && maxRadarDate && radarDate) {
        const radarDateStr = formatDateForSlider(radarDate);
        const radarLineColor = theme === "light" ? "#000000" : "#ffffff";
        fixedShapes.push({
          type: "line",
          x0: radarDateStr,
          x1: radarDateStr,
          y0: 0,
          y1: 1,
          yref: "paper",
          line: { color: radarLineColor, width: 0.5, dash: "solid" },
        });
      }

      Plotly.relayout(plotRef.current, { shapes: fixedShapes });
    } catch (err) {}
  }, [animationDate, radarDate, theme, minRadarDate, maxRadarDate]);

  // Slider handlers
  const handleTimelineSliderChange = (e) => {
    const val = parseInt(e.target.value);
    const selectedDate = new Date(val);
    setAnimationDate(selectedDate);
  };

  const handleRadarSliderChange = (e) => {
    setRadarDate(new Date(parseInt(e.target.value)));
  };

  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const textColor = theme === "light" ? "#333333" : "#f0f0f0";
  const containerStyle = {
    border: `1px solid ${borderColor}`,
    backgroundColor: "transparent",
    padding: "10px",
    borderRadius: "0",
  };

  if (error)
    return (
      <div>
        <Header />
        <div className="container" style={{ color: "red" }}>
          Error: {error}
        </div>
      </div>
    );

  return (
    <div>
      <Header />
      <div
        className="container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "0.5rem" : "1rem",
          paddingBottom: isMobile ? "100px" : "1rem",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {/* LEFT COLUMN: Map and timeline info panel */}
          <div
            style={{
              flex: isMobile ? "1 1 100%" : "0 0 500px",
              width: isMobile ? "100%" : "500px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: isMobile ? "300px" : "400px",
                border: `1px solid ${borderColor}`,
                background: "#30342f",
              }}
            >
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "100%", width: "100%" }}
                attributionControl={false}
                zoomControl={false}
                key={mapCenter.toString() + mapZoom}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution=""
                />

                {showOSMOverlay && (
                  <TileLayer
                    className="toner-blend-layer"
                    url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB'
                    opacity={osmOverlayOpacity}
                  />
                )}

                {visibleMarkers.map((point, idx) => {
                  const colorHex = colorToHex(getMarkerColor(point.theme));
                  const yearsSince =
                    (animationDate - point.date) /
                    (1000 * 60 * 60 * 24 * 365.25);
                  let radius = MIN_RADIUS;
                  if (yearsSince > 0) {
                    radius =
                      MIN_RADIUS +
                      (yearsSince / RADIUS_GROWTH_YEARS) *
                        (MAX_RADIUS - MIN_RADIUS);
                    radius = Math.min(
                      MAX_RADIUS,
                      Math.max(MIN_RADIUS, radius)
                    );
                  }
                  return (
                    <Marker
                      key={`timeline-${idx}`}
                      position={[point.lat, point.lng]}
                      icon={createCustomIcon(colorHex, radius)}
                      eventHandlers={{
                        click: () => {
                          const desc = `<strong>${point.label}</strong><br>
                                      <strong>Date:</strong> ${point.date.toLocaleDateString()}<br>
                                      <strong>Jurisdiction:</strong> ${point.jurisdiction}<br>
                                      <strong>Area:</strong> ${point.area}<br>
                                      ${point.description}<br>
                                      <a href="${point.source}" target="_blank">Source</a>`;
                          setClickedInfo(desc);
                          setMapCenter([point.lat, point.lng]);
                          setMapZoom(13);
                        },
                      }}
                    >
                      <Popup>
                        <strong>{point.label}</strong>
                        <br />
                        <strong>Date:</strong>{" "}
                        {point.date.toLocaleDateString()}
                        <br />
                        <strong>Area:</strong> {point.area || "Not provided"}
                        <br />
                        {point.description}
                        <br />
                        <a href={point.source} target="_blank">
                          Source
                        </a>
                      </Popup>
                    </Marker>
                  );
                })}
                {visibleRadarMarkers.map((point, idx) => (
                  <Marker
                    key={`radar-${idx}`}
                    position={[point.lat, point.lng]}
                    icon={createRadarIcon(12)}
                  >
                    <Popup>
                      <strong>{point.name}</strong>
                      <br />
                      <strong>Type:</strong> {point.bandType}
                      <br />
                      <strong>Purpose:</strong> {point.purpose}
                      <br />
                      <strong>Jurisdiction:</strong> {point.jurisdiction}
                      <br />
                      <strong>Operator:</strong> {point.operator}
                      <br />
                      <strong>Status:</strong> {point.status}
                      <br />
                      <a href={point.source} target="_blank">
                        Source
                      </a>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Timeline info box */}
            <div
              style={{
                ...containerStyle,
                marginTop: "0.5rem",
                width: "100%",
                ...(isMobile && { height: "220px", overflowY: "auto" }),
              }}
            >
              {clickedInfo ? (
                <div dangerouslySetInnerHTML={{ __html: clickedInfo }} />
              ) : (
                "Click a dot or drag the timeline slider to see details."
              )}
            </div>

            {/* Radar info – only on mobile */}
            {isMobile && radarInfo && (
              <div
                style={{
                  ...containerStyle,
                  marginTop: "0.5rem",
                  width: "100%",
                  height: "150px",
                  overflowY: "auto",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: radarInfo }} />
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN: Plot + sliders + OSM controls */}
          <div
            style={{
              flex: isMobile ? "1 1 100%" : "1",
              minWidth: isMobile ? "100%" : "400px",
              width: isMobile ? "100%" : undefined,
              position: "relative",
            }}
          >
            <div style={{ width: "100%" }}>
              <div
                ref={plotRef}
                style={{
                  width: "100%",
                  height: isMobile ? "400px" : "500px",
                  marginBottom: "0.5rem",
                }}
              />

              {/* Timeline slider */}
              <div
                style={{
                  marginTop: "0",
                  marginLeft: isMobile ? 0 : "20px",
                  width: isMobile ? "100%" : "71%",
                  ...(isMobile && {
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }),
                }}
              >
                <div
                  style={{
                    marginBottom: "0.4rem",
                    marginTop: "-1.20rem",
                    fontFamily: "monospace",
                    fontSize: isMobile ? "0.7rem" : "0.8rem",
                  }}
                >
                  Timeline:{" "}
                  {animationDate ? formatDateForSlider(animationDate) : "—"}
                </div>
                <input
                  type="range"
                  min={PLOT_START}
                  max={PLOT_END}
                  step={STEP_MS}
                  value={animationDate ? animationDate.getTime() : PLOT_START}
                  onChange={handleTimelineSliderChange}
                  style={{
                    width: "100%",
                    accentColor: "#555",
                    height: "4px",
                    borderRadius: "2px",
                  }}
                />
                <div
                  style={{
                    fontSize: "0.7rem",
                    marginTop: "0.5rem",
                    color: textColor,
                  }}
                >
                  Drag to reveal timeline events
                </div>
              </div>

              {/* Radar slider */}
              {minRadarDate && maxRadarDate && (
                <div
                  style={{
                    marginTop: "0.8rem",
                    marginLeft: isMobile ? 0 : "20px",
                    width: isMobile ? "100%" : "71%",
                    ...(isMobile && {
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }),
                  }}
                >
                  <div
                    style={{
                      marginBottom: "0.1rem",
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                    }}
                  >
                    Radar: {radarDate ? formatDateForSlider(radarDate) : "—"}
                  </div>
                  <input
                    type="range"
                    min={PLOT_START}
                    max={PLOT_END}
                    step={STEP_MS}
                    value={radarDate ? radarDate.getTime() : PLOT_START}
                    onChange={handleRadarSliderChange}
                    style={{
                      width: "100%",
                      accentColor: "#888",
                      height: "4px",
                      borderRadius: "2px",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "0.5rem",
                      color: textColor,
                    }}
                  >
                    Radar installations
                  </div>
                </div>
              )}

              {/* OSM overlay controls */}
              <div
                style={{
                  marginTop: "0.5rem",
                  marginLeft: isMobile ? 0 : "20px",
                  width: isMobile ? "100%" : "71%",
                  ...(isMobile && {
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }),
                }}
              >
                <label
                  style={{
                    fontFamily: "monospace",
                    fontSize: isMobile ? "0.7rem" : "0.8rem",
                    fontWeight: "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.2rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showOSMOverlay}
                    onChange={(e) => setShowOSMOverlay(e.target.checked)}
                    style={{ accentColor: borderColor }}
                  />
                  Place Names
                </label>
                {showOSMOverlay && (
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={osmOverlayOpacity}
                      onChange={(e) =>
                        setOsmOverlayOpacity(parseFloat(e.target.value))
                      }
                      style={{
                        width: "100%",
                        accentColor: "#a7a5a5",
                        height: "4px",
                        borderRadius: "2px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Radar info overlay – DESKTOP only */}
              {!isMobile && radarInfo && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "60px",
                    right: "-7px",
                    width: "200px",
                    maxHeight: "90%",
                    overflowY: "auto",
                    ...containerStyle,
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    backdropFilter: "blur(4px)",
                    zIndex: 1000,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0)",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: radarInfo }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed mobile legend */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background:
              theme === "light"
                ? "rgba(255,255,255,0.95)"
                : "rgba(20,20,20,0.95)",
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem 1rem",
            padding: "0.4rem 0.8rem",
            zIndex: 2000,
            boxSizing: "border-box",
            fontSize: "0.7rem",
            color: textColor,
          }}
        >
          {orderedThemes.map((themeName) => {
            const colorHex = colorToHex(getMarkerColor(themeName));
            return (
              <div
                key={themeName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: getMarkerColor(themeName),
                    border: `1px solid ${colorHex}`,
                  }}
                ></span>
                {themeName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}