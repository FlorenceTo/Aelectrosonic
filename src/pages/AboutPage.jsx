import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function AboutPage() {
  const [theme, setTheme] = useState("dark");
  const [customBgColor, setCustomBgColor] = useState(null);

  // ---- THEME + CUSTOM COLOR DETECTION ----
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      
      // 1. Check for light-bg class
      const isLight = body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");

      // 2. Check for custom background color (from color picker)
      const bgColor = body.style.backgroundColor;
      if (bgColor && bgColor !== "") {
        setCustomBgColor(bgColor);
      } else {
        setCustomBgColor(null);
      }
    });

    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ["class", "style"] 
    });

    // Initial check
    const body = document.body;
    const isLight = body.classList.contains("light-bg");
    setTheme(isLight ? "light" : "dark");
    
    const bgColor = body.style.backgroundColor;
    if (bgColor && bgColor !== "") {
      setCustomBgColor(bgColor);
    }

    return () => observer.disconnect();
  }, []);

  // ---- HELPER: Check if a color is "light" (luminance > 0.5) ----
  const isLightColor = (color) => {
    if (!color) return false;
    
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match) {
        r = parseInt(match[0]);
        g = parseInt(match[1]);
        b = parseInt(match[2]);
      }
    } else {
      return false;
    }

    // Relative luminance (WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  // ---- DETERMINE IF WE SHOULD INVERT (for custom colors) ----
  const shouldInvert = customBgColor ? isLightColor(customBgColor) : false;

  // ---- STYLES for the box ----
  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const backgroundColor = theme === "light" ? "rgba(245, 243, 239, 0.95)" : "rgba(0, 0, 0, 0.3)";

  // ---- Paragraph style – only applies filter for custom colors ----
  const paragraphStyle = {
    margin: "0 0 1rem 0",
    // Override CSS filter only when a custom color is active
    filter: customBgColor ? (shouldInvert ? "invert(1)" : "none") : undefined,
    transition: "filter 0.3s ease",
  };

  return (
    <div>
      <Header />
      <div style={{ width: "100%", padding: "0.6rem" }}>
        <div
          className="about-box"
          style={{
            border: `1px solid ${borderColor}`,
            padding: "1.3rem 1.5rem 0.8rem 1.5rem",
            backgroundColor: backgroundColor,
            fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
            fontSize: "clamp(0.6rem, 3.5vw, 1.2rem)",
            lineHeight: 1.5,
            fontWeight: 300,
            letterSpacing: "0.02em",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* ===== GRADIENT TEXT (CSS class + dynamic filter override) ===== */}
          <p className="gradient-text" style={paragraphStyle}>
            During fieldwork in Palestine, I often became aware of systems that were present but not visible. A mobile phone could hold a strong connection where no telecommunications tower could be seen. A directional microphone could bring the sound of a distant bird or aircraft closer before either came into view. A wideband receiver could render electromagnetic activity audible, but only within the limits of its frequency range and sensitivity. What became perceptible depended on the instrument, its placement and the conditions surrounding it. The landscape did not become more visible as more devices were introduced; different aspects emerged while others remained distant, obscured or absent. This research began from the partial and absent forms through which an environment becomes perceptible. What appears through a microphone, tracking device, map or spectrogram is never the environment in full, but is produced through a relation between a living body, a technical instrument, the conditions in which a measurement takes place and the person interpreting what has been recorded. A bird becomes a coordinate. Electromagnetic activity becomes sound. Separate measurements become a route. A missing position may be classified as an error, yet its disappearance also marks the point at which a technical relation has failed to produce what was expected. These translations make movement and infrastructure available for study while changing the conditions through which they first became known.
          </p>

          <p className="gradient-text" style={paragraphStyle}>
            I use the term spectral ecologies to describe these relations. Spectral refers to acoustic and electromagnetic frequencies, as well as to incomplete appearances: signals passing through bodies and landscapes without becoming directly visible, sounds arriving before their sources enter view, and movements reconstructed from traces left by sensing systems. Ecology is understood here as more than a relationship between organisms and a supposedly natural environment. It also includes satellites, transmitters, radar, tracking devices, communications networks, military infrastructures and the political conditions determining where people and animals can move. The material on this website should therefore be read neither as a transparent representation nor as evidence leading towards a single explanation. Maps, recordings and visualisations retain the decisions, limits and interruptions through which knowledge was produced.
          </p>

          <p className="gradient-text" style={paragraphStyle}>
            Interference becomes an investigative condition within this process. It draws attention to the moment when a relation becomes unstable: between a bird and its tracker, a satellite and receiver, a sound and microphone, or a body and the infrastructures surrounding it. An interruption may result from technical failure, environmental conditions, depleted power, signal obstruction or deliberate disruption; its presence alone cannot establish a cause. Remaining with it, rather than immediately removing it from the record, keeps open the question of what occurred and what the system was unable to register. The research presented here remains continuous and unfinished. Further fieldwork, conversations and technical experiments may change how earlier material is interpreted. This website functions as a working research environment for considering what exists, how it becomes perceptible and what happens when living movement is measured, translated and made public.
          </p>
        </div>
      </div>
    </div>
  );
}