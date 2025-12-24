const API_BASE = "http://localhost:8080/api/auth";

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  cpassword: string;
}) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
