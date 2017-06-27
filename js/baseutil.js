function ZUtil(){
	this.reqObj = null;
	this.selectKey = null;
	this.loadlayer = function(){
		console.log($.layer)
		$.getScript("/layer/layer.min.js").then(function(data){console.log(data)})
		
		if($.layer==undefined){
			try{
				$.getScript("/js/layer/layer.js");
			}catch(err){return false;}
		}
		return true;
	}
	/**
	 * 弹出iframe， 关闭当前页已打开的弹出iframe
	 * @title 必须，窗口标题
	 * @url 必须，iframe url
	 * @width 必须
	 * @height 必须
	 * @fn 可选，弹出完成后回调函数
	 * @shadeClose 可选,为true时点击遮罩会关闭弹出窗口，默认值：true
	 */
	this.openurl = function(title,url,width,height,fn,shadeClose){
		if(!this.loadlayer()){
			alert("缺少组件");
			return;
		}
		this.close();
		shadeClose = shadeClose||false;
		if(url.indexOf("toUrl=")==-1){
	    	var topurl = encodeURIComponent(top.location.href);
	    	if(url.indexOf("?")==-1){
	    		url = url+"?toUrl="+topurl;
	    	}else{
	    		url = url+"&toUrl="+topurl;
	    	}
	    }
		var index = $.layer({
			type: 2,
		    shade: [0.2,'#aaa'],
		    shadeClose: shadeClose,
		    fix: true,
		    title: title,
		    maxmin: false,
		    iframe: {src : url},		    
		    area: [width , height],
		    success: function(layero){
		    	if(fn && typeof(fn)=="function"){
		    		fn(layero);
		    	}
		    }
		});
		return index;
	};
	/**
	 * 弹出层，显示html
	 * @title 必须，弹出标题
	 * @content 必须，显示内容
	 * @btns 可选，按钮文本，格式：["确定","取消"] ，默认无按钮。
	 * @fn1 可选，第一个按钮点击后回调函数
	 * @fn2 可选，第二个按钮点击后回调函数
	 */
	this.openhtml = function(title,content,btns,fn1,fn2){
		if(btns==undefined || typeof(btns)!="object"){
			btns = [];
		}
		var index = $.layer(
			{
				type:1,
				shade: [0.2, '#aaa'],
				closeBtn:[0,true],
			    shadeClose: true,
				title:title,
				btns:btns.length,
				btn:btns,
				page:{
					html:content
				},
				yes:function(index){
					if(fn1 && typeof(fn1)=="function"){
						if(fn1(index)!==false){
							layer.close(index);
						}
					}else{
						layer.close(index);
					}					
				},
				no:function(index){
					if(fn2 && typeof(fn2)=="function"){
						if(fn2(index)!==false){
							layer.close(index);
						}
					}else{
						layer.close(index);
					}					
				}
			});
		return index;
	};
	/**
	 * 弹出ajax内容，get
	 */
	this.openajax = function(title,url,width,height,okfun,shadeClose){
		if(!(zUtil.isNumber(width) && zUtil.isNumber(height))){
			zUtil.msg("请设置宽高。");
			return;
		}
		title = title||"提示窗口";
		shadeClose = shadeClose||false;
		var index = $.layer(
			{
				type:1,
				shade: [0.2, '#aaa'],
				closeBtn:[0,true],
			    shadeClose: shadeClose,
				title:title,
				area:[width,height],
				page:{
					url:url,
					ok:function(data){
						if(okfun && typeof(okfun)=="function"){
							okfun(data);
						}
					}
				}
			});
		return index;
	};
	/**
	 * 提示便签贴
	 * @eleid 必须，元素id
	 * @msg 必须，内容
	 * @guide 可选，指引方向（0：上，1：右，2：下，3：左），默认：0
	 * @time 可选，关闭时间，单位：秒，默认不关闭 
	 */
	this.tips = function(eleid,msg,guide,time){
		if(!this.loadlayer()){
			return;
		}
		var obj = $("#"+eleid)[0];
		if( obj == undefined){
			this.msg(msg);
			return;
		}
		guide=guide|0;
		time=time|0;
		var param = {};
		param.guide=guide;
		param.time=time;
		param.more = true;
		//param.style= ['background-color:#FF9900; color:#000; border:1px solid #FF9900;', '#FF9900'];
		return layer.tips(msg, obj, param);
	};
	/**
	 * 弹出某个页面元素
	 * @eleid 必须，元素id
	 * @title 可选，标题
	 * @btns 可选，格式：["确定","关闭"]
	 * @fn1 可选，@btns对应的回调函数
	 * @width 可选
	 * @height 可选
	 */
	this.openele = function(eleid,title,btns,fn1,fn2,width,height,shadeClose){
		if($("#"+eleid)[0]==undefined){
			zUtil.msg(msg);
			return;
		}
		title=title||"";
		shadeClose = shadeClose||false;
		if(btns==undefined || typeof(btns)!="object"){
			btns = [];
		}
		var index = 0;
		var config = {
			    type : 1,
			    title:title,
			    fix : false,
			    shade: [0.1,'#000'],
			    shadeClose:shadeClose,
			    page : {
			    	dom: '#'+eleid
			    },
			    btns:btns.length,
				btn:btns,
				yes:function(index){
					if(fn1 && typeof(fn1)=="function"){
						if(fn1(index)!==false){
							layer.close(index);
						}
					}else{
						layer.close(index);
					}					
				},
				no:function(index){
					if(fn2 && typeof(fn2)=="function"){
						if(fn2(index)!==false){
							layer.close(index);
						}
					}else{
						layer.close(index);
					}					
				}
			}
		if(width!=undefined && height!=undefined){
			config.area = [width,height];
		}
		
		index = $.layer(config);
		return index;
	};
	/**
	 * 关闭弹出层
	 * @index 可选，弹出层序号，默认关闭当前所有弹出div
	 */
	this.close = function(index){
		if(!this.loadlayer()){
			return;
		}
		if(index==undefined){
			layer.closeAll();
		}else{
			layer.close(index);
		}
	};
	/**
	 * 提示框
	 * @content 内容
	 * @title 可选，标题，默认“提示”
	 * @fn 点击按钮时回调函数
	 * @time 自动关闭时间，默认不关闭
	 */
	this.alert = function(content,title,fn,time){
		if(!this.loadlayer()){
			alert(content);
			return;
		}
		title = title || "提示";
		time = time==undefined?0:time;
		content = content || "";
		
		var index = layer.alert(content,0,title,function(index){
			if(fn!=undefined && fn!=null){
	    		fn(index);
	    	}
			layer.close(index);
		});
		if(time>0){
			setTimeout(function(){layer.close(index);},time*1000);
		}
	};
	/**
	 * 提示消息 
	 * @msg 提示内容
	 * @time 自动关闭时间，默认2s
	 * @fn 关闭时回调函数
	 */
	this.msg = function(msg,time,fn,shade){
		this.loadlayer();
		if($.layer==undefined){
			alert(msg);
			return;
		}
		if(time==undefined){
			time = 3;
		}
		if(shade==true){
			shade=[0.1,'#000'];
		}else{
			shade = false;
		}
		var index = $.layer(
			{
				type:0,
				title: false,
			    shade: shade,
			    closeBtn: time==0?[0,true]:[0,false],
				time:time,
				dialog: {
				    type: -1,
				    msg: msg
				},
				end:function(){
					if(fn && typeof(fn)=="function"){
						fn();
					}
				}
			}
		);
		return index;
	};
	/**
	 * 确认提示框
	 * @msg 内容
	 * @yesfn 可选，点击“确认”后回调函数。默认点击按钮后会关闭层，如果回调函数返回false，则不关闭。
	 * @title 可选，标题，默认“提示”
	 * @nofn 可选，点击“取消”后回调。
	 */
	this.confirm = function(msg,yesfn,title,nofn,btns){
		this.loadlayer();
		if($.layer==undefined){
			if(confirm(msg)){
				if(yesfn && typeof(yesfn)=="function"){
                	yesfn();
                }
			}
			return;
		}
		title = title || "提示";
		msg = msg || "";
		if(btns==undefined || typeof(btns)!="object"){
			btns = ['确定','取消'];
		}
		
		msg = "<div style='min-width:200px;'>"+msg+"</div>";
		
		var index = $.layer({
			title:title,
		    shade: [0.1,'#000'],
            area: ['auto','auto'],
            dialog: {
                msg: msg,
                btns: btns.length,
                type: 4,
                btn: btns,
                yes: function(){
                    if(yesfn && typeof(yesfn)=="function"){
                    	if(yesfn()!==false){
                    		layer.close(index);
                    	}
                    }else{
                    	layer.close(index);
                    }                    
                }, no: function(){
                    if(nofn && typeof(nofn)=="function"){
                    	nofn();
                    }
                }
            }
        });
		return index;
	};
	/**
	 * 输入提示
	 * @title 必须，标题
	 * @fn 必须，回调函数
	 * @val 可选，文本框默认值
	 * @size 可选，文本框长度，默认200
	 */
	this.prompt = function(title,fn,val,size){
		title = title||"输入提示";
		val = val || "";
		size = size||200;
		var options = {
			    type: 0,
			    title: title,
			    val:val,
			    length: size
			}    
		var idx = layer.prompt(options, function(val,index, elem){
			if(fn && typeof(fn)=="function"){
				fn(val,index, elem);
            }
			layer.close(idx);
		});
	};
	/**
	 * 
	 */
	this.loading = function(time,text){
		if($.layer==undefined){
			return;
		}
		if(time==undefined){
			time = 0;
		}
		if(text!=undefined){
			return layer.load(text,time);
		}
		return layer.load(time);
	};
	
	/**
	 * ajax post
	 * 使用json
	 * @url 必须，url
	 * @data 可选，请求参数，默认无参
	 * @success 可选，请求成功后回调函数
	 * @timout 可选，请求超时，默认30s
	 * @error 可选，请求异常时回调函数
	 * @lock 可选，为true时显示遮罩，默认true
	 * @async 可选，为true表示异步，默认true
	 */
	this.post = function(url,data,success,timeout,error,lock,async,dataType){
		this.reqObj = null;
		if(url==undefined){
			zUtil.msg("无效请求地址。");
			return;
		}
		if(data==undefined || data==null || data==""){
			data = {};
		}
		if(typeof(data)!="object"){
			zUtil.msg("参数错误。");
			return;
		}
		if(timeout==undefined){
			timeout = 30;
		}
		if(async==undefined){
			async=false;
		}
		dataType = dataType||"JSON";
		var lockIdx=-1;
		if(lock==undefined || lock===true){
			lockIdx = layer.load('加载中', timeout);
		}
		
		$.ajax({
			url:url,
			data:data,
			// type:"POST",
			type:"GET",
			timeout:timeout*1000,
			async:async,
			dataType:dataType,
			success:function(result){
				layer.close(lockIdx);
				if(result!=undefined && result.code!=undefined && result.code==99){
					zUtil.reqObj={
						method:"post",
						url:url,
						data:data,
						success:success,
						timeout:timeout,
						error:error,
						async:async,
						dataType:dataType
					};
					zUtil.tologin(result.msg);
					return;
				}
				if(success && typeof(success)=="function"){
					success(result);
				}
			},
			error:function(xhr,message,err){
				layer.close(lockIdx);
				if(error && typeof(error)=="function"){
					error(xhr,message,err);
				}else{
					var msg="请求异常。";
					if(message=="timeout"){
						msg="请求超时。";
					}
					zUtil.msg(msg);
				}
			}
		});
	};
	/**
	 * ajax get 类似post
	 */
	this.get = function(url,data,success,timeout,error,lock,async,dataType){
		zUtil.reqObj=null;
		if(url==undefined){
			zUtil.msg("无效请求地址。");
			return;
		}
		if(data==undefined || data==null || data==""){
			data = {};
		}
		if(typeof(data)!="object"){
			zUtil.msg("参数错误。");
			return;
		}
		if(timeout==undefined){
			timeout = 30;
		}
		if(async==undefined){
			async=true;
		}
		dataType = dataType||"JSON";
		var lockIdx=-1;
		if(lock==undefined){
			lockIdx = layer.load('加载中', timeout);
		}
		
		$.ajax({
			url:url,
			data:data,
			type:"GET",
			timeout:timeout*1000,
			async:async,
			dataType:dataType,
			success:function(result){
				layer.close(lockIdx);
				if(result!=undefined && result.code!=undefined && result.code==99){
					zUtil.reqObj={
						method:"get",
						url:url,
						data:data,
						success:success,
						timeout:timeout,
						error:error,
						async:async,
						dataType:dataType
					};
					zUtil.tologin(result.msg);
					return;
				}
				if(success && typeof(success)=="function"){
					success(result);
				}
			},
			error:function(xhr,message,err){
				layer.close(lockIdx);
				if(error && typeof(error)=="function"){
					error(xhr,message,err);
				}else{
					var msg="请求异常。";
					if(message=="timeout"){
						msg="请求超时。";
					}
					zUtil.msg(msg);
				}
			}
		});
	};
	
	this.loadhtml = function(eleid,url,method,data,fun){
		var obj = $("#"+eleid);
		if(obj[0]==undefined || url==undefined || url==""){
			return;
		}
		method = method||"GET";
		timeout = 30;
		lock = true;
		async = false;
		if(method.toUpperCase()=='POST'){
			this.post(url,data,function(html){
				obj.html(html);
				if(typeof(fun)=="function"){
					fun();
				}
			},timeout,null,lock,async,'HTML');
		}else{
			this.get(url,data,function(html){
				obj.html(html);
				if(typeof(fun)=="function"){
					fun();
				}
			},timeout,null,lock,async,'HTML');
		}
	}
	/**
	 * 自动完成,from url
	 * @id input id
	 * @url：
	 */
	this.autoCompleteFromUrl = function(id,url,post,fn,initfn,direction){
		if($("#"+id).AutoComplete == undefined){
			this.msg("缺少组件");
			return;
		}
		direction = direction||"down";
		if(post==undefined || post==null || post==""){
			post = {};
		}
		if(typeof(initfn)!="function"){
			initfn = null;
		}
		$("#"+id).AutoComplete({
			data:url,
			ajaxParams:post,
			width:"auto",
			listDirection:direction,
			ajaxDataType: 'json',
			ajaxTimeout:10,
			ajaxType:"POST",
			beforeLoadDataHandler:function(keyword){
				this.option.ajaxParams[id] = keyword;
				return true;
			},
			afterSelectedHandler:function(data){
				if($.isFunction(fn)){
					fn(data);
				}
			},
			onerror: function(msg){
				zUtil.msg("请求异常");
				if(initfn!=null){
					initfn();
				}
			},
			oninit:initfn
		});
	};
	/**
	 * 自动完成，指定数据
	 */
	this.autoCompleteFromData = function(id,data,fn,initfn,isshow,direction){
		if($("#"+id).AutoComplete == undefined){
			this.msg("缺少组件");
			return;
		}
		direction = direction||"down";
		if(typeof(initfn)!="function"){
			initfn = null;
		}
		if(typeof(data) != "object"){
			data=[];
		}
		isshow = isshow==undefined?true:isshow;
		var obj = $("#"+id).AutoComplete({
			data:data,
			width:"auto",
			listDirection:direction,
			beforeLoadDataHandler:function(keyword){
				this.option.ajaxParams[id] = keyword;
				return true;
			},
			afterSelectedHandler:function(data){
				if($.isFunction(fn)){
					fn(data);
				}
			},
			onerror: function(msg){
				zUtil.msg("请求异常");
				if(initfn!=null){
					initfn();
				}
			},
			oninit:initfn
		});
		if(isshow==true){
			obj.AutoComplete('show');
		}
	};
	/**
	 * 设cookie
	 * @name 
	 * @val value
	 * @t 可选，cookie保留时间，默认为会话级,单位：天
	 */
	this.setCookie = function(name,val,t){
		if(name==undefined){
			return;
		}
		val = val||"";
		var str = name + "=" + escape(val)+";";
		var expires ="";
		if(t!=undefined){
		    var exp = new Date(); 
		    exp.setTime(exp.getTime()+t * 24 *60 * 60*1000);
		    expires = "expires=" + exp.toGMTString()+";";
		}
		str += expires+"path=/";
		document.cookie = str;
	};
	/**
	 * 读cookie
	 * @name key
	 * @dft 如果cookie中没有，返回的默认值。
	 */
	this.getCookie = function(name,dft){
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		if(arr != null) return unescape(arr[2]); 
		if(dft==undefined || dft==null){
			return dft;
		}
		return "";
	};
	/**
	 * 删除cookie
	 */
	this.delCookie = function(name){
		var exp = new Date(); 
	    exp.setTime(exp.getTime() - 1); 
		document.cookie = name+"='';expires="+exp.toGMTString()+";path=/";
	};
	
	/**
	 * 验证长度，返回true/false
	 * @str 待验证文本
	 * @max 必须，最大长度
	 * @msg 可选，结果为false时的提示文本
	 * @min 可选，最小长度，默认1
	 * @trim 可选，是否去除收尾空格，默认true
	 */
	this.checkLen = function(str,max,msg,min,trim){
		if(str==undefined || max==undefined){
			return false;
		}
		msg = msg==undefined?"":msg;
		min = min==undefined?1:min;
		trim = trim==undefined?true:trim;
		if(trim){
			str = $.trim(str);
		}
		if(str.length<min || str.length>max){
			if(msg!=""){
				this.msg(msg);
			}
			return false;
		}
		return true;
	};
	/**
	 * 验证文本
	 * @str 必须，待验证文本。
	 * @patterns 必须，不传直接返回true。验证正则表达式，string 或 array。
	 * @msg 可选， 验证不通过时的提示。
	 */
	this.checkContent = function(str,patterns,msg){
		if(str==undefined){
			return false;
		}
		if(patterns==undefined){
			return true;
		}
		msg = msg==undefined?"":msg;
		if(typeof(patterns)=="string"){
			patterns = [patterns];
		}
		if(typeof(patterns)!="object"){
			return false;
		}
		for(var i=0;i<patterns.length;i++){
			if(typeof(patterns[i])!="object" || !patterns[i].test(str)){
				if(msg!=""){
					this.msg(msg);
				}
				return false;
			}
		}
		return true;
	};
	/**
	 * 格式化货币，保留2位小数，千位用逗号分隔。
	 * @val 数值。
	 * @symbol 可选，币种符，默认：￥。
	 */
	this.formatMoney=function(val,symbol,precision){
		if(typeof(accounting)=="undefined"){
			return val;
		}
		symbol = symbol==undefined?"":symbol;
		precision = precision==undefined?0:precision;
		
		if(val == undefined){
			return symbol+"0.00";
		}
		var options  = {
			symbol : symbol,   // default currency symbol is '$'
			format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
			decimal : ".",  // decimal point separator
			thousand: ",",  // thousands separator
			precision : precision   // decimal places
		}
		return accounting.formatMoney(val,options);
	};
	/**
	 * 格式化数字
	 * @val 数值
	 * @precision 可选，小数位数，默认“2”。
	 * @thousand 可选，千位分隔符，默认“,”。
	 */
	this.formatNumber = function(val,precision,thousand){
		if(typeof(accounting)=="undefined"){
			return val;
		}
		precision=precision==undefined?2:precision;
		thousand=thousand==undefined?",":thousand;
		
		var options  = {
				precision: precision,
				thousand: thousand
		}
		return accounting.formatNumber(val, options);
	};
	/**
	 *更新验证码图片。
	 *@imgid img id
	 *@inputid 可选，输入框id，用来清空输入框。 
	 */
	this.updateVerifyCode = function(imgid,inputid,isfocus){
		if(imgid==undefined){
			return;
		}
		isfocus = isfocus==undefined?true:isfocus;
		var url=path+"/common/getCode?r="+Math.random();
		setTimeout(function(){$("#"+imgid).attr("src",url);},0);
		$("#"+inputid).val("");
		if(isfocus){
			$("#"+inputid).focus();
		}
	};
	this.isInteger = function(v){
		if(v==undefined){
			return false;
		}
		v = $.trim(v);
		var reg = /^[0-9]*[1-9][0-9]*$/g;
		return reg.test(v);
	};
	/**
	 * 是否是数字
	 * @v 值
	 * @decimal 可选。小数位数，默认最多2位
	 */
	this.isNumber = function(v,decimal){
		v = v+"";
		if(v==undefined || v=="" || !(typeof(v)=="string" || typeof(v)=="number")){
			return false;
		}
		if(decimal!=undefined && !this.isInteger(decimal)){
			return false;
		}
		if(decimal==undefined){
			decimal=2;
		}
		if(!$.isNumeric(v)){
			return false;
		}
		var s = v.length;
		for(;v.indexOf(".")!=-1 && v!="0" && v.substring(s-1,s)=="0";){
			v = v.substring(0,s-1);
			s = v.length;
		}
		v = $.trim(v);
		var reg = "^[0-9]+(.[0-9]{0,"+decimal+"})?$"
		var re = new RegExp(reg);
		return re.test(v);
	};
	/**
	 * 是否是回车
	 */
	this.isEnter = function(event,fn){
		if(event.keyCode==13){
			if(typeof(fn) == "function"){
				fn();
			}
			return true;
		}
		return false;
	}
	/**
	 * 搜索结果项的上下键选择事件
	 * @param keyCode:键码值 as:下拉选项集合(如$("#searchView>a"))
	 */
	this.upDownKeySelect = function(keyCode,as){
		
		if(this.selectKey>=as.length)this.selectKey = null;
		if(keyCode == 38){//向上键
			if(this.selectKey==null){
				this.selectKey = as.length-1;
				as[this.selectKey].className = "cur";//选中样式
			}else{
				as[this.selectKey].className = "";//无样式
				if(this.selectKey<=0){
					this.selectKey = as.length-1;
				}else{
					this.selectKey = this.selectKey - 1;
				}
				as[this.selectKey].className = "cur";
			}
		}else if(keyCode == 40 ){//向下键
			if(this.selectKey==null){
				this.selectKey = 0;
				as[this.selectKey].className = "cur";
			}else{
				as[this.selectKey].className = "";
				if(this.selectKey>=as.length-1){
					this.selectKey = 0;
				}else{
					this.selectKey = this.selectKey + 1;
				}
				as[this.selectKey].className = "cur";
			}
		}if (keyCode == 13) {//Enter键
			if (as.length > 0) {
				if(this.selectKey==null){
					as[0].click();
				}else{
					as[this.selectKey].click();
				}
			}
		}
	}
	/**
	 * 获取浏览器可视宽高
	 */
	this.getBrowserDimensions = function(){
		var dimensions = {};
		var winWidth = 0; 
		var winHeight = 0;
		//获取窗口宽度 
		if (window.innerWidth) { 
			dimensions.width = window.innerWidth; 
		}else if ((document.body) && (document.body.clientWidth)) {
			dimensions.width = document.body.clientWidth;
		}
		//获取窗口高度 
		if (window.innerHeight) {
			dimensions.height = window.innerHeight; 
		}else if ((document.body) && (document.body.clientHeight)) {
			dimensions.height = document.body.clientHeight;
		}
		//通过深入Document内部对body进行检测，获取窗口大小 
		if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){ 
			dimensions.height = document.documentElement.clientHeight; 
			dimensions.width = document.documentElement.clientWidth; 
		}
		return dimensions;
	}
	/**
	 * 获取地理位置
	 * @param callback(data) 回调函数
	 * data.coords.longitude 精度
	 * data.coords.latitude  维度
	 */
	this.getLocation = function(callback){
		if(callback && typeof(callback)=="function"){
			if(navigator.geolocation){
				//请求地理位置
				navigator.geolocation.getCurrentPosition(callback,
				function(data){
					switch(data.code){
						case 1:alert("位置服务被拒绝");break;
						case 2:alert("暂时获取不到位置信息");break;
						case 3:alert("获取信息超时");break;
						case 4:alert("未知错误");break;
					}
				}, {enableHighAccuracy:true, maximumAge:1000});
			}else{
				alert("您的浏览器不支持使用HTML 5来获取地理位置服务");
				return;
			}
		}
	};
	this.getBaiduLngLat = function(callback,address,lng,lat,title){
		callback = callback||'';
		var param = "callback="+callback;
		if(typeof(address) != "undefined"){
			param += "&address="+address;
		}
		if(typeof(lng) != "undefined"){
			param += "&lng="+lng;
		}
		if(typeof(lat) != "undefined"){
			param += "&lat="+lat;
		}
		if(title==undefined || title==''){
			title = "确定位置";
		}
		var url = fzzpath + "/basemap/getBaiduLngLat?"+param;
		zUtil.openurl(title,url,700,550);
	}
}
var zUtil = new ZUtil();