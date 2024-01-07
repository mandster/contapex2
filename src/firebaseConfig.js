import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDod4I8TQ_3FX7ScbIkVxkzuJJtxwOP5Mw",
  authDomain: "contractual-e220f.firebaseapp.com",
  projectId: "contractual-e220f",
  storageBucket: "contractual-e220f.appspot.com",
  messagingSenderId: "506601902944",
  appId: "1:506601902944:web:24d06b93b9ef8281178405",
  measurementId: "G-PBB05C5SEW",
};

const app = initializeApp(firebaseConfig);
export { app };
