import { Application, json, urlencoded, Response, Request, NextFunction } from "express";
import http from 'http';
import cors from 'cors'; // Cross-Origin Resource Sharing
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

const SERVER_PORT = 3000;

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app); 
  }

  private securityMiddleware(app: Application): void{
    app.use(
      cookieSession({
        name: 'session',
        keys: ['test1', 'test2'],
        maxAge: 24 * 7 * 3600000,
        secure: false
      })
    )
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    )
  }
  
  private standardMiddleware(app: Application): void{
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddleware(app: Application): void{}

  private globalErrorHandler(app: Application): void{}

  private async startServer(app: Application): Promise<void>{
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  // websocket vs. http
  // websocket和http都是建立在tcp之上的
  // websocket支持双向链接
  //    前端和服务器建立连接后，服务器也可以向各个不同的前端发单独送信息
  // http只支持但相连接
  //    连接后，只能前端发给后端，后端不知道是哪个前端
  //    发送信息后，前端与后端的链接就中断了
  // 出现性能差
  //    http可延展性更高，能支持的并发更高
  //    websocket运行成本更高
  // 为什么不都用http?
  //  http有些场景实现不了：聊天软件
  //    UserA 给服务器发送信息，服务器再给UserB；必须清楚谁是谁
  private createSocketIO(httpServer: http.Server): void{}

  private startHttpServer(httpServer: http.Server): void{
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  }
}