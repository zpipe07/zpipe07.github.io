"use strict";

(function($) {
  $(document).ready(function() {

    var siteURL = "http://" + top.location.host.toString();
    var $internalLinks = $("a[href^='" + siteURL + "'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#'], a[href$='.html']");
    var $mainNav = $(".nav");

    /**
     * Initialization function
     */
    function init() {
      addEventListeners();
    };

    /**
     * Add event listeners
     */
    function addEventListeners() {
      $internalLinks.off().on("click", internalLinkHandler);
      window.onpopstate = popHandler;
    };

    /**
     * Handler for internal link clicks
     * Extracts url and calls fetchPage()
     * @param  {Event} e event
     */
    function internalLinkHandler(e) {
      e.preventDefault();
      var $this = $(this);
      var url = $this.prop("href");
      var destination = url.split("/")[3] + (url.split("/")[4] ? "/" + url.split("/")[4] : "/");
      // unbind click event
      $internalLinks.unbind("click", internalLinkHandler);
      fetchPage(destination);
      updateUrl(destination);
    };

    /**
     * Fetch page HTML
     * @param  {string} destination url of page
     */
    function fetchPage(destination) {
      // fetch page HTML based off of
      // destination argument
      var url = "/" + (destination === "/" ? "" : destination) + (destination.indexOf(".html") > -1 ? "" : "index.html");
      var jqXHR = $.ajax({
        url: url,
        type: "GET",
        dataType: "html",
      })
      .done(fetchSuccess)
      .fail(function(error) {
        console.log(error);
      });

      function fetchSuccess(data) {
        // ajax success handler
        var html = $.parseHTML(data);
        var $dataContent = $(html[html.length - 2]).find(".page-content");

        updateNav(destination);
        // add class to page content to fade out
        $(".page-content").addClass("page-content--fade-out");
        window.setTimeout(function() {
          $(".page-content").replaceWith($dataContent);
          // re-cache UI
          $internalLinks = $("a[href^='" + siteURL + "'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#'], a[href$='.html']");
          $internalLinks.off().on("click", internalLinkHandler);
        }, 250);
      };
    };

    /**
     * Update the URL and browser history
     * @param  {string} url
     */
    function updateUrl(url) {
      url = url === "/" ? "/" : "/" + url;
      history.pushState({"url": url}, "", url);
    };

    /**
     * Pop handler. called when browser 'back' is clicked
     */
    function popHandler() {
      var url = location.href.split("/")[3] + (location.href.split("/")[4] ? "/" + location.href.split("/")[4] : "/");
      fetchPage(url);
    };

    /**
     * Update nav attribute based on destination
     * @param  {string} destination
     */
    function updateNav(destination) {
      destination = destination.split("/")[0];
      destination = destination.length > 0 ? destination : "index";
      $(".nav").attr("data-nav-js", destination);
    };

    init();
  });
})(jQuery)
