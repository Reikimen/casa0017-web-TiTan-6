-- Ensure the database exists and use it
CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

-- Table to store places (e.g., restaurants)
CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gmap_id VARCHAR(255) NOT NULL, -- Unique ID from Google Maps
    name VARCHAR(255) NOT NULL, -- Name of the place
    address TEXT NOT NULL, -- Address of the place
    location POINT, -- Latitude and longitude of the place (optional)
    UNIQUE KEY unique_gmap_id (gmap_id) -- Ensure gmap_id is unique
);

-- Table to store routes between places (if needed)
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origin_id INT NOT NULL, -- Foreign key to the origin place
    destination_id INT NOT NULL, -- Foreign key to the destination place
    duration INT NOT NULL, -- Travel duration in seconds
    distance_meters INT NOT NULL, -- Distance in meters
    encoded_polyline TEXT NOT NULL, -- Encoded polyline for the route
    FOREIGN KEY (origin_id) REFERENCES places(id),
    FOREIGN KEY (destination_id) REFERENCES places(id),
    INDEX (origin_id), -- Index for foreign key
    INDEX (destination_id) -- Index for foreign key
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert default Admin user
INSERT INTO users (username, password) VALUES ('Admin', 'rootpassword'); -- Replace with a hashed password

-- -- Clear the places and routes tables
TRUNCATE TABLE IF EXISTS places;
TRUNCATE TABLE IF EXISTS routes;