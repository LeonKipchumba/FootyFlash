const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());


const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.football-data.org/v2";

app.get("/api/:endpoint", async (req, res) => {
    try {
        const endpoint = req.params.endpoint;
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: { "X-Auth-Token": API_KEY }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
