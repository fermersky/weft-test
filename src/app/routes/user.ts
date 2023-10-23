import { Router } from "express";
import { userRepository } from "../../db/repositories/index.js";

const router = Router();

router.get("/paginate", async (req, res) => {
  const users = await userRepository.paginate(
    Number(req.query["limit"]),
    Number(req.query["offset"])
  );

  res.json({ data: users });
});

router.get("/find-by-name/:name", async (req, res) => {
  const users = await userRepository.findByName(String(req.params["name"]));

  res.json({ data: users });
});

router.get("/find-by-email/:email", async (req, res) => {
  const users = await userRepository.findByEmail(String(req.params["email"]));

  res.json({ data: users });
});

router.get("/remove-from-group/:userId", async (req, res) => {
  try {
    const users = await userRepository.removeUserFromGroup(
      String(req.params["userId"])
    );

    res.json({ data: users });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default router;
