var http = require('http');
var fs = require('fs');
var ent = require('ent');
var encode = require('ent/encode');
var decode = require('ent/decode');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('newLog', function(pseudo) {
        socket.pseudo = pseudo;
        console.log(socket.pseudo + " est connecté");
        // Quand un client se connecte, on lui envoie un message
        socket.emit('message', 'Vous êtes bien connecté !');
    
        // On signale aux autres clients qu'il y a un nouveau venu
        socket.broadcast.emit('message', "<em><strong>" + socket.pseudo + "</strong> vient de se connecter !</em>");
    
        socket.on("messageInput", function(texte) {
            socket.emit('message', "<span class='myPseudo'>" + socket.pseudo + "</span> " + texte);
            socket.broadcast.emit('message', "<span class='pseudo'>" + socket.pseudo + "</span> " + texte);
        });
    
        socket.on("disconnect", function() {
            console.log(socket.pseudo + " est déconnecté");
            socket.broadcast.emit('message', "<em><strong>" + ent.decode(socket.pseudo) + "</strong> vient de se déconnecter !</em>");
        });
    });
});

server.listen(8080);