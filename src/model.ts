import * as moment from 'moment';

export class M<K = any> {
    constructor (private readonly _data: K) { }

    removeProps(keys: string[]): M<Partial<K>> {
        return new M<Partial<K>>(removeProps<K>(this._data, keys));
    }

    filterProps(keys: string[]): M<Partial<K>> {
        return new M<Partial<K>>(filterProps<K>(this._data, keys));
    }

    toMoment(firestore: any): M<K> {
        return new M(timestampsToMoments(this._data, firestore));
    }

    toTimestamp(firestore: any): M<K> {
      return new M(momentsToTimestamps(this._data, firestore));
    }

    data(): K {
      return this._data;
    }
}

export interface Firestore {
  Timestamp: any,
  FieldValue: any
}

export function removeProps<T = any>(obj: T, keys: string[]): Partial<T> {
  return Object.entries(obj)
    .filter(([key, _]) => !keys.includes(key))
    .reduce((p, [k, v]) => ({...p, [k]: v}), {} as Partial<T>);
}
export function filterProps<T = any>(obj: T, keys: string[]): Partial<T> {
  return Object.entries(obj)
    .filter(([key, _]) => keys.includes(key))
    .reduce((p, [k, v]) => ({...p, [k]: v}), {} as Partial<T>);
}

export function momentsToTimestamps(obj: any, firestore: Firestore): any {
  if (moment.isMoment(obj)) {
    return firestore.Timestamp.fromDate(obj.toDate())
  } else if (isTimestamp(obj, firestore)) {
    return obj;
  } if (obj instanceof firestore.FieldValue) {
    return obj;
  } else if (obj instanceof Array) {
    return obj.map(value => momentsToTimestamps(value, firestore));
  } else if (typeof obj === 'object' && obj) {
    return Object.entries(obj).reduce((data, [key, value]) => {
      data[key] = momentsToTimestamps(value, firestore);
      return data;
    }, {} as { [key: string]: any });
  } else {
    return obj;
  }
}
  
export function timestampsToMoments(obj: any, firestore: Firestore): any {
  if (moment.isMoment(obj)) {
    return obj;
  } else if (isTimestamp(obj, firestore)) {
    return moment(obj.toDate());
  } else if (firestore.FieldValue && obj instanceof firestore.FieldValue) {
    return obj;
  } else if (obj instanceof Array) {
    return obj.map(v => timestampsToMoments(v, firestore.Timestamp));
  } else if (typeof obj === 'object' && obj) {
    return Object.entries(obj).reduce((p, [k, v]) => ({
      ...p, [k]: timestampsToMoments(v, firestore)
    }), {} as {[key: string]: any});
  } else {
    return obj;
  }
}
  
export function isTimestamp(v: any, firestore: Firestore): boolean {
  return v instanceof firestore.Timestamp;
}