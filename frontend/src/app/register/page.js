"use client";
import { Alert } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login(props) {
  const [warning, setWarning] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    // if (password1 == password2) {
    // } else {
    //   setWarning("Passwords are not same");
    // }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          password2: password2,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <>
      <div className="mx-auto mt-5 card glass" style={{ width: "fit-content" }}>
        <div className="text-dark py-4 px-4">
          <h1 className="pt-1 text-center">
            <strong>Register</strong>
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
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="pb-1">
                Email
              </label>
              <input
                type="email"
                className="form-control "
                value={email}
                id="email"
                name="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password1">Password</label>
              <div className="d-grid gap-3 pt-1">
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  id="password1"
                  name="password1"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control"
                  value={password2}
                  id="password2"
                  name="password2"
                  placeholder="Confirm your password"
                  onChange={(e) => setPassword2(e.target.value)}
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
            Register
          </button>
        </form>
      </div>
    </>
  );
}
