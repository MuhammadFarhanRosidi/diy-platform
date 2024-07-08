const pool = require("../setup/connection")
const { AuthorDetail, PostDetail } = require("./class")

class Model{
    static async authors() {
        try { //!ururtkan id
            let query = `
            SELECT * FROM "Authors"
            ORDER BY id
            `
            let { rows } = await pool.query(query)
            rows = rows.map(el => new AuthorDetail(el.id, el.fullName, el.gender))
            return rows
        } catch (error) {
            throw(error)
        }
    }
    
    static async detail() {
        try {
            let query = `
            SELECT a.id, a."fullName", a.gender, COALESCE(count(p.id), 0) AS "totalPost", COALESCE (SUM(p."totalVote"), 0) AS "totalVote", CAST(COALESCE(avg(p."estimatedTime"), 0) AS FLOAT) AS "averageTime"
            FROM "Authors" a
            LEFT JOIN "Posts" p
            ON p."AuthorId" = a.id
            GROUP BY a.id
            ORDER BY a.id
            `
            let { rows } = await pool.query(query)
            rows = rows.map(el => new AuthorDetail(el.id, el.fullName, el.gender, el.totalPost, el.totalVote, el.averageTime))
            return rows
        } catch (error) {
            throw(error)
        }
    }

    static async posts(search) {
        try {
            let query = `
            SELECT p.*, a."fullName" AS "authorName"
            FROM "Posts" p 
            INNER JOIN "Authors" a 
            ON a.id = p."AuthorId"
            `
            if(search) {
                query += ` WHERE p.title ILIKE '%${search}%'`
            }
            query += ` ORDER BY "totalVote" DESC`
            let { rows } = await pool.query(query)
            rows = rows.map(el => new PostDetail(el.id, el.title, el.difficulty, el.totalVote, el.estimatedTime, el.description, el.imageUrl, el.createdDate, el.AuthorId, el.authorName))
            return rows
        } catch (error) {
            throw(error)
        }
    }

    static async postDetail(id) {
        try {
            let query = `
            SELECT p.*, a."fullName" AS "authorName"
            FROM "Posts" p
            INNER JOIN "Authors" a 
            ON a.id = p."AuthorId" 
            WHERE p.id = ${id};
            `
            let { rows } = await pool.query(query)
            return new PostDetail(rows[0].id, rows[0].title, rows[0].difficulty, rows[0].totalVote, rows[0].estimatedTime, rows[0].description, rows[0].imageUrl, rows[0].createdDate, rows[0].AuthorId, rows[0].authorName)
        } catch (error) {
            throw(error)
        }
    }

    static async handlerPostAdd(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description) {
        try {
            let errors = await Model.validation(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description)
            if(errors.length) {
                throw {name: 'ValidationError', errors}
            }
            let query = `
            INSERT INTO "Posts" (title, difficulty, "estimatedTime", description, "totalVote", "imageUrl", "createdDate", "AuthorId")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `
            await pool.query(query, [title, difficulty, estimatedTime, description, 0, imageUrl, createdDate, AuthorId])
            return
        } catch (error) {
            throw(error)
        }
    }
    
    static async handlerPostEdit(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description, totalVote, id) {
        try {
            let errors = await Model.validation(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description)
            if(errors.length) {
                throw {name: 'ValidationError', errors}
            }
            let query = `
            UPDATE "Posts" 
            SET title = $1,
                difficulty = $2,
                "estimatedTime" = $3,
                description = $4,
                "totalVote" = $5,
                "imageUrl" = $6,
                "createdDate" = $7,
                "AuthorId" = $8
            WHERE id = $9;
            `
            await pool.query(query, [title, difficulty, estimatedTime, description, totalVote, imageUrl, createdDate, AuthorId, id])
            return
        } catch (error) {
            throw(error)
        }
    }

    static async postDelete(id) {
        try {
            let query = `
            DELETE FROM "Posts" 
            WHERE id = $1;
            `
            await pool.query(query, [id])
            return
        } catch (error) {
            throw(error)
        }
    }

    static async vote(id) {
        try {
            let query = `
            UPDATE "Posts" 
            SET "totalVote" = "totalVote" + 1
            WHERE id = $1;
            `
            await pool.query(query, [id])
            return
        } catch (error) {
            throw(error)
        }
    }

    static async validation(title, AuthorId, difficulty, estimatedTime, imageUrl, createdDate, description) {
        try {
            let errors = []
            let date = new Date(createdDate)
            let dateNow = new Date()
            let descriptionInput = description
            let words = descriptionInput.split(" ")
            if(!title) {
                errors.push("Title is required")
            } else if(title.length > 100) {
                errors.push("Post title maximum character is 100")
            }
            if(!AuthorId) {
                errors.push("Author is required")
            }
            if(!difficulty) {
                errors.push("Difficulty is required")
            }
            if(!estimatedTime) {
                errors.push("Estimated Time is required")
            } else if(estimatedTime < 5) {
                errors.push("Minimum estimated time is 5 minutes")
            }
            if(!imageUrl) {
                errors.push("Image Url is required")
            }
            if(!createdDate) {
                errors.push("Created Date is required")
            } else if(date > dateNow) {
                errors.push("Maximum created date is today")
            }
            if(!description) {
                errors.push("Description is required")
            } else if(words.length < 10) {
                errors.push("Minimum word in description is 10")
            }
            return errors
        } catch (error) {
            throw(error)
        }
    }
}

module.exports = Model