function adjustHomePage() {
  for (let i = 1; i < Infinity; i++) {
    if ($("main").width() < 250 * (i + 1) + 40 * i) {
      if (i === 1) {
        $(".filtered-countries-container").css({"justify-content": "center", "gap": "max(10vw, 40px)"});
      } else {
        const unconstrainedGap = ($(".filtered-countries-container").width() - 250 * i) / (i - 1);

        $(".filtered-countries-container").css({
          "justify-content": "flex-start",
          "row-gap": "min(" + unconstrainedGap + "px, 70px",
          "column-gap": "min(" + unconstrainedGap + "px, 125px"
        });
      }
      
      break;
    }
  }
}

const firstListMaxWidth = $(".clicked-country-detailed-info ul").eq(0).width();
const secondListMaxWidth = $(".clicked-country-detailed-info ul").eq(1).width();
const largestListMaxWidth = Math.max(firstListMaxWidth, secondListMaxWidth);
const clickedCountryInfoMinWidth = Math.max(largestListMaxWidth, 290);

function adjustDetailPage() {
  if ($(".main-section-detail").width() < largestListMaxWidth) {
    $(".clicked-country-container").css("flex-direction", "column");
    $(".clicked-country-detailed-info ul").eq(0).css("width", "auto");
    $(".clicked-country-detailed-info ul").eq(1).css("width", "auto");
    $(".border-countries-names").css({"min-width": 0, "width": "auto"});
  } else if ($(".main-section-detail").width() < clickedCountryInfoMinWidth + parseFloat($(".clicked-country-container").css("column-gap")) + $(".clicked-country-flag").width()) {
    $(".clicked-country-container").css("flex-direction", "column");
    $(".clicked-country-detailed-info ul").eq(0).css("width", "max-content");
    $(".clicked-country-detailed-info ul").eq(1).css("width", "max-content");
    $(".border-countries-names").css({"min-width": 0, "width": "auto"});
  } else {
    $(".clicked-country-container").css("flex-direction", "row");
    $(".clicked-country-detailed-info ul").eq(0).css("width", "max-content");
    $(".clicked-country-detailed-info ul").eq(1).css("width", "max-content");
    $(".border-countries-names").css("min-width", "290px").width($(".main-section-detail").width() - $(".clicked-country-flag").width() - parseFloat($(".clicked-country-container").css("column-gap")) - $(".border-countries-label").width() - 15);
  }
}

function changeColorScheme() {
  $("body").toggleClass("body-light-mode");

  for (let i = 0; i < $(".element-dark-mode").length; i++) {
    $(".element-dark-mode").eq(i).toggleClass("element-light-mode");
  }

  $(".color-scheme-button").toggleClass("color-scheme-button-light-mode");

  if ($(".moon-image").attr("src") === "/images/moon-dark-mode.png") {
    $(".moon-image").attr("src", "/images/moon-light-mode.png");
    $(".back-button img").attr("src", "/images/back-light-mode.png");
    localStorage.setItem("colorScheme", "light");
  } else {
    $(".moon-image").attr("src", "/images/moon-dark-mode.png");
    $(".back-button img").attr("src", "/images/back-dark-mode.png");
    localStorage.setItem("colorScheme", "dark");
  }

  for (let i = 0; i < $(".footer-link-dark-mode").length; i++) {
    $(".footer-link-dark-mode").eq(i).toggleClass("footer-link-light-mode");
  }

  $("input[type=text]").toggleClass("text-input-light-mode");
  $(".regions-menu-label").toggleClass("regions-menu-label-light-mode");

  for (let i = 0; i < $(".regions-menu-option").length; i++) {
    $(".regions-menu-option").eq(i).toggleClass("regions-menu-option-light-mode");
  }
}

if (localStorage.getItem("colorScheme") === "light") {
  changeColorScheme();
}

if (sessionStorage.getItem("textInputFlag") === "true") {
  $("input[type=text]").focus();
  $("input[type=text]").get(0).setSelectionRange($("input[type=text]").val().length, $("input[type=text]").val().length);
  sessionStorage.setItem("textInputFlag", "false");
} else if (sessionStorage.getItem("selectInputFlag") === "true") {
  $(".regions-menu-label").focus();
  sessionStorage.setItem("selectInputFlag", "false");
}

if ($("input[type=hidden]").val() !== "") {
  $(".regions-menu-label").text($("input[type=hidden]").val());
}

adjustHomePage();
adjustDetailPage();

$(window).resize(function() {
  adjustHomePage();
  adjustDetailPage();
});

$(".color-scheme-button").click(function() {
  changeColorScheme();
});

$("input[type=text]").on("input", function() {
  sessionStorage.setItem("textInputFlag", "true");
  $("form").submit();
});

$(".regions-menu-label").click(function() {
  $(this).toggleClass("open-regions-menu-label");
  $(".regions-menu-options-list").toggleClass("open-regions-menu-options-list");

  if ($(this).text() === "Filter by Region") {
    $(".regions-menu-option").eq(0).focus();
  } else {
    for (let i = 0; i < 6; i++) {
      if ($(".regions-menu-option").eq(i).text() === $(this).text()) {
        $(".regions-menu-option").eq(i).focus();
        break;
      }
    }
  }
});

$(".regions-menu-option").click(function() {
  $(".regions-menu-label").text($(this).text()).removeClass("open-regions-menu-label").focus();
  $(".regions-menu-options-list").removeClass("open-regions-menu-options-list");

  if ($("input[type=hidden]").val() !== $(this).text()) {
    $("input[type=hidden]").val($(this).text());
    sessionStorage.setItem("selectInputFlag", "true");
    $("form").submit();
  }
});

$("html").click(function(e) {
  if (["regions-menu-label", "regions-menu-options-list", "regions-menu-option"].includes(e.target.classList[0]) === false) {
    $(".regions-menu-label").removeClass("open-regions-menu-label");
    $(".regions-menu-options-list").removeClass("open-regions-menu-options-list");
  }
});

$(document).keydown(function(e) {
  let regionIndex = "";

  for (let i = 0; i < 6; i++) {
    if ($(".regions-menu-option").eq(i).is(":focus")) {
      regionIndex = i;
      break;
    }
  }

  if (e.key === "ArrowDown" && regionIndex !== "") {
    if (regionIndex >= 0 && regionIndex <= 4) {
      e.preventDefault();
      $(".regions-menu-option").eq(regionIndex + 1).focus();
    }
  } else if (e.key === "ArrowUp" && regionIndex !== "") {
    if (regionIndex >= 1 && regionIndex <= 5) {
      e.preventDefault();
      $(".regions-menu-option").eq(regionIndex - 1).focus();
    }
  } else if (e.key === "Tab" && regionIndex !== "") {
    $(".regions-menu-label").removeClass("open-regions-menu-label");
    $(".regions-menu-options-list").removeClass("open-regions-menu-options-list");
    $("input[type=text]").focus();
  }
});
