import { useState } from "react";
import { Contador } from "./Contador";
import { Usuarios } from "./Usuarios";
import { useAuth } from "./Auth";

export function App() {
  const { token, error, login, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <>
      <h1>React+login</h1>
      {!token && (
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
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
      )}
      {token && (
        <>
          <button onClick={() => logout()}>Salir</button>
          <h2>Contador</h2>
          <Contador />
          <h2>Usuarios</h2>
          <Usuarios />
        </>
      )}
    </>
  );
}
