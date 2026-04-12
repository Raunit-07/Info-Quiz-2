import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/quiz/leaderboard');
        setData(res.data.data || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Unable to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <h2 className="center">Loading Leaderboard...</h2>;
  }

  return (
    <div className="leaderboard-page">
      <Navbar />
      <div className="leaderboard-card">
        <h1> Leaderboard</h1>

        {error ? (
          <p className="error">{error}</p>
        ) : data.length === 0 ? (
          <p>No data available</p>
        ) : (
          data.map((user, index) => (
            <div className="leaderboard-row" key={index}>
              <span className="rank">#{index + 1}</span>
              <span className="name">{user.username}</span>
              <span className="score">{user.score}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
