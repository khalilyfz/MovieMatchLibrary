import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const calculateAge = (dobString?: string): number | string => {
  if (!dobString) return "N/A";
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};


export const handleSignup = async (
  email: string,
  pswd: string,
  firstname: string,
  lastname: string,
  dateofbirth: string,
  stayLoggedIn: boolean = true,
) => {
  await setPersistence(auth, stayLoggedIn ? browserLocalPersistence : browserSessionPersistence);

  const userCredential = await createUserWithEmailAndPassword(auth, email, pswd);
  const uid = userCredential.user.uid;

  try {
    await setDoc(doc(db, "users", uid), {
      first_name: firstname,
      last_name: lastname,
      date_of_birth: dateofbirth,
      email: email,
      role: "user",
      liked_movies: [],
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    await userCredential.user.delete();
    throw error;
  }

  return userCredential.user;
};


export const handleLogin = async (email: string, pswd: string, stayLoggedIn: boolean = true) => {
  await setPersistence(auth, stayLoggedIn ? browserLocalPersistence : browserSessionPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, pswd);

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
  if (userDoc.exists() && userDoc.data()?.disabled) {
    await signOut(auth);
    throw new Error("Your account has been banned. Please contact support.");
  }

  return userCredential.user;
};

export const handleLogout = async () => {
  await signOut(auth);
};
