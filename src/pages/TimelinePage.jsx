import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist";
import Papa from "papaparse";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";

// ... (all constants and helpers remain the same) ...

export default function TimelinePage() {
  // ... (all state remains the same) ...

  // Ordered themes for legend
  const orderedThemes = [
    "Energy", "Military", "Heritage & Archaeology",
    "Conservation & Environment", "Governance & Territory",
    "Infrastructure & Technology", "Resistance"
  ];

  // ... (all useEffects remain the same, but in the plot layout use isMobile) ...

  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const textColor = theme === "light" ? "#333333" : "#f0f0f0";
  const containerStyle = {
    border: `1px solid ${borderColor}`,
    backgroundColor: "transparent",
    padding: "10px",
    borderRadius: "0",
  };

  if (error) return <div><Header /><div className="container" style={{ color: "red" }}>Error: {error}</div></div>;

  return (
    <div>
      <Header />
      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "1rem" }}>
        <style>{`
          .slider-container {
            width: 71%;
            margin-left: 20px;
          }

          .plot-wrapper {
            width: 100%;
            overflow: visible;
            position: relative;
            margin-bottom: 0.5rem;
          }

          /* Radar info panel – desktop style */
          .radar-info-panel {
            border: 1px solid ${borderColor};
            padding: 10px;
            border-radius: 0;
            background-color: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            max-height: 70%;
            overflow-y: auto;
            font-size: 0.8rem;
          }

          body.light-bg .radar-info-panel {
            background-color: rgba(245, 243, 239, 0.95);
          }

          /* Mobile legend – hidden on desktop */
          .mobile-legend-container {
            display: none;
          }

          @media (max-width: 768px) {
            .slider-container {
              width: 100%;
              margin-left: 0;
            }

            .timeline-left-col {
              flex: 1 1 100% !important;
              width: 100% !important;
              margin: 0 auto;
            }

            .timeline-middle-col {
              flex: 1 1 100% !important;
              min-width: 0 !important;
              width: 100%;
            }

            .timeline-left-col > div:first-child {
              width: 100% !important;
              height: 300px !important;
            }

            .timeline-left-col > div:last-child {
              width: 100% !important;
            }

            .plot-wrapper .plotly-plot {
              height: 350px !important;
            }

            /* Mobile dropdown legend */
            .mobile-legend-container {
              display: block;
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

            /* Radar info panel on mobile – full width */
            .radar-info-panel {
              position: relative !important;
              bottom: auto !important;
              right: auto !important;
              width: 100% !important;
              max-height: 200px !important;
              margin-top: 0.5rem;
            }

            .radar-info-panel-inline {
              width: 100% !important;
              max-height: 200px !important;
              margin-top: 0.5rem;
              position: relative !important;
              bottom: auto !important;
              right: auto !important;
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
          <div className="timeline-left-col" style={{ flex: "0 0 500px", width: "500px", marginTop: "10px" }}>
            {/* ... map content unchanged ... */}
          </div>

          {/* MIDDLE COLUMN: Plot + sliders + legend */}
          <div className="timeline-middle-col" style={{ flex: "1", minWidth: "400px", position: "relative" }}>

            {/* --- Mobile dropdown legend --- */}
            <div className="mobile-legend-container">
              <details className="mobile-legend-details">
                <summary className="mobile-legend-summary">
                  <span>📊 Timeline Legend</span>
                  <span className="legend-arrow">▾</span>
                </summary>
                <div className="mobile-legend-items">
                  {orderedThemes.map((theme) => (
                    <div key={theme} className="legend-item">
                      <span 
                        className="legend-color-swatch" 
                        style={{ backgroundColor: getMarkerColor(theme) }}
                      />
                      <span className="legend-label">{theme}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Plot container – responsive width */}
            <div className="plot-wrapper">
              <div ref={plotRef} style={{ width: "100%", height: "500px" }} />
            </div>

            {/* Timeline slider */}
            <div className="slider-container">
              {/* ... slider content unchanged ... */}
            </div>

            {/* Radar slider */}
            {/* ... radar slider unchanged ... */}

            {/* OSM overlay controls */}
            {/* ... OSM controls unchanged ... */}

            {/* Radar info panel */}
            {/* ... radar info panel unchanged ... */}
          </div>
        </div>
      </div>
    </div>
  );
}