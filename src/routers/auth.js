const { Router } = require("express");
const { validateBody } = require("../middlewares/validateBody.js");
const { registerUserSchema, loginUserSchema } = require("../validation/auth.js");
const { registerUserController, loginUserController, refreshUserSessionController, logoutUserController } = require("../controllers/auth.js");
const { ctrlWrapper } = require("../utils/ctrlWrapper.js");

const router = Router();

router.post(
    '/register',
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);

router.post(
    '/refresh',
    ctrlWrapper(refreshUserSessionController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;