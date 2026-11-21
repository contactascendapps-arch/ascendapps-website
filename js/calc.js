(function () {
  var box = document.getElementById("calc");
  if (!box) return;
  var calls = document.getElementById("calc-calls");
  var pct = document.getElementById("calc-pct");
  var value = document.getElementById("calc-value");
  var out = document.getElementById("calc-out");
  var jobs = document.getElementById("calc-jobs");
  function num(el) { var n = parseFloat(el.value); return isNaN(n) || n < 0 ? 0 : n; }
  function run() {
    var perMonth = num(calls) * (num(pct) / 100) * 4.33;
    var dollars = perMonth * num(value);
    out.textContent = "NZ$" + Math.round(dollars).toLocaleString("en-NZ");
    jobs.textContent = Math.round(perMonth).toLocaleString("en-NZ");
  }
  [calls, pct, value].forEach(function (el) { el.addEventListener("input", run); });
  run();
})();
