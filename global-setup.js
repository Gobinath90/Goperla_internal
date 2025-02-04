// global-setup.js
const fs = require('fs');
const path = require('path');

async function globalSetup() {
    const environmentVariables = {
        ENV: process.env.ENV || 'qa',
        URL: process.env.URL || 'https://etanadigital.net/login',
        BROWSER: process.env.BROWSER || 'Chrome'
    };

    const allureResultsPath = path.join(__dirname, 'allure-results');
    const environmentFilePath = path.join(allureResultsPath, 'environment.properties');

    // Ensure allure-results directory exists
    if (!fs.existsSync(allureResultsPath)) {
        fs.mkdirSync(allureResultsPath);
    }

    // Write environment variables to environment.properties file
    const content = Object.entries(environmentVariables)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.writeFileSync(environmentFilePath, content);
    console.log('Environment properties written to Allure report:', environmentFilePath);
}

module.exports = globalSetup;
