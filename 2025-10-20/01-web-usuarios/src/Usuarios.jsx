import { useEffect, useState } from "react";

export function Usuarios({ token }) {
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async (token) => {
    if (!token) {
      return [];
    }

    const response = await fetch("http://localhost:3000/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data.error);
      return;
    }

    return data.usuarios;
  };

  useEffect(() => {
    fetchUsuarios(token).then((usuarios) => setUsuarios(usuarios));
  }, [token]);

  return (
    <ul>
      {usuarios.map((u) => (
        <li key={u.id}>
          {u.username} ({u.apellido}, {u.nombre})
        </li>
      ))}
    </ul>
  );
}
