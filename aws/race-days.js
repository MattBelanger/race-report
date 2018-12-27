var AWS = require('aws-sdk');

var http = require('http');

exports.handler = (event, context, done) => {

    var req_options = {
        host:  'interview.dev.cfdv.net',
        port: '80',
        path: '/tracks/TRK/race-days.json',
        method: 'GET',
    };

    let response = {
          headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
          body: '',
          statusCode: 200
    };

    var req = http.request(req_options, function(res) {
                res.setEncoding('utf8');
                var returnData = "";
                res.on('data', function (chunk) {
                    returnData += chunk;
            });
            res.on('end', function () {
                response.body = returnData;
                done(null, response);
            });
    });
    req.end();
};
