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

    conn.connect(function(error){
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

            if (event.body !== null && event.body !== undefined) {
                var bodyBase64 = Buffer.from(event.body, 'base64').toString();
                var body = querystring.parse(bodyBase64);


                var token = body.token;
                var description = body.description;

            }
            console.log("Conexion correcta a BD");

            var query = "SELECT * FROM teletok_lambda.token where code = ?";
            var parametros = [token];
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
                                "msg": error
                            }),
                        });
                    });
                }
                else {
                    if (result[0].id != null && result[0].id != undefined) {
                        var query = "INSERT INTO post (description, user_id) VALUES (?,?)";
                        var parametros = [description, result[0].id];
                        conn.query(query, parametros, function(error, result2) {
                            if (error) {
                                conn.end(function() {
                                    callback(error, {
                                        statusCode: 400,
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            "estado": "error al guardar",
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
                                            "estado": "post creado",
                                            "postid": result2.insertId
                                        }),
                                    });
                                });

                            }

                        });


                    }
                    else {
                        conn.end(function() {
                            callback(null, {
                                statusCode: 400,
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    "estado": "token invalido",
                                }),
                            });
                        });
                    }

                }
            });
        }
    });
};
