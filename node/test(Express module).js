
const {sql} = require( './serverPro')
const express = require('express');
const fs = require('fs');

function html(res,PathStr){
    res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});

    return fs.createReadStream('C:\\Users\\Вадим\\WebstormProjects\\untitled19\\public\\index2.html','utf-8');//(__dirname+PathStr,'utf-8');
}
//Відправка HTML

function getMaxStatesNumb(res){
    _sql.sqlQuerry2('select max(id) from content.states;').then(data=> {
        let dbInfo = data[0][0]['max(id)'];
        dbInfo=Number(dbInfo);
        res.send(""+dbInfo);
    })
}
//К-ть новин

function searchInfo(str,res){
    let sqlExStates='select * from  content.states where tatel like("%'+str+'%")'
    let sqlExNews ='select * from content.cntent where Header like("%'+str+'%");'

    _sql.sqlQuerry2(sqlExNews).then(data_=>{
        let news =data_[0];
        for(let i=0;i<data_[0].length;i++){
            news[i].type='NEWS'

        }
        _sql.sqlQuerry2(sqlExStates).then(data=>{
            for(let i=0;i<data[0].length;i++){
                data[0][i].type='STATES'
                news.push(data[0][i]);
            }


            res.send(JSON.stringify(news));

        })


    })

}
//Пошук

function getLastNewsStates(res){

    let  sqlEx= 'select * from content.states where id between (select max(id) from content.cntent )-5 and (select max(id) from content.cntent );';
    _sql.sqlQuerry2(sqlEx).then(data=>{

        console.log(data[0])
        res.send( JSON.stringify(data[0]));


    })

}
//Вигрузка новин

function getInfoById (id,res,type){
    let sqlEx;
    if(type==='NEWS') {
        sqlEx = 'select * from content.cntent where id=' + id+';';
    }
    else {
        sqlEx='select * from content.states where id='+id+';';
    }
    _sql.sqlQuerry2(sqlEx).then(data=>{


        res.send( JSON.stringify(data[0][0]));

    })
}
//Догрузка Новини чи статті

function getNextInfo (id,res,type){
    let toGo=id;
    if(id-3<=0){
        toGo=0;
    }
    else {
        toGo=id-3;
    }
    let sqlEx='';
    if(type==='NEWS') {
        sqlEx = 'select * from content.cntent where id between ' + toGo + ' and ' + (id - 1) + ';';
    }
    else {
        sqlEx = 'select * from content.states where id between ' + toGo + ' and ' + (id - 1) + ';';
    }
    console.log(sqlEx);
    _sql.sqlQuerry2(sqlEx).then(data=>{

      //  console.log(data[0])
        res.send( JSON.stringify(data[0]));

    })

}
function getComents(req,res,type,id) {
    let sqlEx;
    if(type==='NEWS') {
        sqlEx = "SELECT coments.UserName,coments.Coment FROM content.coments where type='N' and idContent="+id+";"
    }
    else {
        sqlEx = "SELECT coments.UserName,coments.Coment FROM content.coments where type='S' and idContent="+id+";"
    }
    _sql.sqlQuerry2(sqlEx).then(data=>{

        console.log(data[0])
        res.send( JSON.stringify(data[0]));

    })


}
//Загрузка Новини\Статті

function getHeaderData(maxNumb,res){

    let sqlEx ='select id,Header from content.cntent where id = (select mainNewId from content.main_new  where id=0);'
    _sql.sqlQuerry2(sqlEx).then(data=> {

        res.end(JSON.stringify({numb:maxNumb,mainNews:data[0][0].Header,id_:data[0][0].id}))
        console.log(data[0][0]);

    })

}
//Вигрузка даних для шапки

function getLogo(res){
    let path = "C:\\Users\\Вадим\\WebstormProjects\\untitled8\\logo.png";
    fs.readFile(path,function (err,data) {
        if(err){console.log( err)}
        else {
        //    res.writeHead(200,{'Content-Type': 'image/png;'});
            res.send(data);
        }

    })
}
//Загрузка логотипу
function backGr(res){
    let path = "C:\\Users\\Вадим\\WebstormProjects\\untitled8\\imgData\\background.png";
    fs.readFile(path,function (err,data) {
        if(err){console.log( err)}
        else {
            //    res.writeHead(200,{'Content-Type': 'image/png;'});
            res.send(data);
        }

    })
}
function getLastNewsBlocks(res){

    let  sqlEx= 'select * from content.cntent where id between (select max(id) from content.cntent )-5 and (select max(id) from content.cntent );';
    _sql.sqlQuerry2(sqlEx).then(data=>{

        res.send( JSON.stringify(data[0]));


    })
    //

    //console.log(inf);

}
//Видача даних для блоку останніх новин

