import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function AboutPage() {
  const [theme, setTheme] = useState("dark");

  // ---- THEME DETECTION ----
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.body.classList.contains("light-bg");
      setTheme(isLight ? "light" : "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTheme(document.body.classList.contains("light-bg") ? "light" : "dark");
    return () => observer.disconnect();
  }, []);

  // ---- STYLES ----
  const borderColor = theme === "light" ? "#2c6e2c" : "#9afc97";
  const backgroundColor = theme === "light" ? "rgba(245, 243, 239, 0.95)" : "rgba(0, 0, 0, 0.3)";

  // ---- Paragraph style – just the margin ----
  const paragraphStyle = {
    margin: "0 0 1rem 0",
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
          <p className="gradient-text" style={paragraphStyle}>
  This research began from the partial and absent forms through which an environment becomes perceptible. What appears through a microphone, tracking device, map or spectrogram is never the environment in full. It is formed through a relation between a living body, a technical instrument, the conditions in which a measurement takes place and the person interpreting what has been recorded. A bird becomes a coordinate. Electromagnetic activity becomes sound. Separate measurements become a route. A missing position may be classified as an error, yet its disappearance also marks the point at which a technical relation has failed to produce what was expected. These translations make movement and infrastructure available for study while changing the conditions through which they first became known. During fieldwork in Palestine, I often became aware of systems that were present but not visible. A mobile phone could hold a strong connection where no telecommunications tower could be seen. A directional microphone could bring the sound of a distant bird or aircraft closer before either came into view. A wideband receiver could render electromagnetic activity audible, but only within the limits of its frequency range and sensitivity. What became perceptible depended on the instrument, its placement and the conditions surrounding it.
          </p>

          <p className="gradient-text" style={paragraphStyle}>
            The website was guided by the intention to make research methods and contextual information more accessible to Palestinian scientists, biologists and ornithologists producing knowledge under occupation. This includes researchers who resist collaborations in which Israeli institutions become the compulsory technological providers, permit holders or validators of work conducted in Palestine, while Palestinians are positioned primarily as local hosts rather than equal producers and owners of knowledge. Israeli procedures for wireless experiments require an Israeli identity number or registered company, and foreign applicants must apply through an Israeli citizen or company. In the occupied West Bank, the Israeli Civil Administration separately regulates activities involving certain wireless devices, including their importation, purchase, possession, development and integration. These rules do not establish that every passive GPS logger is prohibited, but they show how transmitting wildlife tags can become dependent on Israeli licensing, institutional approval or an Israeli intermediary. The conditions of research are further shaped by restricted access to land. Palestine lies along a major bird-migration corridor, yet the habitats through which birds pass cannot be observed equally by those living within them. Checkpoints, road gates, settlements, firing zones, closed military areas and repeated military incursions fragment movement across the West Bank. These restrictions are not confined to Area C. Area A remains part of the occupied West Bank despite the administrative responsibilities assigned to the Palestinian Authority, and Israeli forces continue to enter Palestinian cities, villages and refugee camps, conduct raids, close roads and restrict movement. The division of the West Bank into Areas A, B and C does not describe the actual conditions under which Palestinians move, conduct fieldwork or maintain access to ecological sites.
          </p>

          <p className="gradient-text" style={paragraphStyle}>
            During my fieldwork in Palestine, I learned directly from ornithologists, biologists and others who continue to care for land and animal life under occupation. They described how cameras, binoculars, receivers and other field equipment could be treated with suspicion, and how access to particular areas could change without warning because of military operations, settlers, checkpoints or road closures. The absence of these experiences from public archives does not mean they do not occur. Some may remain undocumented because publishing details could expose researchers, communities or sensitive locations to further risk. The ornithologists and biologists I worked with guided me through high-altitude landscapes and taught me to understand bird movement through thermal currents, altitude, topography, weather, calls and repeated observation. Their knowledge did not begin with a tracking device or bird-identification application. It developed through long relationships with particular places: watching how birds gained height, where they circled, how they moved with rising air, and how their behaviour changed with weather and disturbance. Listening could register a bird or aircraft before it became visible, while familiarity with the landscape could reveal changes that an automated system might not recognise.
          </p>

          <p className="gradient-text" style={paragraphStyle}>
            The bioacoustic identification applications I tested during fieldwork often returned little or no usable information for the Palestinian locations and species we encountered. This did not indicate an absence of birds. It revealed an absence within the databases used by these applications. Species, calls and territories that had not been sufficiently recorded, labelled or incorporated into the system became difficult for the software to identify. What appeared as missing data was therefore connected to a wider geographical and political gap in which some environments are extensively documented and made machine-readable, while others remain technically underrepresented. Learning from Palestinian researchers made clear that limited access to advanced technologies does not indicate an absence of scientific knowledge. Ecological understanding was produced through listening, watching, remembering, caring and returning to the same places over time. These methods are not informal substitutes for technical science. They are forms of situated expertise that remain essential where access to equipment, permits, frequencies, databases and research sites is restricted. They hold forms of knowledge that instruments cannot produce on their own, including memories of ecological change, awareness of local disturbance and an understanding of the relationships between animal movement, land use and political conditions.
          </p>
        </div>
      </div>
    </div>
  );
}