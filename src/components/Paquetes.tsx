
const PAQUETES = [
    {"slug":"cartagena-magica","nombre":"Cartagena Mágica","categoria":"Playa","precio":1850000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Descubre la ciudad amurallada con playas privadas e historia colonial.","emoji":"🏰","destino":"Cartagena","departamento":"Bolívar"},
    {"slug":"medellin-innovadora","nombre":"Medellín Innovadora","categoria":"Ciudad","precio":1200000,"duracion_dias":4,"duracion_noches":3,"descripcion":"Conoce la ciudad más transformadora de América Latina.","emoji":"🚡","destino":"Medellín","departamento":"Antioquia"},
    {"slug":"guatape-extremo","nombre":"Guatapé Extremo","categoria":"Aventura","precio":890000,"duracion_dias":3,"duracion_noches":2,"descripcion":"Adrenalina pura: sube la Piedra del Peñol y navega el embalse.","emoji":"🪨","destino":"Guatapé","departamento":"Antioquia"},
    {"slug":"san-andres-todo-incluido","nombre":"San Andrés Todo Incluido","categoria":"Playa","precio":3200000,"duracion_dias":7,"duracion_noches":6,"descripcion":"El mar de los siete colores con todo incluido en resort.","emoji":"🏝️","destino":"San Andrés","departamento":"San Andrés"},
    {"slug":"tayrona-salvaje","nombre":"Tayrona Salvaje","categoria":"Ecoturismo","precio":1450000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Selva, playas vírgenes y ecosistemas únicos.","emoji":"🌴","destino":"Parque Tayrona","departamento":"Magdalena"},
    {"slug":"valle-cocora-mistico","nombre":"Valle del Cocora Místico","categoria":"Ecoturismo","precio":980000,"duracion_dias":3,"duracion_noches":2,"descripcion":"Caminata entre palmas de cera y fincas cafeteras.","emoji":"🌿","destino":"Valle del Cocora","departamento":"Quindío"},
    {"slug":"amazonas-aventura","nombre":"Amazonas Aventura","categoria":"Aventura","precio":2750000,"duracion_dias":6,"duracion_noches":5,"descripcion":"Explora la selva amazónica y conoce comunidades indígenas.","emoji":"🦜","destino":"Leticia","departamento":"Amazonas"},
    {"slug":"tatacoa","nombre":"Desierto de la Tatacoa","categoria":"Aventura","precio":750000,"duracion_dias":3,"duracion_noches":2,"descripcion":"Observación astronómica y recorridos por paisajes únicos.","emoji":"🌵","destino":"Desierto Tatacoa","departamento":"Huila"},
    {"slug":"cano-cristales","nombre":"Caño Cristales Premium","categoria":"Aventura","precio":2950000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Visita el río más hermoso del mundo.","emoji":"🌈","destino":"Caño Cristales","departamento":"Meta"},
    {"slug":"eje-cafetero","nombre":"Eje Cafetero Tradicional","categoria":"Cultural","precio":1350000,"duracion_dias":4,"duracion_noches":3,"descripcion":"Recorrido por fincas cafeteras y pueblos patrimonio.","emoji":"☕","destino":"Armenia","departamento":"Quindío"},
    {"slug":"nuqui-ecoturismo","nombre":"Nuquí Ecoturismo","categoria":"Playa","precio":2400000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Avistamiento de ballenas y playas vírgenes.","emoji":"🐋","destino":"Nuquí","departamento":"Chocó"},
    {"slug":"barichara-colonial","nombre":"Barichara Colonial","categoria":"Cultural","precio":890000,"duracion_dias":3,"duracion_noches":2,"descripcion":"Conoce uno de los pueblos más bellos de Colombia.","emoji":"🏘️","destino":"Barichara","departamento":"Santander"},
    {"slug":"santuario-las-lajas","nombre":"Santuario Las Lajas","categoria":"Cultural","precio":680000,"duracion_dias":3,"duracion_noches":2,"descripcion":"Basílica neogótica construida sobre un cañón.","emoji":"⛪","destino":"Ipiales","departamento":"Nariño"},
    {"slug":"boyaca-historica","nombre":"Boyacá Histórica","categoria":"Cultural","precio":980000,"duracion_dias":4,"duracion_noches":3,"descripcion":"Villa de Leyva, Ráquira y monumentos históricos.","emoji":"🏛️","destino":"Villa de Leyva","departamento":"Boyacá"},
    {"slug":"canon-del-chicamocha","nombre":"Cañón del Chicamocha","categoria":"Aventura","precio":1150000,"duracion_dias":4,"duracion_noches":3,"descripcion":"Deportes extremos y paisajes espectaculares.","emoji":"🪂","destino":"San Gil","departamento":"Santander"},
    {"slug":"mompox-patrimonial","nombre":"Mompox Patrimonial","categoria":"Cultural","precio":1250000,"duracion_dias":4,"duracion_noches":3,"descripcion":"Historia, arquitectura colonial y cultura ribereña.","emoji":"⛵","destino":"Mompox","departamento":"Bolívar"},
    {"slug":"sierra-nevada-ancestral","nombre":"Sierra Nevada Ancestral","categoria":"Aventura","precio":2100000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Conexión con comunidades indígenas y naturaleza.","emoji":"🏔️","destino":"Santa Marta","departamento":"Magdalena"},
    {"slug":"tolu-covenas-relax","nombre":"Tolú y Coveñas Relax","categoria":"Playa","precio":1100000,"duracion_dias":4,"duracion_noches":3,"descripcion":"Playas tranquilas y actividades acuáticas.","emoji":"🏖️","destino":"Tolú","departamento":"Sucre"},
    {"slug":"isla-gorgona-explorer","nombre":"Isla Gorgona Explorer","categoria":"Aventura","precio":2800000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Naturaleza, senderismo y biodiversidad marina.","emoji":"🦈","destino":"Guapi","departamento":"Cauca"},
    {"slug":"capurgana-paraiso","nombre":"Capurganá Paraíso","categoria":"Playa","precio":1900000,"duracion_dias":5,"duracion_noches":4,"descripcion":"Playas cristalinas y ecoturismo en el Caribe colombiano.","emoji":"🐠","destino":"Acandí","departamento":"Chocó"}
];

import "./Paquetes.css"

function Paquetes() {
    return (
        <div className="paquetes-container">
            <h1 className="paquetes-heading">🌍 Paquetes Turísticos Mareva</h1>

            {PAQUETES.map((paquete) => (
                <div className="paquete-card" key={paquete.slug}>
                    <h2>
                        {paquete.emoji} {paquete.nombre}
                    </h2>

                    <p><strong>Destino:</strong> {paquete.destino}</p>
                    <p><strong>Departamento:</strong> {paquete.departamento}</p>
                    <p><strong>Categoría:</strong> {paquete.categoria}</p>
                    <p>
                        <strong>Duración:</strong> {paquete.duracion_dias} días / {paquete.duracion_noches} noches
                    </p>
                    <p>{paquete.descripcion}</p>

                    <h3 className="paquete-price">
                        ${paquete.precio.toLocaleString("es-CO")}
                    </h3>

                    <button className="paquete-button">Reservar</button>
                </div>
            ))}
        </div>
    );
}

export default Paquetes;