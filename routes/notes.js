import express from 'express';
import db from '../db.js';

const router = express.Router();

// Membuat notes baru
router.post('/', async (req, res) => {
    const { title, datetime, note } = req.body;
    const sql = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
    try {
        const [result] = await db.execute(sql, [title, datetime, note]);
        res.status(201).json({ message: 'Note created successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Menampilkan semua notes
router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM notes';
    try {
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Menampilkan salah satu notes
router.get('/:id', async (req, res) => {
    const sql = 'SELECT * FROM notes WHERE id = ?';
    try {
        const [rows] = await db.execute(sql, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Note not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mengubah notes
router.put('/:id', async (req, res) => {
    const { title, datetime, note } = req.body;
    const sql = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
    try {
        const [result] = await db.execute(sql, [title, datetime, note, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Menghapus notes
router.delete('/:id', async (req, res) => {
    const sql = 'DELETE FROM notes WHERE id = ?';
    try {
        const [result] = await db.execute(sql, [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
