// firebaseService.js
import app from "../firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
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
    description: updatedProduct.description || "",
    price: updatedProduct.price || "",
    price2: updatedProduct.price2 || "",
    price3: updatedProduct.price3 || "",
    size: updatedProduct.size || "",
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

const getProductByIdFromFirebase = async (productId, employeeId) => {
  try {
    const productDoc = await getDoc(doc(db, "products", productId));
    if (productDoc.exists()) {
      const productData = productDoc.data();
      const employeeDoc = await getDoc(doc(db, "employees", employeeId));
      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data();
        const priceCategory = employeeData.priceCategory;
        let priceKey;
        if (priceCategory === "1") {
          priceKey = "price";
        } else {
          priceKey = "price" + priceCategory;
        }
        console.log(
          productId +
            " " +
            employeeId +
            " " +
            priceKey +
            " p " +
            productData.productName
        );
        console.log(productData[priceKey]);
        return {
          id: productDoc.id,
          productName: productData.productName,
          price: parseFloat(productData[priceKey]) || 0,
          // Add other fields as needed
        };
      } else {
        throw new Error(`Employee with ID ${employeeId} does not exist`);
      }
    } else {
      throw new Error(`Product with ID ${productId} does not exist`);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
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
  console.log(price);

  const docRef = await addDoc(collection(db, "prices"), price);
  return docRef.id;
};

const updatePriceInFirebase = async (id, updatedPrice) => {
  const priceRef = doc(db, "prices", id);
  console.log(updatedPrice);
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
        id: doc.id,
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

/// Function to add an entry to the 'entries' collection
const addEntryToFirebase = async (entry) => {
  console.log(entry);
  try {
    const docRef = await addDoc(collection(db, "entries"), entry);
    return docRef.id;
  } catch (error) {
    console.error("Error adding entry:", error);
    throw error;
  }
};

// Function to update an entry in the 'entries' collection
const updateEntryInFirebase = async (entryId, updatedEntry) => {
  try {
    const entryRef = doc(db, "entries", entryId);
    await updateDoc(entryRef, updatedEntry);
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

// Function to delete an entry from the 'entries' collection
const deleteEntryInFirebase = async (entryId) => {
  console.log(entryId);
  try {
    const entryRef = doc(db, "entries", entryId);
    await deleteDoc(entryRef);
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
};

const copyPriceDataToProd = async () => {
  try {
    // Fetch all documents from the "price" collection
    const priceSnapshot = await getDocs(collection(db, "prices"));
    const priceDocuments = priceSnapshot.docs.map((doc) => doc.data());

    // Fetch all documents from the "product" collection
    const productSnapshot = await getDocs(collection(db, "products"));
    const productDocuments = productSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Iterate through each product document
    for (const product of productDocuments) {
      // Find the corresponding document in the "price" collection based on productId
      const matchingPriceDoc = priceDocuments.find(
        (price) => price.productId === product.id
      );

      if (matchingPriceDoc) {
        // Copy price data from "price" document to "product" document
        const { price, price2, price3 } = matchingPriceDoc;
        const productRef = doc(db, "products", product.id);
        console.log(price + price2 + price3 + " d ");

        await updateDoc(productRef, { price, price2, price3 });
        console.log(`Copied price data to product with ID: ${product.id}`);
      }
    }
  } catch (error) {
    console.error("Error copying price data to product:", error);
  }
};

// Function to get all entries from the 'entries' collection
const getAllEntriesFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "entries"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting entries:", error);
    throw error;
  }
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
  addEntryToFirebase,
  updateEntryInFirebase,
  deleteEntryInFirebase,
  getAllEntriesFromFirebase,
  getProductByIdFromFirebase,
  copyPriceDataToProd,
};
