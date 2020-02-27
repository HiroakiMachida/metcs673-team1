import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';
import 'cypress-file-upload';
import * as config from '../../src/config'

firebase.initializeApp(config.firebase);

attachCustomCommands({ Cypress, cy, firebase })