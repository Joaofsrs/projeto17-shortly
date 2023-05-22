import { nanoid } from 'nanoid'
import { db } from '../database/database.connection.js';


export async function createUrlShorten(req, res){
    const { url } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try{
        //const shortUrl = "teste";
        const shortUrl = nanoid(8);

        const session = await db.query(`
            SELECT * FROM sessions WHERE token=$1
        `, [token]);

        if(session.rowCount === 0){
            return res.sendStatus(401);
        }

        await db.query(`
            INSERT INTO shorten (url, "shortUrl", "visitCount", "idUser")
                VALUES ($1,$2, $3, $4);
        `, [url, shortUrl, 0, session.rows[0].idUser]);

        const shorten = await db.query(`
            SELECT * FROM shorten WHERE "shortUrl"=$1
        `, [shortUrl]);

        const returnObject = {
            id: shorten.rows[0].id,
            shortUrl: shortUrl
        }

        res.status(201).send(returnObject);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function getUrlById(req, res){
    const { id } = req.params;

    try{
        const shorten = await db.query(`
            SELECT * FROM shorten WHERE id=$1
        `, [id]);

        if(shorten.rowCount === 0){
            return res.sendStatus(404);
        }

        const returnObject = {
            id: shorten.rows[0].id,
            shortUrl: shorten.rows[0].shortUrl,
            url: shorten.rows[0].url
        };
        
        res.status(200).send(returnObject);
    }catch(err){
        res.status(500).send(err.message);
    }
}