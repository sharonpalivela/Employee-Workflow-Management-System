import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("LEAVE");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data);
      setLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    setError("");

    try {
      const config = getAuthConfig();

      const usersResponse = await axios.get("/api/users", config);
      const allUsers = usersResponse.data || [];
      setUsers(allUsers);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentEmail = payload.sub;

      const currentUser = allUsers.find(
        (u) => u.email === currentEmail
      );

      setUser(currentUser);

      if (currentUser?.role === "EMPLOYEE") {
        const response = await axios.get(
          "/api/requests/my",
          config
        );
        setRequests(response.data?.content || response.data || []);
      } else {
        const response = await axios.get(
          "/api/requests",
          config
        );
        setRequests(response.data?.content || response.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");

      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchDashboardData();
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
    setRequests([]);
    setUsers([]);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "/api/requests",
        {
          title,
          description,
          type,
        },
        getAuthConfig()
      );

      setTitle("");
      setDescription("");
      setType("LEAVE");
      setShowForm(false);

      await fetchDashboardData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create request."
      );
    }
  };

  const handleDecision = async (requestId, action) => {
    setProcessingId(requestId);
    setError("");

    try {
      await axios.put(
        `/api/requests/${requestId}/${action}`,
        {},
        getAuthConfig()
      );

      await fetchDashboardData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${action} request.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (r) => r.status === "PENDING"
  ).length;

  const approvedRequests = requests.filter(
    (r) => r.status === "APPROVED"
  ).length;

  const rejectedRequests = requests.filter(
    (r) => r.status === "REJECTED"
  ).length;

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-mark">W</div>
            <span>Workflow Hub</span>
          </div>

          <div className="login-heading">
            <h1>Welcome back</h1>
            <p>
              Sign in to manage your workflow requests.
            </p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="login-btn">
              Sign in
            </button>
          </form>

          <div className="login-footer">
            <span>Employee • Manager • Admin</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="nav-logo">W</div>
          <h2>Workflow Hub</h2>
        </div>

        <div className="navbar-user">
          <div className="user-summary">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard">
        <section className="welcome">
          <div>
            <span className="eyebrow">
              {user?.role}
            </span>

            <h1>
              Hello, {user?.name?.split(" ")[0]} 👋
            </h1>

            <p>
              {user?.role === "EMPLOYEE"
                ? "Track your requests and submit new workflow requests."
                : user?.role === "MANAGER"
                ? "Review and manage workflow requests from employees."
                : "Monitor users and workflow activity across the system."}
            </p>
          </div>
        </section>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="stats">
          <div className="stat-card">
            <span>Total Requests</span>
            <strong>{totalRequests}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingRequests}</strong>
          </div>

          <div className="stat-card">
            <span>Approved</span>
            <strong>{approvedRequests}</strong>
          </div>

          <div className="stat-card">
            <span>Rejected</span>
            <strong>{rejectedRequests}</strong>
          </div>
        </section>

        {user?.role === "EMPLOYEE" && (
          <section className="dashboard-section">
            <div className="section-heading request-heading">
              <div>
                <h2>My Requests</h2>
                <p>
                  Submit and track your workflow requests.
                </p>
              </div>

              <button
                className="primary-btn compact-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close" : "+ New Request"}
              </button>
            </div>

            {showForm && (
              <form
                className="request-form"
                onSubmit={handleCreateRequest}
              >
                <div className="form-field">
                  <label>Request title</label>
                  <input
                    type="text"
                    placeholder="e.g. Annual Leave Request"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Request type</label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value)
                    }
                  >
                    <option value="LEAVE">Leave</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="DOCUMENT">Document</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <textarea
                    placeholder="Describe your request..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="primary-btn form-submit"
                >
                  Submit Request
                </button>
              </form>
            )}
          </section>
        )}

        {user?.role === "ADMIN" && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Registered Users</h2>
                <p>
                  Users currently registered in the system.
                </p>
              </div>
            </div>

            <div className="user-list">
              {users.map((registeredUser) => (
                <div
                  className="user-row"
                  key={registeredUser.id}
                >
                  <div className="user-info">
                    <strong>
                      {registeredUser.name}
                    </strong>
                    <span>
                      {registeredUser.email}
                    </span>
                  </div>

                  <span className="role-badge">
                    {registeredUser.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>
                {user?.role === "EMPLOYEE"
                  ? "Request History"
                  : "Workflow Requests"}
              </h2>

              <p>
                {user?.role === "EMPLOYEE"
                  ? "Your submitted requests and their current status."
                  : "Review workflow activity across the system."}
              </p>
            </div>
          </div>

          {loadingData ? (
            <div className="empty-state">
              <strong>Loading requests...</strong>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <strong>No requests yet</strong>
              <span>
                Workflow requests will appear here.
              </span>
            </div>
          ) : (
            <div className="request-list">
              {requests.map((request) => (
                <div
                  className="request-row"
                  key={request.id}
                >
                  <div className="request-main">
                    <strong>{request.title}</strong>

                    {request.description && (
                      <p>{request.description}</p>
                    )}

                    <div className="request-meta">
                      <span className="request-type">
                        {request.type}
                      </span>

                      <span className="meta-divider">
                        •
                      </span>

                      <span>
                        {new Date(
                          request.createdAt
                        ).toLocaleDateString()}
                      </span>

                      {request.createdBy && (
                        <>
                          <span className="meta-divider">
                            •
                          </span>

                          <span className="created-by">
                            {request.createdBy}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="request-side">
                    <span
                      className={`status ${request.status.toLowerCase()}`}
                    >
                      {request.status}
                    </span>

                    {user?.role === "MANAGER" &&
                      request.status === "PENDING" && (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            disabled={
                              processingId === request.id
                            }
                            onClick={() =>
                              handleDecision(
                                request.id,
                                "approve"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="reject-btn"
                            disabled={
                              processingId === request.id
                            }
                            onClick={() =>
                              handleDecision(
                                request.id,
                                "reject"
                              )
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;