function getImg(id,res){
    let path = "C:\\Users\\Вадим\\WebstormProjects\\untitled8\\imgData\\"+id+"\\"+1+".jpg";

    fs.readFile(path,function (err,data) {
        if(err){console.log( err)}
        else {

            //res.writeHead(200,{'Content-Type': 'image/jpg;'});
            res.send(data);
        }

    })


}
//Видача картинок
function  addComent(req,res,user,comment,id,type) {
    let  sqlEx= 'select max(id) from content.coments'

    _sql.sqlQuerry2(sqlEx).then(data=>{

        sqlEx="insert into content.coments(id,UserName,Coment,type,idContent) value("+(Number(data[0][0]['max(id)'])+1)+",'"+user+"','"+comment+"','"+type+"','"+id+"');"
       console.log(sqlEx)
        _sql.sqlQuerry2(sqlEx).then(data=>{
           // console.log(data)
            res.send(JSON.stringify({code:200}))
        }).catch(err=>{
            if(err){
                console.log(err)
                res.send(JSON.stringify({code:504}))
            }
        })
        //console.log(Number(data[0][0]['max(id)'])+1)
        //res.send( JSON.stringify(data[0]));


    })
}
var app = express();
let _sql = new sql('127.0.0.1','root','root','content');
var options = {
    host: '127.0.0.1',// Host name for database connection.
    // Port number for database connection.
    user: 'root',// Database user.
    password: 'root',// Password for the above database user.
    database: 'content'// Database name
};
function checkPass(req,res,pass){
    let sqlEx = "select login from content.login_data where password = '"+pass.valuePass+"';"
    _sql.sqlQuerry2(sqlEx).then(data=>{
        //console.log(data[0].length)
        //  console.log(data[0][0].login)
        if(data[0].length>0){

            console.log('1------------------')
            if(data[0][0].login===pass.valueLogin){
                console.log(req.session)
                console.log('20-----------------------')
                // req.session.
                // res.cookie('root', 1, { expires: new Date(Date.now() + 900000), httpOnly: true });
                // req.createSession
                console.log(req.session)
                //req.session.id = 1
                // req.session.username = 'root'
                res.locals.username =req.session.username='root';
                //res.send(req.session.cookie);
                // console.log(res.session.cookie)
                // res.code(303)
                res.redirect(303, '/')
                //req.on('end', () => {
                    //console.log('dsfds')

                    //res.cookie({name:'root',sing:true,id:1})
                //})
            }else {
                req.on('end', () => {

                    res.send(JSON.stringify({code:504}))
                    res.cookie({name: '', sing: false, id: 0})
                })

            }
        }else {
            req.on('end', () => {

                res.send(JSON.stringify({code:504}))
                //res.cookie({name: '', sing: false, id: 0})
            })

        }

    })
}
function registrateNewUser(req,res,userData){
    let sqlEx = 'select max(id) from content.login_data;'
    _sql.sqlQuerry2(sqlEx).then(data=>{
        sqlEx="insert into content.login_data(id,login,password,firstName,LastName) values("+(Number(data[0][0]['max(id)'])+1)+",'"+userData.login+"','"+userData.pass+"','"+userData.name+"','"+userData.family+"');"
            _sql.sqlQuerry2(sqlEx).then(data=>{
                res.send(JSON.stringify({code:200}))
            }).catch(err=>{
                if(err){
                    console.log(err)
                    res.send(JSON.stringify({code:504}))
                }
            })
    }).catch(err=>{
        if(err){
            console.log(err)
            res.send(JSON.stringify({code:504}))
        }
    })
}
app.get('/',(req,res)=>{
    html(res).pipe(res)
})
app.get('/maxStates',(req,res)=>{
    getMaxStatesNumb(res)
})
app.get('/giveMeInfoStr=:data',(req,res)=>{

    searchInfo(req.params.data,res);
})
app.get('/takeLastState',(req,res)=>{
    getLastNewsStates(res)
})
app.get('/SET_MAIN_LIST_STATES',(req,res)=>{
    getLastNewsStates(res)
})
app.get('/giveMeInfoStatId=:ID',(req,res)=>{
    getInfoById(Number(req.params.ID),res,'STATE')
})
app.get('/giveMeInfoNewsId=:ID',(req,res)=>{
    getInfoById(Number(req.params.ID),res,'NEWS')
})
app.get('/getNewInfoId=:ID',(req,res)=>{
    getNextInfo(Number(req.params.ID),res,'NEWS');
})
app.get('/bundle.js',(req,res)=>{
    fs.createReadStream("C:\\Users\\Вадим\\WebstormProjects\\untitled19\\dist\\bundle.js").pipe(res);
})
app.get('/headerInfo',(req,res)=>{
    _sql.sqlQuerry2('select max(id) from content.cntent;').then(data=>getHeaderData(data[0][0]['max(id)'],res));
})
app.get('/getStaInfoId=:ID',(req,res)=>{
    getNextInfo(Number(req.params.ID),res,'STATES');
})
app.get('/background',(req,res)=>{
    backGr(res)
})
app.get('/logoL',(req,res)=>{
    getLogo(res);
})
app.get('/lastNews',(req,res)=>{
    getLastNewsBlocks(res);
})
app.get('/SET_MAIN_LIST_NEWS',(req,res)=>{
    getLastNewsBlocks(res);
})
app.get('/giveMeImg=:ID',(req,res)=>{
    getImg(Number(req.params.ID),res);
})
app.get('/getComentsForNewsId=:ID',(req,res)=>{
    console.log()

    getComents(req,res,'NEWS',req.params.ID)
})
app.get('/getComentsForStatesId=:ID',(req,res)=>{
    //console.log('This work!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    getComents(req,res,'STATES',req.params.ID)
})
/*app.use(session({

    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Put true if https
}))*/
app.use(require('cookie-parser')('dsfsdfsdf'));
const session = require('express-session')
var mySqlStor = require('express-mysql-session')(session)



