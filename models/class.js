class Author {
    constructor(id, fullName, gender) {
        this.id = id
        this.fullName = fullName
        this.gender = gender
    }
}

class AuthorDetail extends Author {
    constructor(id, fullName, gender, totalPost, totalVote, averageTime) {
        super(id, fullName, gender)
        this.totalPost = totalPost
        this.totalVote = totalVote
        this.averageTime = averageTime
    }
}

class Post {
    constructor(id, title, difficulty, totalVote) {
        this.id = id
        this.title = title
        this.difficulty = difficulty
        this.totalVote = totalVote
    }
}

class PostDetail extends Post {
    constructor(id, title, difficulty, totalVote, estimatedTime, description, imageUrl, createdDate, AuthorId, authorName) {
        super(id, title, difficulty, totalVote)
        this.estimatedTime = estimatedTime
        this.description = description
        this.imageUrl = imageUrl
        this.createdDate = createdDate
        this.AuthorId = AuthorId
        this.authorName = authorName
    }
}

module.exports = { AuthorDetail, PostDetail }