import { Router } from 'express';
import {
  changeCurrentWorkspace,
  findUserController,
  updateUserController,
} from '../controllers';
import { authMiddleware } from '@/middlewares/auth';
import { asyncHandler } from '@/utils';

const router: Router = Router();

router
  .route('/')
  .get(authMiddleware, asyncHandler(findUserController))
  .patch(authMiddleware, asyncHandler(updateUserController));

router
  .route('/current-workspace/:workspaceId')
  .patch(authMiddleware, asyncHandler(changeCurrentWorkspace));

export default router;
