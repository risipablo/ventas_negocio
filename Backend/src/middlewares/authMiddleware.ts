import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../modules/auth/auth.model';
import { UserModel } from '../modules/auth/auth.schema';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(`[PROTECT] ${req.method} ${req.originalUrl}`);
  console.log('[PROTECT] cookies:', req.cookies);
  console.log(
    '[PROTECT] authorization:',
    req.headers.authorization ? 'presente' : 'ausente'
  );

  let token: string | undefined;

  if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('[PROTECT] Token tomado de cookie');
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('[PROTECT] Token tomado del header Authorization');
  }

  if (!token) {
    console.warn('[PROTECT] Sin token → 401');
    res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as IJwtPayload;

    console.log('[PROTECT] Token decodificado:', decoded);

    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      console.warn('[PROTECT] Usuario no encontrado → 401');
      res.status(401).json({ error: 'Usuario no encontrado.' });
      return;
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      console.warn('[PROTECT] tokenVersion desactualizado → 401');
      res
        .status(401)
        .json({ error: 'Sesión cerrada. Volvé a iniciar sesión.' });
      return;
    }

    req.user = user;
    console.log(`[PROTECT] OK → ${user._id} ${user.email}`);
    next();
  } catch (err) {
    console.error('[PROTECT] Token inválido:', (err as Error).message);
    res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
  }
};