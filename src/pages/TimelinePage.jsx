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

// Ordered themes (used for legend)
const orderedThemes = [
  "Energy", "Military", "Heritage & Archaeology",
  "Conservation & Environment", "Governance & Territory",
  "Infrastructure & Technology", "Resistance"
];

export default function TimelinePage() {
  const plotRef = useRef(null);
  const plotReady = useRef(false);
  const [theme, setTheme] = useState("dark");
  const [mapCenter, setMapCenter] = useState([31.7683, 35.2137]);
  const [mapZoom, setMapZoom] = useState(6);
  const [error, setError] = useState(null);

  // ... state and useEffects (unchanged) ...

  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const textColor = theme === "light" ? "#333333" : "#f0f0f0";
  const containerStyle = {
    border: `1px solid ${borderColor}`,
    backgroundColor: "transparent",
    padding: "10px",
    borderRadius: "0",
  };
  const sliderContainerStyle = {
    marginTop: "0",
    marginLeft: "20px",
    width: "71%",
  };

  // ... rest of the component (useEffects and handlers) ...

  return (
    <div>
      <Header />
      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
        <style>{`
          /* Mobile-only styles */
          .mobile-legend-container {
            display: none;
          }

          @media (max-width: 768px) {
            /* Left column full width, map smaller */
            .left-col {
              flex: 1 1 100% !important;
              width: 100% !important;
              margin-top: 0 !important;
            }
            .left-col > div:first-child {
              height: 300px !important;
            }
            .left-col > div:last-child {
              width: 100% !important;
              margin-top: 0.5rem !important;
              height: 150px !important; /* fixed height for info box */
              overflow-y: auto;
            }

            /* Right column full width, flex column, reorder children */
            .right-col {
              flex: 1 1 100% !important;
              min-width: 0 !important;
              width: 100% !important;
              display: flex !important;
              flex-direction: column !important;
            }

            /* Sliders come first (order: 1), plot comes second (order: 2) */
            .sliders-wrapper {
              order: 1;
              width: 100%;
            }
            .plot-wrapper {
              order: 2;
              width: 100%;
              overflow-x: auto;
            }
            .plot-wrapper > div {
              min-width: 0 !important;
              width: 100% !important;
              height: 400px !important; /* smaller on mobile */
              margin-bottom: 0 !important;
            }

            /* Mobile legend above plot */
            .mobile-legend-container {
              display: block;
              order: 0; /* above plot */
              margin-bottom: 0.5rem;
              width: 100%;
            }
            .mobile-legend-details {
              border: 1px solid ${borderColor};
              padding: 0.3rem 0.5rem;
              background: rgba(0, 0, 0, 0.3);
              cursor: pointer;
              font-family: monospace;
              font-size: 0.8rem;
            }
            body.light-bg .mobile-legend-details {
              background: rgba(255, 255, 255, 0.8);
            }
            .mobile-legend-summary {
              display: flex;
              justify-content: space-between;
              align-items: center;
              list-style: none;
              user-select: none;
            }
            .mobile-legend-summary::-webkit-details-marker {
              display: none;
            }
            .legend-arrow {
              transition: transform 0.2s ease;
              font-size: 0.7rem;
            }
            .mobile-legend-details[open] .legend-arrow {
              transform: rotate(180deg);
            }
            .mobile-legend-items {
              display: flex;
              flex-wrap: wrap;
              gap: 0.3rem 0.8rem;
              padding: 0.5rem 0 0.2rem 0;
              border-top: 1px solid rgba(154, 252, 151, 0.2);
              margin-top: 0.3rem;
            }
            body.light-bg .mobile-legend-items {
              border-top-color: rgba(44, 110, 44, 0.2);
            }
            .legend-item {
              display: flex;
              align-items: center;
              gap: 0.3rem;
              font-size: 0.7rem;
              font-family: monospace;
            }
            .legend-color-swatch {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              flex-shrink: 0;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            body.light-bg .legend-color-swatch {
              border-color: rgba(0, 0, 0, 0.2);
            }
            .legend-label {
              opacity: 0.85;
            }

            /* Hide Plotly legend on mobile */
            .plot-wrapper .legend {
              display: none !important;
            }

            /* Sliders full width, remove left margin */
            .sliders-wrapper .slider-container {
              width: 100% !important;
              margin-left: 0 !important;
              margin-top: 0.5rem !important;
            }
            .sliders-wrapper .slider-container:first-child {
              margin-top: 0 !important;
            }
            .sliders-wrapper .radar-slider {
              margin-top: 0.8rem !important;
            }
            .sliders-wrapper .osm-container {
              margin-top: 0.8rem !important;
            }

            /* Radar info panel: inline, below sliders */
            .radar-info-panel-inline {
              width: 100% !important;
              max-height: 180px !important;
              height: 180px !important;
              margin-top: 0.5rem !important;
              margin-bottom: 0.5rem !important;
              position: relative !important;
              bottom: auto !important;
              right: auto !important;
              overflow-y: auto !important;
            }
          }

          @media (min-width: 769px) {
            .mobile-legend-container {
              display: none !important;
            }
          }
        `}</style>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {/* LEFT COLUMN: Map and timeline info panel */}
          <div className="left-col" style={{ flex: "0 0 500px", width: "500px", marginTop: "10px" }}>
            <div style={{ width: "100%", height: "400px", border: `1px solid ${borderColor}`, background: "#30342f" }}>
              <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }} attributionControl={false} zoomControl={false} key={mapCenter.toString() + mapZoom}>
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="" />
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
                  const yearsSince = (animationDate - point.date) / (1000 * 60 * 60 * 24 * 365.25);
                  let radius = MIN_RADIUS;
                  if (yearsSince > 0) {
                    radius = MIN_RADIUS + (yearsSince / RADIUS_GROWTH_YEARS) * (MAX_RADIUS - MIN_RADIUS);
                    radius = Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, radius));
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
                        }
                      }}
                    >
                      <Popup>
                        <strong>{point.label}</strong><br />
                        <strong>Date:</strong> {point.date.toLocaleDateString()}<br />
                        <strong>Area:</strong> {point.area || "Not provided"}<br />
                        {point.description}<br />
                        <a href={point.source} target="_blank">Source</a>
                      </Popup>
                    </Marker>
                  );
                })}
                {visibleRadarMarkers.map((point, idx) => (
                  <Marker key={`radar-${idx}`} position={[point.lat, point.lng]} icon={createRadarIcon(12)}>
                    <Popup>
                      <strong>{point.name}</strong><br />
                      <strong>Type:</strong> {point.bandType}<br />
                      <strong>Purpose:</strong> {point.purpose}<br />
                      <strong>Jurisdiction:</strong> {point.jurisdiction}<br />
                      <strong>Operator:</strong> {point.operator}<br />
                      <strong>Status:</strong> {point.status}<br />
                      <a href={point.source} target="_blank">Source</a>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div style={{ ...containerStyle, marginTop: "0.5rem", width: "100%" }}>
              {clickedInfo ? <div dangerouslySetInnerHTML={{ __html: clickedInfo }} /> : "Click a dot or drag the timeline slider to see details."}
            </div>
          </div>

          {/* MIDDLE COLUMN: Plot + sliders + radar overlay + OSM overlay controls */}
          <div className="right-col" style={{ flex: "1", minWidth: "400px", position: "relative" }}>
            {/* Mobile legend dropdown */}
            <div className="mobile-legend-container">
              <details className="mobile-legend-details">
                <summary className="mobile-legend-summary">
                  <span>Timeline Legend</span>
                  <span className="legend-arrow">▾</span>
                </summary>
                <div className="mobile-legend-items">
                  {orderedThemes.map((themeName) => (
                    <div key={themeName} className="legend-item">
                      <span 
                        className="legend-color-swatch" 
                        style={{ backgroundColor: getMarkerColor(themeName) }}
                      />
                      <span className="legend-label">{themeName}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Sliders wrapper – contains timeline, radar, place names */}
            <div className="sliders-wrapper">
              {/* Timeline slider */}
              <div className="slider-container" style={sliderContainerStyle}>
                <div style={{ marginBottom: "0.4rem", marginTop: "-1.20rem", fontFamily: "monospace", fontSize: "0.8rem" }}>
                  Timeline: {animationDate ? formatDateForSlider(animationDate) : "—"}
                </div>
                <input
                  type="range"
                  min={PLOT_START}
                  max={PLOT_END}
                  step={STEP_MS}
                  value={animationDate ? animationDate.getTime() : PLOT_START}
                  onChange={handleTimelineSliderChange}
                  style={{ width: "100%", accentColor: "#555", height: "4px", borderRadius: "2px" }}
                />
                <div style={{ fontSize: "0.7rem", marginTop: "0.5rem", color: textColor }}>
                  Drag to reveal timeline events. Glow grows with years passed.
                </div>
              </div>

              {/* Radar slider */}
              {minRadarDate && maxRadarDate && (
                <div className="slider-container radar-slider" style={{ ...sliderContainerStyle, marginTop: "0.8rem" }}>
                  <div style={{ marginBottom: "0.1rem", fontFamily: "monospace", fontSize: "0.8rem" }}>
                    Radar: {radarDate ? formatDateForSlider(radarDate) : "—"}
                  </div>
                  <input
                    type="range"
                    min={PLOT_START}
                    max={PLOT_END}
                    step={STEP_MS}
                    value={radarDate ? radarDate.getTime() : PLOT_START}
                    onChange={handleRadarSliderChange}
                    style={{ width: "100%", accentColor: "#888", height: "4px", borderRadius: "2px" }}
                  />
                  <div style={{ fontSize: "0.7rem", marginTop: "0.5rem", color: textColor }}>
                    Radar installations
                  </div>
                </div>
              )}

              {/* OSM raster overlay controls */}
              <div className="slider-container osm-container" style={{ ...sliderContainerStyle, marginTop: "0.5rem" }}>
                <label style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: "normal", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
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
                      onChange={(e) => setOsmOverlayOpacity(parseFloat(e.target.value))}
                      style={{
                        width: "100%",
                        accentColor: "#a7a5a5",
                        height: "4px",
                        borderRadius: "2px",
                        marginTop: "4px"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Radar info overlay – inline on mobile, floating on desktop */}
            {radarInfo && (
              <div className="radar-info-panel-inline" style={{
                width: "280px",
                maxHeight: "70%",
                overflowY: "auto",
                ...containerStyle,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(4px)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                fontSize: "0.8rem",
                position: "relative", // will be overridden on mobile to relative
                bottom: "auto",
                right: "auto",
              }}>
                <div dangerouslySetInnerHTML={{ __html: radarInfo }} />
              </div>
            )}

            {/* Plot container */}
            <div className="plot-wrapper" style={{ width: "100%", overflowX: "auto" }}>
              <div ref={plotRef} style={{ minWidth: "800px", height: "500px", marginBottom: "0.5rem" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}