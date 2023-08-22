import express from "express";
import fetch from "node-fetch"

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/numbers", async (req, res) => {
    const urlParams = req.query.url;
    
    if (!urlParams || !Array.isArray(urlParams)) {
        res.status(400).json({ error: "Invalid or missing 'url' parameter(s)" });
        return;
    }

    const fetchDataPromises = urlParams.map(url => fetchData(url));

    try {
        const results = await Promise.allSettled(fetchDataPromises);

        const validResponses = results
            .filter(result => result.status === "fulfilled")
            .map(result => result.value);

        const mergedUniqueIntegers = mergeandsort(validResponses);

        res.json({ numbers: mergedUniqueIntegers });
    } catch (error) {
        console.error(error);
        
    }
});

async function fetchData(url) {
    try {
        const response = await fetch(url, { timeout: 500 });
        const data = await response.json();
        return data.numbers;
    } catch (error) {
        console.error(error);
        
    }
}

function mergeandsort(integersArrays) {
    const merged =  [...integersArrays].flat();
    const uniqueIntegers = [...new Set(merged)];
    return uniqueIntegers.sort((a, b) => a - b);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});