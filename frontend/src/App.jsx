
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
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

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
    setSuccess("");
    setAuthLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data);
      setEmail("");
      setPassword("");
      setLoggedIn(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAuthLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(
        typeof response.data === "string"
          ? response.data
          : "Account created successfully!"
      );

      setName("");
      setEmail("");
      setPassword("");
      setIsRegistering(false);
    } catch (err) {
      const responseData = err.response?.data;
      setError(
        responseData?.message ||
          (typeof responseData === "string" ? responseData : "") ||
          "Unable to create account. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    setError("");

    try {
      const config = getAuthConfig();
      const usersResponse = await axios.get("/api/users", config);
      const allUsers = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [];

      setUsers(allUsers);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentEmail = payload.sub;

      const currentUser = allUsers.find(
        (registeredUser) =>
          registeredUser.email?.toLowerCase() ===
          currentEmail?.toLowerCase()
      );

      if (!currentUser) {
        throw new Error("Unable to find the logged-in user.");
      }

      setUser(currentUser);

      const endpoint =
        currentUser.role === "EMPLOYEE"
          ? "/api/requests/my"
          : "/api/requests";

      const response = await axios.get(endpoint, config);
      const data = response.data;

      setRequests(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (err) {
      console.error("Dashboard loading failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data. Please try again."
      );

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
    setError("");
    setSuccess("");
    setShowForm(false);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSubmittingRequest(true);

    try {
      await axios.post(
        "/api/requests",
        {
          title: title.trim(),
          description: description.trim(),
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
      const responseData = err.response?.data;
      setError(
        responseData?.message ||
          (typeof responseData === "string" ? responseData : "") ||
          "Unable to create request. Please try again."
      );
    } finally {
      setSubmittingRequest(false);
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
      const responseData = err.response?.data;
      setError(
        responseData?.message ||
          (typeof responseData === "string" ? responseData : "") ||
          `Unable to ${action} request. Please try again.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "APPROVED"
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === "REJECTED"
  ).length;

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-decoration decoration-one" />
        <div className="login-decoration decoration-two" />

        <div className="login-card">
          <div className="login-logo">
            <div className="logo-mark">W</div>
            <span>
              Workflow <strong>Hub</strong>
            </span>
          </div>

          <div className="login-heading">
            <span className="auth-eyebrow">
              {isRegistering ? "GET STARTED" : "YOUR WORKSPACE"}
            </span>

            <h1>
              {isRegistering ? "Create your account" : "Welcome back"}
            </h1>

            <p>
              {isRegistering
                ? "Join Workflow Hub to manage your requests."
                : "Sign in to manage your workflow requests."}
            </p>
          </div>

          {success && !isRegistering && (
            <div className="success-message" role="status">
              <span className="message-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              <span className="message-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form
            className="login-form"
            onSubmit={isRegistering ? handleRegister : handleLogin}
          >
            {isRegistering && (
              <div className="form-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSuccess("");
                    setError("");
                  }}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder={
                  isRegistering
                    ? "Create a password (6+ characters)"
                    : "Enter your password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                autoComplete={
                  isRegistering ? "new-password" : "current-password"
                }
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <span className="button-spinner" />
                  {isRegistering ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>
                  {isRegistering ? "Create account" : "Sign in"}
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="auth-roles">
              <span>EMPLOYEE</span>
              <i />
              <span>MANAGER</span>
              <i />
              <span>ADMIN</span>
            </div>

            <p>
              {isRegistering
                ? "Already have an account?"
                : "New to Workflow Hub?"}{" "}
              <button
                type="button"
                className="auth-toggle"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                  setSuccess("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
              >
                {isRegistering ? "Sign in" : "Create account"}
              </button>
            </p>
          </div>
        </div>

        <div className="login-bottom-note">
          Built for smoother workdays <span>✦</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="nav-logo">W</div>
          <div className="brand-copy">
            <h2>Workflow Hub</h2>
            <span>WORKSPACE</span>
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-avatar">
            {user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="user-summary">
            <strong>{user?.name || "Loading user..."}</strong>
            <span>{user?.email || ""}</span>
          </div>

          <span className="navbar-divider" />

          <button className="logout-btn" onClick={handleLogout}>
            <span>↗</span> Logout
          </button>
        </div>
      </nav>

      <main className="dashboard">
        <section className="welcome">
          <div className="welcome-copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              {user?.role || "WORKSPACE"}
            </span>

            <h1>
              Hello, {user?.name?.trim()?.split(/\s+/)[0] || "there"}{" "}
              <span className="wave">✦</span>
            </h1>

            <p>
              {user?.role === "EMPLOYEE"
                ? "Your workday, organized. Track requests and keep everything moving."
                : user?.role === "MANAGER"
                ? "Your team’s workflow at a glance. Review requests and keep things moving."
                : "Your workspace overview. Monitor registered users and workflow activity."}
            </p>
          </div>

          <div className="welcome-decoration" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">W</div>
            <span className="orbit-spark spark-one">✦</span>
            <span className="orbit-spark spark-two">✧</span>
          </div>
        </section>

        {error && (
          <div className="dashboard-error" role="alert">
            <span className="message-icon">!</span>
            <span>{error}</span>
            <button
              type="button"
              className="dismiss-message"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <section className="stats">
          <div className="stat-card stat-total">
            <div className="stat-top">
              <span className="stat-icon">▤</span>
              <span className="stat-label">ALL REQUESTS</span>
            </div>
            <strong>{totalRequests}</strong>
            <span className="stat-caption">Requests in your view</span>
          </div>

          <div className="stat-card stat-pending">
            <div className="stat-top">
              <span className="stat-icon">◷</span>
              <span className="stat-label">PENDING</span>
            </div>
            <strong>{pendingRequests}</strong>
            <span className="stat-caption">Awaiting a decision</span>
          </div>

          <div className="stat-card stat-approved">
            <div className="stat-top">
              <span className="stat-icon">✓</span>
              <span className="stat-label">APPROVED</span>
            </div>
            <strong>{approvedRequests}</strong>
            <span className="stat-caption">Successfully approved</span>
          </div>

          <div className="stat-card stat-rejected">
            <div className="stat-top">
              <span className="stat-icon">↗</span>
              <span className="stat-label">REJECTED</span>
            </div>
            <strong>{rejectedRequests}</strong>
            <span className="stat-caption">Requests not approved</span>
          </div>
        </section>

        {user?.role === "EMPLOYEE" && (
          <section className="dashboard-section">
            <div className="section-heading request-heading">
              <div className="section-heading-copy">
                <span className="section-kicker">YOUR WORKFLOW</span>
                <h2>My Requests <span className="heading-spark">✦</span></h2>
                <p>Submit something new or check on your existing requests.</p>
              </div>

              <button
                className="primary-btn compact-btn"
                onClick={() => {
                  setShowForm(!showForm);
                  setError("");
                }}
              >
                <span>{showForm ? "×" : "+"}</span>
                {showForm ? "Close form" : "New request"}
              </button>
            </div>

            {showForm && (
              <form
                className="request-form"
                onSubmit={handleCreateRequest}
              >
                <div className="form-field">
                  <label htmlFor="request-title">Request title</label>
                  <input
                    id="request-title"
                    type="text"
                    placeholder="e.g. Annual leave request"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="request-type">Request type</label>
                  <select
                    id="request-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="LEAVE">Leave</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="DOCUMENT">Document</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="request-description">Description</label>
                  <textarea
                    id="request-description"
                    placeholder="Add the details someone reviewing your request should know..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-btn form-submit"
                    disabled={submittingRequest}
                  >
                    {submittingRequest
                      ? "Submitting..."
                      : "Submit request →"}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {user?.role === "ADMIN" && (
          <section className="dashboard-section">
            <div className="section-heading">
              <div className="section-heading-copy">
                <span className="section-kicker">WORKSPACE ACCESS</span>
                <h2>Registered Users</h2>
                <p>People who currently have an account in the system.</p>
              </div>

              <span className="count-pill">
                {users.length} {users.length === 1 ? "user" : "users"}
              </span>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <strong>No users to display</strong>
                <span>Registered users will appear here.</span>
              </div>
            ) : (
              <div className="user-list">
                {users.map((registeredUser) => (
                  <div className="user-row" key={registeredUser.id}>
                    <div className="user-avatar small-avatar">
                      {registeredUser.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="user-info">
                      <strong>{registeredUser.name}</strong>
                      <span>{registeredUser.email}</span>
                    </div>

                    <span
                      className={`role-badge ${(registeredUser.role || "employee").toLowerCase()}`}
                    >
                      {registeredUser.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="dashboard-section">
          <div className="section-heading">
            <div className="section-heading-copy">
              <span className="section-kicker">
                {user?.role === "EMPLOYEE"
                  ? "YOUR ACTIVITY"
                  : "TEAM ACTIVITY"}
              </span>

              <h2>
                {user?.role === "EMPLOYEE"
                  ? "Request History"
                  : "Workflow Requests"}
              </h2>

              <p>
                {user?.role === "EMPLOYEE"
                  ? "A single place to keep track of what you’ve submitted."
                  : "Review workflow activity and current request statuses."}
              </p>
            </div>

            <span className="count-pill">
              {requests.length} {requests.length === 1 ? "request" : "requests"}
            </span>
          </div>

          {loadingData ? (
            <div className="empty-state">
              <span className="loading-ring" />
              <strong>Loading your workspace...</strong>
              <span>Getting everything ready for you.</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✧</div>
              <strong>No requests yet</strong>
              <span>
                {user?.role === "EMPLOYEE"
                  ? "Your submitted requests will show up here."
                  : "Requests will appear here when there is activity."}
              </span>

              {user?.role === "EMPLOYEE" && (
                <button
                  className="empty-action"
                  onClick={() => setShowForm(true)}
                >
                  Create your first request →
                </button>
              )}
            </div>
          ) : (
            <div className="request-list">
              {requests.map((request) => (
                <div className="request-row" key={request.id}>
                  <div className="request-main">
                    <div className="request-title-line">
                      <span className="request-mini-icon">↗</span>
                      <strong>{request.title}</strong>
                    </div>

                    {request.description && (
                      <p>{request.description}</p>
                    )}

                    <div className="request-meta">
                      <span className="request-type">
                        {request.type}
                      </span>

                      <span className="meta-divider">•</span>

                      <span>
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString()
                          : "Date unavailable"}
                      </span>

                      {request.createdBy && (
                        <>
                          <span className="meta-divider">•</span>
                          <span className="created-by">
                            {request.createdBy}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="request-side">
                    <span
                      className={`status ${(request.status || "PENDING").toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {request.status || "PENDING"}
                    </span>

                    {user?.role === "MANAGER" &&
                      request.status === "PENDING" && (
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            disabled={processingId === request.id}
                            onClick={() =>
                              handleDecision(request.id, "approve")
                            }
                          >
                            {processingId === request.id
                              ? "Working..."
                              : "✓ Approve"}
                          </button>

                          <button
                            className="reject-btn"
                            disabled={processingId === request.id}
                            onClick={() =>
                              handleDecision(request.id, "reject")
                            }
                          >
                            {processingId === request.id
                              ? "Working..."
                              : "× Reject"}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <span><span className="footer-mark">W</span> Workflow Hub</span>
          <span>Make work flow better <span className="footer-spark">✦</span></span>
        </footer>
      </main>
    </div>
  );
}

export default App;
