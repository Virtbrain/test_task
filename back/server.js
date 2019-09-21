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

app.post('/stat', (req,res)=>{
    getStatuses().then((statuses)=>{
        res.json(statuses)
    })
});

app.post('/prior',(req,res)=>{
    getPrioritys().then((prioritys)=>{
        res.json(prioritys)
    })
});

app.post('/empls',(req,res)=>{
    const {id} = req.body;
    getEmpls(id).then((empls)=>{
        res.json(empls)
    })
})

app.post('/newt',(req,res)=>{
    const newtask = req.body; 
    setTask(newtask.payload).then((result)=>{
        result ? res.json({status: '1 record inserted'}):res.json({status: 'error'});
    })
    
    // getEmpls(id).then((empls)=>{
    //     console.log(empls)
    //     res.json(empls)
    //})
})

app.post('/tasks', (req,res)=>{
    const {id,type} = req.body;
    getTasks(id,type).then((tasks)=>{
        res.json(tasks);
    })

})

function findUser(login){
    return new Promise((resolve, reject)=>{
        connection.query({
            sql: 'SELECT * FROM `users` WHERE `login` = ?',
            timeout: 4000,
            values: [login]
        },function(error,results,fields){
            if (error) reject(error)
            resolve(results[0]);
        })
    })
}

function getTasks(id,type){
    console.log(type)
    switch(type){
        case 'without':return new Promise((resolve, reject)=>{
                connection.query({
                    sql: 'SELECT `tasks`.`id`,`tasks`.`title`,`tasks`.`description`,`tasks`.`date_up`,`tasks`.`date_st`,`tasks`.`date_end`,`tasks`.`priority`,`tasks`.`status`,`tasks`.`creator`,(SELECT CONCAT(`users`.`firstname`," ",`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`creator`) AS `creator_name`,`tasks`.`performer`,(SELECT CONCAT(`users`.`firstname`," " ,`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`performer`) AS `performer_name`,`prioritys`.`prior_name`,`statuses`.`stat_name` FROM `tasks` LEFT OUTER JOIN `prioritys` ON `tasks`.`priority` = `prioritys`.`id` LEFT OUTER JOIN `statuses` ON `tasks`.`status` = `statuses`.`id` WHERE `tasks`.`creator` = ? OR `tasks`.`performer` = ?;',
                    timeout: 4000,
                    values: [id, id]
                }, function(error,results,fields){
                    if (error) reject(error)
                    resolve(results)
                })
            })
        case 'today':return new Promise((resolve, reject)=>{
                connection.query({
                    sql: 'SELECT `tasks`.`id`,`tasks`.`title`,`tasks`.`description`,`tasks`.`date_up`,`tasks`.`date_st`,`tasks`.`date_end`,`tasks`.`priority`,`tasks`.`status`,`tasks`.`creator`,(SELECT CONCAT(`users`.`firstname`," ",`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`creator`) AS `creator_name`,`tasks`.`performer`,(SELECT CONCAT(`users`.`firstname`," " ,`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`performer`) AS `performer_name`,`prioritys`.`prior_name`,`statuses`.`stat_name` FROM `tasks` LEFT OUTER JOIN `prioritys` ON `tasks`.`priority` = `prioritys`.`id` LEFT OUTER JOIN `statuses` ON `tasks`.`status` = `statuses`.`id` WHERE `tasks`.`performer` = ? AND `tasks`.`date_end` = TO_DAYS(NOW());',
                    timeout: 4000,
                    values: [id, id]
                }, function(error,results,fields){
                    if (error) reject(error)
                    resolve(results)
                })
            })
        case 'week':return new Promise((resolve, reject)=>{
                connection.query({
                    sql: 'SELECT `tasks`.`id`,`tasks`.`title`,`tasks`.`description`,`tasks`.`date_up`,`tasks`.`date_st`,`tasks`.`date_end`,`tasks`.`priority`,`tasks`.`status`,`tasks`.`creator`,(SELECT CONCAT(`users`.`firstname`," ",`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`creator`) AS `creator_name`,`tasks`.`performer`,(SELECT CONCAT(`users`.`firstname`," " ,`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`performer`) AS `performer_name`,`prioritys`.`prior_name`,`statuses`.`stat_name` FROM `tasks` LEFT OUTER JOIN `prioritys` ON `tasks`.`priority` = `prioritys`.`id` LEFT OUTER JOIN `statuses` ON `tasks`.`status` = `statuses`.`id` WHERE `tasks`.`performer` = ? AND `tasks`.`date_end` < DATE_ADD(TO_DAYS(NOW()),INTERVAL 7 DAY);',
                    timeout: 4000,
                    values: [id, id]
                }, function(error,results,fields){
                    if (error) reject(error)
                    resolve(results)
                })
            })
        case 'future':return new Promise((resolve, reject)=>{
                connection.query({
                    sql: 'SELECT `tasks`.`id`,`tasks`.`title`,`tasks`.`description`,`tasks`.`date_up`,`tasks`.`date_st`,`tasks`.`date_end`,`tasks`.`priority`,`tasks`.`status`,`tasks`.`creator`,(SELECT CONCAT(`users`.`firstname`," ",`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`creator`) AS `creator_name`,`tasks`.`performer`,(SELECT CONCAT(`users`.`firstname`," " ,`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`performer`) AS `performer_name`,`prioritys`.`prior_name`,`statuses`.`stat_name` FROM `tasks` LEFT OUTER JOIN `prioritys` ON `tasks`.`priority` = `prioritys`.`id` LEFT OUTER JOIN `statuses` ON `tasks`.`status` = `statuses`.`id` WHERE tasks`.`performer` = ? AND `task`.`date_end` > DATE_ADD(TO_DAYS(NOW()),INTERVAL 7 DAY);',
                    timeout: 4000,
                    values: [id, id]
                }, function(error,results,fields){
                    if (error) reject(error)
                    resolve(results)
                })
            })
        case 'people':return new Promise((resolve, reject)=>{
                connection.query({
                    sql: 'SELECT `tasks`.`id`,`tasks`.`title`,`tasks`.`description`,`tasks`.`date_up`,`tasks`.`date_st`,`tasks`.`date_end`,`tasks`.`priority`,`tasks`.`status`,`tasks`.`creator`,(SELECT CONCAT(`users`.`firstname`," ",`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`creator`) AS `creator_name`,`tasks`.`performer`,(SELECT CONCAT(`users`.`firstname`," " ,`users`.`lastname`) FROM `users` WHERE `users`.`id` = `tasks`.`performer`) AS `performer_name`,`prioritys`.`prior_name`,`statuses`.`stat_name` FROM `tasks` LEFT OUTER JOIN `prioritys` ON `tasks`.`priority` = `prioritys`.`id` LEFT OUTER JOIN `statuses` ON `tasks`.`status` = `statuses`.`id` WHERE `tasks`.`creator` = ? OR `tasks`.`performer` = ? ORDER BY `performer_name`;',
                    timeout: 4000,
                    values: [id, id]
                }, function(error,results,fields){
                    if (error) reject(error)
                    resolve(results)
                })
            })
    }
}



