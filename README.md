# 🧠 MyMental – Diário de Hábitos com Autenticação

Um projeto simples e funcional de **diário de hábitos**, onde o usuário pode se registrar, fazer login, adicionar hábitos diários, visualizar a lista e excluir entradas.  
A aplicação usa **Node.js + Express** no back-end e **MySQL** como banco de dados. O front-end é feito com **HTML, CSS e JavaScript puro**.

---

## 🚀 Funcionalidades

- Registro de usuário
- Login com sessão autenticada
- Adição de hábitos com data atual
- Listagem dos hábitos do usuário logado
- Exclusão de hábitos específicos
- Interface simples e funcional
- Middleware de autenticação para rotas protegidas

---

## 🛠️ Tecnologias utilizadas

- **Node.js**
- **Express.js**
- **MySQL**
- **Express-session**
- **HTML5 + CSS3 + JavaScript**

---

## 🗂️ Estrutura do projeto

\`\`\`bash
📦 MyMental
├── 📁 public            # Arquivos estáticos (HTML, CSS, JS do front-end)
├── 📁 routes            # (separação de rotas, se usada)
├── 📁 views             # (se usar template engine opcional)
├── 📁 database          # Script ou config do banco de dados
├── 📄 server.js         # Arquivo principal do servidor
├── 📄 package.json
├── 📄 README.md
\`\`\`

---

## 🔐 Sistema de autenticação

O projeto utiliza **session-based authentication** com `express-session`, onde:
- Ao fazer login, o `userId` é armazenado na sessão.
- As rotas protegidas verificam a sessão com o middleware `isAuthenticated`.
- O logout destrói a sessão e redireciona para a página de login.

---

## 💾 Banco de dados (MySQL)

### Tabela `users`
\`\`\`sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
\`\`\`

### Tabela `habits`
\`\`\`sql
CREATE TABLE habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
\`\`\`

---

## ▶️ Como rodar localmente

1. **Clone o repositório**
\`\`\`bash
git clone https://github.com/seuusuario/MyMental.git
cd MyMental
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
\`\`\`

3. **Configure o banco de dados**
- Crie um banco de dados MySQL.
- Importe o script SQL com as tabelas acima.
- Atualize as credenciais no arquivo `server.js` ou `.env`.

4. **Rode o servidor**
\`\`\`bash
node server.js
\`\`\`

5. **Acesse no navegador**
\`\`\`
http://localhost:3000
\`\`\`

---

## 📸 Prints (opcional)
Adicione aqui capturas de tela do projeto funcionando para deixar o repositório mais atrativo.

---

## 📌 Possíveis melhorias futuras

- Edição de hábitos
- Filtros por data
- Adição de categorias
- Modo escuro
- Deploy online (Vercel, Render, etc)

---

## 🤝 Contribuição

Sinta-se à vontade para abrir issues, enviar PRs ou sugerir melhorias!

---

## 📄 Licença

MIT — use como quiser, apenas mantenha os créditos.