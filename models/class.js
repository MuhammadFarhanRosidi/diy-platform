class Author {
    constructor(id, fullName, gender) {
        this.id = id
        this.fullName = fullName
        this.gender = gender
    }

    get formatName() {
        if (this.gender === "Male") {
            return `Mr. ${this.fullName}`
        } else {
            return `Ms. ${this.fullName}`
        }
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

    get formatCreatedDate() {
        const date = new Date(this.createdDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
}

module.exports = { AuthorDetail, PostDetail }