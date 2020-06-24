const http = require('http');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const mySql = require('mysql2/promise');

class sql{
    conn;
    someVar;
    constructor(host,pass,name,db) {
        this.someVar=[];
        this.conn=mySql.createPool({
            host:host,
            user:name,
            database:db,
            password:pass,
            waitForConnections:true,
            connectionLimit:10,
            queueLimit:0
        });
    }
    async sqlQuerry2(str){
        let a =await this.conn.query(str);
        return a;
    }
}

function numbList(res,str) {
    if(str=='/'){
        return 1;
    }

    str=str.substr(1);
    Number(str);
    if(!Number(str).isNan){


        return str;
    }
    else {

        res.writeHead(404);
        res.end();
    }
}
function html(res,PathStr){
    res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});

    return fs.createReadStream('C:\\Users\\Вадим\\WebstormProjects\\untitled19\\public\\index2.html','utf-8');//(__dirname+PathStr,'utf-8');
}
function  css (req,res) {
    res.writeHead(200,{'Content-Type': 'text/css; charset=utf-8'});
 fs.createReadStream(__dirname+'\\myStyle.css','utf-8').pipe(res);
}

let _sql = new sql('127.0.0.1','root','root','content');

function setImg(res,k,indx,key) {

    let sql_guery='';
    if(key) {
        sql_guery = 'select img_src from content.cntent where id = ( select max(id-' + (indx * 3 - k) + ') from content.cntent);';

    }else {

        sql_guery='select img_src from content.cntent where id = '+ k+' ;';

    }

    _sql.sqlQuerry2(sql_guery).then(inf=>{
        let path = inf[0][0].img_src;


        fs.readFile(path,function (err,data) {
            if(err){console.log( err)}
            else {
                res.writeHead(200,{'Content-Type': 'image/png;'});
                res.end(data);
            }

        })
    })

}
function  set_new(res,k,indx) {
    let sql_q = 'select * from content.cntent where id = ( select max(id-' + (indx * 3 - buf) + ') from content.cntent);';
    _sql.sqlQuerry2(sql_q).then(data => {
        res.end(JSON.stringify(data[0][0]));

    });
}
function set_blocks(k,res,indx) {
    let sql_q = 'select Header from content.cntent where id = ( select max(id-' + (indx * 3 - k) + ') from content.cntent);';

    _sql.sqlQuerry2(sql_q).then(data => {

        res.end(data[0][0].Header)

    });
}
function getLogo(res){
    let path = "C:\\Users\\Вадим\\WebstormProjects\\untitled8\\logo.png";
    fs.readFile(path,function (err,data) {
        if(err){console.log( err)}
        else {
            res.writeHead(200,{'Content-Type': 'image/png;'});
            res.end(data);
        }

    })
}
function getImg(id){

}
function check_content(req,res,index,str) {

let sql_q = 'select Header from content.cntent where id = ( select max(id-'+i+') from content.cntent);';

if(index=='/p1'){
    i-=1;
    _sql.sqlQuerry(req,res,sql_q);

}

}
function getLastNewsBlocks(res){

   let  sqlEx= 'select * from content.cntent where id between (select max(id) from content.cntent )-5 and (select max(id) from content.cntent );';
    _sql.sqlQuerry2(sqlEx).then(data=>{

      res.end( JSON.stringify(data[0]));


    })
        //

        //console.log(inf);

}
function getLastNewsStates(res){

    let  sqlEx= 'select * from content.states where id between (select max(id) from content.cntent )-5 and (select max(id) from content.cntent );';
    _sql.sqlQuerry2(sqlEx).then(data=>{

        console.log(data[0])
        res.end( JSON.stringify(data[0]));


    })
    //

    //console.log(inf);

}
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

        console.log(data[0])
        res.end( JSON.stringify(data[0]));

    })

}
function getInfoById (id,res,type){
    let sqlEx;
    if(type==='NEWS') {
        sqlEx = 'select * from content.cntent where id=' + id+';';
    }
    else {
        sqlEx='select * from content.states where id='+id+';';
    }
    _sql.sqlQuerry2(sqlEx).then(data=>{


        res.end( JSON.stringify(data[0][0]));

    })
}
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


            res.end(JSON.stringify(news));

        })


    })

}
function getMaxStatesNumb(res){
    _sql.sqlQuerry2('select max(id) from content.states;').then(data=> {
        let dbInfo = data[0][0]['max(id)'];
        dbInfo=Number(dbInfo);
        res.end(""+dbInfo);
    })
}
//function  re(id,path='C:\\Users\\Вадим\\WebstormProjects\\untitled8\\imgData\\') {

