const pool = require("../config/db");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.execute(
        `SELECT m.*, c.name AS categoryName
                FROM movies m
                LEFT JOIN categories c ON m.categoryId = c.id
                ORDER BY m.id DESC`,
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  getById: async(req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const [rows] = await pool.execute(
            `SELECT m.*, c.name AS categoryName
            FROM movies m
            LEFT JOIN categories c ON m.categoryId = c.id
            WHERE m.id = ?`, [id]
        );
        if (rows.length === 0) return res.status(404).json({message : 'Movie Tidak DItemukan'});
        res.json(rows[0]);
    }   catch (err) { next(err); }
  },

create: async (req, res, next) => {
    try {
        const { title, year, categoryId } = req.body;
        const userId = req.user ? req.user.id : null;

        const [results] = await pool.execute(
            'INSERT INTO movies (title, year, categoryId, userId) VALUES (?, ?, ?, ?)',
            [title, year ? String(year) : null, categoryId ? String(categoryId) : null, userId ? String(userId) : null]
        );

        res.status(201).json({
            message: 'Movie berhasil ditambahkan',
            id: results.insertId
        });
    } catch (err) {
        next(err);
    }
},   

  update: async(req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const { title, year, categoryId } = req.body;

        const fields = [];
        const values = [];
        if(title !== undefined) {fields.push('title = ?'); values.push(title);}
        if(year !== undefined) {fields.push('year = ?'); values.push(year);}
        if(categoryId !== undefined) {fields.push('categoryId = ?'); values.push(categoryId);}

        if (fields.length === 0) return res.status(400).json({message : 'Nothing To Update'});

        values.push(id);
        const sql = `UPDATE movies SET ${fields.join(',')} WHERE id = ?`;
        const [results] = await pool.execute(sql, values);
        if (results.affectedRows === 0) return res.status(404).json({message : 'Movie Tidak Ditemukan'});
        res.json({ message : 'Movie Diperbarui'}); 
    }   catch (err) { next(err); }
  },


  remove: async(req, res, next) => {
    try{
        const id = parseInt(req.params.id, 10);
        const [results] = await pool.execute('DELETE FROM movies WHERE id = ?', [id]);
        if (results.affectedRows === 0) return res.status(404).json({message : 'Movie Tidak Ditemukan'});
        res.json({message : 'Movie Dihapus'})
    }catch (err) {next(err);}
  }
};
