import { createClickCountSchema } from "@linktree/validation";
import { sendError, sendSuccess, zodError } from "@/utils";
import { HttpStatus } from "@/types";
import type { Request, Response } from "express";
import { increaseLinkClicksService } from "../services";

export const incrementClickController = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = createClickCountSchema.safeParse(req.body);
    if (!success) {
      return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
    }

    const result = await increaseLinkClicksService({
      linkId: data.link_id,
      platform: data.platform,
    });

    return sendSuccess(res, result, HttpStatus.CREATED);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
