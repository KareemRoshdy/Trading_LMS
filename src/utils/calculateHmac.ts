import crypto from "crypto";

export const calculateHmac = (secret: string, data: any) => {
  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(data);
  return hmac.digest("hex");
};
