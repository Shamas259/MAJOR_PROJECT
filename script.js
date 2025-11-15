/* script.js
   - Uses onchange handlers (wired in HTML) and onsubmit handler (in HTML)
   - Multiple functions, loops, if/else checks, innerText/innerHTML usage
*/

// Grab references to elements
const form = document.getElementById('registrationForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

const formMessage = document.getElementById('formMessage');

// Helper to show error for an input
function showError(inputEl, message) {
  const errEl = document.getElementById(inputEl.id + 'Error');
  errEl.innerText = message;               // innerText used as requested
  inputEl.classList.add('is-invalid');
}

// Helper to clear error for an input
function clearError(inputEl) {
  const errEl = document.getElementById(inputEl.id + 'Error');
  errEl.innerText = '';
  inputEl.classList.remove('is-invalid');
}

/* Validation functions — each returns true/false */

// Name: must not be less than 5 characters
function validateName() {
  const value = fullName.value.trim();
  if (value.length === 0) {
    showError(fullName, 'Full name is required.');
    return false;
  }
  if (value.length < 5) {
    showError(fullName, 'Name must be at least 5 characters.');
    return false;
  }
  clearError(fullName);
  return true;
}

// Email: should contain '@' (and a dot after @ for minimal sanity)
function validateEmail() {
  const val = email.value.trim();
  if (val.length === 0) {
    showError(email, 'Email is required.');
    return false;
  }

  // Minimal checks as per requirement: must contain '@'
  if (!val.includes('@')) {
    showError(email, 'Enter correct email (must contain @).');
    return false;
  }

  // Additional sanity: there should be something after @ and a dot in domain
  const parts = val.split('@');
  if (parts.length !== 2 || parts[1].indexOf('.') === -1 || parts[1].startsWith('.') || parts[1].endsWith('.')) {
    showError(email, 'Enter a valid email (e.g. user@mail.com).');
    return false;
  }

  clearError(email);
  return true;
}

// Phone: must be a 10-digit number and must not be 123456789 (or 1234567890)
function validatePhone() {
  // remove non-digits (spaces, dashes)
  const digits = phone.value.replace(/\D/g, '').trim();

  if (digits.length === 0) {
    showError(phone, 'Phone number is required.');
    return false;
  }

  if (digits.length !== 10) {
    showError(phone, 'Phone number must be exactly 10 digits.');
    return false;
  }

  // Disallow common weak/sequential values:
  const forbidden = ['123456789', '1234567890', '0123456789', '12345678901'];
  if (forbidden.includes(digits)) {
    showError(phone, 'Enter a valid phone number (not a sequential placeholder).');
    return false;
  }

  // Basic digit-only verified by regex (already cleaned)
  if (!/^\d{10}$/.test(digits)) {
    showError(phone, 'Phone must only contain digits.');
    return false;
  }

  clearError(phone);
  return true;
}

// Password: cannot be 'password' or user's name and must be >= 8 chars
function validatePassword() {
  const pwd = password.value;
  const name = fullName.value.trim().toLowerCase();

  if (pwd.length === 0) {
    showError(password, 'Password is required.');
    return false;
  }

  if (pwd.length < 8) {
    showError(password, 'Password must be at least 8 characters.');
    return false;
  }

  if (pwd.toLowerCase() === 'password') {
    showError(password, "Password cannot be 'password'.");
    return false;
  }

  // Do not let password be same as name (or contain the name)
  if (name && (pwd.toLowerCase() === name || pwd.toLowerCase().includes(name))) {
    showError(password, 'Password should not be your name.');
    return false;
  }

  // (Optional extra check): encourage variety: at least one digit and one letter
  // This is kept optional — comment or remove if you only want the mandatory checks.
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  if (!hasLetter || !hasDigit) {
    showError(password, 'Password should include letters and numbers for strength.');
    return false;
  }

  clearError(password);
  return true;
}

// Confirm password
function validateConfirmPassword() {
  if (confirmPassword.value.length === 0) {
    showError(confirmPassword, 'Confirm your password.');
    return false;
  }
  if (confirmPassword.value !== password.value) {
    showError(confirmPassword, 'Passwords do not match.');
    return false;
  }
  clearError(confirmPassword);
  return true;
}

/* onsubmit handler - called by form's onsubmit attribute */
// Use a loop of validators as required
function handleSubmit(event) {
  event.preventDefault(); // always prevent default to validate first

  // Clear the top message area
  formMessage.innerHTML = '';

  // validators array lets us loop through functions (demonstrates loop usage)
  const validators = [
    validateName,
    validateEmail,
    validatePhone,
    validatePassword,
    validateConfirmPassword
  ];

  let allValid = true;
  for (let i = 0; i < validators.length; i++) {
    const valid = validators[i](); // call each validator
    if (!valid) {
      allValid = false;
    }
  }

  if (!allValid) {
    // One or more validation failures
    formMessage.innerHTML = '<div class="alert alert-danger">Please fix the highlighted errors and resubmit.</div>';
    // innerHTML used once to render an alert block
    return false; // stop submission
  }

  // If all good — show success message (in real app, submit to server here)
  formMessage.innerHTML = '<div class="alert alert-success">Form submitted successfully — you are human ✅</div>';

  // Example: Reset form after successful submit (optional)
  // form.reset();
  // Optionally clear validation styles
  clearAllErrors();

  // Prevent actual submit in this demo; return false to keep on-page.
  return false;
}

// Utility: clear all error messages/styles
function clearAllErrors() {
  const inputs = [fullName, email, phone, password, confirmPassword];
  for (let i = 0; i < inputs.length; i++) {
    clearError(inputs[i]);
  }
}

// Utility: reset form (bound to Reset button)
function resetForm() {
  form.reset();
  clearAllErrors();
  formMessage.innerHTML = '';
}

/*
  Note:
  - onchange is wired in HTML attributes (e.g. onchange="validateName()").
  - onsubmit is wired in the form element.
  - We used innerText and innerHTML for messages, loops for running validators,
    multiple functions for each field, and if/else checks for conditions.
*/