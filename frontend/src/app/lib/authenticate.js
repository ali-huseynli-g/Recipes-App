import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function setToken(token) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("access_token", token);
    }
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function getToken() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const value = localStorage.getItem("access_token");
    const user = !!value ? JSON.stringify(value) : undefined;
    setUser(user);
  }, []);

  return user;
}

export function readToken() {
  try {
    const token = getToken();
    return token ? jwtDecode(token) : null;
  } catch (err) {
    return null;
  }
}

export function isAuthenticated() {
  const token = readToken();
  return token ? true : false;
}

export function removeToken() {
  localStorage.removeItem("access_token");
}

export async function authenticateUser(user, password) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username: user, password: password }),
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    setToken(data.token);
    return true;
  } else {
    throw new Error(data.message);
  }
}
