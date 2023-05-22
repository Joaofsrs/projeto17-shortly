import { db } from "../database/database.connection.js";

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
        const user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if(user.rowCount !== 0) {
            return res.sendStatus(400)
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.rows[0].password)
        if(!isPasswordCorrect) return res.status(401).send("Senha incorreta")
    }catch(err){
        res.status(500).send(err.message);
    }
}