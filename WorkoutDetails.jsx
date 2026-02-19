// src/pages/WorkoutDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "../api/axios";

export default function WorkoutDetails() {
  const { id } = useParams(); // assigned workout id
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // form fields (client)
  const [status, setStatus] = useState("assigned");
  const [clientNotes, setClientNotes] = useState("");
  const [rating, setRating] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          navigate("/login");
          return;
        }

        // We don't have a GET /client/workouts/:id route yet,
        // so we fetch all and find the one we need.
        const res = await axios.get("/client/workouts");
        const found = res.data?.workouts?.find((w) => w._id === id);

        if (!found) {
          setError("Workout not found (maybe not assigned to this client).");
          setWorkout(null);
          return;
        }

        setWorkout(found);

        // prefill form with existing values
        setStatus(found.status || "assigned");
        setClientNotes(found.clientNotes || "");
        setRating(
          found.rating === undefined || found.rating === null ? "" : String(found.rating)
        );
      } catch (err) {
        setError(err?.response?.data?.error || err.message || "Failed to load workout.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, navigate, token]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        status,
        clientNotes,
      };

      // only send rating if user typed something
      if (rating !== "") {
        const ratingNumber = Number(rating);
        payload.rating = ratingNumber;
      }

      const res = await axios.patch(`/client/workouts/${id}`, payload);

      // backend returns: { message, workout }
      const updated = res.data?.workout;
      setWorkout(updated);

      // sync form with what backend stored
      setStatus(updated.status || status);
      setClientNotes(updated.clientNotes || "");
      setRating(
        updated.rating === undefined || updated.rating === null ? "" : String(updated.rating)
      );
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Failed to update workout.");
    } finally {
      setSaving(false);
    }
  };

  const template = workout?.template;
  const exercises = template?.exercises || [];

  if (loading) return <div style={{ padding: 24 }}>Loading workout...</div>;

  if (error)
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "crimson" }}>{error}</p>
        <Link to="/client">← Back to Client Dashboard</Link>
      </div>
    );

  if (!workout)
    return (
      <div style={{ padding: 24 }}>
        <p>Workout not found.</p>
        <Link to="/client">← Back to Client Dashboard</Link>
      </div>
    );

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h1 style={{ margin: 0 }}>{template?.title || "Workout"}</h1>
      </div>

      <div style={{ marginTop: 12, padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <p style={{ margin: 0 }}>
          <strong>Status:</strong> {workout.status}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Date:</strong> {workout.date}
        </p>
        {workout.completedAt && (
          <p style={{ margin: 0 }}>
            <strong>Completed At:</strong> {new Date(workout.completedAt).toLocaleString()}
          </p>
        )}
      </div>

      <h2 style={{ marginTop: 24 }}>Exercises</h2>

      {exercises.length === 0 ? (
        <p>No exercises on this template yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {exercises.map((ex, idx) => (
            <div
              key={idx}
              style={{ padding: 14, border: "1px solid #eee", borderRadius: 10 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{ex.name}</strong>
                <span style={{ opacity: 0.8 }}>
                  {ex.sets} sets • {ex.reps} reps • Rest {ex.restSeconds}s
                </span>
              </div>
              {ex.notes && <p style={{ marginTop: 8, marginBottom: 0 }}>{ex.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 28 }}>Update Workout</h2>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 10 }}>
        <label style={{ display: "block", marginBottom: 10 }}>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ display: "block", marginTop: 6, width: "100%", padding: 10 }}
          >
            <option value="assigned">assigned</option>
            <option value="completed">completed</option>
          </select>
        </label>

        <label style={{ display: "block", marginBottom: 10 }}>
          Notes (optional)
          <textarea
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            placeholder="How did it feel? Any pain? Anything to tell your coach?"
            style={{ display: "block", marginTop: 6, width: "100%", padding: 10, minHeight: 90 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 14 }}>
          Rating (1–5)
          <input
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="5"
            style={{ display: "block", marginTop: 6, width: "100%", padding: 10 }}
          />
        </label>

        <button onClick={handleSave} disabled={saving} style={{ padding: "10px 14px" }}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
