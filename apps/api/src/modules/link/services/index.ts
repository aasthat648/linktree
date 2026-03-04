import { fail, ok, Result } from "@/utils";
import { CreateLinkBody, LinkResponse, UpdateLinkBody } from "@linktree/validation";
import { Links } from "@/models/links"

export const createLinkService = async (userId: string, data: CreateLinkBody): Promise<Result<LinkResponse>> => {
  try {
    const isLinkExists = await Links.findOne({ user_id: userId, platform: data.platform, title: data.title }).lean();

    if (isLinkExists) {
      return fail('ALREADY_EXISTS', 'Link already exists');
    }

    const link = await Links.create({
      user_id: userId,
      title: data.title,
      link: data.link,
      platform: data.platform,
    });

    const response: LinkResponse = {
      _id: link._id.toString(),
      user_id: link.user_id.toString(),
      title: link.title,
      link: link.link,
      platform: link.platform,
      created_at: link.created_at,
      updated_at: link.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to create link');
  }
}


export const getLinksService = async (userId: string): Promise<Result<LinkResponse[]>> => {
  try {
    const links = await Links.find({ user_id: userId }).lean();

    const response: LinkResponse[] = links.map((link) => ({
      _id: link._id.toString(),
      user_id: link.user_id.toString(),
      title: link.title,
      link: link.link,
      platform: link.platform,
      created_at: link.created_at,
      updated_at: link.updated_at,
    }));

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to get links');
  }
}


export const updateLinkService = async (userId: string, linkId: string, data: UpdateLinkBody): Promise<Result<LinkResponse>> => {
  try {

    const isLinkExists = await Links.findOne({ user_id: userId, platform: data.platform, title: data.title, _id: { $ne: linkId } }).lean();

    if (isLinkExists) {
      return fail('ALREADY_EXISTS', 'Link already exists');
    }

    const link = await Links.findOneAndUpdate({ user_id: userId, _id: linkId }, data, { new: true }).lean();

    if (!link) {
      return fail('NOT_FOUND', 'Link not found');
    }

    const response: LinkResponse = {
      _id: link._id.toString(),
      user_id: link.user_id.toString(),
      title: link.title,
      link: link.link,
      platform: link.platform,
      created_at: link.created_at,
      updated_at: link.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to update link');
  }
}

export const deleteLinkService = async (userId: string, linkId: string): Promise<Result<LinkResponse>> => {
  try {
    const link = await Links.findOneAndDelete({ user_id: userId, _id: linkId }).lean();

    if (!link) {
      return fail('NOT_FOUND', 'Link not found');
    }

    const response: LinkResponse = {
      _id: link._id.toString(),
      user_id: link.user_id.toString(),
      title: link.title,
      link: link.link,
      platform: link.platform,
      created_at: link.created_at,
      updated_at: link.updated_at,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail('DB_ERROR', 'Failed to delete link');
  }
}

