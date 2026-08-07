import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function InterferencePage() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglSupported(false);
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="container" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0.5rem" }}>
        <div className="interference-layout" style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {/* Left column: 3D terrain */}
          <div className="terrain-col" style={{ flex: "2", minWidth: "250px" }}>
            <div
              style={{
                width: "100%",
                height: "calc(100vh - 80px)",
                border: "1px solid #9afc97",
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#111",
              }}
            >
              {!webglSupported ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    padding: "2rem",
                    color: "#ff0000",
                    fontFamily: "monospace",
                    fontSize: "1rem",
                  }}
                >
                  <div>
                    <strong>WebGL not supported</strong>
                    <br />
                    Your browser or device does not support WebGL, which is required for the 3D terrain view. Please try using a browser on a desktop.
                  </div>
                </div>
              ) : (
                <iframe
                  src="./terrain/gps_axes_km_labels.html"
                  title="3D Terrain Map"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="fullscreen"
                />
              )}
            </div>
          </div>

          {/* Right column: description text */}
          <div className="description-col" style={{ flex: "1", minWidth: "250px" }}>
            <div className="description-panel-text">
              <h3>Interference as an investigative condition</h3>
              <p>
                This interactive terrain visualises the raw GPS tracking data of a single Griffon Vulture moving across the Negev Desert and the area surrounding the Dead Sea. The longer movement record shown in the Vulture Map comes from a dataset published through the Movebank Data Repository. In contrast, the data used in this model had not been made public or processed into the cleaned long-range movement record. The model preserves missing positions, interruptions and irregular spatial connections that would normally be removed during data processing. By translating the raw GPS coordinates into a three-dimensional terrain, it becomes possible to compare the recorded trajectory with the surrounding topography and examine where the track remains geographically coherent and where it becomes interrupted, displaced or unstable.
              </p>
              <p>
                Rather than presenting these anomalies as technical errors or as evidence of a single cause, the model treats them as investigative conditions. Their recurring spatial patterns invite closer examination of the operational environments through which wildlife telemetry functions and of the electromagnetic conditions surrounding satellite-based tracking during a period of intensified military infrastructure, radar activity and sustained aerial operations.
              </p>
              <p>
                Move through the model to explore the scale, distribution and spatial clustering of these interruptions.
              </p>
              <p className="interaction-note">
                Interaction: drag to rotate, scroll to zoom, right‑click to pan.
              </p>
            </div>
          </div>
        </div>

        {/* ========== NEW SECTION: Raw GPS Terrain Model ========== */}
        <div className="research-section" style={{ marginTop: "2rem" }}>
          <h3 className="section-title">Raw GPS Terrain Model</h3>
          <p>
            The raw GPS data used to generate this terrain was not originally intended for public interpretation. Recorded between 22 November 2024 and 22 February 2025, the dataset spans a period of sustained military operations across Gaza and the surrounding region. It formed part of a processing pipeline in which movement data was cleaned before publication. Missing positions, duplicated coordinates and irregular trajectories are commonly removed so that a coherent movement path can be reconstructed. This model examines what those interruptions may reveal before they disappear from the record. The raw coordinates were translated into a three-dimensional terrain so that the recorded trajectory could be compared with the surrounding landscape. The terrain provides a spatial reference for evaluating the positions. Sections of the track that follow valleys, escarpments and changes in elevation remain geographically coherent with the landscape. Elsewhere, the trajectory becomes discontinuous, displaced or disappears entirely. These moments are preserved as part of the conditions through which the bird's movement became measurable.
          </p>
          <p>
            The decision to retain these interruptions emerged from a broader concern with wildlife telemetry in conflict environments. Most people have encountered GNSS spoofing without realising it: a phone map may suddenly place them at an airport, in another city or direct them along an impossible route because the device has received false positioning signals. In wildlife telemetry, the same phenomenon can relocate a bird hundreds of kilometres from its actual position or interrupt the continuity of its recorded movement. The Nature Communications article <em>GNSS spoofing in conflict zones disrupts wildlife tracking and hampers research and conservation efforts</em> documents numerous examples of tracked birds being repeatedly relocated to international airports across conflict-affected regions. Several clusters of interruption within this dataset occur in close proximity to the Dimona Radar Facility, including the United States-operated AN/TPY-2 X-band ballistic-missile early-warning radar and the Israeli-operated ELM-2083 L-band aerostat radar for detecting low-altitude aircraft. Their proximity situates these interruptions within an environment characterised by intensive military sensing. The model approaches these interruptions as objects of inquiry and as records of the operational conditions through which wildlife telemetry functions. It shifts the focus from reconstructing movement to examining the infrastructures that make movement measurable, bringing biological movement, satellite navigation, topography and terrestrial sensing systems into the same field of analysis.
          </p>
        </div>
      </div>

      {/* Page‑specific styles – only for the description panel */}
      <style jsx>{`
        .description-panel-text {
          border: 1px solid #9afc97;
          padding: 1rem;
          height: calc(100vh - 80px);
          overflow-y: auto;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .description-panel-text h3 {
          margin-top: 0;
          margin-bottom: 0.8rem;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--site-accent);
          font-weight: normal;
        }

        .description-panel-text p {
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0.8rem 0;
          color: var(--site-text);
        }

        .description-panel-text .interaction-note {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-bottom: 0;
        }

        /* Light mode is automatically handled via CSS variables */
        body.light-bg .description-panel-text {
          background-color: rgba(255, 255, 255, 0.8);
          border-color: var(--site-accent);
        }
      `}</style>
    </div>
  );
}