const toggleBtn = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggleBtn) {
    toggleBtn.textContent = "تم روشن";
  }
}

toggleBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  if (toggleBtn) {
    toggleBtn.textContent = isDark ? "تم روشن" : "تم شب";
  }
});
