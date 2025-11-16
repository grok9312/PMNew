// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// ❗❗❗ 請將此處替換為您自己的 Firebase 專案設定 ❗❗❗
const firebaseConfig = {
    apiKey: "AIzaSyBcS0q4NRu-LJllT3peYI78MFRyLAjnw98",
    authDomain: "pmnew-386ae.firebaseapp.com",
    projectId: "pmnew-386ae",
    storageBucket: "pmnew-386ae.firebasestorage.app",
    messagingSenderId: "667290651824",
    appId: "1:667290651824:web:597a4d1303c6b9f6373f75",
    measurementId: "G-W385FJ34JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/**
 * 使用 Google 帳戶彈出視窗登入
 * @returns {Promise<UserCredential>}
 */
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    // 登入成功後，可以從 result.user 取得使用者資訊
    console.log("登入成功:", result.user);
    return result;
  } catch (error) {
    console.error("Google 登入錯誤:", error);
    return null;
  }
}

/**
 * 登出目前使用者
 * @returns {Promise<void>}
 */
async function signOutUser() {
  try {
    await signOut(auth);
    console.log("登出成功");
  } catch (error) {
    console.error("登出錯誤:", error);
  }
}

/**
 * 監聽使用者驗證狀態的變化
 * @param {function(User|null)} callback - 當使用者登入或登出時要執行的回呼函式
 * @returns {Unsubscribe} - 可用來取消監聽的函式
 */
function onAuthenticationChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 儲存玩家的遊戲紀錄
 * @param {string} userId - 使用者的唯一 ID
 * @param {object} gameData - 要儲存的遊戲資料，例如 { score: 100, level: 1 }
 * @returns {Promise<void>}
 */
async function savePlayerRecord(userId, gameData) {
  if (!userId) {
    console.error("儲存失敗：未提供 userId");
    return;
  }
  try {
    // 我們將每個玩家的紀錄存在 'playerRecords' 集合中，並以玩家的 UID 作為文件 ID
    const playerDocRef = doc(db, "playerRecords", userId);
    // 使用 setDoc 搭配 { merge: true } 可以更新或新增資料，而不會覆蓋整個文件
    await setDoc(playerDocRef, gameData, { merge: true });
    console.log("玩家紀錄儲存成功:", gameData);
  } catch (error) {
    console.error("儲存玩家紀錄時發生錯誤:", error);
  }
}

/**
 * 獲取玩家的遊戲紀錄
 * @param {string} userId - 使用者的唯一 ID
 * @returns {Promise<object|null>} - 玩家的紀錄物件，如果不存在則返回 null
 */
async function getPlayerRecord(userId) {
  if (!userId) {
    console.error("讀取失敗：未提供 userId");
    return null;
  }
  try {
    const playerDocRef = doc(db, "playerRecords", userId);
    const docSnap = await getDoc(playerDocRef);
    if (docSnap.exists()) {
      console.log("成功讀取玩家紀錄:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("該玩家尚無紀錄");
      return null;
    }
  } catch (error) {
    console.error("讀取玩家紀錄時發生錯誤:", error);
    return null;
  }
}


// 將需要被外部使用的函式匯出
export {
  auth,
  signInWithGoogle,
  signOutUser,
  onAuthenticationChanged,
  savePlayerRecord,
  getPlayerRecord
};
