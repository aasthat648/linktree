// import { NextFunction, Request, Response } from 'express';
// import { HttpStatus } from '@/types';
// import { sendError } from '@/utils';
// import { WorkspaceMember } from '@/models/workspace-member';
// import { User } from '@/models/user';
// import { Permission, ROLE_PERMISSIONS } from '@/types/role-permissions';

// export const requirePermission =
//   (permission: Permission) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//       const userId = req?.auth?.id;

//       const user = await User.findById(userId).lean();

//       if (!user) {
//         return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
//       }

//       const currentWorkspace = user.currentWorkspace;

//       const workspaceMember = await WorkspaceMember.findOne({
//         user: userId,
//         workspace: currentWorkspace,
//       }).lean();

//       const role = workspaceMember?.role;

//       if (!userId || !role) {
//         return sendError(res, 'Unauthorized', HttpStatus.UNAUTHORIZED);
//       }

//       const allowed = ROLE_PERMISSIONS[role].includes(permission);

//       if (!allowed) {
//         return sendError(res, 'Forbidden', HttpStatus.FORBIDDEN);
//       }

//       next();
//     };
