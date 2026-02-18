import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || "5050";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SolLearn API Documentation",
            version: "1.0.0",
            description: "API documentation for SolLearn - Decentralized Learning Management System on Solana",
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpecs = swaggerJSDoc(options);

export default swaggerSpecs;
