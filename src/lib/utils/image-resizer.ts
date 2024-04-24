import crypto from 'crypto';
import Resizer from 'react-image-file-resizer';

async function resize(
  base64Uri: string | File | Blob | ProgressEvent<FileReader>
) {
  try {
    const blob = await fetch(base64Uri as string).then(res => res.blob());
    const fileName = crypto.randomBytes(12).toString('hex');

    const resizedFile = new File([blob], `${fileName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
    return resizedFile;
  } catch (error) {
    throw new Error('Error while resizing');
  }
}

export default function imageResizer(
  file: File,
  height: number,
  width: number
) {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      'WEBP',
      100,
      0,
      base64Uri => {
        try {
          const resizedFile = resize(base64Uri);
          resolve(resizedFile);
        } catch (err) {
          reject(err);
        }
      },
      'base64'
    );
  });
}
