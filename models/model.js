const pool = require("../setup/connection")
const { AuthorDetail, PostDetail } = require("./class")

class Model{
    static async authors() {
        try {
            let query = `
            SELECT * FROM "Authors"
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
            SELECT a.id, a."fullName", a.gender, COALESCE(count(p.id), 0) AS "totalPost", COALESCE (SUM(p."totalVote"), 0) AS "totalVote", CAST(COALESCE(avg(p."estimatedTime"), 0) AS DOUBLE PRECISION) AS "averageTime"
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
            SELECT p.* 
            FROM "Posts" p 
            `
            console.log(search)
            if(search) {
                query += `WHERE p.title ILIKE '%${search}%'`
            }
            query += `ORDER BY "totalVote" DESC`
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
            LEFT JOIN "Authors" a 
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
}

module.exports = Model