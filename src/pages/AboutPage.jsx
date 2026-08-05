import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function AboutPage() {
  const [theme, setTheme] = useState("dark");
  const [customBgColor, setCustomBgColor] = useState(null);

  // ---- THEME DETECTION ----
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      
      // Check for light-bg class
      const isLight = body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");

      // Check for custom background color (from color picker)
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

  // ---- HELPER: Check if a color is "light" ----
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

  // ---- DETERMINE IF WE SHOULD INVERT ----
  let shouldInvert = false;
  
  if (theme === "light") {
    // Light mode class: always invert
    shouldInvert = true;
  } else if (customBgColor) {
    // Custom color: invert if the color is light
    shouldInvert = isLightColor(customBgColor);
  }
  // Grey mode (default): apply partial inversion (handled by CSS filter below)

  // ---- STYLES ----
  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const backgroundColor = theme === "light" ? "rgba(245, 243, 239, 0.95)" : "rgba(0, 0, 0, 0.3)";

  // ---- GRADIENT TEXT STYLE with dynamic inversion ----
  const gradientTextStyle = {
    margin: "0 0 1rem 0",
    backgroundImage: "linear-gradient(25deg, rgb(250, 250, 130), rgba(168, 251, 165, 0.9))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: borderColor, // fallback for older browsers
    // Apply filter based on theme
    filter: shouldInvert ? "invert(1)" : "none",
    // Smooth transition when theme changes
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
          <p style={gradientTextStyle}>
            During fieldwork in Palestine, I often became aware of systems that were present but not visible...
          </p>

          <p style={gradientTextStyle}>
            I use the term spectral ecologies to describe these relations...
          </p>

          <p style={gradientTextStyle}>
            Interference becomes an investigative condition within this process...
          </p>
        </div>
      </div>
    </div>
  );
}