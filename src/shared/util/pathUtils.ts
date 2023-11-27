import { access, constants } from 'node:fs/promises';

export const pathExists = async (path: string) => {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch (e) {
    return false;
  }
};
