import { config } from 'dotenv';
import axios from 'axios';
import { insertOrupdatePlace, getPlaceIdByGMapId, insertRoute } from './dataFunctions';

config();
const apiKey = process.env.GMAP_KEY;
const searchEndpoint = process.env.GMAP_SEARCH_ENDPOINT;
const routesEndpoint = process.env.GMAP_ROUTES_ENDPOINT;

// Fetch building data from Google Maps
export async function getUCLBuildings() {
    try {
        const response = await axios.post(
            searchEndpoint,
            { textQuery: "UCL buildings" },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                }
            }
        );
        return response.data.places || [];
    } catch (error) {
        console.error('Error fetching UCL buildings:', error.message);
        return [];
    }
}

// Fetch accommodation data from Google Maps
export async function getAccommodations() {
    try {
        const response = await axios.post(
            searchEndpoint,
            { textQuery: "student halls london ucl" },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                }
            }
        );
        return response.data.places || [];
    } catch (error) {
        console.error('Error fetching accommodations:', error.message);
        return [];
    }
}

// Fetch walking routes
export async function getWalkingRoutesFor(location, durationLimit) {
    try {
        const response = await axios.post(
            routesEndpoint,
            {
                origin: { location: { latLng: location } },
                destination: { travelMode: "WALK" },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                }
            }
        );
        return response.data.routes.filter(r => r.duration <= durationLimit);
    } catch (error) {
        console.error('Error fetching routes:', error.message);
        return [];
    }
}

// Update database with data
export async function updateDataBase() {
    try {
        const buildings = await getUCLBuildings();
        const accommodations = await getAccommodations();

        for (const building of buildings) {
            await insertOrupdatePlace(building, "Buildings");
        }

        for (const accommodation of accommodations) {
            await insertOrupdatePlace(accommodation, "Accommodation");
        }

        for (const building of buildings) {
            const buildingId = await getPlaceIdByGMapId(building.id, "Buildings");
            const routes = await getWalkingRoutesFor(building.location.latLng, 900);
            for (const route of routes) {
                const accommodation = accommodations.find(acc =>
                    acc.location.latitude === route.destination.location.latitude &&
                    acc.location.longitude === route.destination.location.longitude
                );
                if (accommodation) {
                    const accommodationId = await getPlaceIdByGMapId(accommodation.id, "Accommodation");
                    await insertRoute(buildingId, accommodationId, route.duration, route.distanceMeters, route.polyline.encodedPolyline);
                }
            }
        }

        console.log("Database updated successfully.");
    } catch (error) {
        console.error("Error updating database:", error.message);
    }
}
