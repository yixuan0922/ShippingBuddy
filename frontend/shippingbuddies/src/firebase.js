import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: config.apiKey,
//   authDomain: config.authDomain,
//   projectId: config.projectId,
//   storageBucket: config.storageBucket,
//   messagingSenderId: config.messagingSenderId,
//   appId: config.appId,
//   measurementId: config.measurementId,
// };
const firebaseConfig = {
  apiKey: "AIzaSyCepPbnwFWVQ2oxCHY5-dTrn3SRTFuFy6I",
  authDomain: "shippingbuddies-e4ff3.firebaseapp.com",
  projectId: "shippingbuddies-e4ff3",
  storageBucket: "shippingbuddies-e4ff3.appspot.com",
  messagingSenderId: "177921551853",
  appId: "1:177921551853:web:9bd9d308ede04e6eb18be4",
  measurementId: "G-Y7TGEPTRKG",
};
console.log(getApps().length);
const app = initializeApp(firebaseConfig);
console.log(getApps().length);
const auth = getAuth(app);

export { auth };
