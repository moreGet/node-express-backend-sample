const express = require('express')
const app = express()
const serverPort = 3000

const server = app.listen(serverPort, () => {
  console.log('Start Server : localhost:' + serverPort)
})

// set html folder
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

// respond with "hello world" when a GET request is mode to the homepage
app.get('/', (req, res) => {
  res.render('index.html')
})

app.get('/about', (req, res) => {
  res.send('hello about!')
})

// DB CONNECTION
let mysql = require('mysql')
let pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '192.168.0.93',
  user            : 'root',
  password        : '123456',
  database        : 'test'
})

/**
 * MYSQL 고버전 + NODE JS 사용시 아래 에러가 생길 경우
 *
 * code: 'ER_NOT_SUPPORTED_AUTH_MODE',
 * errno: 1251,
 * sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
 * sqlState: '08004',
 * fatal: true
 *
 * 콘솔에서 아래 명령어를 입력
 * ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
 */
app.get('/db', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err // not connected!

    // Use the connection
    connection.query('SELECT * FROM test_table WHERE 1=1 LIMIT 10', (err, result, fields) => {
      if (result.length > 0) {
        res.send(JSON.stringify(result))
        // console.log('RESULT : ' + JSON.stringify(result))
        console.log('RESULT : ' + JSON.stringify(result.find(elem => elem.id >= 0)))
      } else {
        res.send('NO DATA')
        console.log('NO DATA')
      }

      // When done with the connection, release it.
      connection.release()

      // Don't user the connection here, it has been returned to the pool
    })
  })
})