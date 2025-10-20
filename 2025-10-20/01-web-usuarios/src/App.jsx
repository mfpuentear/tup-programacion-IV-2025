import { useState } from "react";
import { Contador } from "./Contador";
import { Usuarios } from "./Usuarios";

export function App() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const session = await response.json();

    if (!response.ok && response.status === 400) {
      console.log("Error:", session.error);
      return;
    }

    setSession(session);
  };

  return (
    <>
      <h1>React+login</h1>
      {!session && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Usuario:</label>
          <input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Contraseña:</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Ingresar</button>
        </form>
      )}
      {session && (
        <>
          <button onClick={() => setSession(null)}>Salir</button>
          <h2>Contador</h2>
          <Contador />
          <h2>Usuarios</h2>
          <Usuarios token={session.token} />
        </>
      )}
    </>
  );
}
