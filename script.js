// Firebase 配置（复制你的 Firebase 配置代码）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 登录
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password).then(user => {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("record-section").style.display = "block";
    loadRecords(user.user.uid);
  }).catch(error => alert(error.message));
}

// 注册
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password).then(user => {
    alert("注册成功");
  }).catch(error => alert(error.message));
}

// 记录提交
document.getElementById("record-form").onsubmit = function(e) {
  e.preventDefault();
  const userId = auth.currentUser.uid;
  const record = {
    date: document.getElementById("date").value,
    project: document.getElementById("project").value,
    amount: parseFloat(document.getElementById("amount").value),
    result: document.getElementById("result").value,
    tags: document.getElementById("tags").value,
    notes: document.getElementById("notes").value,
  };
  db.collection("records").add({
    ...record,
    userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    loadRecords(userId);
  });
};

// 加载记录
function loadRecords(userId) {
  db.collection("records").where("userId", "==", userId).orderBy("createdAt", "desc").get().then(snapshot => {
    const tableBody = document.querySelector("#record-table tbody");
    tableBody.innerHTML = "";
    snapshot.forEach(doc => {
      const row = document.createElement("tr");
      const record = doc.data();
      row.innerHTML = `
        <td>${record.date}</td>
        <td>${record.project}</td>
        <td>${record.amount}</td>
        <td>${record.result}</td>
        <td>${record.tags}</td>
        <td>${record.notes}</td>
      `;
      tableBody.appendChild(row);
    });
  });
}
