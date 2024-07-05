const pool = require("./connection")
const fs = require("fs").promises;

(async () => {
    try {
        let author = JSON.parse(await fs.readFile("./data/authors.json", "utf8"))
        .map(el => {
            return `('${el.fullName}', '${el.gender}')`
        })
        let post = JSON.parse(await fs.readFile("./data/posts.json", "utf8"))
        .map(el => {
            return `('${el.title}', '${el.difficulty}', ${el.estimatedTime}, '${el.description}', ${el.totalVote}, '${el.imageUrl}', '${el.createdDate}', ${el.AuthorId})`
        })
        let insertAuthors = `
        INSERT INTO "Authors" ("fullName", gender)
        VALUES ${author}
        `
        let insertPosts = `
        INSERT INTO "Posts" (title, difficulty, "estimatedTime", description, "totalVote", "imageUrl", "createDate", "AuthorId")
        VALUES ${post}
        `
        await pool.query(insertAuthors)
        await pool.query(insertPosts)
        console.log("SUCCESS SEEDING")
    } catch (error) {
        console.log("ERROR SEEDING", error)
    }
})()