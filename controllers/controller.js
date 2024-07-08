const Model = require("../models/model")

class Controller {
    static async home(req, res) {
        try {
            res.render('index')
        } catch (error) {
            res.send(error)
        }
    }

    static async authors(req, res) {
        try {
            let data = await Model.authors()
            res.render('authors', {data})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async detail(req, res) {
        try {
            let data = await Model.detail()
            res.render('authorDetails', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async posts(req, res) {
        try {
            let {search} = req.query
            let data = await Model.posts(search)
            res.render('posts', {data})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async postDetail(req, res) {
        try {
            let {id} = req.params
            let data = await Model.postDetail(id)
            res.render('postDetail', {data})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async postAdd(req, res) {
        try {
            let {errors} = req.query
            let data = await Model.authors()
            res.render('postAdd', {data, errors})
        } catch (error) {
            res.send(error)
        }
    }
    
    static async handlerPostAdd(req, res) {
        try {
            let { title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description } = req.body
            await Model.handlerPostAdd(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description)
            res.redirect('/posts')
        } catch (error) {
            if(error.name === "ValidationError") {
                res.redirect(`/posts/add?errors=${error.errors}`)
            } else {
                res.send(error)
            }
        }
    }

    static async postEdit(req, res) {
        try {
            let {errors} = req.query
            let {id} = req.params
            let authors = await Model.authors()
            let data = await Model.postDetail(id)
            res.render('postEdit', {data, authors, errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerPostEdit(req, res) {
        try {
            let {id} = req.params
            let { title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description, totalVote } = req.body
            await Model.handlerPostEdit(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description, totalVote, id)
            res.redirect('/posts')
        } catch (error) {
            let {id} = req.params
            if(error.name === 'ValidationError') {
                res.redirect(`/posts/${id}/edit?errors=${error.errors}`)
            } else {
                res.send(error)
            }
        }
    }

    static async postDelete(req, res) {
        try {
            let {id} = req.params
            await Model.postDelete(id)
            res.redirect('/posts')
        } catch (error) {
            res.send(error)
        }
    }
    
    static async vote(req, res) {
        try {
            let {id} = req.params
            await Model.vote(id)
            res.redirect(`/posts/${id}`)
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller