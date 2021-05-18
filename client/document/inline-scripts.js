export const inlineScript = `
			$(document).ready(function () {
				// random bg
				var randombgs = [ "random-1", "random-2", "random-3", "random-4", "random-5", "random-6" ];
				$(".home-header-bg").addClass(randombgs.splice( ~~(Math.random()*randombgs.length), 1 )[0]);
				
				$.reject({
				  reject: {
					all: false,
					safari: 5, // Apple Safari
					safari4: false,
					firefox: 20,//20
					chrome: 27, // Google Chrome
					msie: 8, // Microsoft Internet Explorer
					msie9: true,
					msie10: false,
					opera: true, // Opera
					android: false
				  },
				  closeCookie: true,
				  browserInfo: {
					opera: {
					  text: '',
					  allow: {all: false}, //hide this. all others are by default
					},
					firefox: {
					  text: 'firefox',
					},
					chrome: {
					  text: 'chrome',
					},
					safari: {
					  text: 'safari',
					},
					msie: {
					  text: 'msie',
					}
				  },
				  header: 'Sorry but your browser is not supported',
				  paragraph1: '',
				  paragraph2: 'Please select your browser to update it:',
				  closeMessage: '',
				  imagePath: '/themes/soundsnap3/assets/',
				});
				return false;
			  });
			
			  function createCookie(name, value, days) {
				if (days) {
				  var date = new Date();
				  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				  var expires = "; expires=" + date.toGMTString();
				} else var expires = "";
				document.cookie = name + "=" + value + expires + "; path=/";
			  }
			
			  function readCookie(name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for (var i = 0; i < ca.length; i++) {
				  var c = ca[i];
				  while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				  if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
				}
				return null;
			  }
			
			  function findHeight(element) {
				var h = 0;
				var h_desc;
				$(element).each(function () {
				  $this = $(this);
				  if ($this.height() > h) {
					h_desc = this;
					h = $this.height();
				  }
				});
				$(element).height(h);
			  }
			
			  $(document).ready(function () {
			
				var $window = $(window);
				var w_height = $window.height();
			
				//fix footer to bottom#maincontent
				var content_height = $("#container").height();
			
				if (content_height < w_height) {
				  var newheight = w_height - $("#footer").height() - 92;
				  $("#maincontent").css({'min-height': newheight});
				}
			
				//reposition tooltip
				$('.icon-info').on('mouseenter touchstart', function () {
				  var w_width = $window.width();
				  var tooltip = $(this).next(".info-tooltip");
				  var t_width = tooltip.width();
				  var pos = $(this).offset();
				  var x = pos.left,
					y = pos.top;
				  if (x + t_width >= w_width) {
					tooltip.css({'left': 'auto', 'right': '-30px'});
				  } else {
					tooltip.css({'left': '20px'});
				  }
				  tooltip.show();
				});
				$('.icon-info').on('mouseleave', function () {
				  $(this).next(".info-tooltip").hide();
				});
				$('.maincontent').on('touchmove', function () {
				  $('.info-tooltip').hide();
				});
				$('.info-tooltip').on("click", function () {
				  $(this).hide();
				});
			
				//audio teasers
				$('.more-info').click(function (e) {
				  e.preventDefault();
				  var row = $(this).closest('div.audio-row').next('.audio-info');
				  row.slideToggle('300');
				  $(this).toggleClass('active');
			
				  $(this).text(function (i, text) {
					return text = ($(this).hasClass("active")) ? "- less info" : "+ more info";
				  })
				});
			
				$(".collapse-trigger").click(function (e) {
				  e.preventDefault();
				  $(this).closest("div").find(".collapse-items").slideToggle('50');
				  $(this).toggleClass('collapsed');
				  $(this).text(function (i, text) {
					return text = ($(this).hasClass("collapsed")) ? "View Less" : "View All";
				  });
				});
			
				$window.resize(function () {
				  if ($(this).width() > 768) {
					$(".logo, nav, .responsive-menu-button, .search, .responsive-search-button").removeAttr('style');
				  }
				});
			
				function switch_sticky(status) {
				  if (status === 'dark') {
					$("#header-wrapper").removeClass('sticky-header').addClass('black-header');
					$(".logo img").attr('src', '/papo/i/favicons/papo_logo_white.svg');
				  } else {
					$("#header-wrapper").addClass('sticky-header').removeClass('black-header');
					$(".logo img").attr('src', '/papo/i/favicons/papo_logo_black.svg');
				  }
				}
			
				$('.responsive-menu-button').click(function () {
				  $('nav').stop().animate({width: "toggle"}, 100);
				});
			
				$('.menu-close').click(function (e) {
				  $('nav').animate({width: "toggle"}, 100);
				});
			
				$('.responsive-search-button').click(function () {
				  $(".search").toggle();
				  $(this).toggleClass('search-close');
				  var player_header = $(".jp-type-playlist").offset();
				  if (player_header) {
					if ($(".search").is(":visible"))
					  $(".jp-type-playlist").addClass("shove");
					else
					  $(".jp-type-playlist").removeClass("shove");
				  }
						if ($(this).hasClass('search-close')) {
					switch_sticky('white');
				  } else {
					if ($window.scrollTop() < 72) {
					  switch_sticky('dark');
					}
				  }
					  });
			
				//sticky menu
				var menu_header = $(".maincontent").offset();
			
				if (menu_header) {
			
				  if ($window.scrollTop() >= 72) {
							if( !shouldPreventHeaderAnimate ) switch_sticky('white');
						  }
			
				  $window.scroll(function () {
					if ($(this).scrollTop() >= 72) {
							if ( !shouldPreventHeaderAnimate )	switch_sticky('white');
					} else {
					  if (!$(".responsive-search-button").hasClass('search-close')) {
						if ( !shouldPreventHeaderAnimate ) switch_sticky('dark');
					  }
							  }
				  });
				}
				
			  });
			
			  function change_select(current) {
				$('.tabs.secondary li.display_receipts').hide();
				$('.tabs.secondary li.display_receipts[data-year="' + current + '"]').show();
			  };
		`;
