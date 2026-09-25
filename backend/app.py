import os
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, date, timedelta

from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
import jwt

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass


app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            ]
        }
    },
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)


DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "database": os.getenv("DB_NAME", "mareva2"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "1234"),
    "port": os.getenv("DB_PORT", "5432")
}


JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "Mareva_Proyecto_SENA_2026_Clave_Segura_Muy_Larga"
)


SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")


def obtener_conexion():
    return psycopg2.connect(**DB_CONFIG)


def limpiar_fila(fila):
    if not fila:
        return fila

    resultado = dict(fila)

    for clave, valor in resultado.items():
        if isinstance(valor, (datetime, date)):
            resultado[clave] = valor.isoformat()

    return resultado


def limpiar_filas(filas):
    return [limpiar_fila(fila) for fila in filas]


def obtener_usuario_por_id(id_usuario):
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute(
            """
            SELECT id_usuario, nombre, correo, rol
            FROM usuarios
            WHERE id_usuario = %s
            """,
            (id_usuario,)
        )

        usuario = cursor.fetchone()

        return limpiar_fila(usuario)

    except Exception:
        return None

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


def usuario_es_admin(usuario):
    if not usuario:
        return False

    rol = str(usuario.get("rol", "")).lower().strip()

    return rol in ["admin", "administrador"]


