const pool = require("./connection");

(async () => {
    try {
        let createAuthors = `
        CREATE TABLE IF NOT EXISTS "Authors" (
            id SERIAL PRIMARY KEY,
            "fullName" VARCHAR(120) NOT NULL,
            gender VARCHAR(6) NOT NULL
        )
        `

        let createPosts = `
        CREATE TABLE IF NOT EXISTS "Posts" (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100),
            difficulty VARCHAR(6),
            "estimatedTime" INTEGER,
            description TEXT,
            "totalVote" INTEGER,
            "imageUrl" VARCHAR(100),
            "createdDate" DATE,
            "AuthorId" INTEGER,
                FOREIGN KEY("AuthorId")
                REFERENCES "Authors"("id")
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
        `

        let drop = `
        DROP TABLE IF EXISTS "Posts", "Authors"
        CASCADE
        `

        await pool.query(drop)
        console.log("SUCCESS DROP TABLE")
        await pool.query(createAuthors)
        console.log("SUCCESS CREATE TABLE AUTHORS 'Authors'")
        await pool.query(createPosts)
        console.log("SUCCESS CREATE TABLE 'Posts'")
    } catch (error) {
        console.log("ERROR CREATE TABLE", error)
    }
})()