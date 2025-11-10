import './home.css';

import About from './About';
import Hero from './Hero';
import Highlights from './Highlights';
import LiveFeed from './LiveFeed';
import Testimonials from './Testimonials';

function Home() {
  return (
    <div className="home-page">
      <article className="home-content">
        <Hero />
        <LiveFeed />
        <Highlights />
        <Testimonials />
        <About />
      </article>
    </div>
  );
}

export default Home;
