// pages/BirdMapPage.jsx
import Header from "../components/Header";
import BirdTracker from "../components/BirdTracker";

export default function BirdMapPage() {
  return (
    <div>
      <Header />
      <div className="container" style={{ marginTop: "2rem", paddingBottom: "4rem" }}>
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
            This map shows the recorded movements of nine adult vultures from three species. Each bird carried
            a small GPS device worn like a backpack, which recorded its position at regular intervals. The
            tracks help us understand how vultures move across different kinds of terrain, where they stop or
            return, and how they travel between feeding and roosting areas and possible breeding sites. They
            can also show how roads, settlements, borders and other forms of infrastructure relate to their
            movement.
          </p>
          <p>
            The map also marks the positions of active radar sites in relation to the recorded flight paths.
            This additional layer allows the vultures' movements to be viewed alongside technological and
            military infrastructure. Proximity does not prove that radar affected the birds or altered their
            navigation, but it reveals where animal routes and radar systems occupy the same landscape. These
            routes are not shaped by topography alone. In some areas, conservation organisations provide
            carcasses at artificial feeding stations. These sites can attract vultures to particular locations
            and influence where they remain or return. The map therefore records both bird navigation and the
            human systems that manage, monitor and occupy the areas through which vultures move.
          </p>
        </div>

        {/* --- What the map can reveal section --- */}
        <div className="info-section">
          <h3 className="section-title">What the map can reveal</h3>
          <p>
            The dataset is held by Movebank, an online repository where researchers preserve and share
            animal-tracking information. Each recorded journey is unique and cannot be reproduced, so storing
            the data allows it to be studied again and used to explore questions beyond those asked in the
            original research. Detailed tracking data can reveal colonies, regular roosting places, feeding
            sites, conservation areas and the movements of vulnerable animals. It can also show routes through
            politically or militarily sensitive territories, as well as relationships between wildlife, radar
            sites, roads, settlements, borders and other infrastructure.
          </p>
          <p>
            Making precise locations public can create risks. Sensitive habitats, vulnerable animals and
            important feeding or breeding sites may become easier to identify. The tracks can also reveal
            conservation interventions, such as artificial feeding stations, that actively influence where
            vultures travel and gather. When viewed alongside radar sites, the tracks raise further questions
            about how animal navigation passes through landscapes organised by surveillance, communications
            and military infrastructure. The map does not establish that radar caused a particular movement,
            but it makes these spatial relationships visible.
          </p>
          <p>
            The map should therefore be read as both a record of vulture movement and a record of the conditions
            surrounding and shaping that movement. These conditions include terrain, food availability,
            conservation practices, technological infrastructure and political borders. The movement records
            used in this map come from the dataset <em>Long-range adult movements of 3 vulture species
            (data from Spiegel et al. 2015)</em>, published through the Movebank Data Repository.
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
          overflow: visible;
          height: auto;
          min-height: 600px;
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
            min-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}