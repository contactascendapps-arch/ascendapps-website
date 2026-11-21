(function () {
  var form = document.getElementById("demo-form");
  if (!form) return;
  var statusEl = document.getElementById("status");
  var sending = false;
  // Saves to Simple Host storage when that works; otherwise (for example on Vercel)
  // the request is emailed to contact@ascendapps.co.nz through FormSubmit.
  function viaStorage(entry) {
    try {
      if (!window.SH || !SH.storage) throw new Error("no storage");
      var copy = {}; for (var k in entry) copy[k] = entry[k];
      copy.status = "new";
      return SH.storage.sqlite("requests").table("demo_requests").add(copy);
    } catch (e) { return Promise.reject(e); }
  }
  function viaEmail(entry) {
    var body = {}; for (var k in entry) body[k] = entry[k];
    body._subject = "New demo request: " + entry.business;
    body._template = "table";
    body._captcha = "false";
    return fetch("https://formsubmit.co/ajax/contact@ascendapps.co.nz", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || "something went wrong");
      });
    });
  }
  form.onsubmit = function (event) {
    event.preventDefault();
    if (sending) return;
    sending = true;
    statusEl.className = "";
    statusEl.textContent = "Sending...";
    var params = new URLSearchParams(window.location.search);
    var entry = {
      name: form.name.value.trim(),
      business: form.business.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      industry: form.getAttribute("data-industry") || "",
      page: form.getAttribute("data-page") || "",
      source: params.get("src") || "direct"
    };
    viaStorage(entry).catch(function () { return viaEmail(entry); }).then(function () {
      form.reset();
      statusEl.className = "ok";
      statusEl.textContent = "Thanks, your request is in. We'll be in touch within one business day to lock in a time.";
    }).catch(function (e) {
      statusEl.className = "err";
      statusEl.textContent = "Not sent" + (e && e.message ? ": " + e.message : "") + ". Please try again, or email contact@ascendapps.co.nz.";
    }).then(function () { sending = false; });
  };
})();
