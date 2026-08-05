// pages/HomePage.jsx
import Header from "../components/Header";
import FrequencyWave from "../components/FrequencyWave";
import SpectrumBar from "../components/SpectrumBar";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [theme, setTheme] = useState("dark");
  const [selectedBand, setSelectedBand] = useState(null);
  const [infoTarget, setInfoTarget] = useState(null);
  const bandRefs = useRef({});

  // --- FULL Knowledge base for ALL 12 bands ---
  const bandKnowledge = {
    "HF": {
      fullName: "HF (3–30 MHz)",
      functions: "Long‑range radio communications, amateur radio, maritime and aviation voice, and over‑the‑horizon radar. Relies on ionospheric reflection (skywave) to reach across continents.",
      atmosphere: "Highly dependent on solar activity and ionospheric conditions. Signals reflect off the F‑layer, enabling global propagation. Sensitive to day/night cycles and geomagnetic storms."
    },
    "VHF": {
      fullName: "VHF (30–300 MHz)",
      functions: "FM radio, television broadcasting, air traffic control, marine and land mobile communications, and early warning radar.",
      atmosphere: "Primarily line‑of‑sight, but can occasionally propagate via tropospheric ducting. Affected by weather conditions and terrain; less ionospheric reflection than HF."
    },
    "UHF": {
      fullName: "UHF (300 MHz – 1 GHz)",
      functions: "Terrestrial TV broadcasting, two‑way radios, mobile phones, and early warning radar systems. Used heavily for ground‑to‑ground and ground‑to‑air communications.",
      atmosphere: "Penetrates the ionosphere effectively. Signals travel via ground waves and tropospheric scatter. Very resilient to rain and fog, making it ideal for reliable, short‑to‑medium range terrestrial links."
    },
    "L": {
      fullName: "L‑Band (1–2 GHz)",
      functions: "Global navigation (GPS/Galileo), satellite telemetry, maritime distress beacons, and weather monitoring from space.",
      atmosphere: "Passes easily through clouds, light rain, and vegetation with very low attenuation. Long wavelengths provide excellent foliage penetration, making it the backbone for global space‑to‑ground communications."
    },
    "S": {
      fullName: "S‑Band (2–4 GHz)",
      functions: "Weather surveillance radars (Doppler), airport surveillance (ASR), and some deep‑space satellite communications (e.g., Artemis).",
      atmosphere: "Moderate rain fade begins here. Highly sensitive to atmospheric moisture, which makes it perfect for detecting precipitation intensity and wind shear in storm systems."
    },
    "C": {
      fullName: "C‑Band (4–8 GHz)",
      functions: "Long‑haul satellite communications (downlinks), Wi‑Fi, and weather radar. Often used for transcontinental broadcast distribution.",
      atmosphere: "Encountering increasing attenuation due to heavy rainfall (rain fade). Used with larger satellite dishes to overcome path losses in humid, tropical climates."
    },
    "X": {
      fullName: "X‑Band (8–12 GHz)",
      functions: "Military radar, high‑resolution synthetic aperture radar (SAR) satellite imaging, radar altimeters, and speed detection.",
      atmosphere: "Highly absorbed by atmospheric water vapour and oxygen (oxygen absorption peak near 60 GHz, but affects this band). Used in dual‑polarisation radars to precisely measure raindrop size and shape."
    },
    "Ku": {
      fullName: "Ku‑Band (12–18 GHz)",
      functions: "Satellite TV broadcasting (e.g., DirecTV, Sky), VSAT internet, and radar for ship navigation.",
      atmosphere: "Highly susceptible to heavy rain fade (attenuation). Requires adaptive power control or larger antenna margins to maintain link stability during thunderstorms."
    },
    "K": {
      fullName: "K‑Band (18–27 GHz)",
      functions: "Radar, satellite communications, and radio astronomy. Often used for military radar and high‑speed data links.",
      atmosphere: "Strong attenuation from water vapour and oxygen (absorption peaks). Typically used in short‑range or dry‑climate applications where atmospheric losses are manageable."
    },
    "Ka": {
      fullName: "Ka‑Band (27–40 GHz)",
      functions: "High‑throughput satellite communications (Starlink, OneWeb), radar, and remote sensing. Supports very high data rates.",
      atmosphere: "Severe rain fade and atmospheric absorption; requires robust link budgets and adaptive coding. Often used with small aperture terminals and high‑gain antennas."
    },
    "V": {
      fullName: "V‑Band (40–75 GHz)",
      functions: "High‑capacity point‑to‑point microwave links, research radars, and emerging 5G backhaul. Used in security scanners and atmospheric sensing.",
      atmosphere: "Extreme attenuation from oxygen and water vapour. Limited to short‑range (<1 km) terrestrial applications or satellite cross‑links in low‑loss windows."
    },
    "W": {
      fullName: "W‑Band (75–110 GHz)",
      functions: "Advanced radar imaging, security scanners, and scientific research. Used in automotive radar (76–81 GHz) and atmospheric profiling.",
      atmosphere: "Heavy attenuation by atmospheric gases, but some window bands exist. Often used in dry air or at high altitudes; requires highly sensitive receivers."
    }
  };

  // --- Colour mapping for all 12 bands (matches SpectrumBar DEFAULT_BANDS) ---
  const bandColors = {
    "HF": "#ff0000",
    "VHF": "#ff5500",
    "UHF": "#ff9706",
    "L": "#cdfa05",
    "S": "#0ceb00",
    "C": "#00ffd9",
    "X": "#3044de",
    "Ku": "#6200ff",
    "K": "#7014c6",
    "Ka": "#ba55d3",
    "V": "#ee82ee",
    "W": "#ffffff"
  };

  // --- Theme detection (unchanged) ---
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  // --- The six bands that have visible waveform cards ---
  const bands = [
    { name: "UHF (300 MHz - 1 GHz)", fullName: "UHF", color: "#ff9706" },
    { name: "L-Band (1-2 GHz)", fullName: "L", color: "#cdfa05" },
    { name: "S-Band (2-4 GHz)", fullName: "S", color: "#0ceb00" },
    { name: "C-Band (4-8 GHz)", fullName: "C", color: "#00ffd9" },
    { name: "X-Band (8-12 GHz)", fullName: "X", color: "#3044de" },
    { name: "Ku-Band (12-18 GHz)", fullName: "Ku", color: "#6200ff" },
  ];

  // --- Bar click handler (works for ALL bands) ---
  const handleBandSelect = (shortName) => {
    // Find if this band has a card on the page
    const matchedBand = bands.find(band => band.fullName === shortName);
    const hasCard = !!matchedBand;

    if (hasCard) {
      // Highlight and scroll to the card
      setSelectedBand(matchedBand.name);
      const cardElement = bandRefs.current[matchedBand.name];
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setTimeout(() => setSelectedBand(null), 2000);
    }

    // Show the popup with knowledge (if we have it)
    const info = bandKnowledge[shortName];
    if (info) {
      // If there's no card, we still show the popup, but we can add a note
      const displayName = hasCard ? matchedBand.name : info.fullName;
      setInfoTarget({
        ...info,
        shortName,
        fullName: displayName,
        hasCard, // pass this flag to optionally show a note
        color: bandColors[shortName] || "#9afc97" // fallback to default green
      });
    }
  };

  const closeInfoPanel = () => {
    setInfoTarget(null);
  };

  // --- Card click handler (only for the six that exist) ---
  const handleCardClick = (band) => {
    const info = bandKnowledge[band.fullName];
    if (info) {
      setInfoTarget({ 
        ...info, 
        shortName: band.fullName, 
        fullName: band.name, 
        hasCard: true,
        color: band.color // use the color from the bands array
      });
      setSelectedBand(band.name);
      const cardElement = bandRefs.current[band.name];
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setTimeout(() => setSelectedBand(null), 2000);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Spectral Ecologies</h1>
        <p>
          Spectral: relating to spectra, frequencies, and forms of presence beyond immediate perception,
          from the electromagnetic spectrum to spectral traces and resonances. The animated bands correspond
          to frequencies within the electromagnetic spectrum, including L, S, and X bands commonly associated
          with radar, satellite, and sensing systems. The project investigates the ecological and atmospheric
          conditions produced through electromagnetic transmission, acoustic sensing, and migratory environments.
        </p>

        <div className="wave-grid">
          {bands.map((band) => (
            <div
              key={band.name}
              className={`wave-card ${selectedBand === band.name ? "highlight" : ""}`}
              ref={(el) => (bandRefs.current[band.name] = el)}
              onClick={() => handleCardClick(band)}
              style={{ cursor: "pointer" }}
            >
              <h3>{band.name}</h3>
              <div className="wave-canvas-container">
                <FrequencyWave
                  bandName={band.name}
                  primaryColor={band.color}
                  theme={theme}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Spectrum Bar – now uses the FULL default list (12 bands) --- */}
      <SpectrumBar onBandSelect={handleBandSelect} />

      {/* --- Floating Info Panel --- */}
      {infoTarget && (
        <div className="info-overlay" onClick={closeInfoPanel}>
          <div className="info-panel" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeInfoPanel}>✕</button>
            <h2>
              <span className="color-swatch" style={{ backgroundColor: infoTarget.color }} />
              {infoTarget.fullName}
            </h2>

            {/* If the band has no card on this page, show a subtle note */}
            {!infoTarget.hasCard && (
              <div className="note-missing">
                Note: This band is not displayed in the grid above, but you can still explore its properties.
              </div>
            )}

            <div className="info-section">
              <h4>Function & Use</h4>
              <p>{infoTarget.functions}</p>
            </div>
            <div className="info-section">
              <h4>Atmospheric & Ecological Behaviour</h4>
              <p>{infoTarget.atmosphere}</p>
            </div>
            <div className="info-footer">
              <span>Click the background or ✕ to close</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding-bottom: 60px;
        }
        .wave-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .wave-card {
          border: 1px solid #9afc97;
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 0px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        .wave-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(154, 252, 151, 0.15);
        }
        .wave-card.highlight {
          border: 2px solid #ffd700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        }
        .wave-card h3 {
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .wave-canvas-container {
          width: 100%;
          height: 100px;
          flex-shrink: 0;
        }
        body.light-bg .wave-card {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        body.light-bg .wave-card.highlight {
          border-color: #ff8c00;
          box-shadow: 0 0 20px rgba(255, 140, 0, 0.4);
        }

        /* Info Panel Styles */
        .info-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        .info-panel {
          background: #111;
          border: 1px solid #9afc97;
          max-width: 550px;
          width: 90%;
          padding: 2rem;
          border-radius: 0;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        body.light-bg .info-panel {
          background: #f5f5f5;
          border-color: #2c6e2c;
        }
        body.light-bg .info-panel p {
          color: #222;
        }
        .info-panel h2 {
          margin-top: 0;
          color: #9afc97;
          font-size: 1.4rem;
          border-bottom: 0px solid rgba(154, 252, 151, 0.2);
          padding-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        body.light-bg .info-panel h2 {
          color: #1a4a1a;
        }
        .color-swatch {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        body.light-bg .color-swatch {
          border-color: rgba(0,0,0,0.2);
        }
        .info-section {
          margin: 1.2rem 0;
        }
        .info-section h4 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.7;
          margin-bottom: 0.3rem;
          color: #9afc97;
        }
        body.light-bg .info-section h4 {
          color: #2c6e2c;
        }
        .info-section p {
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
          color: #ddd;
        }
        body.light-bg .info-section p {
          color: #222;
        }
        .info-footer {
          margin-top: 1.5rem;
          font-size: 0.65rem;
          opacity: 0.5;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 1rem;
          color: #999;
        }
        body.light-bg .info-footer {
          border-top: 1px solid rgba(0,0,0,0.1);
          color: #666;
        }
        .note-missing {
          background: rgba(154, 252, 151, 0.1);
          padding: 0.5rem 0.8rem;
          font-size: 0.8rem;
          color: #9afc97;
          margin-bottom: 1rem;
          border-radius: 0;
          border-left: none;
        }
        body.light-bg .note-missing {
          background: rgba(44, 110, 44, 0.1);
          color: #1a4a1a;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          color: #9afc97;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.6;
          transition: 0.2s;
        }
        .close-btn:hover {
          opacity: 1;
          transform: rotate(90deg);
        }
        body.light-bg .close-btn {
          color: #1a4a1a;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 900px) {
          .wave-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .wave-grid {
            grid-template-columns: 1fr;
          }
          .info-panel {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}