import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount) as any,
    }) as any;
    console.log('Firebase Admin SDK đã được khởi tạo');
}

export default admin;