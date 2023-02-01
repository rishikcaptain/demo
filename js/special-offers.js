// TODO:

var showLocalImages = false;
var isScholarshipBanner = false;
var imgExtension = ".webp";
var isSpecialEarlyBirdLive = false;
var specialEarlyBirdDiscount = 40;

$.ajax({
  url: "https://api.codingninjas.com/api/v4/get_landing_offer_banner?source=landing",
  // url: "https://mocki.io/v1/fa9aaf78-af7c-4ab8-b1d3-446dd37aef49",
  type: "GET",
  success: function (result) {
    try {
      if (isSpecialEarlyBirdLive == false) return;
      // console.log(result);
      var apiData = result["data"]["offer_data"];
      // To create exception if no offer is live
      var earlyBirdDiscount = apiData["early_bird_discount_percentage"];
      apiData["early_bird_discount_percentage"] = specialEarlyBirdDiscount;

      if (earlyBirdDiscount == 40) {
        isScholarshipBanner = false;
      }

      if (isScholarshipBanner == true) {
        showLocalImages = true;
        apiData["early_bird_discount_percentage"] = 30;
        return;
      }

      showSpecialOffers(apiData);
      hideTopNotificationOnScroll(apiData);
      topNotification(apiData);
      middleNotification(apiData);
      // only for homepage
      try {
        modifyLandingLi(apiData);
      } catch (err) {
        // Do nothing, it isn't homepage
      }
    } catch (err) {
      // No new offers
      console.log(err);
      console.log("No specials offers");
    }
  },
  error: function (error) {
    return;
  },
});

// Show special offers
function showSpecialOffers(apiData) {
  // console.log("Showing Special Offers");
  $(".special-offer").css({ display: "unset" });
  $("#top-notification").css({ display: "flex" });
  var earlyBirdDiscount = apiData["early_bird_discount_percentage"];

  if (earlyBirdDiscount != 30) {
    $(".middle-notification-2").css({ display: "none" });
  }
}

function hideTopNotificationOnScroll(apiData) {
  var earlyBirdDiscount = apiData["early_bird_discount_percentage"];
  // hide notification banner on scroll
  $(window).scroll(function () {
    // return;
    var height = $(this).scrollTop();
    // console.log(height);
    if (height == 0) {
      // $("#top-notification").css("display", "flex");
      $("#top-notification").slideDown(250);
    } else {
      // $("#top-notification").css("display", "none");
      $("#top-notification").slideUp(250);
    }
  });
}

// top-notification
function topNotification(apiData) {
  var headingDOM = $(".top-notification-heading");
  var paragraphDOM = $(".top-notification-paragraph");
  var ctaDOM = $(".top-notification-cta");
  var validityDOM = $(".top-notification-validity");
  var earlyBirdDiscount = apiData["early_bird_discount_percentage"];

  // Paragraph
  if (earlyBirdDiscount == 30) {
    paragraph = "Get 30% Early Bird Discount + 12% Extra Discount";
  } else {
    paragraph =
      "Get <s>30%</s> " +
      earlyBirdDiscount +
      "% Early Bird Discount + 12% Extra Discount";
  }
  paragraphDOM.html(paragraph);

  // CTA
  totalDiscount = earlyBirdDiscount + 12;
  var cta = "GET " + totalDiscount + "% DISCOUNTS NOW";
  ctaDOM.text(cta);
}

function middleNotification(apiData) {
  // Add option for custom local image
  var desktopDOM = $(".middle-notification-desktop");
  var desktopImgSrc = apiData["desktop_banner"];
  var mobileDOM = $(".middle-notification-mobile");
  var mobileImgSrc = apiData["mobile_banner"];

  if (showLocalImages == true) {
    desktopDOM.attr("src", "./assets/special-offer/desktop" + imgExtension);
    mobileDOM.attr("src", "./assets/special-offer/mobile" + imgExtension);
  } else {
    desktopDOM.attr("src", desktopImgSrc);
    mobileDOM.attr("src", mobileImgSrc);
  }
}

function modifyLandingLi(apiData) {
  earlyBirdDOM = $(".landing-page-li-early-bird-discount");
  totalSavingsDOM = $(".landing-page-li-total-savings");
  var earlyBirdDiscount = apiData["early_bird_discount_percentage"];

  if (earlyBirdDiscount != 30) {
    var textHTML =
      "Also Get <s>30%</s> <strong> " +
      earlyBirdDiscount +
      "% </strong> Early Bird Discount.";
    earlyBirdDOM.html(textHTML);

    totalSavingsHTML = "Save around <strong>Rs 8,000</strong> on any course.";
    totalSavingsDOM.html(totalSavingsHTML);
  }
}
