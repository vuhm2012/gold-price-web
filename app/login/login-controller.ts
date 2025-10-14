import { firebaseAuth } from '@/lib/firebase/init';

const loginWithFirebase = async (email: string, password: string) => {
  // const result = await signInWithEmailAndPassword(
  //   firebaseAuth,
  //   email,
  //   password
  // );
  // localStorage.setItem('access_token', await result.user.getIdToken());
  // return result;
  return true
};

export { loginWithFirebase };
