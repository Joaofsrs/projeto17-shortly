import { Router } from "express";
import authRouter from "./authRouter.routes.js";
import urlRouter from "./urlsRouter.routes.js";

const router = Router();
router.use(authRouter);
router.use(urlRouter)

export default router;