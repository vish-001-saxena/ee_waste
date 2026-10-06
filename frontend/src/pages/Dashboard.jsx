import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://ee-waste-backed.onrender.com";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    item_type: "",
    brand: "",
    model: "",
    condition: "",
    quantity: 1,
    description: "",
    pickup_address: "",
  });

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, []);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadDashboard = async () => {
    try {
      const userResponse = await axios.get(
        `${API_URL}/api/auth/me`,
        authConfig
      );

      setUser(userResponse.data);

      const itemsResponse = await axios.get(
        `${API_URL}/api/e-waste/my`,
        authConfig
      );

      setItems(itemsResponse.data);
    } catch (err) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await axios.post(
        `${API_URL}/api/e-waste`,
        {
          ...form,
          quantity: Number(form.quantity),
        },
        authConfig
      );

      setMessage("E-waste submitted successfully!");

      setForm({
        item_type: "",
        brand: "",
        model: "",
        condition: "",
        quantity: 1,
        description: "",
        pickup_address: "",
      });

      loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to submit e-waste."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-page">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <span className="badge">♻️ E-Waste Dashboard</span>

          <h1>
            Welcome, {user?.name || "User"}!
          </h1>

          <p>
            Manage your electronic waste responsibly.
          </p>
        </div>

        <button
          onClick={logout}
          className="btn secondary"
        >
          Logout
        </button>
      </div>

      <div className="dashboard-grid">

        {/* Submit E-Waste */}

        <div className="dashboard-card">
          <h2>Submit E-Waste</h2>

          <p className="card-subtitle">
            Tell us about the electronic item you want to recycle.
          </p>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label>Item Type</label>

            <input
              name="item_type"
              placeholder="e.g. Laptop, Mobile, TV"
              value={form.item_type}
              onChange={handleChange}
              required
            />

            <div className="form-row">

              <div>
                <label>Brand</label>

                <input
                  name="brand"
                  placeholder="e.g. Dell"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Model</label>

                <input
                  name="model"
                  placeholder="e.g. Inspiron 15"
                  value={form.model}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-row">

              <div>
                <label>Condition</label>

                <select
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select condition
                  </option>

                  <option value="New">
                    New
                  </option>

                  <option value="Used">
                    Used
                  </option>

                  <option value="Damaged">
                    Damaged
                  </option>

                  <option value="Non-functional">
                    Non-functional
                  </option>
                </select>
              </div>

              <div>
                <label>Quantity</label>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Describe the electronic item..."
              value={form.description}
              onChange={handleChange}
              rows="3"
            />

            <label>Pickup Address</label>

            <textarea
              name="pickup_address"
              placeholder="Enter your pickup address"
              value={form.pickup_address}
              onChange={handleChange}
              rows="3"
              required
            />

            <button
              type="submit"
              className="btn primary full"
            >
              Submit for Recycling
            </button>

          </form>
        </div>

        {/* My Submissions */}

        <div className="dashboard-card">

          <div className="card-heading">
            <div>
              <h2>My Submissions</h2>

              <p className="card-subtitle">
                Track your recycling requests.
              </p>
            </div>

            <span className="count-badge">
              {items.length}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <div>📦</div>

              <h3>No submissions yet</h3>

              <p>
                Submit your first electronic item for recycling.
              </p>
            </div>
          ) : (
            <div className="submission-list">

              {items.map((item) => (
                <div
                  className="submission-item"
                  key={item.id}
                >
                  <div>
                    <h3>
                      {item.item_type}
                    </h3>

                    <p>
                      {item.brand || "Unknown brand"}
                      {item.model
                        ? ` • ${item.model}`
                        : ""}
                    </p>

                    <small>
                      Quantity: {item.quantity}
                    </small>
                  </div>

                  <span
                    className={`status ${item.status}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;