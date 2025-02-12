const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect("https://" + req.headers.host + req.url);
    }
    next();
});

app.get("/", (req, res) => {
    res.send("Backend is running with HTTPS!");
});

app.post("/submit", async (req, res) => {
    const {
        timestamp,
        ownerName,
        homeAddress,
        city,
        state,
        zipCode,
        cellPhone,
        email,
        petName,
        species,
        breed,
        age,
        sex,
        spayedOrNeutered,
        color,
        microchip,
        initials,
    } = req.body;

    const credentialsPath = path.resolve(
        __dirname,
        process.env.GOOGLE_CREDENTIALS_FILE
    ); // Read the credentials from environment variable
    const auth = new google.auth.GoogleAuth({
        keyFile: credentialsPath,
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID; // Use environment variable for Spreadsheet ID

    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:Q",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [
                    timestamp,
                    ownerName,
                    homeAddress,
                    city,
                    state,
                    zipCode,
                    cellPhone,
                    email,
                    petName,
                    species,
                    breed,
                    age,
                    sex,
                    spayedOrNeutered,
                    color,
                    microchip,
                    initials,
                ],
            ],
        },
    });

    res.send("Successfully submitted! Thank you!");
});

// Use the dynamic port assigned by Elastic Beanstalk
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
