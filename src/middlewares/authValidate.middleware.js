import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";

export async function createUserValidate(req, res, next){
    const { name, email, password, confirmPassword } = req.body;

    try{
        if(password !== confirmPassword){
            return res.sendStatus(422);
        }

        const user = await db.query(`
            SELECT * FROM users WHERE email=$1
        `, [email]);
        if(user.rowCount !== 0){
            return res.sendStatus(409);
        }

        next();
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function signInValidate(req, res, next){
    const { email, password } = req.body;
    try{
        console.log("teste")
        const user = await db.query(`
            SELECT * FROM users WHERE email=$1
        `, [email]);
        console.log(user);
        if(user.rowCount === 0) {
            return res.sendStatus(401)
        }   

        console.log(user.rows[0].password);

        const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].password)
        if(!isPasswordCorrect){
            return res.status(401).send("Senha incorreta")
        }
        next();
    }catch(err){
        res.status(500).send(err.message);
    }
}

export async function authorizationValidate(req, res, next){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)
     
    next();
}