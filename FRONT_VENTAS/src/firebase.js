import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const config = {
  apiKey: "AIzaSyAdqjKa8zZv-AvVuIIfReudp1Ium7qTOW4",
  authDomain: "sointeips.firebaseapp.com",
  projectId: "sointeips",
  storageBucket: "sointeips.appspot.com",
  messagingSenderId: "978150789088",
  appId: "1:978150789088:web:38c283b7bf043adfe9a585"
};

let firebasegeneral = app.initializeApp(config);

const firestore = firebasegeneral.firestore();
const fireStorage = firebasegeneral.storage();
const fireRealtime = firebasegeneral.database();
const auth = firebasegeneral.auth();

firestore.settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
});

firestore
  .enablePersistence({ synchronizeTabs: true })
  .then(() => {
    window.eviusFailedPersistenceEnabling = false;
  })
  .catch(err => {
    console.error(err);
    window.eviusFailedPersistenceEnabling = true;
  });

window.firebase = app;

export { app, auth, firestore, fireStorage, fireRealtime,firebasegeneral };
