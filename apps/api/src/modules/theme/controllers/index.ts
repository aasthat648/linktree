import type { Request, Response } from "express";
import { HttpStatus } from "@/types";
import { sendError, zodError, errorReasonToHttpStatus, sendSuccess } from "@/utils";
import { updateThemeBodySchema } from "@linktree/validation";
import { getThemeService, updateThemeService } from "@/modules/theme/services";

export const updateTheme = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { success, error, data } = updateThemeBodySchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await updateThemeService(userId, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const getTheme = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const result = await getThemeService(userId);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};