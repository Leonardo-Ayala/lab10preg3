const mysql = require('mysql2');
const querystring = require('querystring');

exports.handler = (event, context, callback) => {

    var conn = mysql.createConnection({
        host: "database-2.cw9yxxv7kuyu.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "leonardo1256",
        port: 3306,
        database: "teletok_lambda"
    });

    conn.connect(function(error) {
        if (error) {
            conn.end(function() {
                callback(error, {
                    statusCode: 400,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "estado": "ok",
                        "msg": error
                    }),
                });
            });
        }
        else {
            if (event.queryStringParameters != null) {
                var id = event.queryStringParameters.id;

            }

            var query = "SELECT * FROM post where id = ?;";
            var parametros = [id];
            conn.query(query, parametros, function(error, result) {
                if (error) {
                    conn.end(function() {
                        callback(error, {
                            statusCode: 400,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                "estado": "error",
                            }),
                        });
                    });
                }
                else {
                    conn.end(function() {
                        callback(null, {
                            statusCode: 200,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                "estado": "post",
                                "postid": result
                            }),
                        });
                    });

                }

            });

        }

    });

};
