// src/cardService.js
import { db } from "./firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore"; 

// Function 1: Save the card (Used on the Creator Page)
export const createCard = async (sender, recipient, message, bouquet) => {
  try {
    const docRef = await addDoc(collection(db, "cards"), {
      sender: sender,
      recipient: recipient,
      message: message,
      bouquet: bouquet, // This is your array/object of flowers
      createdAt: new Date()
    });
    // This returns the ID (e.g., "7f8a9s7d") so you can make the link
    return docRef.id; 
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};

// Function 2: Fetch the card (Used on the Viewer Page)
export const getCardData = async (cardId) => {
  try {
    const docRef = doc(db, "cards", cardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such card!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching document: ", e);
    return null;
  }
};