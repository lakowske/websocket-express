/*
 * (C) 2014 Seth Lakowske
 */

var express         = require('express');
var http            = require('http');
var WebSocketServer = require('ws').Server;
var websocket       = require('websocket-stream');

/*
 * A websocket server that serves static content
 */
function WsStaticServer(options) {
    this.path = options.path;
    this.wsPath = options.wsPath;
}

WsStaticServer.prototype.listen = function(port, onListen) {

    this.app = express();
    this.app.use(express.static(this.path));
    this.server = http.createServer(this.app);

    var self = this;
    this.server.listen(port, function() {
        self.wss = new WebSocketServer({server : self.server, path:self.wsPath});
        onListen(self.wss);
    })
}

WsStaticServer.prototype.close = function() {
    this.wss.close();
    this.server.close();
}



/*
 * ServerSocket sends http traffic to a pipeline
 */
function ServerSocket(options) {
    this.servePath = node.servePath;
    this.port = node.port;
    this.wsPath = node.wsPath;
    this.node = node;
    this.listen();
}

/*
 * Start the http server and create the node pipeline.
 */
ServerSocket.prototype.listen = function() {
    this.wsStaticServer = new WsStaticServer(this.node);

    var self = this;

    this.wsStaticServer.listen(function(wss) {

        wss.on('connection', function(ws) {
            self.stream = websocket(ws);
        })
    })
}

ServerSocket.prototype.end = function() {
    this.wsStaticServer.close();
}

exports.WsStaticServer = WsStaticServer;
exports.ServerSocket   = ServerSocket;
