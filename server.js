const express = require('express');
const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())
const routes = require('./api_routes/routes');
routes(app);
const port = process.env.PORT || 3003;

app.listen(port, () => {
    console.log(`Listening to port http://localhost:${port}`);
});