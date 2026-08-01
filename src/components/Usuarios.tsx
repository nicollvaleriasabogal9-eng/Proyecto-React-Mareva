import React from "react"
import "./Usuarios.css"

const Usuarios: React.FC = () => {
    const usuarios = [
        { id: 1, name: "Pedro"},
        { id: 2, name: "Valentina"},
        { id: 3, name: "Pepe"}
    ]
    return (
        <div className="usuarios-table-wrapper">
            <table className="usuarios-table">
            <thead style={{}}>
                <tr >
                    <th>ID</th>
                    <th>Nombre</th>
                </tr>
                
                    
            </thead>
            <tbody>
                {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}

export default Usuarios;