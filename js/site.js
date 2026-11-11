(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setStatus(form, type, message) {
    var status = form.querySelector(".form-status");
    if (!status) return;
    status.textContent = message;
    status.className = "form-status" + (type ? " is-" + type : "");
  }

  function hookBookForm(form) {
    if (!form) return;
    form.addEventListener("submit", function (event) {
      var emailField = form.querySelector('input[type="email"]');
      if (emailField && !isValidEmail(emailField.value.trim())) {
        event.preventDefault();
        setStatus(form, "error", "Please enter a valid email address.");
        emailField.focus();
        return;
      }

      event.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      setStatus(form, "", "Sending…");

      fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        mode: "no-cors",
      })
        .then(function () {
          setStatus(form, "success", "Check your inbox to confirm.");
          form.reset();
        })
        .catch(function () {
          setStatus(
            form,
            "error",
            "Something went wrong. Please try again, or email chris@chriscronan.com."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  function hookContactForm(form) {
    if (!form) return;
    var nameField = form.querySelector("#contact-name");
    var emailField = form.querySelector("#contact-email");
    var messageField = form.querySelector("#contact-message");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (nameField && !nameField.value.trim()) {
        setStatus(form, "error", "Please enter your name.");
        nameField.focus();
        return;
      }
      if (emailField && !isValidEmail(emailField.value.trim())) {
        setStatus(form, "error", "Please enter a valid email address.");
        emailField.focus();
        return;
      }
      if (messageField && !messageField.value.trim()) {
        setStatus(form, "error", "Please enter a message.");
        messageField.focus();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      setStatus(form, "", "Sending…");

      fetch(form.getAttribute("action"), {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            setStatus(form, "success", "Thanks — your message is on its way.");
            form.reset();
            return;
          }
          return response.json().catch(function () {
            return null;
          }).then(function (data) {
            var message =
              "Something went wrong. Please try again, or email chris@chriscronan.com.";
            if (data && data.errors && data.errors.length) {
              var fromApi = data.errors
                .map(function (err) {
                  return err && err.message;
                })
                .filter(Boolean)
                .join(" ");
              if (fromApi) message = fromApi;
            }
            setStatus(form, "error", message);
          });
        })
        .catch(function () {
          setStatus(
            form,
            "error",
            "Something went wrong. Please try again, or email chris@chriscronan.com."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  hookBookForm(document.getElementById("book-form"));
  hookContactForm(document.getElementById("contact-form"));
})();
