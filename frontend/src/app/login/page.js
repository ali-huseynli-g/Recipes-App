"use client";
import { Alert } from "react-bootstrap";
import { useState } from "react";
import { authenticateUser } from "../lib/authenticate";

export default function Login() {
  const [warning, setWarning] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await authenticateUser(username, password);
      window.location.href = "/";
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <div className="mx-auto mt-5 card glass" style={{ width: "fit-content" }}>
        <div className="text-dark py-4 px-4">
          <h1 className="pt-1 text-center">
            <strong>LOG IN</strong>
          </h1>
        </div>

        <form className="px-4" onSubmit={handleSubmit}>
          <div className="d-grid gap-3">
            <div className="form-group">
              <label htmlFor="username" className="pb-1">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                id="username"
                name="username"
                placeholder="Enter username"
                style={{ paddingRight: "12px !important" }}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="d-grid gap-3 pt-1">
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          {warning && (
            <>
              <br />
              <Alert variant="danger">{warning}</Alert>
            </>
          )}

          <br />
          <button type="submit" className="btn btn-outline-success mb-3">
            Login
          </button>
        </form>
      </div>
    </>
  );
}
