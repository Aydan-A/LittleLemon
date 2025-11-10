import './App.css';

import { Routes, Route } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import About from './pages/about/About';
import Home from './pages/homepage/Home';
import Menu from './pages/menu/Menu';
import Reservation from './pages/reservation/Reservation';
import ConfirmReservation from './pages/reservation/ConfirmReservation';
import OrderOnline from './pages/order-online/OrderOnline';
import Login from './pages/login/Login';
import NotFound from './pages/not-found/NotFound';
import { ReservationProvider } from './pages/reservation/ReservationProvider';

function App() {
  return (
    <ReservationProvider>
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/confirmation" element={<ConfirmReservation />} />
            <Route path="/order-online" element={<OrderOnline />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ReservationProvider>
  );
}

export default App;
