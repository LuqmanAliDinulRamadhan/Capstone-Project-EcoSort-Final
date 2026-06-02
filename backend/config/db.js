const mysql = require('mysql2/promise');
require('dotenv').config(); 

// Koneksi awal
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false } 
});

const initDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'ecosort_db';
    
    // 1. Bikin database otomatis kalau belum ada
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    
    // 2. Arahkan koneksi ke database tersebut
    await pool.query(`USE \`${dbName}\`;`);
    
    // 3. Bikin tabel history klasifikasi
    await pool.query(`
      CREATE TABLE IF NOT EXISTS histories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_sampah VARCHAR(255) NOT NULL,
        kategori VARCHAR(100) NOT NULL,
        akurasi VARCHAR(50) NOT NULL,
        tanggal_scan TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log(`Database MySQL terhubung & Tabel siap! 🚀`);
  } catch (error) {
    console.error('Gagal inisialisasi database:', error);
  }
};

initDB();

// Export koneksi
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

module.exports = db;