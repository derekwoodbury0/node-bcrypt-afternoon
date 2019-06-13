let bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        let { username, password, isAdmin } = req.body
        let db = req.app.get('db')

        let result = await db.get_user(username)
        let existingUser = result[0]

        if (existingUser) {
            res.status(409).send('Username taken')
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        let registeredUser = await db.register_user(isAdmin, username, hash)
        let user = registeredUser[0]

        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }

        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        let { username, password } = req.body
        let db = req.app.get('db')

        let foundUser = await db.get_user([username])
        let user = foundUser[0]

        if (!user) {
            return res.status(401).send('User not found. Please register as a new user before logging in')
        }

        let isAuthenticated = bcrypt.compareSync(password, user.hash)

        if (!isAuthenticated) {
            return res.status(403).send('Incorrect password')
        }

        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }

        return res.send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        return res.sendStatus(200)
    }
}