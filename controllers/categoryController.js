const pool = require("../config/db");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM categories ORDER BY id DESC",
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [rows] = await pool.execute(
        "SELECT * FROM categories WHERE id = ?",
        id,
      );
      if (rows.length === 0)
        return res.status(404).json({ message: "Category tidak ditemukan" });
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const userId = req.user ? req.user.id : null;

      const [results] = await pool.execute(
        "INSERT INTO categories (name, description, userId) VALUES(?, ?, ?)",
        [name, description || null, userId],
      );
      res
        .status(201)
        .json({ id: results.insertId, name, description: description || null });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, description } = req.body;

      //build dynamic update
      const fields = [];
      const values = [];
      if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
      }
      if (description !== undefined) {
        fields.push("description = ?");
        values.push(description);
      }

      if (fields.length === 0)
        return res.status(400).json({ message: "Nothing To Update" });

      values.push(id);
      const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
      const [results] = await pool.execute(sql, values);

      if (results.affectedRows === 0)
        return res.status(404).json({ message: "category tidak ditemukan" });
      res.json({ message: "Category Diperbarui" });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [results] = await pool.execute(
        "DELETE FROM categories WHERE id = ?",
        [id],
      );
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Category tidak ditemukan" });
      res.json({ message: "Category dihapus" });
    } catch (err) {
      next(err);
    }
  },
};
