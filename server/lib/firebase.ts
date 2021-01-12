import admin from 'firebase-admin';
import serviceAccount from './config/firebase-service-key.json';

export function initFirebase(): void {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: 'https://qw-pusher.firebaseio.com',
    });
  }
}
