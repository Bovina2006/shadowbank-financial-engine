import {
  auth,
  db,
  signOut,
  deleteUser,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from "./firebase.js";

import { 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let chart = null;

/* =========================
   AUTH PROTECTION
========================= */

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadHistory();
  }
});

/* =========================
   LOGOUT
========================= */

window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

/* =========================
   DELETE ACCOUNT
========================= */

window.deleteAccount = async () => {
  const confirmDelete = confirm("Are you sure you want to delete your account?");
  if (!confirmDelete) return;

  await deleteUser(auth.currentUser);
  alert("Account deleted successfully.");
  window.location.href = "index.html";
};

window.toggleLoanSection = function () {
  const hasLoans = document.getElementById("hasLoans").value;
  document.getElementById("loanSection").classList.toggle("hidden", hasLoans === "no");
};

window.toggleSubSection = function () {
  const hasSubs = document.getElementById("hasSubs").value;
  document.getElementById("subSection").classList.toggle("hidden", hasSubs === "no");
};
document.getElementById("loanCount").addEventListener("change", function () {
  const container = document.getElementById("loanInputs");
  container.innerHTML = "";

  for (let i = 1; i <= this.value; i++) {
    container.innerHTML += `
      <label>Loan ${i} Monthly Payment</label>
      <input type="number" class="loanAmount" placeholder="Enter amount">
    `;
  }
});

document.getElementById("subCount").addEventListener("change", function () {
  const container = document.getElementById("subInputs");
  container.innerHTML = "";

  for (let i = 1; i <= this.value; i++) {
    container.innerHTML += `
      <label>Subscription ${i} Monthly Cost</label>
      <input type="number" class="subAmount" placeholder="Enter amount">
    `;
  }
});


/* =========================
   MAIN ANALYSIS ENGINE
========================= */

window.runSimulation = async () => {
  try {

    const income = +document.getElementById("income").value || 0;
    const savings = +document.getElementById("savings").value || 0;
    const credit = +document.getElementById("credit").value || 0;
    const transactions = +document.getElementById("transactions").value || 0;
    let totalLoan = 0;
    if (document.getElementById("hasLoans").value === "yes") {
      document.querySelectorAll(".loanAmount").forEach(input => {
        totalLoan += (+input.value || 0);
      });
    }

    let totalSubs = 0;
    if (document.getElementById("hasSubs").value === "yes") {
      document.querySelectorAll(".subAmount").forEach(input => {
        totalSubs += (+input.value || 0);
      });
    }


    const years = +document.getElementById("years").value || 1;

    if (income <= 0) {
      alert("Please enter a valid income.");
      return;
    }

    /* ===== Financial Modeling ===== */

    const inflation = savings * 0.06 * years;
    const opportunity = savings * 0.08 * years;
    const micro = transactions * 2 * 12 * years;
    const subscription = totalSubs * 12 * years;
    const loanLoss = totalLoan * 12 * years;


    const total = inflation + opportunity + micro + subscription + loanLoss;

    document.getElementById("totalLeakage").innerText = "₹" + total.toFixed(0);

    /* ===== Financial Health Score ===== */

    let score = 100;

    const dti = (totalLoan / income) * 100;
    const subscriptionRatio = (totalSubs / income) * 100;

    if (dti > 50) score -= 30;
    else if (dti > 35) score -= 15;

    if (credit < 650) score -= 20;
    else if (credit < 750) score -= 10;

    if (subscriptionRatio > 15) score -= 10;

    if (transactions > 150) score -= 5;

    if (score < 0) score = 0;

    document.getElementById("healthScore").innerText = score + "/100";

    let riskText = "Low Risk";
    if (score < 40) riskText = "High Risk";
    else if (score < 70) riskText = "Moderate Risk";

    document.getElementById("riskLevel").innerText = riskText;

    /* ===== Save Monthly History ===== */

    await saveMonthlyHistory(total, score);

    /* ===== Generate Chart ===== */

    generateChart(inflation, opportunity, subscription, micro, loanLoss);
    generateInsights(income, savings, totalLoan, totalSubs, transactions, score);

  } catch (error) {
    console.error("Simulation error:", error);
    alert("Something went wrong. Check console.");
  }
};

