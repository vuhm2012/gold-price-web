export class BaseEntity<T> {
  result: 'OK' | 'NG';
  data: T | ErrorEntity;

  constructor(result: 'OK' | 'NG', data: T | ErrorEntity) {
    this.result = result;
    this.data = data;
  }
}

export class ErrorEntity {
  message_id: string;

  constructor(messageId: string) {
    this.message_id = messageId;
  }
}