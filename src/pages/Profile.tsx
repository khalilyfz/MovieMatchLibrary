import React, { useEffect, useState } from "react";
import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSpinner,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import { doc, onSnapshot } from "firebase/firestore";
import {
    filmOutline,
    logOutOutline,
    mailOutline,
    personOutline,
    shieldCheckmarkOutline,
} from "ionicons/icons";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { calculateAge } from "../auth/userAuth";

interface UserProfileData {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    photo_url?: string;
    email?: string;
    role?: "admin" | "user";
    liked_movies?: string[];
}


const Profile: React.FC = () => {
    const { user, role, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const age = calculateAge(profile?.date_of_birth);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, "users", user.uid),
            (docSnap) => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfileData);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching profile:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                        <IonSpinner name="crescent" />
                    </div>
                ) : (
                    <>
                        {/* Profile Header Card */}
                        <IonCard style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                                <IonAvatar style={{ width: "110px", height: "110px", border: "3px solid var(--ion-color-primary)" }}>
                                    {profile?.photo_url ? (
                                        <img src={profile.photo_url} alt="Profile" />
                                    ) : (
                                        <div
                                            style={{
                                                backgroundColor: "var(--ion-color-step-200)",
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "2.5rem",
                                            }}
                                        >
                                            👤
                                        </div>
                                    )}
                                </IonAvatar>
                            </div>

                            <IonCardTitle>
                                {profile?.first_name} {profile?.last_name}
                            </IonCardTitle>

                            <IonCardSubtitle style={{ marginTop: "0.5rem" }}>
                                <IonBadge color={role === "admin" ? "warning" : "medium"}>
                                    {role?.toUpperCase() || "USER"}
                                </IonBadge>
                            </IonCardSubtitle>
                        </IonCard>

                        {/* Admin Dashboard Button (Only visible if Admin) */}
                        {role === "admin" && (
                            <IonButton
                                expand="block"
                                color="secondary"
                                routerLink="/admin"
                                className="ion-margin-bottom"
                            >
                                <IonIcon slot="start" icon={shieldCheckmarkOutline} />
                                Admin Dashboard
                            </IonButton>
                        )}

                        {/* User Details List */}
                        <IonList inset>
                            <IonItem lines="full">
                                <IonIcon slot="start" icon={mailOutline} color="primary" />
                                <IonLabel>
                                    <p>Email</p>
                                    <h2>{profile?.email || user?.email}</h2>
                                </IonLabel>
                            </IonItem>

                            <IonItem lines="full">
                                <IonIcon slot="start" icon={personOutline} color="primary" />
                                <IonLabel>
                                    <p>Age</p>
                                    <h2>{age !== null ? `${age} years old` : "Not provided"}</h2>
                                </IonLabel>
                            </IonItem>

                            <IonItem lines="none">
                                <IonIcon slot="start" icon={filmOutline} color="primary" />
                                <IonLabel>
                                    <p>Favorite Playlist</p>
                                    <h2>{profile?.liked_movies?.length ?? 0} Movies Saved</h2>
                                </IonLabel>
                            </IonItem>
                        </IonList>

                        {/* Logout Button */}
                        <IonButton
                            expand="block"
                            color="danger"
                            fill="outline"
                            className="ion-margin-top"
                            onClick={logout}
                        >
                            <IonIcon slot="start" icon={logOutOutline} />
                            Logout
                        </IonButton>
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Profile;