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
import { handleLogin } from '../auth/userAuth';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pswd, setPswd] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();


  const login = async () => {
    try {
      setErr("");
      await handleLogin(email, pswd, stayLoggedIn);
      navigate('/home');
    } catch (err: any) {
      setErr(err.message);
    }
  }
  return (
    <IonPage>
      <IonContent fullscreen >
        <IonInput type='email' label='Email Adress' onIonInput={(e) => setEmail(e.detail.value ?? "")} />
        <IonInput type='password' label='Password' onIonInput={(e) => setPswd(e.detail.value ?? "")} >
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
        <IonButton onClick={login}>Login</IonButton>
        <IonButton onClick={() => navigate("/signup")}>Create New Account</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
