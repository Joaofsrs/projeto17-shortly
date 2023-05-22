import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../shcemas/urls.schemas.js";
import { createUrlShorten, deleteUrls, getShortUrl, getUrlById } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(urlSchema), createUrlShorten);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl",  getShortUrl);
urlRouter.delete("/urls/:id", deleteUrls);

export default urlRouter;