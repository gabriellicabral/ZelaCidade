const express = require('express');

const {criarBanco} = require('./.database');

const app = express();

app.use(express.json());

app.get('/', (req, res)=> {
res.send(`
    <body> 
    <h1>ZelaCidade</h1>
    <h2>Gestão de problemas urbanos</h2>
    <p>Endpoint que leva aos incidentes cadastrados: /incidentes</p>
    </body>
    `)


}) 

const PORT = 3000

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})

app.get('/incidentes', async (req, res) => {
    const db = await criarBanco()
    const listaIncidentes = await db.all(`SELECT * FROM incidentes`)
    res.json(listaIncidentes)
})

// ROTA ESPECÍFICA: Busca apenas UM incidente pelo número do ID
app.get('/incidentes/:id', async (req, res) => {
    const { id } = req.params

    const db = await criarBanco()

    const incidenteEspecifico = await db.all(`SELECT * FROM incidentes WHERE id = ?`, [id])
    res.json(incidenteEspecifico)
})

// ROTA POST: Define uma rota do tipo POST para o endpoint '/incidentes'
app.post('/incidentes', async (req, res) => {
    const {tipo_problema, localizacao, descricao, prioridade, nome_solicitante, contato_solicitante, data_registro, hora_registro, imagem_problema} = req.body

    const db = await criarBanco()

    await db.run(`INSERT INTO incidentes (tipo_problema, localizacao, descricao, prioridade, nome_solicitante, contato_solicitante, data_registro, hora_registro, imagem_problema) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [tipo_problema, localizacao, descricao, prioridade, nome_solicitante, contato_solicitante, data_registro, hora_registro, imagem_problema] )

    res.send(`Incidente novo registrado: ${tipo_problema} registrado na data ${data_registro} por ${nome_solicitante}`)
})

//atualizando um problema já existente, mas editando um lugar especifico
app.put('/incidentes/:id', async (req, res)=>{
   //pega o id do incidente que vem pela URL
    const{id} = req.params

    const {prioridade, descricao, status_resolucao} = req.body

    const db = await criarBanco()

    await db.run(`
        UPDATE incidentes
        SET descricao = ?, prioridade = ?, status_resolucao = ?
        WHERE id = ?
        ` , [descricao, prioridade, status_resolucao, id])
        
        res.send (`O incidente de ID ${id} foi atualizado com sucesso`)
})

app.delete('/incidentes/:id', async (req, res)=>{
    const {id} = req.params
    const db = await criarBanco()
    await db.run (`DELETE FROM incidentes WHERE id = ?`, [id])
    res.send(`O incidente de id ${id} foi removido com sucesso`)
})