def token_required(func):
    def wrapper(*args, **kwargs):

        if request.method == "OPTIONS":
            return "", 200

        authorization = request.headers.get("Authorization", "")

        if not authorization:
            return jsonify({
                "error": "Token requerido"
            }), 401

        if not authorization.startswith("Bearer "):
            return jsonify({
                "error": "Formato de token inválido"
            }), 401

        token = authorization.split(" ", 1)[1].strip()

        if not token:
            return jsonify({
                "error": "Token requerido"
            }), 401

        try:
            datos = jwt.decode(
                token,
                JWT_SECRET,
                algorithms=["HS256"]
            )

            usuario_id = (
                datos.get("id_usuario")
                or datos.get("id")
                or datos.get("usuario_id")
            )

            if not usuario_id:
                return jsonify({
                    "error": "Token inválido"
                }), 401

            usuario = obtener_usuario_por_id(usuario_id)

            if not usuario:
                return jsonify({
                    "error": "Usuario no encontrado"
                }), 401

            request.usuario = usuario

            return func(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({
                "error": "El token ha expirado"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "error": "Token inválido"
            }), 401

        except Exception as e:
            return jsonify({
                "error": str(e)
            }), 401

    wrapper.__name__ = func.__name__

    return wrapper


def validar_password(password):
    if not password:
        return False

    if len(password) < 8:
        return False

    if not re.search(r"[A-Z]", password):
        return False

    if not re.search(r"[a-z]", password):
        return False

    if not re.search(r"\d", password):
        return False

    if not re.search(r"[^A-Za-z0-9]", password):
        return False

    return True


def preparar_base_datos():
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            ALTER TABLE reserva
            ADD COLUMN IF NOT EXISTS id_transporte INTEGER
        """)

        cursor.execute("""
            ALTER TABLE reserva
            ADD COLUMN IF NOT EXISTS id_alojamiento INTEGER
        """)

        cursor.execute("""
            ALTER TABLE cupones
            ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS reserva_cupon (
                id_reserva INTEGER NOT NULL,
                id_cupon INTEGER NOT NULL,
                fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS disponibilidad_paquetes (
                id_disponibilidad SERIAL PRIMARY KEY,
                paquete VARCHAR(255) NOT NULL,
                fecha_ida DATE NOT NULL,
                capacidad INTEGER DEFAULT 50,
                reservado INTEGER DEFAULT 0,
                activa BOOLEAN DEFAULT TRUE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(paquete, fecha_ida)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notificaciones_cliente (
                id_notificacion SERIAL PRIMARY KEY,
                id_usuario INTEGER NOT NULL,
                titulo VARCHAR NOT NULL,
                mensaje TEXT NOT NULL,
                leida BOOLEAN DEFAULT FALSE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conexion.commit()

        print("BASE DE DATOS PREPARADA")

    except Exception as e:
        if conexion:
            conexion.rollback()

        print("ERROR PREPARANDO BASE DE DATOS:", e)

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@app.route("/", methods=["GET"])
def inicio():
    return jsonify({
        "mensaje": "API MAREVA funcionando correctamente"
    }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok"
    }), 200


@app.route("/registro", methods=["POST", "OPTIONS"])
def registro():

    if request.method == "OPTIONS":
        return "", 200

    datos = request.get_json() or {}

    nombre = str(datos.get("nombre", "")).strip()
    correo = str(datos.get("correo", "")).strip().lower()
    contrasena = str(datos.get("contrasena", ""))

    if not nombre or not correo or not contrasena:
        return jsonify({
            "error": "Todos los campos son obligatorios"
        }), 400

    if not validar_password(contrasena):
        return jsonify({
            "error": "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
        }), 400

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute(
            """
            SELECT id_usuario
            FROM usuarios
            WHERE LOWER(correo) = LOWER(%s)
            """,
            (correo,)
        )

        existente = cursor.fetchone()

        if existente:
            return jsonify({
                "error": "El correo ya está registrado"
            }), 409

        password_hash = bcrypt.hashpw(
            contrasena.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO usuarios
            (nombre, correo, contrasena, rol, fecha_registro)
            VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING id_usuario, nombre, correo, rol
            """,
            (
                nombre,
                correo,
                password_hash,
                "cliente"
            )
        )

        usuario = cursor.fetchone()

        conexion.commit()

        return jsonify({
            "mensaje": "Usuario registrado correctamente",
            "usuario": limpiar_fila(usuario)
        }), 201

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@app.route("/login", methods=["POST", "OPTIONS"])
def login():

    if request.method == "OPTIONS":
        return "", 200

    datos = request.get_json() or {}

    correo = str(datos.get("correo", "")).strip().lower()
    contrasena = str(datos.get("contrasena", ""))

    if not correo or not contrasena:
        return jsonify({
            "error": "Correo y contraseña son obligatorios"
        }), 400

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute(
            """
            SELECT *
            FROM usuarios
            WHERE LOWER(correo) = LOWER(%s)
            LIMIT 1
            """,
            (correo,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({
                "error": "Correo o contraseña incorrectos"
            }), 401

        password_guardada = str(usuario["contrasena"])

        if not bcrypt.checkpw(
            contrasena.encode("utf-8"),
            password_guardada.encode("utf-8")
        ):
            return jsonify({
                "error": "Correo o contraseña incorrectos"
            }), 401

        token = jwt.encode(
            {
                "id_usuario": usuario["id_usuario"],
                "correo": usuario["correo"],
                "rol": usuario["rol"]
            },
            JWT_SECRET,
            algorithm="HS256"
        )

        usuario_respuesta = limpiar_fila(usuario)
        usuario_respuesta.pop("contrasena", None)

        return jsonify({
            "mensaje": "Inicio de sesión correcto",
            "token": token,
            "usuario": usuario_respuesta
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@app.route("/perfil", methods=["GET", "OPTIONS"])
@token_required
def perfil():

    if request.method == "OPTIONS":
        return "", 200

    usuario = obtener_usuario_por_id(
        request.usuario["id_usuario"]
    )

    return jsonify(usuario), 200


@app.route("/paquetes", methods=["GET", "OPTIONS"])
def paquetes():

    if request.method == "OPTIONS":
        return "", 200

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT * FROM paquetes")

        resultados = cursor.fetchall()

        return jsonify(limpiar_filas(resultados)), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@app.route("/fechas-disponibles", methods=["GET", "OPTIONS"])
def fechas_disponibles():

    if request.method == "OPTIONS":
        return "", 200

    paquete = request.args.get("paquete", "").strip()

    if not paquete:
        return jsonify({
            "error": "Debe indicar el paquete"
        }), 400

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute(
            """
            SELECT *
            FROM disponibilidad_paquetes
            WHERE LOWER(paquete) = LOWER(%s)
            AND activa = TRUE
            AND fecha_ida >= CURRENT_DATE
            ORDER BY fecha_ida
            """,
            (paquete,)
        )

        resultados = cursor.fetchall()

        if not resultados:
            fecha_actual = date.today()

            for i in range(0, 120, 7):
                fecha_salida = fecha_actual + timedelta(days=i)

                cursor.execute(
                    """
                    INSERT INTO disponibilidad_paquetes
                    (paquete, fecha_ida, capacidad, reservado, activa)
                    VALUES (%s, %s, 50, 0, TRUE)
                    ON CONFLICT (paquete, fecha_ida)
                    DO NOTHING
                    """,
                    (
                        paquete,
                        fecha_salida
                    )
                )

            conexion.commit()

            cursor.execute(
                """
                SELECT *
                FROM disponibilidad_paquetes
                WHERE LOWER(paquete) = LOWER(%s)
                AND activa = TRUE
                AND fecha_ida >= CURRENT_DATE
                ORDER BY fecha_ida
                """,
                (paquete,)
            )

            resultados = cursor.fetchall()

        respuesta = []

        for fila in resultados:
            item = limpiar_fila(fila)

            capacidad = int(item.get("capacidad") or 50)
            reservado = int(item.get("reservado") or 0)

            item["disponible"] = max(
                capacidad - reservado,
                0
            )

            respuesta.append(item)

        return jsonify({
            "fechas": respuesta
        }), 200

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@app.route("/alojamientos", methods=["GET", "OPTIONS"])
def alojamientos():

    if request.method == "OPTIONS":
        return "", 200

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT *
            FROM alojamientos
            ORDER BY id_alojamiento
        """)

        resultados = cursor.fetchall()

        return jsonify(limpiar_filas(resultados)), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@app.route("/transportes", methods=["GET", "OPTIONS"])
def transportes():

    if request.method == "OPTIONS":
        return "", 200

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT *
            FROM transportes
            WHERE activo = TRUE
            ORDER BY id_transporte
        """)

        resultados = cursor.fetchall()

        respuesta = []

        for fila in resultados:
            item = limpiar_fila(fila)

            capacidad = int(item.get("capacidad") or 0)

            cursor.execute(
                """
                SELECT COALESCE(SUM(
                    COALESCE(adultos, 0) +
                    COALESCE(ninos, 0) +
                    COALESCE(bebes, 0)
                ), 0) AS ocupados
                FROM reserva
                WHERE id_transporte = %s
                AND estado <> 'Cancelada'
                """,
                (item["id_transporte"],)
            )

            ocupados = cursor.fetchone()["ocupados"]

            item["sillas_disponibles"] = max(
                capacidad - int(ocupados or 0),
                0
            )

            respuesta.append(item)

        return jsonify(respuesta), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


def enviar_correo_reserva(
    correo_destino,
    nombre,
    id_reserva,
    paquete,
    destino,
    fecha_ida,
    fecha_regreso,
    total,
    estado
):

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP NO CONFIGURADO. NO SE ENVIO CORREO.")

        return False

    try:
        mensaje = MIMEMultipart("alternative")

        mensaje["Subject"] = f"Reserva MAREVA #{id_reserva}"
        mensaje["From"] = SMTP_FROM
        mensaje["To"] = correo_destino

        contenido = f"""
Hola {nombre},

Tu reserva en MAREVA fue registrada correctamente.

Número de reserva: #{id_reserva}
Paquete: {paquete}
Destino: {destino}
Fecha de ida: {fecha_ida}
Fecha de regreso: {fecha_regreso}
Total: ${total:,.0f}
Estado: {estado}

Gracias por viajar con MAREVA.

{BASE_URL}
"""

        mensaje.attach(
            MIMEText(contenido, "plain", "utf-8")
        )

        servidor = smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT,
            timeout=20
        )

        servidor.ehlo()
        servidor.starttls()
        servidor.ehlo()

        servidor.login(
            SMTP_USER,
            SMTP_PASSWORD
        )

        servidor.sendmail(
            SMTP_FROM,
            correo_destino,
            mensaje.as_string()
        )

        servidor.quit()

        print(
            f"CORREO DE RESERVA ENVIADO A {correo_destino}"
        )

        return True

    except Exception as e:
        print(
            "ERROR ENVIANDO CORREO:",
            e
        )

        return False


@app.route("/reservas", methods=["POST", "GET", "OPTIONS"])
def reservas():

    if request.method == "OPTIONS":
        return "", 200

    if request.method == "GET":
        return obtener_reservas_admin()

    datos = request.get_json() or {}

    usuario_id = (
        datos.get("id_usuario")
        or datos.get("usuario")
    )

    if not usuario_id:
        return jsonify({
            "error": "Debe iniciar sesión para realizar una reserva"
        }), 401

    try:
        usuario_id = int(usuario_id)
    except Exception:
        return jsonify({
            "error": "Usuario inválido"
        }), 400

    paquete = str(
        datos.get("paquete")
        or datos.get("id_paquete")
        or ""
    ).strip()

    destino = str(
        datos.get("destino")
        or paquete
    ).strip()

    fecha_ida = (
        datos.get("fecha_ida")
        or datos.get("fecha_salida")
    )

    fecha_regreso = datos.get("fecha_regreso")

    adultos = int(
        datos.get("adultos") or 0
    )

    ninos = int(
        datos.get("ninos")
        or datos.get("niños")
        or 0
    )

    bebes = int(
        datos.get("bebes")
        or datos.get("bebés")
        or 0
    )

    cantidad_personas = int(
        datos.get("cantidad_personas")
        or datos.get("personas")
        or (
            adultos +
            ninos +
            bebes
        )
    )

    mascotas = datos.get("mascotas", False)

    if isinstance(mascotas, str):
        mascotas = mascotas.lower() in [
            "true",
            "1",
            "si",
            "sí",
            "yes"
        ]

    mascotas_db = 1 if mascotas else 0

    id_alojamiento = datos.get(
        "id_alojamiento"
    )

    id_transporte = datos.get(
        "id_transporte"
    )

    try:
        id_alojamiento = (
            int(id_alojamiento)
            if id_alojamiento not in [None, "", 0]
            else None
        )
    except Exception:
        id_alojamiento = None

    try:
        id_transporte = (
            int(id_transporte)
            if id_transporte not in [None, "", 0]
            else None
        )
    except Exception:
        id_transporte = None

    precio_paquete = float(
        datos.get("precio_paquete") or 0
    )

    precio_alojamiento = float(
        datos.get("precio_alojamiento") or 0
    )

    precio_transporte = float(
        datos.get("precio_transporte") or 0
    )

    total = float(
        datos.get("total")
        or datos.get("precio_total")
        or (
            precio_paquete +
            precio_alojamiento +
            precio_transporte
        )
    )

    estado = "Pendiente de pago"

    if not paquete:
        return jsonify({
            "error": "Debe seleccionar un paquete"
        }), 400

    if not fecha_ida:
        return jsonify({
            "error": "Debe seleccionar una fecha de salida"
        }), 400

    if cantidad_personas <= 0:
        return jsonify({
            "error": "Debe haber al menos una persona en la reserva"
        }), 400

    if cantidad_personas > 50:
        return jsonify({
            "error": "La reserva no puede superar 50 personas"
        }), 400

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM usuarios
            WHERE id_usuario = %s
            """,
            (usuario_id,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({
                "error": "Usuario no encontrado"
            }), 401

        cursor.execute(
            """
            SELECT *
            FROM disponibilidad_paquetes
            WHERE LOWER(paquete) = LOWER(%s)
            AND fecha_ida = %s
            AND activa = TRUE
            FOR UPDATE
            """,
            (
                paquete,
                fecha_ida
            )
        )

        disponibilidad = cursor.fetchone()

        if not disponibilidad:
            return jsonify({
                "error": "La fecha seleccionada no está disponible"
            }), 400

        capacidad = int(
            disponibilidad["capacidad"] or 50
        )

        reservado = int(
            disponibilidad["reservado"] or 0
        )

        disponible = capacidad - reservado

        if cantidad_personas > disponible:
            return jsonify({
                "error": f"Solo quedan {disponible} cupos disponibles para esta fecha"
            }), 400

        if id_alojamiento:

            cursor.execute(
                """
                SELECT *
                FROM alojamientos
                WHERE id_alojamiento = %s
                """,
                (id_alojamiento,)
            )

            alojamiento = cursor.fetchone()

            if not alojamiento:
                return jsonify({
                    "error": "El alojamiento seleccionado no existe"
                }), 400

            pet_friendly = alojamiento.get(
                "pet_friendly"
            )

            if mascotas and not pet_friendly:
                return jsonify({
                    "error": "El alojamiento seleccionado no permite mascotas"
                }), 400

        if id_transporte:

            cursor.execute(
                """
                SELECT *
                FROM transportes
                WHERE id_transporte = %s
                AND activo = TRUE
                FOR UPDATE
                """,
                (id_transporte,)
            )

            transporte = cursor.fetchone()

            if not transporte:
                return jsonify({
                    "error": "El transporte seleccionado no existe o no está disponible"
                }), 400

            capacidad_transporte = int(
                transporte.get("capacidad") or 0
            )

            cursor.execute(
                """
                SELECT COALESCE(SUM(
                    COALESCE(adultos, 0) +
                    COALESCE(ninos, 0) +
                    COALESCE(bebes, 0)
                ), 0) AS ocupados
                FROM reserva
                WHERE id_transporte = %s
                AND estado <> 'Cancelada'
                """,
                (id_transporte,)
            )

            ocupados = int(
                cursor.fetchone()["ocupados"] or 0
            )

            disponibles_transporte = (
                capacidad_transporte -
                ocupados
            )

            if cantidad_personas > disponibles_transporte:
                return jsonify({
                    "error": "No hay suficientes sillas disponibles en el transporte seleccionado"
                }), 400

        cursor.execute(
            """
            INSERT INTO reserva
            (
                id_usuario,
                paquete,
                destino,
                fecha_ida,
                fecha_salida,
                fecha_regreso,
                adultos,
                ninos,
                bebes,
                mascotas,
                cantidad_personas,
                id_alojamiento,
                id_transporte,
                precio_paquete,
                precio_alojamiento,
                precio_transporte,
                total,
                precio_total,
                estado
            )
            VALUES
            (
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s
            )
            RETURNING *
            """,
            (
                usuario_id,
                paquete,
                destino,
                fecha_ida,
                fecha_ida,
                fecha_regreso,
                adultos,
                ninos,
                bebes,
                mascotas_db,
                cantidad_personas,
                id_alojamiento,
                id_transporte,
                precio_paquete,
                precio_alojamiento,
                precio_transporte,
                total,
                total,
                estado
            )
        )

        reserva = cursor.fetchone()

        id_reserva = reserva["id_reserva"]

        cursor.execute(
            """
            UPDATE disponibilidad_paquetes
            SET reservado = reservado + %s
            WHERE id_disponibilidad = %s
            """,
            (
                cantidad_personas,
                disponibilidad["id_disponibilidad"]
            )
        )

        cursor.execute(
            """
            INSERT INTO notificaciones_cliente
            (
                id_usuario,
                titulo,
                mensaje,
                leida,
                fecha_creacion
            )
            VALUES
            (
                %s,
                %s,
                %s,
                FALSE,
                CURRENT_TIMESTAMP
            )
            """,
            (
                usuario_id,
                "Reserva creada",
                f"Tu reserva para {destino} fue creada correctamente."
            )
        )

        conexion.commit()

        correo_enviado = enviar_correo_reserva(
            usuario["correo"],
            usuario["nombre"],
            id_reserva,
            paquete,
            destino,
            fecha_ida,
            fecha_regreso,
            total,
            estado
        )

        respuesta = limpiar_fila(reserva)

        respuesta["correo_enviado"] = correo_enviado

        return jsonify({
            "mensaje": "Reserva creada correctamente",
            "reserva": respuesta
        }), 201

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


def obtener_reservas_admin():

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM reserva
            ORDER BY id_reserva DESC
            """
        )

        reservas = cursor.fetchall()

        return jsonify(
            limpiar_filas(reservas)
        ), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/mis-reservas", methods=["GET", "OPTIONS"])
@token_required
def mis_reservas():

    if request.method == "OPTIONS":
        return "", 200

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM reserva
            WHERE id_usuario = %s
            ORDER BY id_reserva DESC
            """,
            (usuario_id,)
        )

        reservas = cursor.fetchall()

        return jsonify(
            limpiar_filas(reservas)
        ), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/reservas/<int:id_reserva>/pagar", methods=["PUT", "POST", "OPTIONS"])
@token_required
def pagar_reserva(id_reserva):

    if request.method == "OPTIONS":
        return "", 200

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM reserva
            WHERE id_reserva = %s
            AND id_usuario = %s
            FOR UPDATE
            """,
            (
                id_reserva,
                usuario_id
            )
        )

        reserva = cursor.fetchone()

        if not reserva:
            return jsonify({
                "error": "Reserva no encontrada"
            }), 404

        if str(reserva.get("estado", "")).lower() == "cancelada":
            return jsonify({
                "error": "No se puede pagar una reserva cancelada"
            }), 400

        cursor.execute(
            """
            UPDATE reserva
            SET estado = 'Pagada'
            WHERE id_reserva = %s
            RETURNING *
            """,
            (id_reserva,)
        )

        reserva_actualizada = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO notificaciones_cliente
            (
                id_usuario,
                titulo,
                mensaje,
                leida,
                fecha_creacion
            )
            VALUES
            (
                %s,
                %s,
                %s,
                FALSE,
                CURRENT_TIMESTAMP
            )
            """,
            (
                usuario_id,
                "Pago confirmado",
                f"El pago de tu reserva #{id_reserva} fue realizado correctamente."
            )
        )

        conexion.commit()

        return jsonify({
            "mensaje": "Pago realizado correctamente",
            "reserva": limpiar_fila(
                reserva_actualizada
            )
        }), 200

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/reservas/<int:id_reserva>", methods=["GET", "PUT", "DELETE", "OPTIONS"])
@token_required
def detalle_reserva(id_reserva):

    if request.method == "OPTIONS":
        return "", 200

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM reserva
            WHERE id_reserva = %s
            """,
            (id_reserva,)
        )

        reserva = cursor.fetchone()

        if not reserva:
            return jsonify({
                "error": "Reserva no encontrada"
            }), 404

        if (
            int(reserva["id_usuario"]) !=
            int(usuario_id)
            and
            not usuario_es_admin(request.usuario)
        ):
            return jsonify({
                "error": "No tienes permiso para ver esta reserva"
            }), 403

        return jsonify(
            limpiar_fila(reserva)
        ), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/reservas/<int:id_reserva>/cancelar", methods=["PUT", "POST", "OPTIONS"])
@token_required
def cancelar_reserva(id_reserva):

    if request.method == "OPTIONS":
        return "", 200

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM reserva
            WHERE id_reserva = %s
            AND id_usuario = %s
            FOR UPDATE
            """,
            (
                id_reserva,
                usuario_id
            )
        )

        reserva = cursor.fetchone()

        if not reserva:
            return jsonify({
                "error": "Reserva no encontrada"
            }), 404

        estado_actual = str(
            reserva.get("estado", "")
        ).lower()

        if estado_actual == "cancelada":
            return jsonify({
                "error": "La reserva ya está cancelada"
            }), 400

        cantidad_personas = int(
            reserva.get("cantidad_personas")
            or (
                int(reserva.get("adultos") or 0) +
                int(reserva.get("ninos") or 0) +
                int(reserva.get("bebes") or 0)
            )
        )

        fecha_ida = (
            reserva.get("fecha_ida")
            or reserva.get("fecha_salida")
        )

        paquete = reserva.get("paquete")

        cursor.execute(
            """
            UPDATE reserva
            SET estado = 'Cancelada'
            WHERE id_reserva = %s
            RETURNING *
            """,
            (id_reserva,)
        )

        reserva_cancelada = cursor.fetchone()

        cursor.execute(
            """
            UPDATE disponibilidad_paquetes
            SET reservado = GREATEST(
                reservado - %s,
                0
            )
            WHERE LOWER(paquete) = LOWER(%s)
            AND fecha_ida = %s
            """,
            (
                cantidad_personas,
                paquete,
                fecha_ida
            )
        )

        cursor.execute(
            """
            INSERT INTO notificaciones_cliente
            (
                id_usuario,
                titulo,
                mensaje,
                leida,
                fecha_creacion
            )
            VALUES
            (
                %s,
                %s,
                %s,
                FALSE,
                CURRENT_TIMESTAMP
            )
            """,
            (
                usuario_id,
                "Reserva cancelada",
                f"Tu reserva #{id_reserva} fue cancelada correctamente."
            )
        )

        conexion.commit()

        return jsonify({
            "mensaje": "Reserva cancelada correctamente",
            "reserva": limpiar_fila(
                reserva_cancelada
            )
        }), 200

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/cupones", methods=["GET", "OPTIONS"])
def cupones():

    if request.method == "OPTIONS":
        return "", 200

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute("""
            SELECT *
            FROM cupones
            WHERE activo = TRUE
            ORDER BY id_cupon
        """)

        resultados = cursor.fetchall()

        return jsonify(
            limpiar_filas(resultados)
        ), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/reservas/<int:id_reserva>/aplicar-cupon", methods=["POST", "OPTIONS"])
@token_required
def aplicar_cupon(id_reserva):

    if request.method == "OPTIONS":
        return "", 200

    datos = request.get_json() or {}

    codigo = str(
        datos.get("codigo")
        or datos.get("cupon")
        or ""
    ).strip()

    if not codigo:
        return jsonify({
            "error": "Debe ingresar un cupón"
        }), 400

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT *
            FROM reserva
            WHERE id_reserva = %s
            AND id_usuario = %s
            """,
            (
                id_reserva,
                usuario_id
            )
        )

        reserva = cursor.fetchone()

        if not reserva:
            return jsonify({
                "error": "Reserva no encontrada"
            }), 404

        cursor.execute(
            """
            SELECT *
            FROM cupones
            WHERE UPPER(codigo) = UPPER(%s)
            AND activo = TRUE
            LIMIT 1
            """,
            (codigo,)
        )

        cupon = cursor.fetchone()

        if not cupon:
            return jsonify({
                "error": "El cupón no existe o no está activo"
            }), 404

        precio_original = float(
            reserva.get("precio_total")
            or reserva.get("total")
            or 0
        )

        descuento = float(
            cupon.get("descuento")
            or cupon.get("porcentaje")
            or 0
        )

        if descuento > 100:
            descuento = 100

        nuevo_total = precio_original * (
            1 - descuento / 100
        )

        cursor.execute(
            """
            UPDATE reserva
            SET precio_total = %s,
                total = %s
            WHERE id_reserva = %s
            RETURNING *
            """,
            (
                nuevo_total,
                nuevo_total,
                id_reserva
            )
        )

        reserva_actualizada = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO reserva_cupon
            (
                id_reserva,
                id_cupon
            )
            VALUES (%s, %s)
            """,
            (
                id_reserva,
                cupon["id_cupon"]
            )
        )

        conexion.commit()

        return jsonify({
            "mensaje": "Cupón aplicado correctamente",
            "descuento": descuento,
            "reserva": limpiar_fila(
                reserva_actualizada
            )
        }), 200

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/mis-notificaciones", methods=["GET", "OPTIONS"])
@token_required
def mis_notificaciones():

    if request.method == "OPTIONS":
        return "", 200

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT
                id_notificacion,
                id_usuario,
                titulo,
                mensaje,
                leida,
                fecha_creacion
            FROM notificaciones_cliente
            WHERE id_usuario = %s
            ORDER BY fecha_creacion DESC,
                     id_notificacion DESC
            """,
            (usuario_id,)
        )

        notificaciones = cursor.fetchall()

        return jsonify(
            limpiar_filas(notificaciones)
        ), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/notificaciones/<int:id_notificacion>/leida", methods=["PUT", "POST", "OPTIONS"])
@token_required
def marcar_notificacion_leida(id_notificacion):

    if request.method == "OPTIONS":
        return "", 200

    usuario_id = request.usuario["id_usuario"]

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            UPDATE notificaciones_cliente
            SET leida = TRUE
            WHERE id_notificacion = %s
            AND id_usuario = %s
            RETURNING *
            """,
            (
                id_notificacion,
                usuario_id
            )
        )

        notificacion = cursor.fetchone()

        if not notificacion:
            return jsonify({
                "error": "Notificación no encontrada"
            }), 404

        conexion.commit()

        return jsonify(
            limpiar_fila(notificacion)
        ), 200

    except Exception as e:
        if conexion:
            conexion.rollback()

        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.route("/notificaciones/<int:id_notificacion>/leer", methods=["PUT", "POST", "OPTIONS"])
