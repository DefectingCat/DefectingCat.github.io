const baseUrl = 'https://blog-backend-beige-pi.vercel.app/';

/**
 * Read post meta info from backend
 */
const readFileMate = async (filename: string) => {
  const target = `${baseUrl}/${filename}.mdx`;
  const result = await (await fetch(target)).text();
};