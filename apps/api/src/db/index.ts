import { connect } from 'mongoose';
import env from '../config/env';
import { NodeEnv } from '../types';
import { User } from '../models/users';
import { createProfileService } from '../modules/profile/services';
import { hashPassword } from '../utils/password';

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_USERNAME = 'admin';
const ADMIN_NAME = 'Admin';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';

async function ensureAdminUser(): Promise<void> {
  const existing = await User.findOne({
    $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
  }).lean();
  if (existing) return;

  const password = process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
  const passwordHash = await hashPassword(password);
  const [user] = await User.create([
    { name: ADMIN_NAME, username: ADMIN_USERNAME, email: ADMIN_EMAIL, passwordHash },
  ]);
  await createProfileService({
    user_id: user._id.toString(),
    display_name: ADMIN_NAME,
    bio: '',
    avatar_url: '',
  });
  console.log(`✅ Admin user ready: ${ADMIN_EMAIL} / ${ADMIN_USERNAME} (password: ${password})`);
}

const connectDB = async () => {
  try {
    // Use URL as-is and set database via option so we never double-append (e.g. link-tree/link-tree)
    const uri = env.MONGODB_URL.replace(/\/$/, ''); // strip trailing slash
    const hasDbInUrl = /\/[^/]+$/.test(uri.replace(/\?.*$/, '')); // path after host = database in URI
    const connectionOptions = hasDbInUrl ? {} : { dbName: env.MONGODB_DATABASE };
    await connect(hasDbInUrl ? uri : `${uri}/${env.MONGODB_DATABASE}`, connectionOptions);
    console.log('✅ MongoDB connected successfully to :', env.MONGODB_DATABASE);
    if (env.NODE_ENV === NodeEnv.DEVELOPMENT) {
      await ensureAdminUser();
    }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export { connectDB };
