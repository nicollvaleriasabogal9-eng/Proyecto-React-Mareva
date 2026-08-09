interface CardAccionProps {
  titulo: string;
  texto: string;
  estado: string;
  boton: string;
  onAccion: () => void;
}

function CardAccion({
  titulo,
  texto,
  estado,
  boton,
  onAccion,
}: CardAccionProps) {
  return (
    <div className="card-accion">
      {estado && <span className="card-accion-estado">{estado}</span>}

      {titulo && <h3>{titulo}</h3>}

      {texto && <p>{texto}</p>}

      <button className="card-accion-boton" onClick={onAccion}>
        {boton}
      </button>
    </div>
  );
}

export default CardAccion;