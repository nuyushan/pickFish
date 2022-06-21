const express = require('express')
const api = require('./api')
const {createJob} = require('./cron')
const app = express()

const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const {oidCommentMap} = require("./commentSet");
const {getCommentList} = require("./api");
const io = new Server(server,{
    cors: {
        origin : "http://localhost:3000",
        credentials: true
    }
});

io.on('connection',(socket) => {
    console.log('a user connected');
    createJob(socket);
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});

app.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


app.get('/get_comment_list/:pageNum', async (req, res) => {
    const commentList = await api.getCommentList(req.params.pageNum);
    console.log(commentList);
    res.send('Hello World!')
})

app.get('/add_monitor/:oid', async (req, res) => {
    const oid = req.params.oid;
    //oid不存在或者已经监听了该评论区
    if (!oid || oidCommentMap[oid]){
       res.send('-1');
       return;
    }
    const data = await getCommentList(1,oid);
    if (!data){
        res.send('-2');
        return;
    }
    oidCommentMap[oid] = {}
});