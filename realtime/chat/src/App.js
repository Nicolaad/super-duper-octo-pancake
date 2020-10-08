import React from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDsYSz4aobkTnebuIF3IalCDKBrHmfq8kw",
  authDomain: "chat-4ddbe.firebaseapp.com",
  databaseURL: "https://chat-4ddbe.firebaseio.com",
  projectId: "chat-4ddbe",
  storageBucket: "chat-4ddbe.appspot.com",
  messagingSenderId: "965897329937",
  appId: "1:965897329937:web:0c64f3437a46e286d300b0",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with google!</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign out!</button>
    )
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  return (
    <div>
      {messages &&
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid } = props.message;
  return (
    <div>
      <p>{text}</p>
    </div>
  );
}
export default App;
