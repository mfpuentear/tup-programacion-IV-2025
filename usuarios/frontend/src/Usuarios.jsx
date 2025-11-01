import { useEffect, useState } from "react";
import { AuthRol, useAuth } from "./Auth";
import { useCallback } from "react";

export function Usuarios() {
  const { fetchAuth } = useAuth();

  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = useCallback(async () => {
    const response = await fetchAuth("http://localhost:3000/usuarios");
    const data = await response.json();

    if (!response.ok) {
      console.log("Error:", data.error);
      return;
    }

    return data.usuarios;
  }, [fetchAuth]);

  useEffect(() => {
    fetchUsuarios().then((usuarios) => setUsuarios(usuarios));
  }, [fetchUsuarios]);

  const handleQuitar = async (id) => {
    // Preguntar si quiere quitar el usuario
    if (window.confirm("¿Desea quitar el usuario?")) {
      // Pedir a la api que quite el usuario
      const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        return window.alert("Error al quitar usuario");
      }

      const usuarios = await fetchUsuarios();
      setUsuarios(usuarios);
    }
  };

  return (
    <>
      <h1>Usuarios</h1>
      <table>
        <thead>
          <th>ID</th>
          <th>Username</th>
          <th>Apellido</th>
          <th>Nombre</th>
          <th>Activo</th>
          <th>Acciones</th>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.apellido}</td>
              <td>{u.nombre}</td>
              <td>{u.activo ? "Si" : "No"}</td>
              <td>
                <AuthRol rol="admin">
                  <button onClick={() => handleQuitar(u.id)}>Quitar</button>
                </AuthRol>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
