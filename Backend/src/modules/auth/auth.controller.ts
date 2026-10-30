import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { loginSchema, registerSchema } from '../../validators/auth.schema';
import { UserModel } from './auth.schema';
import { IAuthResquest, IJwtPayload } from './auth.model';

const generateToken = (user: {
  _id: unknown;
  role: string;
  name?: string;
  tokenVersion: number;
}): string => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '3h' }
  );
};

export const registerUser = async (
  req: Request<{}, {}, z.infer<typeof registerSchema>>,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });
    const nameExists = await UserModel.findOne({ name });

    if (userExists) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    if (nameExists) {
      res.status(400).json({ error: 'El nombre ya está registrado' });
      return;
    }

    const newUser = new UserModel({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginUser = async (
  req: Request<{}, {}, z.infer<typeof loginSchema>>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: 'Email incorrecto o no autorizado' });
      return;
    }

    const token = generateToken({
      _id: user._id,
      role: user.role,
      name: user.name,
      tokenVersion: user.tokenVersion,
    });

    await UserModel.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Error en el servidor: ' + (err as Error).message });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as IJwtPayload;

      await UserModel.findByIdAndUpdate(decoded.id, {
        $inc: { tokenVersion: 1 },
      });
    }
  } catch (err) {}

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.json({ message: 'Cierre de sesión exitoso' });
};

export const userName = async (
  req: IAuthResquest,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.user?._id).select('name email');

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const validateToken = async (
  req: IAuthResquest,
  res: Response
): Promise<void> => {
  res.status(200).json({
    valid: true,
    user: {
      id: req.user?._id,
      name: req.user?.name,
      email: req.user?.email,
    },
  });
};