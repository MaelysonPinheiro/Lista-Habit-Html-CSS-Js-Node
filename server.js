const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()
const port = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized:false,
    cookie: {secure:false}
}))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myhabit'
})

db.connect((err) =>{
    if(err){
        console.log('Erro ao conectar no BD: ', err)
        return
    }
    console.log('Conectado no Banco de dados')
})

app.use(express.static(path.join(__dirname,'views')))

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.post('/register', async (req,res)=>{
    const{username, email, password} = req.body

    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = 'INSERT INTO users (nome, email, senha) VALUES (?,?,?)'

        db.query(sql, [username, email, hashedPassword], (err,result)=> {
            if(err){
                console.error('Erro ao inserir usuario no banco de dados:', err)
                return res.send('Erro ao registrar o usuario')
            }
            res.redirect('/login')
        })
    } catch(err){
        console.log('Erro ao registrar o usuario: ', err)
        res.send('Erro ao registrar o usuario.')
    }
})

app.get('/login', (req,res)=> {
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body

    const sql = 'SELECT * FROM users WHERE email = ?'

    db.query(sql, [email], async (err,results)=> {
        if(err){
            console.error('Erro ao consultar o banco de dados: ', err)
            return res.send('Erro ao fazer login.')
        }
        if (results.length === 0){
            return res.send('E-mail ou Senha invalidos')
        }

        const user = results[0]

        try{
            const match = await bcrypt.compare(password,user.senha)
            if(match){
                req.session.userId = user.id
                req.session.username = user.nome
                res.redirect('/index.html')
            } else {
                res.send('E-mail ou senha invalidos.')
            }
        }catch(error){
            console.error('Erro ao comparar senha: ', error)
            res.send('Erro ao fazer login.')
        }
    })
})

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}
app.get('/username', isAuthenticated, (req, res) => {
    const sql = 'SELECT nome FROM users WHERE id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o nome do usuário:', err);
            return res.status(500).json({ error: 'Erro ao obter o nome do usuário' });
        }
        if (results.length > 0) {
            res.json({ username: results[0].nome });
        } else {
            res.json({ username: 'Usuário' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.send('Erro ao fazer logout.');
        }
        res.redirect('/login.html');
    });
});

//Rota para adicionar ao Diario

app.post('/api/lista', isAuthenticated, (req, res) => {
    const { lista } = req.body;
    const sql = 'INSERT INTO habits (user_id, habit, created_at) VALUES (?, ?, CURDATE())';

    db.query(sql, [req.session.userId, lista], (err, result) => {
        if (err) {
            console.error('Erro ao registrar no diario, Erro: ', err);
            return res.status(500).json({ error: 'Erro ao registrar no diario' });
        }
        res.status(201).json({ success: true });
    });
});

// Rota para buscar todas as entradas do diário
app.get('/api/lista', isAuthenticated, (req, res) => {
    const sql = 'SELECT id, habit, created_at FROM habits WHERE user_id = ?';
    
    db.query(sql, [req.session.userId], (err, resultados) => {
        if (err) {
            console.error('Erro ao buscar entradas do diário:', err);
            return res.status(500).json({ error: 'Erro ao buscar entradas do diário' });
        }
        res.json(resultados); // Retorna as entradas do diário
    });
});

// Rota para excluir uma entrada do diário
app.delete('/api/lista/:id', isAuthenticated, (req, res) => {
    const { id } = req.params; // Obtém o ID da entrada a ser excluída
    const sql = 'DELETE FROM habits WHERE id = ? AND user_id = ?';

    db.query(sql, [id, req.session.userId], (err, result) => {
        if (err) {
            console.error('Erro ao excluir entrada do diário:', err);
            return res.status(500).json({ error: 'Erro ao excluir entrada do diário' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Entrada do diário não encontrada' });
        }
        res.status(204).send(); // Responde com sucesso (sem conteúdo)
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});