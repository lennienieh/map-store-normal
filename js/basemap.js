function BaseMap(){
	this.overlay = {};
	this.loadmap = function(city,center,zoom) {
		var map = new BMap.Map("mapview", {
			enableMapClick : false
		});
		this.currentZoom = zoom||12;
		if(center!=""){
			var c = center.split(",");
			map.centerAndZoom(new BMap.Point(c[0],c[1]),this.currentZoom);
		}else{
			map.centerAndZoom(city,this.currentZoom);
		}
		map.enableScrollWheelZoom(true);
		map.setZoom(this.currentZoom);
		map.enableInertialDragging();//启用地图惯性拖拽
		map.enableContinuousZoom();//地图缩放效果
		this.map = map;
	};
	this.centerPoint = function(x,y,zoom){
		if(x==undefined || y==undefined || x==0 || y==0){
			return;
		}
		if(zoom == undefined){
			zoom = this.map.getZoom();
		}
		var point = new BMap.Point(x, y);
		this.map.centerAndZoom(point, zoom);
	};
	/*用一张图片覆盖物*/
	this.addImgMarker=function(lng,lat,imgurl,width,height,click,data,id){
		if(arguments.length<3 || imgurl==""){
			return;
		}
		var offsetX=0,offsetY=0;
		var img = document.createElement("img");
		img.src = imgurl;
		if(width){
			img.width = width;
			offsetX = width/2;
		}
		if(height){
			img.height = height;
			offsetY = height/2;
		}
		if(id){
			img.id=id;
		}
		var html = img.outerHTML;
		var imgOverlay = new baseMap.HtmlOverlay(lng,lat,html,click,data,offsetX,offsetY);
		baseMap.map.addOverlay(imgOverlay);
		return imgOverlay;
	};
    /*html覆盖物*/
    this.addHtmlMarker=function(lng,lat,html,click,data,offsetX,offsetY,className){
    	var htmlOverlay = new baseMap.HtmlOverlay(lng,lat,html,click,data,offsetX,offsetY,className);
    	baseMap.map.addOverlay(htmlOverlay);
		return htmlOverlay;
    }
    this.HtmlOverlay=function(lng,lat,html,click,data,offsetX,offsetY,className){
    	var pt = new BMap.Point(lng,lat);
		this._point = pt;
		this._html = html;
		this._click = click;
		this._data = data||'';
		this._offsetX = offsetX||0;
		this._offsetY = offsetY||0;
		this._className = className||'';
	};
	this.HtmlOverlay.prototype = new BMap.Overlay();
	this.HtmlOverlay.prototype.initialize = function(map){
	      this._map = map;
	       
	      var that = this;
	      var div = this._div = document.createElement("div");
	      div.style.position = "absolute";
	      if(this._className!=''){
	    	  div.className = this._className;
	      }
	      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
	      div.innerHTML=this._html;	
	      div.onclick = function() {
	    	  var e = that;
	    	  if(typeof(that._click)=="function"){
	    		  that._click(e);
	    	  }
	      };
	      $(div).on("touchend",function(){
	    	  var e = that;
	    	  if(typeof(that._click)=="function"){
	    		  that._click(e);
	    	  }
	      });
	      div.onmouseover=function(){
	    	  this.style.zIndex = 1000;
	      };
	      div.onmouseout=function(){
	    	  this.style.zIndex = BMap.Overlay.getZIndex(that._point.lat);
	      }
	      baseMap.map.getPanes().labelPane.appendChild(div);
	      return div;
	};
	this.HtmlOverlay.prototype.draw = function() {
		var map = this._map;
		var pixel = map.pointToOverlayPixel(this._point);
		this._div.style.left = (pixel.x -this._offsetX) + "px";
		this._div.style.top = (pixel.y -this._offsetY) + "px";
	};
	this.HtmlOverlay.prototype.hide = function() {
		if (this._div){
			this._div.style.display = "none";
		}
	};
	/**
	 * 区域覆盖物
	 */
	this.addArea=function (mapArea){
		var points = [];
		var ll = mapArea.split(";");
		for(var i=0;i<ll.length;i++){
			var d = ll[i].split(",");
			if(d.length==2){
				var p = new BMap.Point(d[0],d[1]);
				points.push(p);
			}
		}
		if(points.length==0){
			return;
		}
		var styleOptions = {
				strokeColor:"blue",
				fillColor:"blue",
				strokeWeight: 1,
				strokeOpacity: 0.5,
				fillOpacity: 0.1,
				strokeStyle: 'solid'
			};
		var polygon = new BMap.Polygon(points, styleOptions);
		baseMap.map.addOverlay(polygon);
	};
	this.getMapParam = function(){
		var post = {};
		var zoom = baseMap.map.getZoom();
		var bounds = baseMap.map.getBounds();
		var ne = bounds.getNorthEast();
		var se = bounds.getSouthWest();
		var bound = se.lng + "," + ne.lng + ";" + se.lat + "," + ne.lat;
		post.bound = bound;
		post.zoom = zoom;
		return post;
	}
}

var baseMap = new BaseMap();