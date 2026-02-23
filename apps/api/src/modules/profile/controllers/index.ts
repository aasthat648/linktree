import type { Request, Response } from "express";
import { HttpStatus } from "@/types";
import { sendError, errorReasonToHttpStatus, sendSuccess, zodError } from "@/utils";
import { getProfileService, updateProfileService } from "../services";
import { updateProfileBodySchema } from "@linktree/validation";

export const getProfile = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const result = await getProfileService(userId);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { success, error, data } = updateProfileBodySchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await updateProfileService(userId, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

