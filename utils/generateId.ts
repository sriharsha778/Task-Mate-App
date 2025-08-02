import * as Crypto from 'expo-crypto';

export const generateId = async (): Promise<string> => {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return [...bytes]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};
