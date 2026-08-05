import { Request, Response } from "express";
import shortid from "shortid";
import { prisma } from "../utils/prisma";
import { error } from "node:console";

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
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async redirect(req: Request, res: Response) {
    try {
      const { shortUrl } = req.params;

      if (typeof shortUrl !== "string") {
        return res.status(400).json({ error: "Invalid Short URL" });
      }

      const url = await prisma.link.findUnique({
        where: {
          shortUrl,
        },
      });

      if (url) {
        return res.redirect(url.originalUrl);
      } else {
        return res.status(404).json("URL not found");
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