/* =========================
   SAVE HISTORY
========================= */

async function saveMonthlyHistory(total, score) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    history: arrayUnion({
      date: new Date().toLocaleDateString(),
      leakage: total,
      score: score
    })
  }, { merge: true });

  loadHistory();
}

/* =========================
   LOAD HISTORY
========================= */

async function loadHistory() {
  const user = auth.currentUser;
  if (!user) return;

  const docSnap = await getDoc(doc(db, "users", user.uid));

  const historyList = document.getElementById("history");
  if (!historyList) return;

  historyList.innerHTML = "";

  if (docSnap.exists() && docSnap.data().history) {
    docSnap.data().history.forEach(entry => {
      const li = document.createElement("li");
      li.innerText = `${entry.date} — ₹${entry.leakage} | Score: ${entry.score}`;
      historyList.appendChild(li);
    });
  }
}

/* =========================
   PIE CHART
========================= */

function generateChart(inflation, opportunity, subs, micro, loan) {

  const ctx = document.getElementById("pieChart");
  if (!ctx) return;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Inflation","Opportunity","Subscriptions","Micro","Loans"],
      datasets: [{
        data: [inflation, opportunity, subs, micro, loan]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function generateInsights(income, savings, totalLoan, totalSubs, transactions, score) {

  const list = document.getElementById("insightsList");
  if (!list) return;

  list.innerHTML = "";

  const insights = [];

  const savingsRate = (savings / income) * 100;
  const loanRatio = (totalLoan / income) * 100;
  const subRatio = (totalSubs / income) * 100;

  // 🧠 SAVINGS
  if (savingsRate < 20) {
    insights.push("⚠️ Your savings rate is low. Try to save at least 20% of your income.");
  } else {
    insights.push("✅ Good savings habit. You're building financial stability.");
  }

  // 💳 LOANS
  if (loanRatio > 40) {
    insights.push("🚨 High loan burden. Consider reducing EMIs or avoiding new loans.");
  } else if (loanRatio > 20) {
    insights.push("⚠️ Moderate loan load. Keep it under control.");
  }

  // 📺 SUBSCRIPTIONS
  if (subRatio > 10) {
    insights.push("📉 You're spending a lot on subscriptions. Cut unused ones.");
  }

  // 🛒 MICRO SPENDING
  if (transactions > 100) {
    insights.push("💸 Frequent small transactions are draining money. Track daily spending.");
  }

  // 📊 SCORE BASED
  if (score < 50) {
    insights.push("🔥 Financial health is weak. Focus on cutting expenses and boosting savings.");
  } else if (score < 75) {
    insights.push("⚠️ You're doing okay, but there's room for improvement.");
  } else {
    insights.push("💎 Strong financial position. Keep it consistent.");
  }

  // 💡 GENERAL TIP
  insights.push("💡 Wealth erosion comes from inflation, missed investments, and hidden spending.");

  // Render
  insights.forEach(text => {
    const li = document.createElement("li");
    li.innerText = text;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const menuDropdown = document.getElementById("menuDropdown");
  const logoutBtn = document.getElementById("logoutBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  if (!menuBtn || !menuDropdown) return;

  // Toggle dropdown
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle("show");
  });

  // Close if clicking outside
  document.addEventListener("click", () => {
    menuDropdown.classList.remove("show");
  });

  // Logout click
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });

  // Delete click
  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    await deleteUser(auth.currentUser);
    alert("Account deleted successfully.");
    window.location.href = "index.html";
  });
});

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", async () => {
    const confirmClear = confirm("Clear all monthly history?");
    if (!confirmClear) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, {
        history: []
      }, { merge: true });

      alert("History cleared.");

      loadHistory(); // refresh UI
    } catch (err) {
      console.error("Clear history error:", err);
      alert("Failed to clear history.");
    }
  });
}