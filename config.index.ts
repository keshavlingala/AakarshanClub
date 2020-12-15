import {writeFile} from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
   production: true,
   firebase: {
        apiKey: '${process.env.FIREBASE_API_KEY}',
        authDomain: 'aakarshankmit.firebaseapp.com',
        databaseURL: 'https://aakarshankmit.firebaseio.com',
        projectId: 'aakarshankmit',
        storageBucket: 'aakarshankmit.appspot.com',
        messagingSenderId: '556366404515',
        appId: '1:556366404515:web:15d24b5658d8ce09'
    },
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
