import { db } from './firebase.js';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";

const DELAY = 800; // Keep delay for UI feedback feeling



export const api = {
  // Simulate Aadhaar Verification (Still simulated as we don't have a real Aadhaar API)
  verifyAadhaar: async (aadhaar) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (!/^\d{12}$/.test(aadhaar)) {
          reject('Invalid Aadhaar Number. Must be 12 digits.');
          return;
        }

        try {
          // Check if already registered in Firestore
          const q = query(collection(db, "users"), where("aadhaar", "==", aadhaar));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            reject('Aadhaar number already registered.');
            return;
          }

          // In a real app, we would hit an UIDAI API here.
          // For this demo, we'll allow any valid 12-digit aadhaar that isn't already registered.
          // We return mock details to pre-fill the form.
          resolve({
            aadhaar: aadhaar,
            name: 'Citizen ' + aadhaar.slice(-4), // Mock name
            address: '123, Gandhi Road, New Delhi',
            phone: '98765' + aadhaar.slice(-5),
            email: '',
            state: 'Delhi',
            district: 'New Delhi',
            taluka: 'Connaught Place',
            village: '',
            pincode: '110001'
          });

        } catch (error) {
          console.error("Error verifying aadhaar:", error);
          reject('Service unavailable. Please try again.');
        }
      }, DELAY);
    });
  },

  // Simulate Sending OTP
  sendOtp: async (phone) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`OTP sent to ${phone}: 123456`);
        resolve(true); // Always succeed for demo
      }, DELAY);
    });
  },

  // Simulate Verifying OTP
  verifyOtp: async (otp) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (otp === '123456') {
          resolve(true);
        } else {
          reject('Invalid OTP');
        }
      }, DELAY / 2);
    });
  },

  // Register User -> Store in Firestore
  register: async (userData) => {
    try {
      // Create a document with Aadhaar as ID for easy lookup, or auto-ID
      // Let's use auto-ID but ensure unique aadhaar via query check (done in verify)
      const docRef = await addDoc(collection(db, "users"), {
        ...userData,
        createdAt: new Date().toISOString()
      });
      return { ...userData, id: docRef.id };
    } catch (e) {
      console.error("Error adding user: ", e);
      throw e;
    }
  },

  // Login -> Check Firestore
  login: async (aadhaar, password) => {
    try {
      const q = query(collection(db, "users"), where("aadhaar", "==", aadhaar), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const session = { ...userData, id: userDoc.id };
        delete session.password; // Don't store password in session

        localStorage.setItem('currentUser', JSON.stringify(session));
        return session;
      } else {
        throw new Error('Invalid Aadhaar number or password');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to be caught by UI
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  },

  // Get Current User
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  },

  // Submit Complaint -> Store in Firestore
  submitComplaint: async (complaintData) => {
    try {
      const docRef = await addDoc(collection(db, "complaints"), {
        ...complaintData,
        status: 'Submitted',
        history: [
          { status: 'Submitted', timestamp: new Date().toISOString(), note: 'Complaint received.' }
        ],
        createdAt: new Date().toISOString()
      });

      // Update the returned object with the generated ID
      return { ...complaintData, id: docRef.id };
    } catch (e) {
      console.error("Error submitting complaint: ", e);
      throw e;
    }
  },

  // Get User Complaints -> Fetch from Firestore
  getComplaints: async (userAadhaar) => {
    try {
      const q = query(collection(db, "complaints"), where("userId", "==", userAadhaar));
      const querySnapshot = await getDocs(q);

      const complaints = [];
      querySnapshot.forEach((doc) => {
        complaints.push({ id: doc.id, ...doc.data() });
      });

      // Client-side sort for now
      return complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return [];
    }
  },

  // Get Single Complaint
  getComplaint: async (id) => {
    try {
      const docRef = doc(db, "complaints", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting complaint:", error);
      throw error;
    }
  },

  // Update User Details
  updateUser: async (aadhaar, updates) => {
    try {
      const q = query(collection(db, "users"), where("aadhaar", "==", aadhaar));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);

        await updateDoc(userRef, updates);

        // Update local session if needed
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.aadhaar === aadhaar) {
          localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...updates }));
        }

        return { ...userDoc.data(), ...updates };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};
