import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"

export async function createUser(req, res){
    const { name, email, password, confirmPassword } = req.body;

    try{
        const hash = bcrypt.hashSync(password, 10)

        await db.query(`
            INSERT INTO users (name, email, password)
                VALUES ($1,$2, $3);
        `, [name, email, hash]);
        res.sendStatus(201);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function getUser(req, res){
    try{
        const users = await db.query(`
            SELECT * FROM users
        `);
        res.send(users);
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {
        const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);

        const token = uuid();
        await db.query(`
            INSERT INTO sessions ( token, "idUser") 
                VALUES ($1, $2)
        `, [token, user.rows[0].id]);
        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err.message);
    }
}
