import { Request, Response } from "express";
import shortid from "shortid";
import { prisma } from "../utils/prisma";
import { error } from "node:console";

export class LinkController {
  // Shorten API
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

  // Redirect API
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

  // GET link by ID
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const findUrl = await prisma.link.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findUrl) {
        return res.status(404).json({ message: "URL not found" });
      }

      const { originalUrl, shortUrl } = findUrl;

      return res.status(200).json({ findUrl: { id, originalUrl, shortUrl } });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // GET All links from user
  async findAll(req: Request, res: Response) {
    try {
      const userId = req.userId;

      const links = await prisma.link.findMany({
        where: {
          userId,
        },
      });

      return res.status(200).json({ links });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // DELETE link
  async delete(req: Request, res: Reponse) {
      try {
        const { shortUrl } = req.params;

        const result = await prisma.link.delete({
          where: {
            shortUrl
          }
        })

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "URL not found" });
        }

        return res.status(204);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
  }
}
