const ws=require('ws');
const {GameManager}=require('./GameManager');

const wss = new ws.WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    console.log('done');
  gameManager.addUser(ws)
  // ws.on("disconnect", () => gameManager.removeUser(ws))
});
