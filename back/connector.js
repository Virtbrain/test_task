const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testtask'
})

function findUser(login){
    connection.connect(err=>{
        if (err){
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadID);
    });

    connection.query({
        sql: 'SELECT * FROM `users` WHERE `login` = ?',
        timeout: 4000,
        values: [login]
    },function(error,results,fields){
        return results;
    })

    connection.end();
}

function primitiveQuery(){
    connection.connect(err=>{
        if (err){
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadID);
    });

    connection.query({
        sql: 'SELECT * FROM `users`',
        timeout: 4000,
    },function(error,results,fields){
        return results;
    })

    connection.end();
}