import db from './databaseconnection';

const placeTypes = {
    Buildings: 'Buildings',
    Accommodation: 'Accommodation',
};

// Function to execute SQL queries
export async function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

// Function to insert or update a place
export async function insertOrupdatePlace(place, placeType) {
    const query = `
        INSERT INTO places (gmap_id, display_name, type, address, location)
        VALUES (?, ?, ?, ?, POINT(?, ?))
        ON DUPLICATE KEY UPDATE 
            display_name = VALUES(display_name),
            type = VALUES(type),
            address = VALUES(address),
            location = VALUES(location)
    `;
    const params = [
        place.id,
        place.displayName,
        placeType,
        place.formattedAddress,
        place.location.latitude,
        place.location.longitude,
    ];
    await executeQuery(query, params);
}

// Function to get place ID by Google Maps ID and type
export async function getPlaceIdByGMapId(gmapId, type) {
    const query = `SELECT id FROM places WHERE gmap_id = ? AND type = ?`;
    const result = await executeQuery(query, [gmapId, type]);
    return result.length > 0 ? result[0].id : null;
}

// Function to insert route information
export async function insertRoute(buildingId, accommodationId, duration, distanceMeters, encodedPolyline) {
    const query = `
        INSERT INTO routes (building_id, accommodation_id, duration, distance_meters, encoded_polyline)
        VALUES (?, ?, ?, ?, ?)
    `;
    await executeQuery(query, [buildingId, accommodationId, duration, distanceMeters, encodedPolyline]);
}
