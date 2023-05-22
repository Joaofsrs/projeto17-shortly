import { Router } from "express";
import authRouter from "./authRouter.routes.js";

const router = Router();
router.use(authRouter);

export default router;