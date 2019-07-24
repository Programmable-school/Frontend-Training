$(function() {
  $("#ticker01").liScroll();
  $("#ticker01").off("mouseenter mouseleave");
});

const $link = $("#link__continue--middle, #link__continue--lower");
$link.attr("href", "https://github.com/hukusuke1007");

$(function () {
  const sokujiMessage = '即時関数だよ jQuery';
  console.log(sokujiMessage);
});

(function () {
  const sokujiMessage = '即時関数だよ JavaScript';
  console.log(sokujiMessage);
}());
// console.log(sokujiMessage);   // sokujiMessage is not defined


// $.func.call("", true, 'input[type="search"]')
(function ($) {
  var call = function (value, selector) {
    console.log("call", value, selector);
    if (value === true) {
      $(selector).focus();
    } else {
      $(selector).blur();
    }
  }
  call(true, 'input[type="search"]');
  $.func = call;
})(jQuery);