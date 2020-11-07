import { Timestamp } from './timestamp';
import * as moment from 'moment';
import firebase from 'firebase';
import * as admin from 'firebase-admin';

export class M {
    constructor (private _data) { }

    removeProps(keys: string[]) {
        const data = Object.entries(this._data)
            .filter(([key, _]) => !keys.includes(key))
            .reduce((p, [k, v]) => ({...p, [k]: v}), {});
        return new M(data);
    }

    filterProps(keys: string[]) {
        const data = Object.entries(this._data)
            .filter(([key, _]) => keys.includes(key))
            .reduce((p, [k, v]) => ({...p, [k]: v}), {});
        return new M(data);
    }

    toMoment(firestore: any = firebase.firestore || admin.firestore) {
        return new M(timestampsToMoments(this._data, firestore));
    }

    toTimestamp(firestore: any = firebase.firestore || admin.firestore) {
      return new M(momentsToTimestamps(this._data, firestore));
    }

    data() {
      return this._data;
    }
}

export function momentsToTimestamps(obj: any, firestore: any): any {
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
  
export function timestampsToMoments(obj: any, firestore: any): any {
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
  
export function isTimestamp(v: any, firestore): boolean {
  return v instanceof firestore.Timestamp;
}