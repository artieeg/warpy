import "module-alias/register";

import express from "express";
import routes from "@app/routes";

const app = express();
app.use(routes);

const PORT = process.env.PORT;

const main = async () => {
  app.listen(`0.0.0.0:${PORT}`, () => {
    console.log(`Started user service on port ${PORT}`);
  });
};

main();
