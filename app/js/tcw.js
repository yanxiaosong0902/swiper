;(function(root,factory){
	if(typeof define === 'function' && define.amd){
		define([],factory);
	}else if(typeof exports === 'object'){
		module.exports = factory();
	}else{
		root.jzConvSubmit = factory();
	}
})(window,function() {
	function jzConvSubmit(){
		(function(param){
			var c = {
				query:[], 
				args:param||{}
			};
			c.query.push(["_setAccount","802"]);
			(window.__zpSMConfig = window.__zpSMConfig||[]).push(c);
			var zp = document.createElement("script"); 
			zp.type = "text/javascript"; 
			zp.async = true;
			zp.src = ("https:" == document.location.protocol ? "https:" : "http:") + "//cdn.zampda.net/s.js";
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(zp, s);
		})(window.__zp_tags_params);
	}
	window.jzConvSubmit = jzConvSubmit;
	return jzConvSubmit
})
