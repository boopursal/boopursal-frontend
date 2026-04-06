class firebaseService {
    init() {}
    getUserData() { return new Promise(resolve => resolve(null)); }
    updateUserData() {}
    onAuthStateChanged() {}
    signOut() {}
}
const instance = new firebaseService();
export default instance;
