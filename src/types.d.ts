export interface CallbackObject {
  success: Function;
  error: Function;
  upgradeneeded: Function;
}

export interface IDBEvent {
  target: {
    result: IDBDatabase;
  };
}

export interface IndexItem {
  name: string;
  index: string;
}