import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

export const signJwtAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyJwtAccessToken = (token: string): JWTPayload | null => {
  try {
    console.log('Verifying JWT token with secret:', JWT_SECRET ? 'Set' : 'Not set');
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('JWT verification successful:', decoded);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};
