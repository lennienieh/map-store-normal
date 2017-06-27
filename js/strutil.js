/**
 * 常用的字符串方法JS工具类
 * @author 梁华山
 * add by 20130315
 */

//转码
function encode(strIn)
{
	if(checkUtil.isNull(strIn))return "";
	var intLen=strIn.length;
	var strOut="";
	var strTemp;

	for(var i=0; i<intLen; i++)
	{
		strTemp=strIn.charCodeAt(i);
		if (strTemp>255)
		{
			tmp = strTemp.toString(16);
			for(var j=tmp.length; j<4; j++) tmp = "0"+tmp;
			strOut = strOut+"^"+tmp;
		}
		else
		{
			if (strTemp < 48 || (strTemp > 57 && strTemp < 65) || (strTemp > 90 && strTemp < 97) || strTemp > 122)
			{
				tmp = strTemp.toString(16);
				for(var j=tmp.length; j<2; j++) tmp = "0"+tmp;
				strOut = strOut+"~"+tmp;
			}
			else
			{
				strOut=strOut+strIn.charAt(i);
			}
		}
	}

	return (strOut);
}

//解码
function decode(strIn)
{
	if(checkUtil.isNull(strIn))return "";
	var intLen = strIn.length;
	var strOut = "";
	var strTemp;

	for(var i=0; i<intLen; i++)
	{
		strTemp = strIn.charAt(i);
		switch (strTemp)
		{
			case "~":{
				strTemp = strIn.substring(i+1, i+3);
				strTemp = parseInt(strTemp, 16);
				strTemp = String.fromCharCode(strTemp);
				strOut = strOut+strTemp;
				i += 2;
				break;
			}
			case "^":{
				strTemp = strIn.substring(i+1, i+5);
				strTemp = parseInt(strTemp,16);
				strTemp = String.fromCharCode(strTemp);
				strOut = strOut+strTemp;
				i += 4;
				break;
			}
			default:{
				strOut = strOut+strTemp;
				break;
			}
		}

	}
	return (strOut);
}

/**
*功能:删除字符串中的空格和换行符
*/
function removeBlankEnter(tmpText){
	//删除字符串中的空格和换行符
	var tmpText = tmpText;
	for(var i=tmpText.length-1; i>=0; i--){
		tmpText = tmpText.replace("\n","");
	}
	var str = "";
	for(var i=tmpText.length-1; i>=0; i--){
		if(tmpText.charAt(i)!=" "&&tmpText.charAt(i)!="\r")str=tmpText.charAt(i)+str;
	}
	return str;
}

//替换所有 
String.prototype.replaceAll=function(search,replace){
	var result=this;
	while(result.indexOf(search)!=-1){
		result=result.replace(search,replace); 
	}
	return result;
}

/**
 * 计算字符长度,中文占两个字节
 * @param sTargetStr
 * @returns {Number}
 */
function strLen(str) {
    var sTmpStr, sTmpChar;
    var nOriginLen = 0;
    var nStrLength = 0;
    sTmpStr = new String(str);
    nOriginLen = sTmpStr.length;
    for ( var i=0 ; i < nOriginLen ; i++ ) {
        sTmpChar = sTmpStr.charAt(i);

        if (escape(sTmpChar).length > 4) {
            nStrLength += 2;
        } else if (sTmpChar!='/r') {
            nStrLength ++;
        }
    }
    return nStrLength;
}

