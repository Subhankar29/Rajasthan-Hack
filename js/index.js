//jQuery time
var current_fs, next_fs, nextLog, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var BaseURL = "http://192.168.0.103:3000";

$(document).ready(function () {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", BaseURL + "/getTransaction", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ phoneNumber: "1234567890" }));
  var response = JSON.parse(xhttp.responseText);
  if (response.items) {
    for (i = 0; i < response.items.length; i++) {
      if (response.items.tokenName != "MNY") {
        if (response.items.status != "freezed") {
          $('.fs-table').append("<div><tb><h3 class=\"tokenName\">" + response.items.balance + " " + response.items.tokenName + "</h3><button type=\"submit\" id=\"ClaimSub\" name=\"submit\" class=\"action-button\" value=\"CLAIM\" /></div></tb>");
        } else {
          $('.fs-table').append("<div><tb><h3 class=\"tokenName\">" + response.items.tokenName + "</h3><h2>Freezed</h2></div></tb>");
        }
      }
    }
  }
  console.log(response.items);
});

$("#login").click(function () {
  var xhttp = new XMLHttpRequest();
  var phone = (document.getElementById('phoneNumber').value);
  console.log(phone);
  xhttp.open("POST", BaseURL + "/login", false);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ mobileNumber: phone }));
  // xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  console.log(response);
  if (response.id) {
    sessionStorage.setItem("mobile", phone);
    nextLog = $(".nextLog")
      .parent()
      .next();

    xhttp.open("POST", BaseURL + "/getTransaction", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({ phoneNumber: sessionStorage.getItem("mobile") }));
    var response = JSON.parse(xhttp.responseText);
    console.log(response);

  } else {
    alert("This user is not registered with us");
  }

});

$(".next").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = $(this)
    .parent()
    .next();

  //activate next step on progressbar using the index of next_fs
  $("#progressbar li")
    .eq($("fieldset").index(next_fs))
    .addClass("active");

  //show the next fieldset
  next_fs.show();
  //hide the current fieldset with style
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale current_fs down to 80%
        scale = 1 - (1 - now) * 0.2;
        //2. bring next_fs from the right(50%)
        left = now * 50 + "%";
        //3. increase opacity of next_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({
          transform: "scale(" + scale + ")",
          position: "absolute"
        });
        next_fs.css({ left: left, opacity: opacity });
      },
      duration: 800,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: "easeInOutBack"
    }
  );
});

$(".previous").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  previous_fs = $(this)
    .parent()
    .prev();

  //de-activate current step on progressbar
  $("#progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");

  //show the previous fieldset
  previous_fs.show();
  //hide the current fieldset with style
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale previous_fs from 80% to 100%
        scale = 0.8 + (1 - now) * 0.2;
        //2. take current_fs to the right(50%) - from 0%
        left = (1 - now) * 50 + "%";
        //3. increase opacity of previous_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({ left: left });
        previous_fs.css({
          transform: "scale(" + scale + ")",
          opacity: opacity
        });
      },
      duration: 800,
      complete: function () {
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: "easeInOutBack"
    }
  );
});

$("#ClaimSub").click(function () {
  xhttp.open("POST", BaseURL + "/getTransaction", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ phoneNumber: sessionStorage.getItem("mobile") }));
  var response = JSON.parse(xhttp.responseText);
  console.log(response);
});