const mysqlConfig = {
    host:'localhost',
    user:'root',
    password:'',
    database:'auth_server',
    port:3306,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
};

module.exports = mysqlConfig;