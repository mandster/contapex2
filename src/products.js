import { useState, useEffect } from "react";
import { app } from "./firebaseConfig";
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [comments, setComments] = useState("");
  const [editId, setEditId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, "products"));
      setProducts(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const addProduct = async () => {
    await addDoc(collection(db, "products"), {
      productName: productName,
      comments: comments,
    });
  };

  const updateProduct = async () => {
    await updateDoc(doc(db, "products", editId), {
      productName: productName,
      comments: comments,
    });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  // ... rest of the component remains the same


return (
  <div>
     <h1>Products</h1>
     <input
       placeholder="Product Name"
       value={productName}
       onChange={(e) => setProductName(e.target.value)}
     />
     <input
       placeholder="Comments"
       value={comments}
       onChange={(e) => setComments(e.target.value)}
     />
     <button onClick={addProduct}>Add Product</button>
     <table>
       <thead>
         <tr>
           <th>Employee Name</th> {/* Change this line */}
           <th>Comments</th>
           <th>Actions</th>
         </tr>
       </thead>
       <tbody>
         {products.map((product) => (
           <tr key={product.id}>
             <td>{product.employeeName}</td> {/* Change this line */}
             <td>{product.comments}</td>
             <td>
               <button
                 onClick={() => {
                  setEditId(product.id);
                  setProductName(product.productName);
                  setComments(product.comments);
                 }}
               >
                 Edit
               </button>
               <button onClick={() => deleteProduct(product.id)}>
                 Delete
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
     {editId ? <button onClick={updateProduct}>Update Product</button> : null}
  </div>
 );
};

export default Products;
