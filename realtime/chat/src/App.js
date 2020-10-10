import React, { useState } from "react";

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

  return (
    <button class="signButton" onClick={signInWithGoogle}>
      Sign in with google!
    </button>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button class="signButton" onClick={() => auth.signOut()}>
        Sign out!
      </button>
    )
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
  };
  return (
    <div>
      <SignOut></SignOut>
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send!</button>
      </form>
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";
  return (
    <div className={`messages ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}
export default App;
