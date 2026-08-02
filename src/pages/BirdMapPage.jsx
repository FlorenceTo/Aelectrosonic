// pages/BirdMapPage.jsx
import Header from "../components/Header";
import BirdTracker from "../components/BirdTracker";

export default function BirdMapPage() {
  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: "0.5rem", paddingBottom: "2rem" }}>
        <h2 style={{ borderBottom: "none", marginBottom: "0.25rem", paddingBottom: 0 }}>
          Bird Movement Tracker
        </h2>
        <p style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          Griffon vulture GPS telemetry
        </p>

        {/* --- About the data section --- */}
        <div className="info-section">
          <h3 className="section-title">About the data</h3>
          <p>
            This dataset records the GPS movements of nine adult vultures from three species. Backpack-mounted
            GPS–accelerometer tags documented successive locations over time, allowing the birds' movements to
            be read in relation to distance, terrain, roosting areas and the places they repeatedly returned to.
            The tracks do not simply show where the vultures travelled; they also reveal how movement is shaped
            by the landscapes and systems through which they navigate.
          </p>
          <p>
            In Israel, the vultures were tracked within an intensively managed conservation system that included
            artificial feeding stations. These sites provide reliable food and can attract birds back towards
            particular areas, meaning that the recorded paths reflect both avian navigation and human intervention.
            The map therefore makes visible a relationship between animal movement, topography and the
            infrastructures established to manage vulnerable populations.
          </p>
        </div>

        {/* --- What the tracks expose section --- */}
        <div className="info-section">
          <h3 className="section-title">What the tracks expose</h3>
          <p>
            Movebank archives observations of animal movement that cannot be reproduced, allowing completed
            datasets to be preserved, cited and reused. Public access enables these records to be interpreted
            beyond the original questions of the study.
          </p>
          <p>
            Detailed wildlife tracking can, however, reveal more than movement alone. It may expose colonies
            and habitual roosts, feeding sites, vulnerable individuals, routes through ecologically, politically
            or militarily sensitive territories, and relationships between wildlife and human infrastructure.
            At the same time, the routes should not be understood as entirely spontaneous or unaffected by
            intervention. Managed feeding sites, conservation areas and other infrastructures may actively
            influence where birds travel, remain or return.
          </p>
          <p>
            The map can therefore be read both as a record of vulture navigation and as evidence of the
            conditions that organise that navigation. It shows how animal movement crosses topographic and
            political boundaries while also being redirected by conservation practices, food provision and
            systems of monitoring.
          </p>
          <p>
            These are potential ethical risks of publishing precise movement data rather than documented harms
            caused by this particular dataset. Movebank places responsibility on data owners to establish
            appropriate access permissions for threatened or at-risk populations and cautions that archived
            records may be incomplete or contain location outliers. This dataset is released under a CC0
            public-domain licence, but its creators and associated publication should still be credited
            according to academic and professional standards.
          </p>
        </div>

        {/* --- The map --- */}
        <div className="map-container">
          <BirdTracker />
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .section-title {
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9afc97;
          border-bottom: 1px solid rgba(154, 252, 151, 0.2);
          padding-bottom: 0.4rem;
          margin: 1.5rem 0 1rem 0;
          font-weight: normal;
        }
        body.light-bg .section-title {
          color: #1a4a1a;
          border-bottom: 1px solid rgba(44, 110, 44, 0.2);
        }
        .info-section p {
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0.8rem 0;
          color: #ddd;
        }
        body.light-bg .info-section p {
          color: #222;
        }
        .map-container {
          margin-top: 2rem;
          border: 1px solid #9afc97;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
        }
        body.light-bg .map-container {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        @media (max-width: 600px) {
          .container {
            padding: 0 0.8rem;
          }
          .map-container {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}