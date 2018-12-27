var AWS = require('aws-sdk');

var http = require('http');

exports.handler = (event, context, done) => {
 
    var req_options = {
        host:  'interview.dev.cfdv.net',
        port: '80',
        path: '/tracks/TRK/race-days/'+event.queryStringParameters.race_date+'/races/'+event.queryStringParameters.race_number+'.json',
        method: 'GET',
    };
    
    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*"
        },
        "body": '',
        "isBase64Encoded": false
    };

    var req = http.request(req_options, function(res) {
                res.setEncoding('utf8');
                var returnData = "";
                res.on('data', function (chunk) {
                    returnData += chunk;
            });
            res.on('end', function () {
                response.body = returnData;
                done(null, response)
            });
    });
    req.end();
};
