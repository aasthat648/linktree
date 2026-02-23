import { fail, ok, Result } from "@/utils";
import { CreateThemeBody, ThemeResponse, UpdateThemeBody } from "@linktree/validation";
import { ThemeModel } from "@/models/theme";

export const createThemeService = async (userId: string, data: CreateThemeBody): Promise<Result<ThemeResponse>> => {
  try {

    const isThemeExists = await ThemeModel.findOne({ user_id: userId }).lean();

    if (isThemeExists) {
      return fail('ALREADY_EXISTS', 'Theme already exists');
    }

    const theme = await ThemeModel.create({
      user_id: userId,
      type: data.type,
      value: data.value,
    });

    const response: ThemeResponse = {
      _id: theme._id.toString(),
      user_id: theme.user_id.toString(),
      type: theme.type,
      value: theme.value,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to create theme');
  }
};

export const updateThemeService = async (userId: string, data: UpdateThemeBody): Promise<Result<ThemeResponse>> => {
  try {
    const theme = await ThemeModel.findOneAndUpdate({ user_id: userId }, data, { new: true });

    if (!theme) {
      return fail('NOT_FOUND', 'Theme not found');
    }

    const response: ThemeResponse = {
      _id: theme._id.toString(),
      user_id: theme.user_id.toString(),
      type: theme.type,
      value: theme.value,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to update theme');
  }
};
