  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-35225306-3']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

var stats = {
	logevent : function(category, action, opt_label, opt_value, opt_noninteraction)
	{
		//_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
		_gaq.push(['_trackEvent', category, action, opt_label]);
		//console.warn('stats.logevent', category, action, opt_label, opt_value, opt_noninteraction);
	}

}
