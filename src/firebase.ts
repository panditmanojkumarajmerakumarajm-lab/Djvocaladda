import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { AudioSample } from "./types";

// Firebase client configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0848123495",
  appId: "1:286513253164:web:e9e0107c69a5a1740bfa89",
  apiKey: "AIzaSyAyo-ti_P7Dhzxc0EadSSqmkXlOLaWVMvw",
  authDomain: "gen-lang-client-0848123495.firebaseapp.com",
  databaseId: "ai-studio-djvocaladda-d2b04975-360e-41f5-a3a2-80fdadaf971b",
  storageBucket: "gen-lang-client-0848123495.firebasestorage.app",
  messagingSenderId: "286513253164",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.databaseId);

const SAMPLES_COLLECTION = "samples";

// Fetch all samples from Firestore sorted by createdAt
export async function getFirestoreSamples(): Promise<AudioSample[]> {
  try {
    const q = query(collection(db, SAMPLES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const samples: AudioSample[] = [];
    querySnapshot.forEach((document) => {
      const data = document.data();
      samples.push({
        id: document.id,
        title: data.title || "",
        audioUrl: data.audioUrl || "",
        category: data.category || "Voice Drops",
        duration: data.duration || "0:30",
        plays: data.plays || 0,
      });
    });
    return samples;
  } catch (error) {
    console.error("Error fetching samples from Firestore: ", error);
    return [];
  }
}

// Add a sample to Firestore
export async function addFirestoreSample(sample: Omit<AudioSample, "id">): Promise<AudioSample> {
  try {
    const docRef = await addDoc(collection(db, SAMPLES_COLLECTION), {
      ...sample,
      createdAt: Timestamp.now(),
    });
    return {
      id: docRef.id,
      ...sample,
    };
  } catch (error) {
    console.error("Error adding sample to Firestore: ", error);
    throw error;
  }
}

// Delete a sample from Firestore
export async function deleteFirestoreSample(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SAMPLES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting sample from Firestore: ", error);
    throw error;
  }
}
