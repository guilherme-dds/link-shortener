import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { hash } from "bcryptjs";

export class UserController {
  async store(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const hash_password = await hash(password, 8);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash_password,
      },
    });

    return res.json(user);
  }
}
