import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
export default function LoginPage() {
  function signIn() {
    signInWithEmailAndPassword(auth, "jon@gmail.com", "123123")
      .then((userCredential) => {
        // Signed in
        console.log("signedin");

        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  return (
    <div>
      <button onClick={signIn}>login</button>
      login
    </div>
  );
}
