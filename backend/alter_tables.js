const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'mysql-eventmanagement1-kelinguma-ce4.b.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_i5CnDi3pQ8hbhfibvn5',
    database: 'defaultdb',
    port: 27472,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Tables:', tables);

    // Let's use the actual table names (usually singular if Hibernate created them by default)
    try { await connection.execute('ALTER TABLE event MODIFY COLUMN cover_image LONGTEXT'); console.log('event table updated.'); } catch(e) { console.log(e.message); }
    try { await connection.execute('ALTER TABLE user MODIFY COLUMN profile_pic LONGTEXT'); console.log('user table updated.'); } catch(e) { console.log(e.message); }
    try { await connection.execute('ALTER TABLE users MODIFY COLUMN profile_pic LONGTEXT'); console.log('users table updated.'); } catch(e) { console.log(e.message); }
    try { await connection.execute('ALTER TABLE organizer_profile MODIFY COLUMN logo_url LONGTEXT'); console.log('organizer_profile table updated.'); } catch(e) { console.log(e.message); }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

main();
