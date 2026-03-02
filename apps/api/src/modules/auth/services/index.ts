import { User } from '@/models/users';
import { createProfileService } from '@/modules/profile/services';
import { generateToken, hashPassword, verifyPassword } from '@/utils';
import { fail, ok, Result } from '@/utils/result';
import { RegisterBody, LoginBody, UserResponse, ChangePasswordBody } from '@linktree/validation';

export const registerService = async (
  data: RegisterBody,
): Promise<Result<UserResponse>> => {
  try {
    const { name, username, email, password } = data;

    const isEmailExists = await User.findOne({ email }).lean();
    const isUsernameExists = await User.findOne({ username }).lean();

    if (isUsernameExists) {
      return fail('ALREADY_EXISTS', 'Username already taken');
    }

    if (isEmailExists) {
      return fail('ALREADY_EXISTS', 'Email already exists');
    }

    const passwordHash = await hashPassword(password);

    const [user] = await User.create([
      {
        name,
        username,
        email,
        passwordHash,
      },
    ]);

    await user.save();

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    await createProfileService({
      user_id: user._id.toString(),
      display_name: user.name,
      bio: '',
      avatar_url: '',
    });

    const response: UserResponse = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to register user');
  }
};

export const loginService = async (
  data: LoginBody,
): Promise<Result<UserResponse>> => {
  try {
    const loginId = (data.email ?? '').trim().toLowerCase();
    if (!loginId || !data.password) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const userDoc = await User.findOne({
      $or: [{ email: loginId }, { username: loginId }],
    }).select('+passwordHash');

    if (!userDoc) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const plain = userDoc.toObject ? userDoc.toObject() : (userDoc as unknown) as Record<string, unknown>;
    const p = plain as Record<string, unknown>;
    const hash = typeof p.passwordHash === 'string' ? p.passwordHash : undefined;

    if (!hash) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const isPasswordCorrect = await verifyPassword(data.password, hash);
    if (!isPasswordCorrect) {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    let token: string;
    try {
      token = generateToken({
        id: String(p._id),
        email: String(p.email ?? ''),
      });
    } catch {
      return fail('UNAUTHORIZED', 'Invalid email or password');
    }

    const response: UserResponse = {
      id: String(p._id),
      name: String(p.name ?? ''),
      username: String(p.username ?? ''),
      email: String(p.email ?? ''),
      token,
      createdAt: (p.createdAt as Date) ?? new Date(),
      updatedAt: (p.updatedAt as Date) ?? new Date(),
    };
    return ok(response);
  } catch {
    return fail('UNAUTHORIZED', 'Invalid email or password');
  }
};



