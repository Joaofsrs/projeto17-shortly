import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { urlSchema } from "../shcemas/urls.schemas.js";
import { createUrlShorten } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(urlSchema), createUrlShorten);

export default urlRouter;