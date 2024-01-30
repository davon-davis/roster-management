import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import axios from "axios";

export type People = {
  firstName: string;
  lastName: string;
};

export const peopleRouter = createTRPCRouter({
  getPeople: protectedProcedure.query(async (): Promise<People[]> => {
    const result = await axios.get("http://localhost:3002/people");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.data;
  }),
});
