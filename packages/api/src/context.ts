import { UnauthorizedError, uuid } from '@etimo-achievements/common';
import { getRepositories, getTransactionRepositories, Repositories } from '@etimo-achievements/data';
import { IContext, TransactionRepositories } from '@etimo-achievements/service';
import { IFeatureService, ILogger, INotifyService, JWT } from '@etimo-achievements/types';
import { DevLogger, FeatureServiceFactory, getEnvVariable, NotifyServiceFactory } from '@etimo-achievements/utils';
import { getWorkers, Workers } from '@etimo-achievements/worker-common';
import { Request, Response } from 'express';

let count: number = 0;

type ContextOptions = {
  logger?: ILogger;
  notifier?: INotifyService;
  feature?: IFeatureService;
};

export type IApiContext = IContext & {
  workers: Workers;
};

export class Context implements IApiContext {
  public logger: ILogger;
  public notifier: INotifyService;
  public feature: IFeatureService;
  public workers: Workers;
  public remoteAddress: string;
  public requestId: string;
  public requestDate: Date;
  public timestamp: string;
  public jwt?: JWT;
  public scopes?: string[];
  public refreshTokenId?: string;
  public refreshTokenKey?: string;

  constructor(private req: Request, private res: Response, options?: ContextOptions) {
    this.logger = options?.logger ?? new DevLogger(this);
    this.notifier = options?.notifier ?? NotifyServiceFactory.create('slack', this);
    this.feature = options?.feature ?? FeatureServiceFactory.create('unleash', this);
    this.remoteAddress = req.ip;
    this.requestId = req.get('X-Request-Id') ?? uuid();
    this.requestDate = new Date();
    this.timestamp = new Date().toTimeString().split(' ')[0];
    this.workers = getWorkers();
    count++;
  }

  public get repositories(): Repositories {
    return getRepositories();
  }

  public async transactionRepositories(): Promise<TransactionRepositories> {
    return getTransactionRepositories();
  }

  public get loggingContext() {
    if (getEnvVariable('LOG_CONTEXT') !== 'true') {
      return {};
    }

    const context: any = {
      requestId: this.requestId,
      userId: this.jwt?.act,
      isClient: this.jwt?.act !== this.jwt?.sub,
      email: this.jwt?.email,
      scopes: this.scopes,
      request: {
        userAgent: this.req.get('user-agent'),
        method: this.req.method,
        httpVersion: this.req.httpVersion,
        originalUrl: this.req.originalUrl,
        query: this.req.query,
        url: this.req.url,
      },
      response: {
        elapsed: Date.now() - this.requestDate.getTime(),
        statusCode: this.res.statusCode,
        statusMessage: this.res.statusMessage,
      },
    };

    if (getEnvVariable('LOG_HEADERS') === 'true') {
      context.request.headers = this.requestHeaders;
      context.response.headers = this.responseHeaders;
    }

    return context;
  }

  // #security -- delete sensitive request headers here
  public get requestHeaders() {
    const headers = { ...this.req.headers };
    delete headers['cookie'];
    delete headers['authorization'];
    delete headers['user-agent'];
    return headers;
  }

  // #security -- delete sensitive response headers here
  public get responseHeaders() {
    const headers = { ...this.res.getHeaders() };
    delete headers['set-cookie'];
    return headers;
  }

  public setLogger(logger: ILogger) {
    this.logger = logger;
  }

  public get userId() {
    const userId = this.jwt?.act;

    if (!userId) {
      throw new UnauthorizedError('You are not logged in');
    }

    return userId;
  }

  public get shortRequestId(): string {
    return this.requestId.substring(0, 7);
  }

  public get requestCount() {
    return count;
  }
}
