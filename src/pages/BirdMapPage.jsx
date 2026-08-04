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

        {/* --- About the tracking device section --- */}
        <div className="tracker-section">
          {/* Full‑width image above the title – live nest cam */}
          <div className="image-block">
            <img
              src="/images/live_nest_cam_vulture.jpg"
              alt="Live cam capture: Griffon Vulture spreading its wings at its nest site at Gamla Nature Reserve."
              className="full-width-image"
            />
            <p className="small-text image-caption">
              Live cam capture: Griffon Vulture spreading its wings at its nest site at Gamla Nature Reserve.
            </p>
          </div>

          <h3 className="section-title">About the tracking device</h3>
          <p>
            The movement dataset makes the vultures' routes visible, but the device that produced those routes
            is much less visible. The accompanying Movebank reference material explains how the records are
            organised and defines fields such as GPS position, speed, direction, acceleration, duty cycle, tag
            manufacturer, tag mass and readout method. However, the material supplied with the dataset does not
            publicly identify the tracker by a product name or model number. Academic papers connected to the
            research identify it more generally as a 160 g GPS and accelerometer tag manufactured by e-obs GmbH.
            The device was attached to the bird's back with a Teflon harness and combined GPS positioning,
            body-movement sensing and UHF radio communication. The publications describe its components and
            functions, but do not name a specific commercial model.
          </p>

          {/* Image 1 – GPS device */}
          <div className="image-block">
            <img
              src="/images/gps_device_eobs.jpg"
              alt="Representative GPS tracking devices used in Hebrew University vulture research."
              className="full-width-image"
            />
            <p className="small-text">
              According to Professor Ran Nathan, the device shown on the left is the type that would have been
              carried by the griffon vulture recovered in Sudan. The photograph shows the physical form of the
              tracker and its harness, but it is not a photograph of the device recovered from the bird and does
              not confirm the precise model used to produce the 2008–2011 long-range movement dataset.
            </p>
          </div>

          {/* Device identification */}
          <div className="device-specs">
            <h4 className="specs-title">Identification of the device</h4>
            <p><strong>Device type:</strong> e-obs 160 g GPS–ACC tag with UHF communication</p>
            <p><strong>Manufacturer:</strong> e-obs GmbH, Munich, Germany</p>
            <p><strong>Model:</strong> Not named in the published research</p>
            <p><strong>Tag mass:</strong> 160 g</p>
            <p><strong>Fitted mass:</strong> Approximately 190 g, including the 30 g Teflon harness</p>
            <p><strong>Deployment:</strong> Hebrew University and Israel Nature and Parks Authority vulture research, 2008–2011</p>
            <p><strong>Attachment:</strong> Backpack configuration</p>
            <p><strong>Sensors:</strong> GPS and tri-axial accelerometer</p>
            <p><strong>GPS measurements:</strong> Latitude, longitude, elevation and ground speed</p>
            <p><strong>Acceleration measurements:</strong> Movement along three axes, sampled at 3.3 Hz during short recording periods</p>
            <p><strong>Communication:</strong> Individual UHF pinger and local UHF data download</p>
            <p><strong>Data storage:</strong> Measurements stored onboard until downloaded by researchers</p>
          </div>

          {/* Image 2 – vulture movement diagram */}
          <div className="image-block">
            <img
              src="/images/vulture_movement_diagram.jpg"
              alt="Illustration of accelerometer axes: sway, surge and heave."
              className="full-width-image"
            />
            <p className="small-text">
              The illustration shows how the tracking device measures movement in three directions using an
              accelerometer: side to side (sway), forwards and backwards (surge), and up and down (heave). The
              graph shows how these acceleration signals change while the vulture is standing, running, eating,
              passively flying and actively flying. It does not show the bird's GPS route; instead, it shows how
              patterns of bodily movement can be interpreted as different behaviours. Acceleration was sampled
              at 3.3 Hz along each axis.
            </p>
            <p className="small-text source">
              <strong>Source:</strong> Adapted from Nathan, R., Spiegel, O., Fortmann-Roe, S., Harel, R.,
              Wikelski, M. and Getz, W. M. (2012), "Using tri-axial acceleration data to identify behavioral modes
              of free-ranging animals: general concepts and tools illustrated for griffon vultures," Journal of
              Experimental Biology, 215(6), pp. 986–996, Figure 2. DOI: 10.1242/jeb.058602.
            </p>
          </div>

          <p>
            For someone without technical knowledge, the tracker can be understood as a small programmable
            computer carried by the bird. It was not a camera and did not continuously watch the animal. At
            scheduled times, it calculated a GPS position, measured changes in the bird's bodily movement and
            stored those measurements inside the device. Researchers later retrieved the records through a
            short-range UHF radio connection. The tags followed different daytime schedules across the study
            period. Some recorded GPS positions every ten minutes, while others recorded them every minute before
            the records were reduced to ten-minute intervals for analysis. The route shown on the map is therefore
            not a continuous journey observed from beginning to end. It is a reconstruction made by connecting
            separate measurements collected according to the device's programming.
          </p>
          <p>
            Understanding how the tracker worked is important because tracking data can appear neutral and
            complete when it is actually shaped by technical and human decisions. Researchers decide which sensors
            to include, how frequently measurements are taken, when the device is active and how missing records
            are interpreted. These decisions determine which aspects of the bird's movement become visible and
            which remain unrecorded between measurements. The duration and frequency of data collection were also
            shaped by practical limitations involving battery life, onboard storage and how often researchers
            could approach closely enough to download the data.
          </p>
          <p>
            There is also an ethical imbalance in how this information is presented. The bird becomes highly
            visible: its route, speed, pauses, feeding areas and movements through borders and infrastructure can
            be examined in detail. By comparison, the instrument, its programming and the institutions collecting
            and managing the data may remain less visible. Showing the tracker and explaining its functions makes
            clear that the map is not a direct or complete representation of the bird's experience. It is the
            bird's movement selected, measured and translated through a technical system designed and programmed
            by people.
          </p>
          <p>
            This raises wider questions about who is able to track, store and publish an animal's movements, what
            kinds of knowledge are produced through that process and what risks arise when the detailed locations
            of vulnerable animals are made public. Making the device visible does not resolve these questions, but
            it allows viewers to understand how the data was produced and to read the map more critically.
          </p>
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

        /* --- Tracker section styles --- */
        .tracker-section {
          margin-top: 2rem;
          border: 1px solid #9afc97;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
        }
        body.light-bg .tracker-section {
          border-color: #2c6e2c;
          background: rgba(255, 255, 255, 0.8);
        }
        .tracker-section p {
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0.8rem 0;
          color: #ddd;
        }
        body.light-bg .tracker-section p {
          color: #222;
        }
        .tracker-section .section-title {
          margin-top: 0;
        }

        /* Full‑width images */
        .image-block {
          margin: 0 0 1.5rem 0;
        }
        .full-width-image {
          width: 100%;
          height: auto;
          display: block;
          border: 1px solid #9afc97;
        }
        body.light-bg .full-width-image {
          border-color: #2c6e2c;
        }
        .image-caption {
          margin-top: 0.3rem !important;
          font-size: 0.7rem !important;
          opacity: 0.7;
          text-align: center;
        }

        .small-text {
          font-size: 0.75rem !important;
          line-height: 1.5 !important;
          opacity: 0.7;
        }
        .small-text.source {
          margin-top: 0.3rem !important;
          font-size: 0.7rem !important;
        }

        /* Device specs */
        .device-specs {
          margin: 1.5rem 0;
          border: 1px solid rgba(154, 252, 151, 0.2);
          padding: 1rem;
        }
        body.light-bg .device-specs {
          border-color: rgba(44, 110, 44, 0.2);
        }
        .specs-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9afc97;
          margin-bottom: 0.5rem;
          font-weight: normal;
          border-bottom: 1px solid rgba(154, 252, 151, 0.1);
          padding-bottom: 0.3rem;
        }
        body.light-bg .specs-title {
          color: #1a4a1a;
          border-bottom: 1px solid rgba(44, 110, 44, 0.1);
        }
        .device-specs p {
          font-size: 0.8rem !important;
          line-height: 1.5 !important;
          margin: 0.2rem 0 !important;
        }
        .device-specs p strong {
          opacity: 0.7;
        }

        @media (max-width: 600px) {
          .container {
            padding: 0 0.8rem;
          }
          .map-container {
            padding: 0.5rem;
            min-height: 500px;
          }
          .tracker-section {
            padding: 1rem;
          }
          .device-specs {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}