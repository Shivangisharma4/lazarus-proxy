const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000; // Use environment port for hosting

// Simple cache to prevent redundant API calls
const linkCache = new Map();

app.get('/go', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("Error: Please provide a URL. Example: /go?url=https://google.com");
    }

    // Check cache first for performance
    if (linkCache.has(targetUrl)) {
        console.log(`[Cache Hit] Redirecting to: ${linkCache.get(targetUrl)}`);
        return res.redirect(linkCache.get(targetUrl));
    }

    try {
        console.log(`[Health Check] Pinging: ${targetUrl}`);

        // Timeout set to 3 seconds to keep user experience fast
        await axios.head(targetUrl, { timeout: 3000 });

        // If alive, cache the result and redirect
        linkCache.set(targetUrl, targetUrl);
        return res.redirect(targetUrl);

    } catch (error) {
        console.warn(`[Link Dead] Attempting resurrection for: ${targetUrl}`);

        try {
            const waybackApi = `http://archive.org/wayback/available?url=${targetUrl}`;
            const response = await axios.get(waybackApi);
            const snapshot = response.data.archived_snapshots.closest;

            if (snapshot && snapshot.available) {
                console.log(`[Success] Archive found! Redirecting to Wayback Machine.`);
                linkCache.set(targetUrl, snapshot.url);
                return res.redirect(snapshot.url);
            } else {
                console.error(`[Failure] No archive found for: ${targetUrl}`);
                return res.status(404).send("The link is dead and no archive exists.");
            }
        } catch (archiveError) {
            console.error(`[API Error] Wayback Machine is unreachable.`);
            return res.status(502).send("The original link is dead and the archive service is currently down.");
        }
    }
});

app.listen(PORT, () => {
    console.log(`Lazarus Proxy is active on port ${PORT}`);
});