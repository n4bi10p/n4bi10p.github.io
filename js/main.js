AOS.init({
        duration: 800,
        easing: "slide"
    }),
    function (t) {
        "use strict";
        t(window).stellar({
            responsive: !0,
            parallaxBackgrounds: !0,
            parallaxElements: !0,
            horizontalScrolling: !1,
            hideDistantElements: !1,
            scrollProperty: "scroll"
        });
        t(".js-fullheight").css("height", t(window).height()), t(window).resize((function () {
            t(".js-fullheight").css("height", t(window).height())
        }));
        setTimeout((function () {
            t("#ftco-loader").length > 0 && t("#ftco-loader").removeClass("show")
        }), 1), t.Scrollax();
        t("body").on("click", ".js-fh5co-nav-toggle", (function (e) {
            e.preventDefault(), t("#ftco-nav").is(":visible") ? t(this).removeClass("active") : t(this).addClass("active")
        }));
        t(document).on("click", '#ftco-nav a[href^="#"]', (function (e) {
            e.preventDefault(), t.attr(this, "href"), t("html, body").animate({
                scrollTop: t(t.attr(this, "href")).offset().top - 70
            }, 500, (function () {}))
        }));
        t(".home-slider").owlCarousel({
            loop: !0,
            autoplay: !0,
            margin: 0,
            animateOut: "fadeOut",
            animateIn: "fadeIn",
            nav: !1,
            autoplayHoverPause: !1,
            items: 1,
            navText: ["<span class='ion-md-arrow-back'></span>", "<span class='ion-chevron-right'></span>"],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1e3: {
                    items: 1
                }
            }
        }), t("nav .dropdown").hover((function () {
            var e = t(this);
            e.addClass("show"), e.find("> a").attr("aria-expanded", !0), e.find(".dropdown-menu").addClass("show")
        }), (function () {
            var e = t(this);
            e.removeClass("show"), e.find("> a").attr("aria-expanded", !1), e.find(".dropdown-menu").removeClass("show")
        })), t("#dropdown04").on("show.bs.dropdown", (function () {}));
        t(window).scroll((function () {
            var e = t(this).scrollTop(),
                a = t(".ftco_navbar"),
                s = t(".js-scroll-wrap");
            e > 150 && (a.hasClass("scrolled") || a.addClass("scrolled")), e < 150 && a.hasClass("scrolled") && a.removeClass("scrolled sleep"), e > 350 && (a.hasClass("awake") || a.addClass("awake"), s.length > 0 && s.addClass("sleep")), e < 350 && (a.hasClass("awake") && (a.removeClass("awake"), a.addClass("sleep")), s.length > 0 && s.removeClass("sleep"))
        }));
        t("#section-counter, .hero-wrap, .ftco-counter, .ftco-about").waypoint((function (e) {
            if ("down" === e && !t(this.element).hasClass("ftco-animated")) {
                var a = t.animateNumber.numberStepFactories.separator(",");
                t(".number").each((function () {
                    var e = t(this),
                        s = e.data("number");
                    e.animateNumber({
                        number: s,
                        numberStep: a
                    }, 7e3)
                }))
            }
        }), {
            offset: "95%"
        });
        t(".ftco-animate").waypoint((function (e) {
            "down" !== e || t(this.element).hasClass("ftco-animated") || (t(this.element).addClass("item-animate"), setTimeout((function () {
                t("body .ftco-animate.item-animate").each((function (e) {
                    var a = t(this);
                    setTimeout((function () {
                        var t = a.data("animate-effect");
                        "fadeIn" === t ? a.addClass("fadeIn ftco-animated") : "fadeInLeft" === t ? a.addClass("fadeInLeft ftco-animated") : "fadeInRight" === t ? a.addClass("fadeInRight ftco-animated") : a.addClass("fadeInUp ftco-animated"), a.removeClass("item-animate")
                    }), 50 * e, "easeInOutExpo")
                }))
            }), 100))
        }), {
            offset: "95%"
        }), t(".image-popup").magnificPopup({
            type: "image",
            closeOnContentClick: !0,
            closeBtnInside: !1,
            fixedContentPos: !0,
            mainClass: "mfp-no-margins mfp-with-zoom",
            gallery: {
                enabled: !0,
                navigateByImgClick: !0,
                preload: [0, 1]
            },
            image: {
                verticalFit: !0
            },
            zoom: {
                enabled: !0,
                duration: 300
            }
        }), t(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
            disableOn: 700,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: !1,
            fixedContentPos: !1
        });
        t(".mouse-icon").on("click", (function (e) {
            return e.preventDefault(), t("html,body").animate({
                scrollTop: t(".goto-here").offset().top
            }, 500, "easeInOutExpo"), !1
        }));
        var e = function (t, e, a) {
            this.toRotate = e, this.el = t, this.loopNum = 0, this.period = parseInt(a, 10) || 2e3, this.txt = "", this.tick(), this.isDeleting = !1
        };
        e.prototype.tick = function () {
            var t = this.loopNum % this.toRotate.length,
                e = this.toRotate[t];
            this.isDeleting ? this.txt = e.substring(0, this.txt.length - 1) : this.txt = e.substring(0, this.txt.length + 1), this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";
            var a = this,
                s = 165 - 100 * Math.random();
            this.isDeleting && (s /= 2), this.isDeleting || this.txt !== e ? this.isDeleting && "" === this.txt && (this.isDeleting = !1, this.loopNum++, s = 500) : (s = this.period, this.isDeleting = !0), setTimeout((function () {
                a.tick()
            }), s)
        }, window.onload = function () {
            for (var t = document.getElementsByClassName("txt-rotate"), a = 0; a < t.length; a++) {
                var s = t[a].getAttribute("data-rotate"),
                    o = t[a].getAttribute("data-period");
                s && new e(t[a], JSON.parse(s), o)
            }
            var n = document.createElement("style");
            n.type = "text/css", n.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }", document.body.appendChild(n)
        }
    }(jQuery),
    function (t) {
        var e = [],
            a = !1,
            s = t("#navi a");
        s.click((function (e) {
            e.preventDefault(), t("html, body").animate({
                scrollTop: t(t(this).attr("href")).offset().top - 180
            }, 500), hash(t(this).attr("href"))
        })), s.each((function () {
            e.push(t(t(this).attr("href")))
        })), t(window).scroll((function (o) {
            var n = t(this).scrollTop() + t(window).height() / 2;
            for (var i in e) {
                var r = e[i];
                if (n > r.offset().top) var l = r.attr("id")
            }
            l !== a && (a = l, t(s).removeClass("current"), t('#navi a[href="#' + a + '"]').addClass("current"))
        }))
    }(jQuery), hash = function (t) {
        history.pushState ? history.pushState(null, null, t) : location.hash = t
    }, $((function () {
        function t(t) {
            return t / 100 * 360
        }
        $(".progress").each((function () {
            var e = $(this).attr("data-value"),
                a = $(this).find(".progress-left .progress-bar"),
                s = $(this).find(".progress-right .progress-bar");
            e > 0 && (e <= 50 ? s.css("transform", "rotate(" + t(e) + "deg)") : (s.css("transform", "rotate(180deg)"), a.css("transform", "rotate(" + t(e - 50) + "deg)")))
        }))
    }));