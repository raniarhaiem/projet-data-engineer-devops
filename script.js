// Importing the Axios library for making HTTP requests
const axios = require('axios');
// Importing the mysql2/promise library to interact with MySQL asynchronously
const mysql = require('mysql2/promise');
// Importing the Express framework for creating web applications with Node.js
const express = require('express');
// Importing middleware for Express.js applications to generating Prometheus metrics
const promBundle = require('express-prom-bundle');

// Creating an instance of the Express application
const app = express();
// Creating a middleware instance 
const metricsMiddleware = promBundle({ includeMethod: true });

// Defining the port number on which the Express application will listen Use the PORT environment variable if set, or default to 3000
const port = process.env.PORT || 3000;

//Imports a configuration object from a module named config.
const config = require('./config');

// MySQL Database Connection Configuration
const dbConfig = config.dbConfig;


//integrates the middleware into your Express.js application
app.use(metricsMiddleware);


// Function to fetch data from the API
async function fetchDataFromAPI() {
  try {
    const response = await axios.get('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/arbresremarquablesparis/records/?limit=20');
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data from API: ${error.message}`);
  }
}

async function createTable() {
  // Establish a connection to the MySQL database using the provided configuration
  const connection = await mysql.createConnection(dbConfig);
  try {
    // Define the table creation query
    const tableQuery = `
      CREATE TABLE IF NOT EXISTS test_data (
        id int NOT NULL AUTO_INCREMENT,
        geom_lon decimal(10,8) DEFAULT NULL,
        geom_lat decimal(10,8) DEFAULT NULL,
        arbres_idbase int DEFAULT NULL,
        arbres_domanialite varchar(255) DEFAULT NULL,
        arbres_arrondissement varchar(255) DEFAULT NULL,
        arbres_complementadresse varchar(255) DEFAULT NULL,
        arbres_numero varchar(255) DEFAULT NULL,
        arbres_adresse varchar(255) DEFAULT NULL,
        arbres_circonferenceencm int DEFAULT NULL,
        arbres_hauteurenm int DEFAULT NULL,
        arbres_stadedeveloppement varchar(255) DEFAULT NULL,
        arbres_pepiniere varchar(255) DEFAULT NULL,
        arbres_genre varchar(255) DEFAULT NULL,
        arbres_espece varchar(255) DEFAULT NULL,
        arbres_varieteoucultivar varchar(255) DEFAULT NULL,
        arbres_dateplantation datetime DEFAULT NULL,
        arbres_libellefrancais varchar(255) DEFAULT NULL,
        com_idbase int DEFAULT NULL,
        com_idarbre int DEFAULT NULL,
        com_site varchar(255) DEFAULT NULL,
        com_adresse varchar(255) DEFAULT NULL,
        com_complement_adresse varchar(255) DEFAULT NULL,
        com_arrondissement varchar(255) DEFAULT NULL,
        com_domanialite varchar(255) DEFAULT NULL,
        com_nom_usuel varchar(255) DEFAULT NULL,
        com_nom_latin varchar(255) DEFAULT NULL,
        com_autorite_taxo varchar(255) DEFAULT NULL,
        com_annee_plantation varchar(255) DEFAULT NULL,
        com_qualification_rem varchar(255) DEFAULT NULL,
        com_resume text,
        com_descriptif text,
        com_delib_num varchar(255) DEFAULT NULL,
        com_delib_date varchar(255) DEFAULT NULL,
        com_label_arbres varchar(255) DEFAULT NULL,
        com_url_pdf varchar(255) DEFAULT NULL,
        com_url_photo1 varchar(255) DEFAULT NULL,
        com_copyright1 varchar(255) DEFAULT NULL,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
    `;
    // Execute the table creation query
    await connection.query(tableQuery);
    console.log('Table test_data created successfully.');
  } catch (error) {
    console.error(`Error creating table: ${error.message}`);
  } finally {
    // Close the database connection
    await connection.end();
  }
}

// Run the function to create the table
createTable();

// Function to insert data into MySQL
async function insertDataIntoMySQL(data) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    // Insert data into the MySQL database
    for (const result of data.results) {
      const {
        arbres_idbase,
        geom_x_y: { lon, lat },
        arbres_domanialite,
        arbres_arrondissement,
        arbres_complementadresse,
        arbres_numero,
        arbres_adresse,
        arbres_circonferenceencm,
        arbres_hauteurenm,
        arbres_stadedeveloppement,
        arbres_pepiniere,
        arbres_genre,
        arbres_espece,
        arbres_varieteoucultivar,
        arbres_dateplantation,
        arbres_libellefrancais,
        com_idbase,
        com_idarbre,
        com_site,
        com_adresse,
        com_complement_adresse,
        com_arrondissement,
        com_domanialite,
        com_nom_usuel,
        com_nom_latin,
        com_autorite_taxo,
        com_annee_plantation,
        com_qualification_rem,
        com_resume,
        com_descriptif,
        com_delib_num,
        com_delib_date,
        com_label_arbres,
        com_url_pdf,
        com_url_photo1,
        com_copyright1,
      } = result;
      // Format date 
      const formattedDate = arbres_dateplantation ? new Date(arbres_dateplantation).toISOString().slice(0, 19).replace('T', ' ') : null;
      await connection.execute(
        'INSERT INTO test_data (arbres_idbase, geom_lon, geom_lat, arbres_domanialite, arbres_arrondissement, arbres_complementadresse, arbres_numero, arbres_adresse, arbres_circonferenceencm, arbres_hauteurenm, arbres_stadedeveloppement, arbres_pepiniere, arbres_genre, arbres_espece, arbres_varieteoucultivar, arbres_dateplantation, arbres_libellefrancais, com_idbase, com_idarbre,com_site, com_adresse, com_complement_adresse, com_arrondissement, com_domanialite, com_nom_usuel, com_nom_latin, com_autorite_taxo, com_annee_plantation, com_qualification_rem, com_resume, com_descriptif, com_delib_num, com_delib_date, com_label_arbres, com_url_pdf, com_url_photo1, com_copyright1) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [arbres_idbase, lon, lat, arbres_domanialite, arbres_arrondissement, arbres_complementadresse, arbres_numero, arbres_adresse, arbres_circonferenceencm, arbres_hauteurenm, arbres_stadedeveloppement, arbres_pepiniere, arbres_genre, arbres_espece, arbres_varieteoucultivar, formattedDate, arbres_libellefrancais, com_idbase, com_idarbre, com_site, com_adresse, com_complement_adresse, com_arrondissement, com_domanialite, com_nom_usuel, com_nom_latin, com_autorite_taxo, com_annee_plantation, com_qualification_rem, com_resume, com_descriptif, com_delib_num, com_delib_date, com_label_arbres, com_url_pdf, com_url_photo1, com_copyright1]
      );
    }
    console.log('Data inserted into MySQL.');
  } catch (error) {
    throw new Error(`Error inserting data into MySQL: ${error.message}`);
  } finally {
    await connection.end();
  }
}




// Main function 
async function main() {
  try {
    const apiData = await fetchDataFromAPI();
    await insertDataIntoMySQL(apiData);
    console.log('Process completed.');
  } catch (error) {
    console.error(error.message);
  }
}


// ******************************Algorithms******************************//

// Define an API endpoint to get chart data: trees-by-genre 
// counts tree data by genre 
app.get('/api/trees-by-genre', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT arbres_genre, COUNT(*) as count FROM test_data GROUP BY arbres_genre');
    await connection.end();
    const genre = rows.map(row => row.arbres_genre);
    const treeCounts = rows.map(row => row.count);
    // Send the chart data as JSON
    res.json({ genre, treeCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define an API endpoint to get chart data: trees-by-arrondissement
// counts tree data by arrondissement
app.get('/api/trees-by-arrondissement', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT arbres_arrondissement, COUNT(*) as count FROM test_data GROUP BY arbres_arrondissement');
    await connection.end();
    const arrondissements = rows.map(row => row.arbres_arrondissement);
    const treeCounts = rows.map(row => row.count);
    res.json({ arrondissements, treeCounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define an API endpoint to get chart data: average-tree-height-by-district
// calculates the average height of trees in each arrondissement 
app.get('/api/average-tree-height-by-district', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT
        arbres_arrondissement as treeDistrict,
        AVG(arbres_hauteurenm) as averageTreeHeight
      FROM test_data
      WHERE arbres_arrondissement IS NOT NULL
        AND arbres_hauteurenm IS NOT NULL
      GROUP BY arbres_arrondissement
    `);
    await connection.end();
    const data = rows.map(row => ({
      treeDistrict: row.treeDistrict,
      averageTreeHeight: row.averageTreeHeight,
    }));
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Define an API endpoint to get chart data: top-tree-species
// counts how many tree in each species 
app.get('/api/top-tree-species', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(`
      SELECT
        arbres_espece as treeSpecies,
        COUNT(*) as treeCount
      FROM test_data
      WHERE arbres_espece IS NOT NULL
      GROUP BY treeSpecies
      ORDER BY treeCount DESC
    `);
    await connection.end();
    const data = {};
    rows.forEach(row => {
      data[row.treeSpecies] = row.treeCount;
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a default route for the root url
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chart.html');
});
//Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

main();
