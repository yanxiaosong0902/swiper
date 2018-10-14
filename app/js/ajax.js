;(function(root,factory){
	if(typeof define === 'function' && define.amd){
		define([],factory);
	}else if(typeof exports === 'object'){
		module.exports = factory();
	}else{
		root.ajax = factory();
	}
})(window,function(){
	function setAjax(opt,fn){
		/*
			opt参数格式
			var opt = {
				uf:JSON.stringify(user_info),
				a:796,
				convid:"23f742ba6fb1106520a1b6b47da51933"
			};
		*/
		$.ajax({
			url:'http://bl.gtags.net/lds',
			data:opt,
			type:'get',
			withCredentials:true,
			success:function(res){
				if(fn){
					fn(res);
				}
			}
		})
	}
	window.Ajax = setAjax;
	return setAjax
})