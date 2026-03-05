import { ClickCounts } from "@/models/clicks";
import { Links, type PlatformType } from "@/models/links";
import { Profile } from "@/models/profile";
import { fail, ok, Result } from "@/utils/result";
import { Types } from "mongoose";

export type IncrementClick = {
  // userId: string;
  linkId: string;
  platform: PlatformType;
  //   country: string;
  //   state: string;
};

export const increaeHomePageClicksService = async (
  userId: string,
): Promise<Result<void>> => {
  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) {
      return fail("NOT_FOUND", "Profile not found");
    }
    profile.clicks++;
    await profile.save();
    return ok(undefined);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to increase home page clicks");
  }
};

export const increaseLinkClicksService = async ({
  linkId,
  platform,
}: IncrementClick): Promise<Result<void>> => {
  try {
    const link = await Links.findOne({ _id: linkId });
    if (!link) {
      return fail("NOT_FOUND", "Link not found");
    }
    const userId = link.user_id;

    const clickCount = await ClickCounts.create({
      user_id: userId,
      link_id: linkId,
      platform: platform,
      clicks: 1,
      country: "IN",
      state: "MH",
    });
    if (!clickCount) {
      return fail("NOT_FOUND", "Click count not found");
    }
    return ok(undefined);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to increase link clicks");
  }
};
