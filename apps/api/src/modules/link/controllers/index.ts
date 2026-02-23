import { HttpStatus } from "@/types";
import { sendError, zodError, errorReasonToHttpStatus, sendSuccess } from "@/utils";
import { createLinkBodySchema, linkIdParamSchema, updateLinkBodySchema } from "@linktree/validation";
import { createLinkService, deleteLinkService, getLinksService, updateLinkService } from "../services";
import type { Request, Response } from "express";

export const createLink = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { success, error, data } = createLinkBodySchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await createLinkService(userId, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
}

export const getLinks = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const result = await getLinksService(userId);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
}

export const updateLink = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  const { id } = linkIdParamSchema.parse(req.params);

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { success, error, data } = updateLinkBodySchema.safeParse(req.body);

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await updateLinkService(userId, id, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
}

export const deleteLink = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const { id } = linkIdParamSchema.parse(req.params);

  const result = await deleteLinkService(userId, id);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
}
