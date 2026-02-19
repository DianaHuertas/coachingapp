import { useEffect, useState } from "react";
import api from "../api/axios";

function ClientDashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get("/client/workouts");
        setWorkouts(res.data.workouts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div>
      <h1>Client Dashboard</h1>

      {workouts.length === 0 ? (
        <p>No workouts assigned yet.</p>
      ) : (
        workouts.map((workout) => (
          <div key={workout._id} style={{ border: "1px solid black", marginBottom: "10px", padding: "10px" }}>
            <h3>{workout.template?.title}</h3>
            <p>Status: {workout.status}</p>
            <p>Date: {workout.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ClientDashboard;
