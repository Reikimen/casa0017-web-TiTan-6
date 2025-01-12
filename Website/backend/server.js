const express = require('express');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const mysql = require('mysql2/promise');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'mydatabase',
};

const placeTypes = {
  Buildings: 'Buildings',
  Accommodation: 'Accommodation',
};

// Using both a connection pool and a single connection
let pool;
let connection;

/* Before connec ting to the database, check if the port is in use and kill the process if necessary */
// Function to get the local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
      for (const alias of interfaces[iface]) {
          if (alias.family === 'IPv4' && !alias.internal) {
              return alias.address;
          }
      }
  }
  return 'localhost';
}

// Function to check and kill processes using the target port
function killPortProcess(port, callback) {
  const command = process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port}`;
  
  exec(command, (err, stdout, stderr) => {
      if (err || stderr) {
          console.error(`Error checking port ${port}:`, err || stderr);
          return callback(); // Continue starting the server even if no process is found
      }
      
      const lines = stdout.trim().split('\n');
      if (lines.length > 0) {
          console.log(`Port ${port} is in use. Attempting to close...`);
          // For Windows: Extract PID from the netstat output
          if (process.platform === 'win32') {
              lines.forEach(line => {
                  const match = line.match(/\d+$/);
                  if (match) {
                      const pid = match[0];
                      exec(`taskkill /PID ${pid} /F`, (err, stdout, stderr) => {
                          if (err) console.error(`Failed to kill process ${pid}:`, err || stderr);
                          else console.log(`Process ${pid} killed.`);
                      });
                  }
              });
          } else {
              // For Unix-based systems: Extract PID from lsof output
              lines.forEach(line => {
                  const match = line.match(/\b\d+\b/);
                  if (match) {
                      const pid = match[0];
                      exec(`kill -9 ${pid}`, (err, stdout, stderr) => {
                          if (err) console.error(`Failed to kill process ${pid}:`, err || stderr);
                          else console.log(`Process ${pid} killed.`);
                      });
                  }
              });
          }
      }
      callback();
  });
}

/* The ports are all not in use, so lets connect to the db */
// Connect to the database
const connectToDatabase = async () => {
  try {
    pool = await mysql.createPool(dbConfig);
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the MySQL database.');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

// Fetch data from Google Places API and insert into database
// Here is the Example Code (By default, the API returns up to 20 results)
const fetchDataFromGoogleAPI = async () => {
  try {
    console.log('Starting request to Google Places API...');
    const response = await axios.get(process.env.GMAP_SEARCH_ENDPOINT, {
      params: {
        key: process.env.GMAP_KEY,
        query: 'New York restaurant', // Example query, replace with your own
      },
    });
    console.log('Received response from Google Places API:', response.data);

    const data = response.data.results;

    try {
      await connection.beginTransaction();

      // Insert data into the database
      for (const item of data) {
        await connection.query('INSERT INTO places (gmap_id, name, address) VALUES (?, ?, ?)', [item.place_id, item.name, item.formatted_address]);
      }

      await connection.commit();
      console.log('Data inserted into the database successfully.');
    } catch (err) {
      await connection.rollback();
      console.error('Error during database transaction:', err);
      throw err;
    }

    console.log('Data fetched from Google Places API and inserted into the database.');
  } catch (err) {
    console.error('Error fetching data from Google Places API:', err);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('Request data:', err.request);
    } else {
      console.error('Error message:', err.message);
    }
  }
};

const getUCLBuildings = async () => {
  try {
    console.log('Starting request to Google Places API...');
    let results = [];
    let nextPageToken = null;

    do {
      const response = await axios.get(process.env.GMAP_SEARCH_ENDPOINT, {
        params: {
          key: process.env.GMAP_KEY,
          query: 'UCL Buildings', // Example query, replace with your own
          pagetoken: nextPageToken,
        },
      });

      console.log('Received response from Google Places API:', response.data);
      results = results.concat(response.data.results);
      nextPageToken = response.data.next_page_token;

      // Google Places API requires a short delay before using the next_page_token
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (nextPageToken);

    try {
      await connection.beginTransaction();

      // Insert data into the database
      for (const item of results) {
        await connection.query('INSERT INTO places (gmap_id, name, address) VALUES (?, ?, ?)', [item.place_id, item.name, item.formatted_address]);
      }

      await connection.commit();
      console.log('Data inserted into the database successfully.');
    } catch (err) {
      await connection.rollback();
      console.error('Error during database transaction:', err);
      throw err;
    }

    console.log('Data fetched from Google Places API and inserted into the database.');
  } catch (err) {
    console.error('Error fetching data from Google Places API:', err);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('Request data:', err.request);
    } else {
      console.error('Error message:', err.message);
    }
  }
};

const getAccommodations = async () => {
  try {
    console.log('Starting request to Google Places API...');
    let results = [];
    let nextPageToken = null;

    do {
      const response = await axios.get(process.env.GMAP_SEARCH_ENDPOINT, {
        params: {
          key: process.env.GMAP_KEY,
          query: 'student halls london ucl', // Example query, replace with your own
          pagetoken: nextPageToken,
        },
      });

      console.log('Received response from Google Places API:', response.data);
      results = results.concat(response.data.results);
      nextPageToken = response.data.next_page_token;

      // Google Places API requires a short delay before using the next_page_token
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (nextPageToken);

    try {
      await connection.beginTransaction();

      // Insert data into the database
      for (const item of results) {
        await connection.query('INSERT INTO places (gmap_id, name, address) VALUES (?, ?, ?)', [item.place_id, item.name, item.formatted_address]);
      }

      await connection.commit();
      console.log('Data inserted into the database successfully.');
    } catch (err) {
      await connection.rollback();
      console.error('Error during database transaction:', err);
      throw err;
    }

    console.log('Data fetched from Google Places API and inserted into the database.');
  } catch (err) {
    console.error('Error fetching data from Google Places API:', err);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('Request data:', err.request);
    } else {
      console.error('Error message:', err.message);
    }
  }
};


// Example function to call Google Geocoding API
const fetchGeocodeData = async (address) => {
  try {
    const response = await axios.get(process.env.GMAP_GEOCODE_ENDPOINT, {
      params: {
        key: process.env.GMAP_KEY,
        address: address,
      },
    });
    console.log('Received response from Google Geocoding API:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching data from Google Geocoding API:', err);
  }
};

// Example function to call Google Distance Matrix API
const fetchDistanceMatrixData = async (origins, destinations) => {
  try {
    const response = await axios.get(process.env.GMAP_DISTANCE_MATRIX_ENDPOINT, {
      params: {
        key: process.env.GMAP_KEY,
        origins: origins,
        destinations: destinations,
      },
    });
    console.log('Received response from Google Distance Matrix API:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching data from Google Distance Matrix API:', err);
  }
};

// Example function to call Google Time Zone API
const fetchTimeZoneData = async (location, timestamp) => {
  try {
    const response = await axios.get(process.env.GMAP_TIMEZONE_ENDPOINT, {
      params: {
        key: process.env.GMAP_KEY,
        location: location,
        timestamp: timestamp,
      },
    });
    console.log('Received response from Google Time Zone API:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching data from Google Time Zone API:', err);
  }
};

// Example function to call Google Static Maps API
const fetchStaticMap = async (center, zoom, size) => {
  try {
    const response = await axios.get(process.env.GMAP_STATICMAP_ENDPOINT, {
      params: {
        key: process.env.GMAP_KEY,
        center: center,
        zoom: zoom,
        size: size,
      },
      responseType: 'arraybuffer',
    });
    console.log('Received response from Google Static Maps API');
    return response.data;
  } catch (err) {
    console.error('Error fetching data from Google Static Maps API:', err);
  }
};

// Serve the front-end files
app.use(express.static(path.join(__dirname, '../front-end')));

// Example API endpoint
app.get('/api/example', (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

// New API endpoint to test Google Places API connection
app.get('/api/test-google-api', async (req, res) => {
  try {
    const response = await axios.get(process.env.GMAP_SEARCH_ENDPOINT, {
      params: {
        key: process.env.GMAP_KEY,
        query: 'UCL Buildings in London',
        location: '51.524559, -0.134040', // UCL's approximate latitude and longitude
        radius: 100000, // Search within 1000 meters
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching data from Google Places API:', err);
    res.status(500).json({ error: 'Error fetching data from Google Places API' });
  }
});

// Example database query
app.get('/', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    res.json({ message: 'Database connected!', result: rows[0].result });
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
          res.json({ success: false, message: 'Registration failed' });
      } else {
          res.json({ success: true });
      }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Log the received username and password
  console.log('Received username:', username);
  console.log('Received password:', password);

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
      if (err || results.length === 0) {
          res.json({ success: false, message: 'Login failed' });
      } else {
          const user = results[0];
          if (bcrypt.compareSync(password, user.password)) {
              res.json({ success: true });
          } else {
              res.json({ success: false, message: 'Login failed' });
          }
      }
  });
});


// killPortProcess(PORT, async () => { 
// });

// Start the server
app.listen(PORT, async () => {
    const localIP = getLocalIP(); // Get local IP address
    await connectToDatabase(); // Connect to the database
    await getUCLBuildings(); // Get UCL building information
    await getAccommodations(); // Get accommodation information
    console.log(`The local ip is http://${localIP}`); // Print the local IP address
    console.log(`Backend is now running on http://localhost:${PORT}`); // Print server startup information
});







