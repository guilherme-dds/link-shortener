import { Request, Response } from "express";
import shortid from "shortid";
import { prisma } from "../utils/prisma";

export class LinkController {
  async shorten(req: Request, res: Response) {
    try {
      const { originalUrl, userId } = req.body;

      const validUrl = URL.canParse(originalUrl.trim());

      if (validUrl) {
        const shortUrl = shortid.generate();
        const newUrl = await prisma.link.create({
          data: {
            originalUrl,
            shortUrl,
            userId,
          },
        });
        res.status(201).json({ newUrl });
      } else {
        return res.status(400).json({ message: "Invalid URL format" });
      }
    } catch (error) {
      console.log(error);
      console.log(Object.keys(prisma));
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
