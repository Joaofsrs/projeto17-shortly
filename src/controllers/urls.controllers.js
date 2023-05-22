import { nanoid } from 'nanoid'


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