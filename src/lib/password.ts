const CHARS = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#";

export function generatePassword(length = 12): string {
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return pwd;
}
