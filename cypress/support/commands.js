import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';
import 'cypress-file-upload';


const fbConfig = {
  apiKey: "AIzaSyDQ4kXM-H_M4y5LabXQRGnEGOSEjHaB0DQ",
  authDomain: "team1-test-67251.firebaseapp.com",
  databaseURL: "https://team1-test-67251.firebaseio.com",
  projectId: "team1-test-67251",
  storageBucket: "team1-test-67251.appspot.com",
  messagingSenderId: "374277221605",
  appId: "1:374277221605:web:d0c37b704a1d48dd90780c"
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase })