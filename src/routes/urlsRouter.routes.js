import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../shcemas/urls.schemas.js";
import { createUrlShorten, deleteUrls, getRanking, getShortUrl, getUrlById, getUserMe } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(urlSchema), createUrlShorten);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl",  getShortUrl);
urlRouter.delete("/urls/:id", deleteUrls);
urlRouter.get("/users/me", getUserMe);
urlRouter.get("/ranking", getRanking);

export default urlRouter;