import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to HomeBnB</h1>
        <p>Book unique homes and experiences all over the world.</p>
      </header>
      <section className="landing-content">
        <div className="landing-image">
          <img src="path/to/your/image.jpg" alt="Landing" />
        </div>
        <div className="landing-info">
          {/* <h2>Explore the world</h2>
          <p>Find the perfect place to stay for your next trip.</p> */}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;