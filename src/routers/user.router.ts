import { Router } from "express";

import userController from "../controllers/user.controller";

const router = Router();

router.post("/", async (req, res) => {
  const data = await userController.create(req.body);

  if (data == null) {
    res.status(404).json({ ok: false, msg: "failed to create user" });

    return;
  }
  res.json({ ok: true, data });
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  const data = await userController.getById(userId);

  if (data == null) {
    res.status(401).json({ ok: false, msg: "could not find user" });

    return;
  }
  res.json({ ok: true, data });
});

export default router;
