# 🏋️ Aplicação de Treino Diário • Flask + MySQL

Uma aplicação web simples para organizar e acompanhar treinos diários, com agrupamento por dias da semana, frases de motivação e notas adicionais.

---

## 🚀 Funcionalidades

- Adicionar exercícios por dia da semana
- Marcar exercícios como concluídos
- Adicionar notas a cada exercício
- Frase de motivação ao concluir um exercício
- Interface organizada e responsiva
- API RESTful com Flask

---

## 🛠️ Como correr a aplicação localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/msssantos/python-full-stack-app.git
cd python-full-stack-app


python3 -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt


CREATE DATABASE todo_app;

CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'troca_esta_password';
GRANT ALL PRIVILEGES ON todo_app.* TO 'todo_user'@'localhost';

USE todo_app;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  day VARCHAR(20)
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  todo_id INT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE
);


Correr a aplicação

python3 app.py

Ou com o Flask CLI:

export FLASK_APP=app.py
flask run