// firebaseService.js
import app from "../firebaseConfig";

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore/lite";

const db = getFirestore(app);

const addProductToFirebase = async (product) => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

const updateProductInFirebase = async (id, updatedProduct) => {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, updatedProduct);
};

const deleteProductInFirebase = async (id) => {
  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
};

const getAllProductsFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export {
  addProductToFirebase,
  updateProductInFirebase,
  deleteProductInFirebase,
  getAllProductsFromFirebase,
};
