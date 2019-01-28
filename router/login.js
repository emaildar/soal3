var router = require("express").Router();
var mysql = require('mysql')
var bodyParser = require("body-parser");
router.use(bodyParser.json());

var mysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'sekolahku'
})

mysql.connect(()=>{
    console.log('Database MySQL terhubung')
})

router.post("/signup", (req, res) => {
    var data = req.body;
    if ((req.body.hasOwnProperty('email') && req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password')) == false) {
        res.send("Signup Berhasil");
    }
    else {
        var sql = `select * from users where username = '${req.body.username}' OR email = '${req.body.email}'`;
        mysql.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            else if (result.length > 0) {
                res.send({
                    "signup": "failed",
                    "status": "Anda sudah terdaftar"
                });
            }
            else {
                var sql = `insert into users set ?`;
                mysql.query(sql, data, (err, result) => {
                    res.send({
                        "username": req.body.username,
                        "email": req.body.email,
                        "password": req.body.password,
                        "status": "Signup sukses"
                    });
                })
            }
        })
    }
});

router.post("/login", (req, res) => {
    if (req.body.hasOwnProperty('email') && req.body.hasOwnProperty('username')) {
        res.send("masukkan username dan password anda");
    }
    else if (!req.body.hasOwnProperty('password')) {
        res.send("masukkan password anda");
    }
    else {
        var sql = `select * from users where username = '${req.body.username}' or email = '${req.body.email}'`;
        mysql.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            else if (result == 0) {
                res.send({
                    "login": "failed",
                    "status": "Akun tidak terdaftar"
                });
            }
            else {
                if (req.body.password != result[0].password) {
                    res.send({
                        "login": "failed",
                        "status": "Password salah"
                    });
                }
                else {
                    res.send({
                        "login": "ok",
                        "status": "Login sukses"
                    });
                }
            }
        })
    }
});

module.exports = router;