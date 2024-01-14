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
  query,
  where,
} from "firebase/firestore/lite";

const db = getFirestore(app);

const addProductToFirebase = async (product) => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

const updateProductInFirebase = async (id, updatedProduct) => {
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
const addEmployeeToFirebase = async (employee) => {
  const docRef = await addDoc(collection(db, "employees"), employee);
  return docRef.id;
};

const updateEmployeeInFirebase = async (id, updatedEmployee) => {
  const employeeRef = doc(db, "employees", id);

  const dataToUpdate = {
    employeeName: updatedEmployee.employeeName,
    priceCategory: updatedEmployee.priceCategory,
    definition: updatedEmployee.definition,
    // ... other fields
  };

  try {
    await updateDoc(employeeRef, dataToUpdate);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

const deleteEmployeeInFirebase = async (id) => {
  const employeeRef = doc(db, "employees", id);
  await deleteDoc(employeeRef);
};

const getAllEmployeesFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "employees"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addPriceToFirebase = async (price) => {
  const docRef = await addDoc(collection(db, "prices"), price);
  return docRef.id;
};

const updatePriceInFirebase = async (id, updatedPrice) => {
  const priceRef = doc(db, "prices", id);
  try {
    await updateDoc(priceRef, updatedPrice);
    console.log("Price document successfully updated!");
  } catch (error) {
    console.error("Error updating price document:", error);
  }
};

const deletePriceInFirebase = async (id) => {
  const priceRef = doc(db, "prices", id);
  await deleteDoc(priceRef);
};

const getAllPricesFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "prices"));
  const prices = [];

  for (const doc of querySnapshot.docs) {
    const priceData = doc.data();

    // Check if productId exists before querying
    if (priceData.productId) {
      const productSnapshot = await getDocs(
        query(
          collection(db, "products"),
          where("productId", "==", priceData.productId)
        )
      );

      let productData = null;
      if (productSnapshot.docs.length > 0) {
        productData = productSnapshot.docs[0].data();
      }

      prices.push({
        product: { ...productData, id: priceData.productId },
        price: priceData.price,
        price2: priceData.price2,
        price3: priceData.price3,
        date: priceData.date,
      });
    }
  }

  return prices;
};

const getProductsFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export {
  addProductToFirebase,
  updateProductInFirebase,
  deleteProductInFirebase,
  getAllProductsFromFirebase,
  addEmployeeToFirebase,
  updateEmployeeInFirebase,
  deleteEmployeeInFirebase,
  getAllEmployeesFromFirebase,
  addPriceToFirebase,
  updatePriceInFirebase,
  deletePriceInFirebase,
  getAllPricesFromFirebase,
  getProductsFromFirebase,
};
