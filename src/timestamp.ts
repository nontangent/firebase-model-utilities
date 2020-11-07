import firebase from 'firebase/app';
import * as admin from 'firebase-admin';

export type Timestamp = firebase.firestore.Timestamp | admin.firestore.Timestamp;
export const Timestamp = firebase?.firestore?.Timestamp || admin?.firestore?.Timestamp;

export const firestore = firebase.firestore || admin.firestore;