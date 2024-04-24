import type { S3ParamType } from '../types';

type ParamType = {
  file: File | null;
  [key: string]: string | File | Blob | null;
};

export default async function handleImageUpload(
  url: string,
  fields: S3ParamType,
  file: File
) {
  const params: ParamType = {
    ...fields,
    'Content-Type': file?.type as string,
    file,
  };
  const formData = new FormData();
  for (const name in params) {
    const value = params[name];
    if (value !== null && value !== undefined) {
      formData.append(name, value);
    }
  }

  const upload = await fetch(url, { method: 'POST', body: formData });
  if (upload.ok) {
    console.log('Uploaded successfully!');
  } else {
    console.error(upload);
  }
}
