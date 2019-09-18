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
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(
    path.resolve(__dirname, `public`)
))

app.post('/auth', async (req, res) => {
    const {login, password} = req.body;
    //console.log(login + ' ' + password)
    findUser(login).then((result) => {
       if (!result){
        res.json({result: false, reason: 'Пользователь не существует'})
       } else if(result.pwd != password) {
           res.json({result: false, reason: 'Неверный пароль'})
       } else {
           res.json({result: true, reason: ''})
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