//}
function getHeaderData(maxNumb,res){

    let sqlEx ='select id,Header from content.cntent where id = (select mainNewId from content.main_new  where id=0);'
    _sql.sqlQuerry2(sqlEx).then(data=> {

       res.end(JSON.stringify({numb:maxNumb,mainNews:data[0][0].Header,id_:data[0][0].id}))
        console.log(data[0][0]);

    })

}
function getImg(id,res){
    let path = "C:\\Users\\Вадим\\WebstormProjects\\untitled8\\imgData\\"+id+"\\"+1+".jpg";

        fs.readFile(path,function (err,data) {
            if(err){console.log( err)}
            else {
                res.writeHead(200,{'Content-Type': 'image/jpg;'});
                res.end(data);
            }

        })


}
let indextList = '',buf=0;
_sql.sqlQuerry2('select max(id) from content.cntent;').then(data=> {
    let dbInfo = data[0][0]['max(id)'];

    var server = http.createServer((req, res) => {




//req.use(cookieParser('secret'));


        if(/^\/giveMeImg=[1-90]+$/.test(req.url)){
            getImg(Number(req.url.substr(11,)),res);
            return;
        }


        if(req.url==='/maxStates'){
            getMaxStatesNumb(res)
            return;
        }

        if(req.url==='/register'){
            req.on('data',(data=>{
                let a = JSON.parse(data);
                console.log(a.valuePass);
            }))

            req.on('end',()=>{
              // res.cookie('Ivan','dfgdfg')

            })
            return;
        }
        if(/^\/giveMeInfoStr=[А-Я-а-яі\s]+$/.test(decodeURI(req.url))){
            let a =decodeURI(req.url);
            a=a.substr(15,)
            searchInfo(a,res);
            return;
        }







        if(/^\/giveMeInfoStatId=[0-9]+$/.test(req.url)){
            getInfoById(Number(req.url.substr(18,)),res,'STATE')

            return;
        }
        if(/^\/giveMeInfoNewsId=[0-9]+$/.test(req.url)){
            getInfoById(Number(req.url.substr(18,)),res,'NEWS')

            return;
        }
        if(/^\/getNewInfoId=[0-9]+$/.test(req.url)){

            getNextInfo(Number(req.url.substr(14,)),res,'NEWS');
            return;
        }
        if(/^\/getStaInfoId=[0-9]+$/.test(req.url)){
            getNextInfo(Number(req.url.substr(14,)),res,'STATES');
            return;
        }

        if(req.url==='/logoL'){
            getLogo(res);
            return;

        }


        if (req.url ==='/takeLastState'||req.url==='/SET_MAIN_LIST_STATES'){
            getLastNewsStates(res);
            return;
        }


        if ((/^\/[0-9]+/.test(req.url) || req.url === '/') && (numbList(res,req.url)<=dbInfo/3)){

            indextList = numbList(res, req.url);
            html(res,'\\myhml.html').pipe(res);
            return;
        }



        if(/^\/p[1-3]\.new[0-9]+$/.test(req.url)){
            buf=Number(req.url[2]);


            html(res,'\\blockHtml.html').pipe(res);
            return;
        }
        if(/^\/id=[0-9]+$/.test(req.url) ){

            set_new(res,buf,Number(req.url.substr(req.url.search(/=/)+1,req.url.length-1)));
            return;
        }
        if(req.url==='/bundle.js'){
            fs.createReadStream("C:\\Users\\Вадим\\WebstormProjects\\untitled19\\dist\\bundle.js").pipe(res);
            return;
        }
        if(req.url==='/listPosition'){
            res.end(''+dbInfo);
        }
        if(req.url==='/id'){
            res.end(''+indextList);
            return;
        }




        if (/^\/p[1-3]$/.test(req.url)) {

            set_blocks(Number(req.url[2]),res,indextList);
            return;
        }

        if (req.url === '/myStyle.css') {
            css(req, res);
            return;
        }

        if(req.url==='/headerInfo'){

            getHeaderData(dbInfo,res);
           // res.end(JSON.stringify({numb:dbInfo,mainNews:"Chornobil gorit",id_:}))
            return;
        }
        if(req.url==='/lastNews'||req.url==='/SET_MAIN_LIST_NEWS'){
            getLastNewsBlocks(res);
            return;

        }
        if(/^\/i[1-3]$/.test(req.url)){

            setImg(res,Number(req.url[2]),indextList,true);
            return;
        }
        if(/^\/imgBlock=[1-9]+$/.test(req.url)){

            setImg(res,Number(req.url.substr(req.url.search(/=/)+1,req.url.length-1)),0,false);
            return;
        }
        else {
            if (req.url != (/^\/[0-9]+/.test(req.url) || req.url == '/')) {
                res.writeHead(404);
                res.end();
            }
        }


        console.log(decodeURI(req.url));
    });
    server.listen(8080, '127.0.0.1');
});
