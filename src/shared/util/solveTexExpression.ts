import axios from 'axios';

export const solveTexExpression = async (
  tex: string,
): Promise<string | null> => {
  const data = {
    origin: 'input',
    language: 'en',
    query: tex,
    referer: 'https://www.symbolab.com/solver/step-by-step',
  };

  try {
    const res = await axios.postForm(
      'https://www.symbolab.com/pub_api/bridge/solution',
      data,
    );

    return res.data['solution']['solution']['default'] as string;
  } catch (e) {
    console.error(e);
  }

  return null;
};
