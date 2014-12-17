/*
 * (C) 2014 Seth Lakowske
 */

var test = require('tape');
var wse  = require('./');
var request = require('request');

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
