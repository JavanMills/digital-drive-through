const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const initializeDatabase = async () => {
    try {
        // Read the schema file
        const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema
        await pool.query(schema);
        console.log('Database schema initialized successfully');

        // Close the pool
        await pool.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

// Run the initialization
initializeDatabase(); 