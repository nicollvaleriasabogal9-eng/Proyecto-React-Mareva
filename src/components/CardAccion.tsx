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
      <div>
        <strong>{titulo}</strong>
        <p>{texto}</p>
        <small>{estado}</small>
      </div>

      <button onClick={onAccion}>{boton}</button>
    </div>
  );
}

export default CardAccion;

