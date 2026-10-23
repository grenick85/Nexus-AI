"use strict";
const $ = id => document.getElementById(id);
const STORAGE_KEY = "nexus-ai-demo-messages-v1";
const messages = [];
function render() {
  $("messages").replaceChildren();
  for (const item of messages) {
    const el = document.createElement("div");
    el.className = "message " + item.role;
    el.textContent = item.text;
    $("messages").append(el);
  }
  $("messages").scrollTop = $("messages").scrollHeight;
}
function save() {
  if ($("memory").checked) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}
function add(role, text) { messages.push({role, text}); render(); save(); }
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (Array.isArray(stored)) {
    $("memory").checked = true;
    for (const item of stored.slice(-100)) {
      if (["user","assistant"].includes(item.role) && typeof item.text === "string") messages.push({role:item.role,text:item.text});
    }
  }
} catch { localStorage.removeItem(STORAGE_KEY); }
if (!messages.length) add("assistant", "Welcome to Nexus AI. This is a local demo with scripted responses, not a connected language model.");
render();
$("chat").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("prompt"), text = input.value.trim();
  if (!text) return;
  add("user", text); input.value = "";
  add("assistant", "Demo response: I received your message. A real AI model will be connected in a later phase, with your permission and secure server-side configuration.");
});
$("memory").addEventListener("change", () => {
  if ($("memory").checked) save();
  else localStorage.removeItem(STORAGE_KEY);
});
$("clear").addEventListener("click", () => {
  messages.length = 0;
  localStorage.removeItem(STORAGE_KEY);
  add("assistant", "Local conversation erased. Memory remains " + ($("memory").checked ? "enabled" : "disabled") + ".");
});
$("intensity").addEventListener("input", event => {
  const value = Number(event.target.value);
  $("value").textContent = value;
  $("signal").textContent = value === 0 ? "No signal. This is a simulation, not physical sensation." : "Simulated tactile signal at " + value + "%. No hardware is connected.";
});