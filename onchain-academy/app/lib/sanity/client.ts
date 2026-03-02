import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-03-01",
    useCdn: false, // Set to true for production usage
    token: process.env.SANITY_API_DEV_TOKEN,
});
