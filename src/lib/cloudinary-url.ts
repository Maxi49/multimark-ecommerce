const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

const MOTO_PAD_TRANSFORM = 'e_bgremoval,e_trim,c_pad,b_transparent,w_1200,h_800';
const LOGO_TRIM_TRANSFORM = 'e_bgremoval,e_trim';

const isCloudinaryUrl = (url: string) =>
  url.includes('cloudinary') && url.includes(CLOUDINARY_UPLOAD_SEGMENT);

export const applyCloudinaryTransform = (url: string, transform: string) => {
  if (!isCloudinaryUrl(url)) return url;

  const parts = url.split(CLOUDINARY_UPLOAD_SEGMENT);
  if (parts.length < 2) return url;

  const prefix = parts[0];
  const rest = parts.slice(1).join(CLOUDINARY_UPLOAD_SEGMENT);

  if (rest.startsWith(`${transform}/`)) {
    return url;
  }

  const [first, ...remaining] = rest.split('/');
  const hasVersion = /^v\d+/.test(first);
  const remainder = hasVersion ? rest : remaining.join('/');

  if (!remainder) return url;

  return `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${transform}/${remainder}`;
};

export const getMotoImageUrl = (url: string) =>
  applyCloudinaryTransform(url, MOTO_PAD_TRANSFORM);

export const getLogoImageUrl = (url: string) =>
  applyCloudinaryTransform(url, LOGO_TRIM_TRANSFORM);
