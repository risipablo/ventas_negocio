import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import authRoutes from './modules/auth/auth.routes';
import salesRoutes from './modules/sales/sales.routes';
import listRoutes from './modules/list/list.routes'
import gastoRoutes from './modules/gastos/gastos.route'
import clientesRoutes from './modules/clientes/cliente.routes'
import proveedoresRoutes from './modules/proveedores/proveedores.route'
import carritoRoutes from './modules/carrito/carrito.routes'
import notaRoutes from './modules/notas/nota.route'
import errorHandler from './middlewares/errorMiddleware';
import { env } from './config/env';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandlers();
  }

  private middlewares(): void {
    this.app.use(
      helmet({
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      })
    );

    this.app.use(mongoSanitize());

    this.app.use(
      cors({
        origin: [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          'http://localhost:5176',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());
  }

  private routes(): void {
    
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/sales', salesRoutes);
    this.app.use('/api/list', listRoutes)
    this.app.use('/api/gastos', gastoRoutes)
    this.app.use('/api/clientes', clientesRoutes)
    this.app.use('/api/proveedors', proveedoresRoutes)
    this.app.use('/api/carritos', carritoRoutes)
    this.app.use('/api/notas', notaRoutes)
    
    this.app.get('/api/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private errorHandlers(): void {
    this.app.use((req: Request, res: Response) => {
      console.warn(`[404] ${req.method} ${req.originalUrl}`);
      res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path,
      });
    });

    this.app.use(errorHandler);

    this.app.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error('[500] Error:', err.message);
        console.error(err.stack);

        res.status(500).json({
          error:
            env.NODE_ENV === 'production'
              ? 'Error interno del servidor'
              : err.message,
        });
      }
    );
  }
}

export default new App().app;