import { updateDataBase } from './google-map/mapquery.mjs';

(async () => {
    try {
        console.log("Starting database update...");
        await updateDataBase();
        console.log("Database update completed.");
    } catch (error) {
        console.error("Error during database update:", error);
    }
})();