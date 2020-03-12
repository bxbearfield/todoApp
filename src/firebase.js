//import * as firebase from 'firebase';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/messaging";
import "firebase/database";

const config = {
    apiKey: "AIzaSyDMSRJdQb-Bfwx0-1JD-hsyGZvzx98WHxw",
    authDomain: "tododb-b1da6.firebaseapp.com",
    databaseURL: "https://tododb-b1da6.firebaseio.com",
    projectId: "tododb-b1da6",
    storageBucket: "",
    messagingSenderId: "272309204605",
    appId: "1:272309204605:web:e943a437e294b8db"
  };

  firebase.initializeApp(config);

  const firebaseDB = firebase.database();
  const firebaseAU = firebase.auth();

  export {firebaseDB, firebaseAU}