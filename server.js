const express = require("express");
const next = require("next");
const routes = require("./routes");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = routes.getRequestHandler(app);

const port = process.env.PORT || 8080;

app
    .prepare()
    .then(() => {
        const server = express();

        server.get("*", (req, res) => {
            return handle(req, res);
        });

        server.post('*', (req, res) => {
            console.log(req.body)
            return handle(req, res)
        })

        server.use(handle).listen(port, err => {
            if (err) throw err;
            console.log(`Listening on ${port}`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });