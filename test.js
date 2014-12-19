/*
 * (C) 2014 Seth Lakowske
 */

var test      = require('tape');
var wse       = require('./');
var request   = require('request');
var websocket = require('websocket-stream');


test('static server test', function(t) {

    var server = new wse.WsStaticServer({

        path : '.',
        wsPath : 'webSocket'

    })

    server.listen(5000, function() {

        request('http://localhost:5000/test-data.txt', function (error, response, body) {

            if (!error && response.statusCode === 200) {

                t.strictEqual(body, 'Foo\n', 'should equal Foo');
                t.end();

            } else {

                t.fail('request error');

            }

            server.close();

        })

    })

})


test('streaming server test',  function(t) {

    var server = new wse.WsStaticServer({
        path : '.',
        wsPath : '/webSocket'
    });

    server.listen(5002, function() {

        //setup echo server
        server.wss.on('connection', function(ws) {

            var stream = websocket(ws);

            stream.pipe(stream);

        });


        //connect to the echo server
        var ws = websocket('ws://localhost:5002/webSocket');

        ws.on('data', function(data) {
            t.equal(data.toString(), 'Boo', 'got Boo as expected');
            ws.destroy();
            server.close();
            t.end();
        })

        //Send a message
        ws.write('Boo');

    });

})
