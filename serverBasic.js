const express = require('express');
const res = require('express/lib/response');
const app = express();
const port = 3500;

app.get('/', (req, res)=>{
    var helloObj = {data:'hello world from Express'}
    var jsonResponse = JSON.stringify(helloObj);
    res.type('json' );
    //res.send(jsonResponse);
});

app.listen(port, ()=>{
    console.log(`Example app listenin on port ${port}`);
});
