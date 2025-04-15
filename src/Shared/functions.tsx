// eslint-disable-next-line import/prefer-default-export
export const firstLetterUpperCase = (message: string) => {
  if (message && message.length > 0) {
    return (
      message[0].toUpperCase() +
      message.substring(1, message.length).toLowerCase()
    );
  }
  return '';
};

export const isValidFileType = (newFile: File) =>
  newFile.type.startsWith('image/') || newFile.type === 'application/pdf';

export const formatCamelCase = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1') // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize the first letter
};
