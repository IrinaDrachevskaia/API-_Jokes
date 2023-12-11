import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {

    res.render("index.ejs", { context: ""});
});

app.post("/joke", async (req, res) => {
    try {
        var apiUrl = "https://v2.jokeapi.dev/joke/";

        var categories = "";
        const selectedCategories = Array.isArray(req.body.CategoryName)
            ? req.body.CategoryName
            : [req.body.CategoryName];

        if (req.body.catSelect === 'multi') {
            categories = selectedCategories.join(',');
        } else {
            categories = "any";
        }

        apiUrl = apiUrl + categories + "?format=json";

        var blacklistFlags = "";
        const selectedBlackList = Array.isArray(req.body.blackList)
            ? req.body.blackList
            : [req.body.blackList];
        if (selectedBlackList.length > 0) {
            blacklistFlags = selectedBlackList.join(',');
            apiUrl = apiUrl + "&blacklistFlags=" + blacklistFlags;
        }

        var types = "";
        const selectedTypes = Array.isArray(req.body.type)
            ? req.body.type
            : [req.body.type];
        if (selectedTypes.length > 0) {
            types = selectedTypes.join(",");
        } else {
            types = "single";
        }

        var contains = req.body.contains;
        if (contains.length > 0){
            apiUrl = apiUrl + "&contains=" + contains;
        }

        const language = req.body.language;
        const amount = req.body.amount;
        apiUrl = apiUrl + "&type=" + types + "&lang=" + language + "&amount=" + amount;

        const response = await axios.get(apiUrl);
        const resultData = response.data;
        let result;

        if (resultData.error){
            result = "No Jokes Found 😞 Try Again!";
        } else {
            if (resultData.amount > 1){
                result = resultData.jokes;
            }
            else {
                if (resultData.type === "twopart"){
                    result = resultData.setup + " - " + resultData.delivery;
                } else {
                    result = resultData.joke;
                }
                
            }
        }

        res.render("index.ejs", { context: result });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            context: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });