export enum LogType {
  Error,
  HandledError,
  ValidRequest,
}

export interface ILogStorageModel {
  uuid: string
  logType: LogType
  timestamp: string
  HttpEndpoint: string
  HttpMethod: string
  HttpStatusCode: number
  requestBody?: any
  requestQuery?: any
  stackTrace?: string
  tags?: string[]
  details?: string
}

export class LogStorageModel implements ILogStorageModel {
  constructor(
    public uuid: string,
    public logType: LogType,
    public timestamp: string,
    public HttpEndpoint: string,
    public HttpMethod: string,
    public HttpStatusCode: number,
    public requestBody?: any,
    public requestQuery?: any,
    public stackTrace?: string,
    public tags?: string[],
    public details?: string,
  ) {}

  public toString(): string {
    let logString =
      `User ID: ${this.uuid}` +
      `, Log Type: ${this.logType}` +
      `, Status Code: ${this.HttpStatusCode}` +
      `, Timestamp: ${this.timestamp}` +
      `, HTTP Method: ${this.HttpMethod}` +
      `, URL: ${this.HttpEndpoint}`;

    if (this.logType === LogType.Error ||
      this.logType === LogType.HandledError
    ) {
      logString +=
        this.requestBody ? `, Body: ${JSON.stringify(this.requestBody)}` : '';
      logString +=
        this.requestQuery ? `, Query: ${JSON.stringify(
          this.requestQuery)}` : '';
    }

    if (this.stackTrace &&
      (this.logType === LogType.Error)
    ) {
      logString += `\n Error Stack: ${this.stackTrace}`;
    }
    return logString;
  }
}

export class LogStorageFactory {
  static createLogStorage(
    uuid: string,
    logType: LogType,
    timestamp: string,
    HttpEndpoint: string,
    HttpMethod: string,
    HttpStatusCode: number,
    requestBody?: any,
    requestQuery?: any,
    stackTrace?: string,
    tags?: string[],
    details?: string,
  ) {
    return new LogStorageModel(
      uuid,
      logType,
      timestamp,
      HttpEndpoint,
      HttpMethod,
      HttpStatusCode,
      requestBody,
      requestQuery,
      stackTrace,
      tags,
      details,
    );
  }
}
