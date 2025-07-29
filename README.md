# 🏋️ Aplicação de Treino Diário • Flask + MySQL

Uma aplicação web interativa para organizar planos de treino diários, com agrupamento por dias da semana, notas associadas a cada exercício e frases de motivação ao concluir tarefas. Desenvolvida com Flask, MySQL e HTML/CSS/JS puro.

---

## 🚀 Funcionalidades

- ✅ Adicionar exercícios por dia da semana
- ✅ Marcar exercícios como concluídos
- ✅ Adicionar notas individuais a cada exercício
- ✅ Receber uma frase de motivação ao concluir um exercício
- ✅ Interface visualmente apelativa, com imagem de fundo e animações suaves
- ✅ Organização por dias (segunda a domingo)
- ✅ API RESTful com endpoints organizados

---

## 🛠️ Como correr a aplicação localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/msssantos/python-full-stack-app.git
cd python-full-stack-app
```

### 2. Criar e ativar ambiente virtual

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

---

## 🥪 Base de Dados MySQL

### 1. Aceder ao MySQL

```bash
mysql -u root -p
```

### 2. Criar base de dados e tabelas

```sql
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
```

> ☝️ Podes também usar o ficheiro `docs/database.sql` incluído no projeto.

---

## ⚙️ Correr a aplicação

### Opção 1: via Python

```bash
python3 app.py
```

### Opção 2: com Flask CLI

```bash
export FLASK_APP=app.py       # Linux/macOS
set FLASK_APP=app.py          # Windows
flask run
```

---

## 📆 API – Principais rotas

| Método | Rota                            | Descrição                            |
|--------|----------------------------------|----------------------------------------|
| GET    | `/api/todos`                    | Lista todas as tarefas                 |
| POST   | `/api/todos`                    | Adiciona nova tarefa                   |
| PUT    | `/api/todos/<id>`               | Atualiza tarefa (ex: marcar como feita)|
| DELETE | `/api/todos/<id>`               | Remove tarefa                          |
| GET    | `/api/todos/<id>/notes`         | Lista notas da tarefa                  |
| POST   | `/api/todos/<id>/notes`         | Adiciona nota à tarefa                 |
| GET    | `/random`                       | Retorna número e frase motivacional    |

---

## ✨ Extras incluídos

- 🧠 Entidade nova (`notes`) com API funcional
- 🧘‍♀️ Rota `/random` com número e frase motivacional ao concluir tarefa
- 🗓️ Agrupamento de tarefas por dias da semana
- 💬 Interface visualmente agradável:
  - Imagem de fundo personalizada
  - Ícones e animações de hover
  - Fade-in suave nas tarefas adicionadas
  - Mensagens de motivação flutuantes
- 📱 Interface responsiva (mobile friendly)
- 📄 Estrutura clara, README completo e branch separada para melhorias

---

## 📷 Capturas de ecrã

![exemplo](static/imagens/background.jpg)

---

## 📁 Estrutura do Projeto (resumo)

```
├── app.py                 # Código principal Flask + API
├── static/
│   ├── app.js             # JS da interface
│   ├── style.css          # Estilos da página
│   └── imagens/           # Imagens de fundo (opcional)
├── templates/
│   └── index.html         # Página principal HTML
├── docs/
│   └── database.sql       # Script de criação da BD
├── requirements.txt       # Dependências do projeto
└── README.md              # Este ficheiro
```

---

## 🧑‍💻 Autor


Desenvolvido por Marta Santos, no contexto de avaliação