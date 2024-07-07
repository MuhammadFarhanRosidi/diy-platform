const Controller = require('../controllers/controller')

const router = require('express').Router()

router.get('/', Controller.authors)
router.get('/detail', Controller.detail)

module.exports = router