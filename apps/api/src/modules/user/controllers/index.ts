import { Request, Response } from 'express';
import { HttpStatus } from '@/types';
import {
  errorReasonToHttpStatus,
  sendError,
  sendSuccess,
  zodError,
} from '@/utils';
import {
  changeCurrentWorkspaceService,
  findUserService,
  updateUserService,
} from '@/modules/user/services';
import { updateUserSchema } from '@/schemas/user';

export const findUserController = async (req: Request, res: Response) => {
  const id = req?.auth?.id;

  if (!id) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  const result = await findUserService(id);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const updateUserController = async (req: Request, res: Response) => {
  const id = req?.auth?.id;
  const { success, data, error } = updateUserSchema.safeParse(req.body);

  if (!id) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  if (!success) {
    return sendError(res, zodError(error), HttpStatus.BAD_REQUEST);
  }

  const result = await updateUserService(id, data);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};

export const changeCurrentWorkspace = async (req: Request, res: Response) => {
  const userId = req?.auth?.id;
  const { workspaceId } = req.params;

  if (!userId) {
    return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  if (!workspaceId) {
    return sendError(res, 'Workspace id is required', HttpStatus.BAD_REQUEST);
  }

  const result = await changeCurrentWorkspaceService(userId, workspaceId);

  if (!result.ok) {
    return sendError(res, result.message, errorReasonToHttpStatus(result.reason));
  }

  return sendSuccess(res, result.data, HttpStatus.OK);
};
