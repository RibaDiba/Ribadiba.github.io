/* Renders .sol-course-card contents from data attrs, and .sol-stepper mini bars.
   Keeps the showcase HTML lean (matches the real repo's data-driven CourseCard). */
(function () {
  function starRow(rating) {
    var rounded = Math.max(0, Math.min(5, Math.round(rating * 2) / 2));
    var out = "";
    for (var i = 0; i < 5; i++) {
      if (i + 1 <= rounded) out += "★";
      else if (i + 0.5 === rounded) out += "⯪";
      else out += "☆";
    }
    return out;
  }

  function mountCourseCards(root) {
    (root || document).querySelectorAll(".sol-course-card[data-course]").forEach(function (el) {
      var course = el.getAttribute("data-course");
      var prof = el.getAttribute("data-professor");
      var rating = parseFloat(el.getAttribute("data-rating") || "0");
      el.innerHTML =
        '<div class="row1"><p class="prof">' + prof + '</p>' +
        '<div class="stars">' + starRow(rating) + "</div></div>" +
        '<p class="code">' + course + "</p>";
    });
  }

  var STEP_LABELS = [
    "Upload your Audit",
    "Select Your Gen Eds",
    "Select Your Registration Date",
    "Confirm Your Schedule",
  ];
  var STEPPER_THEME = {
    brown: { on: "var(--sol-sand)", off: "rgba(245,213,192,.28)" },
    teal: { on: "var(--sol-sky)", off: "rgba(192,239,245,.28)" },
  };

  function mountSteppers(root) {
    (root || document).querySelectorAll(".sol-stepper[data-active-step]").forEach(function (el) {
      var active = parseInt(el.getAttribute("data-active-step"), 10);
      var theme = STEPPER_THEME[el.getAttribute("data-theme") || "brown"];
      var html = "";
      STEP_LABELS.forEach(function (label, i) {
        var step = i + 1;
        var filled = step <= active;
        var isActive = step === active;
        html +=
          '<div class="seg"><div class="bar"><i style="width:' + (filled ? "100%" : "0%") +
          ";background:" + theme.on + ';"></i></div>' +
          '<div class="lbl" style="color:' + theme.on + ';opacity:' + (isActive ? 1 : 0) + '">' +
          (isActive ? label : "\u00A0") + "</div></div>";
      });
      el.innerHTML = html;
    });
  }

  window.mountSolComponents = function (root) {
    mountCourseCards(root);
    mountSteppers(root);
  };
})();
