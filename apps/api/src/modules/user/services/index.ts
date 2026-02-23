import { UpdateUserSchema, UserSchema } from '@/schemas/user';
import { WorkspaceSchema } from '@/schemas/workspace';
import { User } from '@/models/user';
import { Workspace } from '@/models/workspace';
import { fail, Result, ok } from '@/utils/result';
export const findUserService = async (id: string): Promise<Result<UserSchema>> => {
  try {
    if (!id) {
      return fail('UNKNOWN', 'Provided id is invalid');
    }

    const user = await User.findOne({ _id: id }).lean();

    if (!user) {
      return fail('NOT_FOUND', 'User not found');
    }

    const response: UserSchema = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl || undefined,
      currentWorkspace: user.currentWorkspace?.toString(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return ok(response);
  } catch (error) {
    return fail('UNKNOWN', 'Internal server error');
  }
};

export const updateUserService = async (
  id: string,
  data: UpdateUserSchema,
): Promise<Result<UserSchema>> => {
  if (!id) {
    return fail('UNKNOWN', 'Provided id is invalid');
  }

  const user = await User.findOne({ _id: id });

  if (!user) {
    return fail('NOT_FOUND', 'User not found');
  }

  const isUsernameUpdated = user.username !== data.username;

  if (isUsernameUpdated) {
    const isUsernameExist = await User.findOne({ username: data.username });
    if (isUsernameExist) {
      return fail('ALREADY_EXISTS', 'Username already exists');
    }

    user.username = data.username;
  }


  user.name = data.name;
  user.avatarUrl = data.avatarUrl;

  await user.save();

  const response: UserSchema = {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl || undefined,
    currentWorkspace: user.currentWorkspace?.toString(),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return ok(response);
};

export const changeCurrentWorkspaceService = async (
  owner: string,
  workspaceId: string,
): Promise<Result<WorkspaceSchema>> => {
  try {
    const workspace = await Workspace.findOne({ owner, _id: workspaceId }).lean();

    if (!workspace) {
      return fail('NOT_FOUND', 'Workspace not found');
    }

    await User.findByIdAndUpdate(
      owner,
      { currentWorkspace: workspaceId },
      { new: true },
    );

    const response: WorkspaceSchema = {
      id: workspace._id.toString(),
      owner: workspace.owner.toString(),
      name: workspace.name,
      description: workspace.description,
      imageUrl: workspace.imageUrl || null,
      inviteCode: workspace.inviteCode,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };

    return ok(response);
  } catch (error) {
    return fail('DB_ERROR', 'Failed to change current workspace');
  }
};
