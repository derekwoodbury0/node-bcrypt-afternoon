module.exports = {
    dragonTreasure: async (req, res) => {
        let treasure = await req.app.get('db').get_dragon_treasure(1)
        return res.status(200).send(treasure)
    },
    getUserTreasure: async (req, res) => {
        let userTreasure = await req.app.get('db').get_user_treasure([req.session.user.id])

        return res.status(200).send(userTreasure)
    },
    addUserTreasure: async (req, res) => {
        let {treasureURL} = req.body
        let { id } = req.session.user

        let userTreasure = await req.app.get('db').add_user_treasure(treasureURL, id)

        return res.status(200).send(userTreasure)
    },
    getAllTreasure: async (req, res) => {
        let allTreasure = await req.app.get('db').get_all_treasure()
        return res.status(200).send(allTreasure)
    }
} 