function getStatuses(){
    return new Promise((resolve,reject)=>{
        connection.query({
            sql:'SELECT * FROM `statuses`',
            timeout: 4000
        }, function(error, results, fileds){
            if (error) reject(error)
            resolve(results)
        })
    })
}

function getPrioritys(){
    return new Promise((resolve, reject)=>{
        connection.query({
            sql:'SELECT * FROM `prioritys`',
            timeout: 4000,
        }, function(error,results,fields){
            if (error) reject(error)
            resolve(results)
        })
    })
}

function getEmpls(id){
    return new Promise((resolve,reject)=>{
        connection.query({
            sql:'SELECT `users`.`id`, `firstname`, `lastname`, `fathername` FROM `users` LEFT OUTER JOIN `relations` ON `relations`.`boss` = ? WHERE `users`.`id` = `relations`.`epml`',
            timeout: 4000,
            values: [id]
        }, function(error, results, fileds){
            if (error) reject(error)
            resolve(results)
        })
    })
}

function setTask(data){
    console.log(data)
    return new Promise((resolve,reject)=>{
        connection.query({
            sql:'INSERT INTO `testtask`.`tasks` (`title`, `description`, `date_up`, `date_st`, `date_end`, `priority`, `status`, `creator`, `performer`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
            timeout: 4000,
            values:[data.title, data.description, 
                    data.dateUp, data.dateSt, 
                    data.dateEnd, data.priority,
                    data.status, data.creator, data.performer]
        }, function(error, results, fileds){
            if (error) reject(error)
            resolve(results)
        })
    })
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

