// pages/InterferencePage.jsx

import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function InterferencePage() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) {
      setWebglSupported(false);
    }
  }, []);

  return (
    <div>
      <Header />

      <main className="container interference-container">
        <div className="interference-layout">
          {/* Left column: interactive 3D terrain */}
          <section
            className="terrain-col"
            aria-label="Interactive GPS terrain model"
          >
            <div className="terrain-frame">
              {!webglSupported ? (
                <div className="webgl-fallback" role="alert">
                  <div>
                    <strong>WebGL not supported</strong>
                    <br />
                    Your browser or device does not support WebGL, which is
                    required for the 3D terrain view. Please try using a desktop
                    browser.
                  </div>
                </div>
              ) : (
                <iframe
                  className="terrain-iframe"
                  src="/terrain/gps_axes_km_labels.html"
                  title="Interactive three-dimensional terrain generated from raw Griffon Vulture GPS tracking data"
                  allowFullScreen
                />
              )}
            </div>
          </section>

          {/* Right column: introductory text */}
          <aside className="description-col">
            <div className="description-panel">
              <h3>Interference as an Investigative Condition</h3>

              <p>
                This interactive terrain visualises the raw GPS tracking data
                of a single Griffon Vulture moving across the Negev Desert and
                the area surrounding the Dead Sea.
              </p>

              <p>
                The longer movement record shown in the Vulture Map comes from
                a dataset published through the Movebank Data Repository. In
                contrast, the data used in this model had not been made public
                or processed into the cleaned long-range movement record.
              </p>

              <p>
                The model preserves missing positions, interruptions and
                irregular spatial connections that would normally be removed
                during data processing. By translating the raw GPS coordinates
                into a three-dimensional terrain, it becomes possible to
                compare the recorded trajectory with the surrounding
                topography and examine where the track remains geographically
                coherent and where it becomes interrupted, displaced or
                unstable.
              </p>

              <p>
                The model does not present these anomalies as technical errors
                or as evidence of a single cause. It treats them as
                investigative conditions. Their recurring spatial patterns
                invite closer examination of the operational environments
                through which wildlife telemetry functions and of the
                electromagnetic conditions surrounding satellite-based
                tracking during a period of intensified military
                infrastructure, radar activity and sustained aerial
                operations.
              </p>

              <p>
                Move through the model to explore the scale, distribution and
                spatial clustering of these interruptions.
              </p>

              <p className="interaction-note">
                <strong>Interaction:</strong> drag to rotate, scroll to zoom,
                and right-click and drag to pan.
              </p>
            </div>
          </aside>
        </div>

        {/* Full-width research text beneath the model */}
        <section
          className="research-section terrain-research-section"
          aria-labelledby="raw-gps-terrain-heading"
        >
          <h3
            id="raw-gps-terrain-heading"
            className="section-title"
          >
            Raw GPS Terrain Model
          </h3>

          <p>
            The raw GPS data used to generate this terrain was not originally
            intended for public interpretation. Recorded between 22 November
            2024 and 22 February 2025, the dataset spans a period of sustained
            military operations across Gaza and the surrounding region. It
            formed part of a processing pipeline in which movement data was
            cleaned before publication. Missing positions, duplicated
            coordinates and irregular trajectories are commonly removed so
            that a coherent movement path can be reconstructed. This model
            examines what those interruptions may reveal before they disappear
            from the record. The raw coordinates were translated into a
            three-dimensional terrain so that the recorded trajectory could be
            compared with the surrounding landscape. The terrain provides a
            spatial reference for evaluating the positions. Sections of the
            track that follow valleys, escarpments and changes in elevation
            remain geographically coherent with the landscape. Elsewhere, the
            trajectory becomes discontinuous, displaced or disappears
            entirely. These moments are preserved as part of the conditions
            through which the bird&apos;s movement became measurable.
          </p>

          <p>
            The decision to retain these interruptions emerged from a broader
            concern with wildlife telemetry in conflict environments. Most
            people have encountered GNSS spoofing without realising it: a phone
            map may suddenly place them at an airport, in another city or
            direct them along an impossible route because the device has
            received false positioning signals. In wildlife telemetry, the
            same phenomenon can relocate a bird hundreds of kilometres from
            its actual position or interrupt the continuity of its recorded
            movement. The{" "}
            <a
              href="/papers/jiguet-et-al-2025-gnss-spoofing-wildlife-tracking.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the Nature Communications article as a PDF in a new tab"
            >
              <em>
                Nature Communications article: GNSS spoofing in conflict zones
                disrupts wildlife tracking and hampers research and
                conservation efforts
              </em>
            </a>{" "}
            documents numerous examples of tracked birds being repeatedly
            relocated to international airports across conflict-affected
            regions. Several clusters of interruption within this dataset occur
            in close proximity to the Dimona Radar Facility, including the
            United States-operated AN/TPY-2 X-band ballistic-missile
            early-warning radar and the Israeli-operated ELM-2083 L-band
            aerostat radar for detecting low-altitude aircraft. Their proximity
            situates these interruptions within an environment characterised
            by intensive military sensing. The model approaches these
            interruptions as objects of inquiry and as records of the
            operational conditions through which wildlife telemetry functions.
            It shifts the focus from reconstructing movement to examining the
            infrastructures that make movement measurable, bringing biological
            movement, satellite navigation, topography and terrestrial sensing
            systems into the same field of analysis.
          </p>
        </section>
      </main>
    </div>
  );
}