import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <span className="badge">♻️ Sustainable Technology</span>

          <h1>
            Give Your E-Waste
            <span> a Better Future.</span>
          </h1>

          <p>
            E-Waste Management Platform helps you responsibly dispose of
            electronic waste and track your recycling journey.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn primary">
              Start Recycling
            </Link>

            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="recycle-icon">♻</div>
          <h3>Recycle Responsibly</h3>
          <p>
            Turn unused electronics into a cleaner and more sustainable
            tomorrow.
          </p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Submit E-Waste</h3>
          <p>
            Register your unused electronic devices for responsible recycling.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Easy Pickup</h3>
          <p>
            Provide your pickup location and let the recycling process begin.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Status</h3>
          <p>
            Track your submission from pending to collected and recycled.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;