import { Profile } from "@/models/profile";
import { fail, ok, Result } from "@/utils/result";
import { CreateProfileBody, ProfileResponse, UpdateProfileBody } from "@linktree/validation";

export const getProfileService = async (
  userId: string,
): Promise<Result<ProfileResponse>> => {
  try {
    const profile = await Profile.findOne({ user_id: userId });

    if (!profile) {
      return fail('NOT_FOUND', 'User not found');
    }

    const response: ProfileResponse = {
      user_id: profile.user_id.toString(),
      display_name: profile.display_name,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to get user profile');
  }
};

export const createProfileService = async (
  data: CreateProfileBody,
): Promise<Result<ProfileResponse>> => {
  try {
    const { user_id, display_name, bio, avatar_url } = data;

    const profile = await Profile.create({
      user_id,
      display_name,
      bio,
      avatar_url,
    });

    const response: ProfileResponse = {
      user_id: profile.user_id.toString(),
      display_name: profile.display_name,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to create user profile');
  }
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileBody,
): Promise<Result<ProfileResponse>> => {
  try {
    const profile = await Profile.findOneAndUpdate({ user_id: userId }, data, { new: true });

    if (!profile) {
      return fail('NOT_FOUND', 'User not found');
    }

    const response: ProfileResponse = {
      user_id: profile.user_id.toString(),
      display_name: profile.display_name,
      bio: profile.bio || null,
      avatar_url: profile.avatar_url || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to update user profile');
  }
};