@token_required
def marcar_notificacion_leer_compatibilidad(
    id_notificacion
):

    return marcar_notificacion_leida(
        id_notificacion
    )


@app.route("/admin/usuarios", methods=["GET", "OPTIONS"])
@token_required
def admin_usuarios():

    if request.method == "OPTIONS":
        return "", 200

    if not usuario_es_admin(request.usuario):
        return jsonify({
            "error": "No tienes permisos de administrador"
        }), 403

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()

        cursor = conexion.cursor(
            cursor_factory=RealDictCursor
        )

        cursor.execute(
            """
            SELECT
                id_usuario,
                nombre,
                correo,
                rol,
                fecha_registro
            FROM usuarios
            ORDER BY id_usuario DESC
            """
        )

        usuarios = cursor.fetchall()

        return jsonify(
            limpiar_filas(usuarios)
        ), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@app.errorhandler(404)
def error_404(error):
    return jsonify({
        "error": "Ruta no encontrada",
        "ruta": request.path
    }), 404


@app.errorhandler(405)
def error_405(error):
    return jsonify({
        "error": "Método no permitido",
        "metodo": request.method,
        "ruta": request.path
    }), 405


@app.errorhandler(500)
def error_500(error):
    return jsonify({
        "error": "Error interno del servidor"
    }), 500


if __name__ == "__main__":

    preparar_base_datos()

    print("======================================")
    print("        MAREVA BACKEND INICIADO")
    print("======================================")
    print("BASE DE DATOS:", DB_CONFIG["database"])
    print("SERVIDOR: http://127.0.0.1:5000")
    print("FRONTEND: http://localhost:5173")
    print("======================================")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

