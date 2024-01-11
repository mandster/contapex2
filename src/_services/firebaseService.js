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
  console.log(product);
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

const updateProductInFirebase = async (id, updatedProduct) => {
  console.log(id);

  console.log(updatedProduct.size);
  if (typeof updatedProduct.size === "undefined") {
    updatedProduct.size = 0;
  }
  // Assuming productRef is a valid DocumentReference obtained from Firestore
  const productRef = doc(db, "products", String(id));

  // Example data to update
  const dataToUpdate = {
    // Valid field value types: string, number, boolean, object, array, null
    productName: updatedProduct.productName,
    description: updatedProduct.description,
    size: updatedProduct.size,
    // ... other fields
  };
  console.log(dataToUpdate);
  try {
    await updateDoc(productRef, dataToUpdate);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
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
