import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="static-page">
      <h1>Page not found</h1>
      <p>The page you were looking for does not exist.</p>
      <Link to="/">Return home</Link>
    </main>
  );
}

export default NotFound;
