// config/firebase.js
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Chỉ khởi tạo Firebase Admin SDK nếu chưa được khởi tạo
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK đã được khởi tạo');
}

export default admin;