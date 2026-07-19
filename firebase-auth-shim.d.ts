declare module "firebase/auth" {
  export {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
  } from "@firebase/auth/dist/index";
  export type { Auth, User } from "@firebase/auth/dist/src/model/public_types";
}
