import { Router } from "express";
import { peopleService } from "../services/peopleService";

export const peopleRouter = () => {
  const peopleRouter = Router();

  peopleRouter.get("/", async (req, res) => {
    try {
      const people = await peopleService();
      res.json(people);
    } catch (error) {
      res.status(500).send("Error fetching people data");
    }
  });

  return peopleRouter;
};
