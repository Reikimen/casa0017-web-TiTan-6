// import { config } from 'dotenv';
import axios from 'axios';
import { insertOrupdatePlace, getPlaceIdByGMapId, insertRoute } from '../data/dataFunctions.mjs'; // Adjusted import path
import * as Config from '../data/env.mjs'; // Adjusted import path
// config();
const apiKey = Config.GMAP_KEY;
const searchEndpoint = Config.GMAP_SEARCH_ENDPOINT;
const routesEndpoint = Config.GMAP_ROUTES_ENDPOINT;
console.log('API key:', apiKey, 'Search endpoint:', searchEndpoint, 'Routes endpoint:', routesEndpoint);
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
                    "X-Goog-FieldMask" : "places.displayName,places.formattedAddress,places.id,places.location"
                }
            }
        );
        console.log('UCL buildings data:', response.data.places);
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
                    "X-Goog-FieldMask" : "places.displayName,places.formattedAddress,places.id,places.location"
            }
            }
        );
        console.log('Accommodations data:', response.data.places);
        return response.data.places || [];
    } catch (error) {
        console.error('Error fetching accommodations:', error.message);
        return [];
    }
}

// Fetch walking routes
// export async function getWalkingRoutesFor(location, durationLimit) {
//     try {
//         const response = await axios.post(
//             routesEndpoint,
//             {
//                 origin: { location: { latLng: location } },
//                 destination: { location: { latLng: location } }, 
//                 travelMode: "WALK",
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "X-Goog-Api-Key": apiKey,
//                     "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
//                     }
//             }
//         );
//         console.log('Walking routes data:', response.data.routes);
//         if (!response.data.routes) {
//             return [];
//         }
//         return response.data.routes.filter(r => r.duration <= durationLimit);
//     } catch (error) {
//         console.error('Error fetching routes:', error.message);
//         return [];
//     }
// }
export async function getWalkingRoutesFor(location, duration) {
    const accommodations = await getAccommodations();
    let routes = [];
    for (const accommodation of accommodations) {
        try {
            const response = await axios.post(routesEndpoint, {
                origin: {
                    location: {
                        latLng: location
                    }
                },
                destination: {
                    location: {
                        latLng: accommodation.location
                    }
                },
                travelMode: "WALK"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
                }
            });
            
            const resRoutes = response.data;
            if (resRoutes.routes) {
         for(const r of resRoutes.routes)
            {
                console.log("Each Route:", r);
                if (parseInt(r.duration) <= duration)
                {
                    routes.push(r);
                }
            }
            }
           
        } catch (error) {
            throw error;
        }
        // axios.post(routesendpoint, {
        //     origin: {
        //         location: {
        //             latLng: location
        //         }
        //     },
        //     destination: {
        //         location: {
        //             latLng: accommodation.location
        //         }
        //     },
        //     travelMode: "WALK"
        // }, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "X-Goog-Api-Key": apiKey,
        //         "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
        //     }
        // }).then((res) => {
        //     if (res.data.duration <= duration)
        //     {
        //         routes.push(res.data);
        //     }
        // }).catch((err) => { throw err });
    }
    return routes;
}

// Update database with data
export async function updateDataBase() {
    try {
        console.log("Fetching UCL buildings...");
        const buildings = await getUCLBuildings();
        console.log("Fetched UCL buildings:", buildings);

        console.log("Fetching accommodations...");
        const accommodations = await getAccommodations();
        console.log("Fetched accommodations:", accommodations);

        console.log("Inserting buildings into database...");
        for (const building of buildings) {
            console.log("Inserting building:", building);
            await insertOrupdatePlace(building, "Buildings");
        }

        console.log("Inserting accommodations into database...");
        for (const accommodation of accommodations) {
            console.log("Inserting accommodation:", accommodation);
            await insertOrupdatePlace(accommodation, "Accommodation");
        }

        console.log("Fetching and inserting routes into database...");
        for (const building of buildings) {
            const buildingId = await getPlaceIdByGMapId(building.id, "Buildings");
            console.log("Building ID:", buildingId);
            const routes = await getWalkingRoutesFor(building.location.latLng, 900);
            console.log("Fetched routes for building:", routes);
            for (const route of routes) {
                const accommodation = accommodations.find(acc =>
                    acc.location.latitude === route.destination.location.latitude &&
                    acc.location.longitude === route.destination.location.longitude
                );
                if (accommodation) {
                    const accommodationId = await getPlaceIdByGMapId(accommodation.id, "Accommodation");
                    console.log("Accommodation ID:", accommodationId);
                    await insertRoute(buildingId, accommodationId, route.duration, route.distanceMeters, route.polyline.encodedPolyline);
                }
            }
        }

        console.log("Database updated successfully.");
    } catch (error) {
        console.error("Error updating database:", error.message);
    }
}
