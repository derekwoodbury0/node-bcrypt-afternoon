const express = require('express')
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const app = express()
const port = 4000
let authCtrl = require('./controllers/authController')
let treasureCtrl = require('./controllers/treasureController')
let auth = require('./middleware/authMiddleware')

const { SESSION_SECRET, CONNECTION_STRING } = process.env

app.use(express.json())
app.use(session ({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

massive(CONNECTION_STRING).then(db => {
    app.set ('db', db)
    app.listen(port, () => console.log(`listening on port ${port}`))
})

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)
