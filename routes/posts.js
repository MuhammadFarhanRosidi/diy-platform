const Controller = require('../controllers/controller')

const router = require('express').Router()

router.get('/', Controller.posts)
router.get('/add', Controller.postAdd)
router.post('/add', Controller.handlerPostAdd)
router.get('/:id', Controller.postDetail)
router.get('/:id/edit', Controller.postEdit)
router.post('/:id/edit', Controller.handlerPostEdit)
router.get('/:id/delete', Controller.postDelete)
router.get('/:id/vote', Controller.vote)


module.exports = router