from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import mysql.connector
import random

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

DB = {
    "host":     "localhost",
    "user":     "todo_user",
    "password": "troca_esta_password",
    "database": "todo_app",
    "auth_plugin": "mysql_native_password"
}

def get_db():
    return mysql.connector.connect(**DB)

@app.route("/")
def index():
    return render_template("index.html")

# ---------- TAREFAS ----------
@app.route("/api/todos", methods=["GET"])
def list_todos():
    conn = get_db(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, text, done, day FROM todos ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(rows)

@app.route("/api/todos", methods=["POST"])
def add_todo():
    text = request.json.get("text", "").strip()
    day = request.json.get("day", "").strip().lower()
    if not text or not day:
        return jsonify({"error": "Texto ou dia inválido"}), 400

    conn = get_db(); cur = conn.cursor()
    cur.execute("INSERT INTO todos (text, day) VALUES (%s, %s)", (text, day))
    conn.commit()
    todo_id = cur.lastrowid
    cur.close(); conn.close()
    return jsonify({"id": todo_id, "text": text, "done": 0, "day": day}), 201


@app.route("/api/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    done = int(bool(request.json.get("done", 0)))
    conn = get_db(); cur = conn.cursor()
    cur.execute("UPDATE todos SET done=%s WHERE id=%s", (done, todo_id))
    conn.commit()
    cur.close(); conn.close()
    return jsonify({"id": todo_id, "done": done})

@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    conn = get_db(); cur = conn.cursor()
    cur.execute("DELETE FROM todos WHERE id=%s", (todo_id,))
    conn.commit()
    cur.close(); conn.close()
    return "", 204

# ---------- NOTAS ----------
@app.route("/api/todos/<int:todo_id>/notes", methods=["GET"])
def list_notes(todo_id):
    conn = get_db(); cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, content, created_at FROM notes WHERE todo_id=%s ORDER BY created_at DESC", (todo_id,))
    notes = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(notes)

@app.route("/api/todos/<int:todo_id>/notes", methods=["POST"])
def add_note(todo_id):
    content = request.json.get("content", "").strip()
    if not content:
        return jsonify({"error": "nota vazia"}), 400
    conn = get_db(); cur = conn.cursor()
    cur.execute("INSERT INTO notes (todo_id, content) VALUES (%s, %s)", (todo_id, content))
    conn.commit()
    note_id = cur.lastrowid
    cur.close(); conn.close()
    return jsonify({"id": note_id, "content": content}), 201

# ---------- RANDOM QUOTE ----------
@app.route("/random-quote")
def random_quote():
    frases = [
        "Faz hoje o que o teu futuro vai agradecer.",
        "Cada tarefa concluída é uma vitória.",
        "Não deixes para amanhã o que podes riscar hoje.",
        "Um passo de cada vez!",
        "A produtividade nasce da consistência."
    ]
    return random.choice(frases)

@app.route("/random")
def random_combo():
    frases = [
        "Força total!",
        "Treino feito, missão cumprida!",
        "Cada repetição conta!",
        "Estás mais perto do teu objetivo!",
        "Excelente esforço!",
        "Nunca pares, estás a evoluir!",
        "Superaste-te mais uma vez!"
    ]
    resposta = {
        "numero": random.randint(1, 100),
        "frase": random.choice(frases)
    }
    return jsonify(resposta)


# ---------- RUN ----------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
