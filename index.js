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
    this.app = express();
    this.app.use(express.static(this.path));
}

WsStaticServer.prototype.listen = function(port, onListen) {
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

exports.WsStaticServer = WsStaticServer;
