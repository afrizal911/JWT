const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) throw new error('jwt secret belum diset');

const SALT_ROUNDS = 10;

module.exports = {
    register: async (req, res, next) => {
        try {
            const {email, password, name} = req.body;

            if(!email || !password) return res.status(400).json({ message : 'Email Dan Password Wajib'});
            if(password.length < 6) return res.status(400).json({message : 'Password minimal 6 karakter'});

            const[exiting] = await pool.execute('select id from users where email = ?', [email]);
            if (exiting.length > 0) {
                return res.status(409).json({message : 'Email Sudah Terdaftar'});
            }

            const hashed = await bcrypt.hash(password, SALT_ROUNDS);

            const [results] = await pool.execute(
                'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
                [email, name || null, hashed]
            );

            const insertId = results.insertId;
            return res.status(201).json({ id: insertId, email, name:name || null});
        }catch (err)    {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
         const { email, password } = req.body;
         if (!email || !password) return res.status(400).json({message : 'Email dan Password Wajin'});

         const [rows] = await pool.execute('SELECT * FROM users where email = ?', [email]);
         if(rows.length === 0) return res.status(401).json({message : 'Invalid Credentials'})
         
         const user = rows[0];

         const match = await bcrypt.compare(password, user.password);
         if (!match) return res.status(401).json({message : 'Invalid Credentials'});

        const payload = { id: user.id,  email: user.email};
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h'});

        return res.json({
            message : 'Login Berhasil',
            token,
            user : { id: user.id, email: user.email, name: user.name}
        });
        }   catch (err) {
            next(err);
        }
    }
}