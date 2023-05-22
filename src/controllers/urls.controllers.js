import { nanoid } from 'nanoid'
import { db } from '../database/database.connection.js';


export async function createUrlShorten(req, res) {
    const { url } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        //const shortUrl = "teste";
        const shortUrl = nanoid(8);

        const session = await db.query(`
            SELECT * FROM sessions WHERE token=$1;
        `, [token]);

        if (session.rowCount === 0) {
            return res.sendStatus(401);
        }

        await db.query(`
            INSERT INTO shorten (url, "shortUrl", "visitCount", "idUser")
                VALUES ($1,$2, $3, $4);
        `, [url, shortUrl, 0, session.rows[0].idUser]);

        const shorten = await db.query(`
            SELECT * FROM shorten WHERE "shortUrl"=$1;
        `, [shortUrl]);

        const returnObject = {
            id: shorten.rows[0].id,
            shortUrl: shortUrl
        }

        res.status(201).send(returnObject);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params;

    try {
        const shorten = await db.query(`
            SELECT * FROM shorten WHERE id=$1;
        `, [id]);

        if (shorten.rowCount === 0) {
            return res.sendStatus(404);
        }

        const returnObject = {
            id: shorten.rows[0].id,
            shortUrl: shorten.rows[0].shortUrl,
            url: shorten.rows[0].url
        };

        res.status(200).send(returnObject);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getShortUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const shorten = await db.query(`
            SELECT * FROM shorten WHERE "shortUrl"=$1;
        `, [shortUrl]);

        if (shorten.rowCount === 0) {
            return res.sendStatus(404);
        }

        const newVisitCount = shorten.rows[0].visitCount + 1;
        await db.query(`
            UPDATE shorten
            SET "visitCount"=$1
            WHERE "shortUrl"=$2;
        `, [newVisitCount, shortUrl]);

        const url = shorten.rows[0].url;

        res.redirect(url);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteUrls(req, res) {
    const { id } = req.params;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.query(`
            SELECT * FROM sessions WHERE token=$1;
        `, [token]);

        if (session.rowCount === 0) {
            return res.sendStatus(401);
        }

        const shorten = await db.query(`
            SELECT * FROM shorten WHERE id=$1;
        `, [id]);

        if (shorten.rowCount === 0) {
            return res.sendStatus(404)
        }

        if (session.rows[0].idUser !== shorten.rows[0].idUser) {
            return res.sendStatus(401);
        }

        await db.query(`
            DELETE FROM shorten WHERE id=$1;
        `, [id]);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getUserMe(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);
    try {
        const session = await db.query(`
            SELECT * FROM sessions WHERE token=$1;
        `, [token]);

        if (session.rowCount === 0) {
            return res.sendStatus(401);
        }

        const user = await db.query(`
            SELECT * FROM users WHERE id=$1;
        `, [session.rows[0].idUser]);
        
        const shorten = await db.query(`
            SELECT * FROM shorten WHERE "idUser"=$1;
        `, [session.rows[0].idUser]);

        const some = await db.query(`
            SELECT SUM("visitCount") FROM shorten WHERE "idUser"=$1;
        `, [session.rows[0].idUser]);


        const returnObject = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            visitCount: some.rows[0].sum,
            shortenedUrls: shorten.rows
        };
        res.send(returnObject);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getRanking(req, res){
    try {
        const numsei2 = await db.query(` 
            SELECT *
            FROM shorten
            ORDER BY "visitCount" DESC
            LIMIT 10;
        `);

        res.send(numsei2.rows);
    }catch(err){
        res.status(500).send(err.message);
    }
}