//var conn =
var sessionStore = new mySqlStor({
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'id',
            expires: 'expires',
            data: 'username'
        }
    }
}, _sql.getConn());
//sql script for check cookie | select id,username from content.sessions where id = 'Zwr1v8MffkhzeZjWvUuM6QndVbxrRQ_d' and username like('%"username":"root"%');

//app.use(cookie('aveMaria'))
app.use(session({
   // key: 'MyKey',
    name:'SSID',
    secret: 'dsfsdfsdf',
    cookie: {
        httpOnly: false,
     //   maxAge: 1000 * 60 * 60,
        secure: false
    },
    //domain: '.mydomain.com',
    store: sessionStore,
    signed: true,

    resave: false,
    saveUninitialized: true
}));/*
app.use((req,res,next)=>{

    console.log(req.session)
    next();
})*/

/*app.use((req, res, next) => {
    console.log((typeof req.session === 'undefined'))
    console.log(req.session.)
    /*if(! (typeof req.session === 'undefined')) {

        console.log('Its work')
        console.log('SIGNED', req.signedCookies['SSID'])
        if (!req.signedCookies['SSID']) {
            req.session.destroy((err => {
                if (err) {
                    return res.send({error: 'Logout error'})
                }
                req.session = null
                res.clearCookie(SESS_NAME, {path: '/'})
                return res.send({'clearSession': 'success'})
            }))
            res.send('СЕССИЯ БЫЛА ПОДМЕНЕНА')
        }
    }
    next()
})*/
/*app.get('/checkSesion',(req,res)=>{

    if(req.session){
        console.log(req.session.id)
        console.log(req.session)
        res.send('goood')
    }
    else{
        console.log(req.session)
        res.send('baad')
    }
})
*/
app.post('/autorized',(req,res)=>{
    req.on('data',(data)=>{
        let a = JSON.parse(data)
      //  console.log('ses: '+req.session+' user: '+req.session.username)
        if(typeof req.session.username==='undefined'){
            registrateNewUser(req,res,a);
        }
    })
})
app.post('/commenting',(req,res)=>{
    req.on('data', (data) => {
        let a = JSON.parse(data)
        if(!(typeof req.session === 'undefined')){
            if(req.session.username !=='' && (typeof req.session.username !== 'undefined')){
               // res.send(JSON.stringify({code:200,userName:req.session.username}))
                if(a.valueComent!==null&&a.valueComent.length>=5){
                    console.log(a.valueComent)
                    if(a.type==='STATES'){
                        addComent(req,res,req.session.username,a.valueComent,a.id,'S')
                    }if(a.type==='NEWS'){
                        addComent(req,res,req.session.username,a.valueComent,a.id,'N')
                    }
                }

            }else {
                res.send(JSON.stringify({code:404}))
            }
        }else {
            res.send({code:404})

        }
    })
})
app.post('/register',(req,res)=> {
    // console.log('dsfgsdfg')

    if (req.xhr || req.accepts('json,html') === 'json') {

    }
    else {

        req.on('data', (data) => {
            let a = JSON.parse(data)
            checkPass(req,res,a);
        })
        // let a = JSON.parse(req.body);
        //console.log(

    }
    //  console.log(req.query.form)
    // console.log(req.body)
    // console.log('dsgdfgsdfg')
    // console.log(req.body.valuePass)
})
app.get('/name',(req,res)=>{
    let a =JSON.stringify({code:403,userName:''})
    if(!(typeof req.session === 'undefined')){
        if(req.session.username !=='' && (typeof req.session.username !== 'undefined')){
            res.send(JSON.stringify({code:200,userName:req.session.username}))
        }else {
            res.send(a)
        }
    }else {
        res.send(a)

    }

})

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
