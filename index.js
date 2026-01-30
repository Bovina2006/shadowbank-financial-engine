import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "./firebase.js";

const errorMessage = document.getElementById("error-message");

/* LOGIN */
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  errorMessage.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      errorMessage.textContent = "Wrong password, please try again.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage.textContent = "No account found with this email.";
    } else {
      errorMessage.textContent = "Login failed. Please try again.";
    }
  }
});

/* REGISTER */
document.getElementById("registerBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully!");
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

/* FORGOT PASSWORD */
document.getElementById("forgotBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    errorMessage.textContent = "Please enter your email first.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent.");
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
