import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { signInSchema, signUpSchema } from "../shcemas/auth.schemas.js";
import { createUser, getUser } from "../controllers/auth.controllers.js";
import { createUserValidate } from "../middlewares/authValidate.middleware.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signUpSchema), createUserValidate,createUser);
authRouter.get("/signup", getUser)
authRouter.post("/signin", validateSchema(signInSchema), );

export default authRouter;