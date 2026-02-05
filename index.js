import {
  auth,
  provider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup
} from "./firebase.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

/* ================= LOGIN ================= */

document.getElementById("loginBtn").addEventListener("click", async () => {
  errorMessage.textContent = "";

  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    if (!userCred.user.emailVerified) {
      errorMessage.textContent = "Please verify your email before logging in.";
      return;
    }

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

/* ================= REGISTER ================= */

document.getElementById("registerBtn").addEventListener("click", async () => {
  errorMessage.textContent = "";

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    await sendEmailVerification(userCred.user);

    errorMessage.textContent =
      "Account created. Verification email sent. Please verify before login.";

  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

/* ================= GOOGLE LOGIN ================= */

window.googleLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "dashboard.html";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
};

/* ================= FORGOT PASSWORD ================= */

document.getElementById("forgotBtn").addEventListener("click", async () => {
  errorMessage.textContent = "";

  if (!emailInput.value) {
    errorMessage.textContent = "Please enter your email first.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, emailInput.value);
    errorMessage.textContent = "Password reset email sent.";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
