const Controller = require('../controllers/controller')
const router = require('express').Router()
const routerAuthor = require('./authors')
const routerPosts = require('./posts')

router.get('/', Controller.home)
router.use('/authors', routerAuthor)
router.use('/posts', routerPosts)



module.exports = router