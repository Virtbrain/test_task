const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const consolidate = require('consolidate');
const connector = require('./connector.js');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'testtask'
})
connection.connect(err=>{
    if (err){
        console.error('error connecting: ' + err.stack);
        return;
    }
});

const app = express();
const port = 8085;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(
    path.resolve(__dirname, `public`)
))

app.post('/auth', (req, res) => {
    const {login, password} = req.body;
    //console.log(login + ' ' + password)
    findUser(login).then((user) => {
       if (!user){
        res.json({status: 'error', reason: 'Пользователь не существует'})
       } else if(user.pwd != password) {
           res.json({status: 'error', reason: 'Неверный пароль'})
       } else {
           console.log(user)
           res.json({status: 'success', reason: '', user: user})
       }
    })
    //connection.end();Note: If you're serving web requests, 
    //then you shouldn't be ending connections on every request. 
    //Just create a connection on server startup and use the connection/client object to query all the time.
});

function findUser(login){
    return new Promise((resolve, reject)=>{
        connection.query({
            sql: 'SELECT * FROM `users` WHERE `login` = ?',
            timeout: 4000,
            values: [login]
        },function(error,results,fields){
            if (error) reject(error)
            //console.log(results[0])
            resolve(results[0]);
        })
    })
}

function getTasks(id,type){
    return new Promise((resolve, reject)=>{
        connection.query({
            sql: 'SELECT `tasks`.`title`,`tasks`.`description`,`tasks`.`date_end`,`users`.`firstname`,`users`.`lastname`,`statuses`.`stat_name` FROM `tasks` LEFT OUTER JOIN `users` ON `tasks`.`performer` = `users`.`id` LEFT OUTER JOIN `statuses` ON `tasks`.`status` = `statuses`.`id` WHERE `tasks`.`creator` = ?',
            timeout: 4000,
            values: [id]
        }, function(error,results,fields){
            if (error) reject(error)
            resolve(results)
        })
    })
}

// function primitiveQuery(){
//     let queryRes = []
//     connection.connect(err=>{
//         if (err){
//             console.error('error connecting: ' + err.stack);
//             return;
//         }
//         console.log('connected with mysql...');
//     });
//     connection.query({
//         sql: 'SELECT * FROM `users`',
//         timeout: 4000,
//     },function(error,results,fields){
//         queryRes = results
//     })
//     connection.end();
//     return queryRes
// }



// console.log(primitiveQuery())
// app.get('/',(req, res)=>{
//     res.send("Hellow world");
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

