 import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonPage,
} from '@ionic/react';
import './Details.css';
import { handleSignup } from '../auth/userAuth';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const IsValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const HasUppercase = (str: string): boolean => {
  return /[A-Z]/.test(str);
};

const HasNumber = (str: string): boolean => {
  return /[0-9]/.test(str);
};

const HasSymbol = (str: string): boolean => {
  return /[^A-Za-z0-9]/.test(str);
};

const IsValidPassword = (pswd: string): boolean => {
  return (
    pswd.length >= 8 &&
    HasUppercase(pswd) &&
    HasNumber(pswd) &&
    HasSymbol(pswd)
  );
};

const IsValidName = (name: string): boolean => {
  return /^[A-Za-zÀ-ÿ\s'-]+$/.test(name) && name.trim().length >= 2;
};

const IsValidDOB = (dob: string): boolean => {
  if (!dob) return false;

  const date = new Date(dob);
  const today = new Date();

  return !isNaN(date.getTime()) && date <= today;
};

const GetAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthday) {
    age--;
  }

  return age;
};

const IsOldEnough = (dob: string, minimumAge: number): boolean => {
  return GetAge(dob) >= minimumAge;
};




const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [confPswd, setConfPswd] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const validateSignup = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setErr("First and last name are required");
      return false;
    }

    if (!IsValidName(firstName) || !IsValidName(lastName)) {
      setErr("Names contain invalid characters");
      return false;
    }

    if (!IsValidEmail(email)) {
      setErr("Invalid email address");
      return false;
    }

    if (!IsValidPassword(pswd)) {
      setErr(
        "Password must be at least 8 characters and contain an uppercase letter, number, and symbol"
      );
      return false;
    }

    if (pswd !== confPswd) {
      setErr("Passwords do not match");
      return false;
    }

    if (!IsValidDOB(dob)) {
      setErr("Invalid date of birth");
      return false;
    }

    if (!IsOldEnough(dob, 13)) {
      setErr("You must be at least 13 years old");
      return false;
    }

    return true;
  };

  const signup = async () => {
    setErr("");

    if (!validateSignup()) {
      return;
    }

    try {
      await handleSignup(email, pswd, firstName, lastName, dob, stayLoggedIn);
      navigate('/home');
    } catch (error: any) {
      setErr(error.message);
    }
  };


  return (
    <IonPage>
      <IonContent fullscreen >
        <IonInput type='text' label='First Name' onIonInput={(e) => setFirstName(e.detail.value ?? "")} />
        <IonInput type='text' label='Last Name' onIonInput={(e) => setLastName(e.detail.value ?? "")} />
        <IonInput type='date' label='Date of birth' onIonInput={(e) => setDob(e.detail.value ?? "")} />
        <IonInput type='email' label='Email Adress' onIonInput={(e) => setEmail(e.detail.value ?? "")} />
        <IonInput type='password' label='Password' onIonInput={(e) => setPswd(e.detail.value ?? "")} >
          <IonInputPasswordToggle slot='end' />
        </IonInput>
        <IonInput type='password' label='Confirm Password' onIonInput={(e) => setConfPswd(e.detail.value ?? "")} >
          <IonInputPasswordToggle slot='end' />
        </IonInput>
        <div>
          <IonCheckbox
            checked={stayLoggedIn}
            onIonChange={(e) => setStayLoggedIn(Boolean(e.detail.checked))}
          />
          <IonLabel>Stay logged in</IonLabel>
        </div>
        {err && <p>{err}</p>}
        <IonButton onClick={signup}>Signup</IonButton>
        <IonButton onClick={() => navigate("/login")}>I already have an account</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
