const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const consolidate = require('consolidate');
const connector = require('./connector.js');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(
    path.resolve(__dirname, `public`)
))

app.post('/auth', async (req, res) => {
    // console.log(req)
    const {login, password} = req.body;
    // console.log(req.body)
    console.log(login + ' ' + password)
    //сходить в базу проверить юзера, если есть то пропустить если нет то вывести что такого нет, если неверный пасс то вывести чтоневерный пасс
    res.json({result: 'Nice'})
    // const user = await User.findOne({name: username})
    // if (user){
    //     if (username === user.name && chiferWork(password,'salt','encode') === user.password) {
    //         const token = jwt.sign({
    //             id: user._id,
    //             username: user.name,
    //         }, secret);
    //         res.json({token});
    //     } else {
    //         res.json({error: 'Wrong credentials'})
    //     }
    // } else {
    //     res.json({error: `Can't find user ${username}`})
    // }
});

// const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'testtask'
// })

// function findUser(login){
//     connection.connect(err=>{
//         if (err){
//             console.error('error connecting: ' + err.stack);
//             return;
//         }
//         console.log('connected as id ' + connection.threadID);
//     });

//     connection.query({
//         sql: 'SELECT * FROM `users` WHERE `login` = ?',
//         timeout: 4000,
//         values: [login]
//     },function(error,results,fields){
//         return results;
//     })

//     connection.end();
// }

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

