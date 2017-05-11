var transBasicText;
var resultColor = document.getElementById("result_color");  //色を表示するための領域
var colors = [];

//Add span tag every number of color.
function colorEncryption() {
  var traText = document.getElementById("now").value;  //暗号化対象文字列
  var textBytes = string_to_utf8_hex_string(traText);  //8gjns81u8ab -> a8982798097d84780180970986983710972f74918697647910
  var mod;

  colors = transColor(textBytes);  //['#982792', '#987329', '#980502', ...]

  for(var i = 0; i < colors.length; i++) {
    if(colors[i].length != 7 && colors[i].length > 4 && colors[i].length < 7){
      mod = 7 - colors[i].length;

      for(var c = 0; c < mod; c++) {
        colors[i] += '0';
      }
    }

    if(colors[i].length != 4 && colors[i].length < 4) {
      mod = 4 - colors[i].length;

      for(var c = 0; c < mod; c++) {
        colors[i] += '0';
      }
    }
  }

  addSpanTag(colors);

  transBasicText = utf8_hex_string_to_string(textBytes);  //元の文章に戻した文字列
}

function addSpanTag(colors) {
  var addSpan = [];
  var addSpanTag = [];
  var spanArray = [];

  for(var i = 0; i < colors.length; i++) {

    addSpan[i] = document.createElement("span");
    addSpanTag[i] = document.createTextNode(colors[i]);
    addSpan[i].appendChild(addSpanTag[i]);
    resultColor.appendChild(addSpan[i]);

    if(i == colors.length - 1) {
      addSpan[i] = document.createElement("br");
      resultColor.appendChild(addSpan[i]);
    }
  }

  spanArray = document.getElementsByTagName("span");

  for(var i = spanArray.length - 1, j = 0; j < colors.length; i--, j++) {
    spanArray[i].style.color = colors[j];
    spanArray[i].style.backgroundColor = colors[j];
  }
}

//Translation to color code.
function transColor(bytes) {
  var colors = [];

  if(bytes.length % 6 != 0) {
    var mod = bytes.length % 6;
    var addZero = '';

    for(var i = 0; i < mod - 2; i++) {
      addZero += '0';
    }

    bytes = addZero + bytes;
  }

  colors = splitByLength(bytes, 6);

  for(var c = 0; c < colors.length; c++) {
    colors[c] = '#' + colors[c];
  }

  return colors;
}

function decryption() {
  var decText = document.getElementById("base");
  decText.innerHTML = transBasicText;
}

//string -> byte code(type is string)
function string_to_utf8_hex_string(text) {
  var bytes1 = string_to_utf8_bytes(text);
  var hex_str1 = bytes_to_hex_string(bytes1);
  return hex_str1;
}

function utf8_hex_string_to_string(hex_str1) {
  var bytes2 = hex_string_to_bytes(hex_str1);
  var str2 = utf8_bytes_to_string(bytes2);

  return str2;
}

function string_to_utf8_bytes(text) {
  var result = [];

  if(text == null) {
    return result;
  }

  for(var i = 0; i < text.length; i++) {
    var stringToChar = text.charCodeAt(i);

    if(stringToChar <= 0x7f) {
      result.push(stringToChar);
    } else if(stringToChar <= 0x07ff) {
      result.push(((stringToChar >> 6) & 0x1F) | 0xC0);
      result.push((stringToChar & 0x3F) | 0x80);
    } else {
      result.push(((stringToChar >> 12) & 0x0F) | 0xE0);
      result.push(((stringToChar >> 6) & 0x3F) | 0x80);
      result.push((stringToChar & 0x3F) | 0x80);
    }
  }

  return result;
}

function bytes_to_hex_string(bytes) {
  var result = "";

  for(var i = 0;i < bytes.length; i++) {
    result += byte_to_hex(bytes[i]);
  }

  return result;
}

function byte_to_hex(byte_num) {
  var digits = (byte_num).toString(16);

  if(byte_num < 16) {
    return '0' + digits;
  }

  return digits;
}

function hex_string_to_bytes(hex_str) {
  var result = [];

  for(var i = 0; i < hex_str.length; i++) {
    result.push(hex_to_byte(hex_str.substr(i, 2)));
  }

  return result;
}

function utf8_bytes_to_string(arr) {
  if(arr == null) {
    return null;
  }

  var result = "";
  var i;

  while (i = arr.shift()) {
    if(i <= 0x7f) {
      result += String.fromCharCode(i);
    } else if(i <= 0xdf) {
      var c = ((i & 0x1f) << 6);
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
    } else if(i <= 0xe0) {
      var c = ((arr.shift() & 0x1f) << 6) | 0x0800;
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
    } else {
      var c = ((i & 0x0f) << 12);
      c += (arr.shift() & 0x3f) << 6;
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
    }
  }

  return result;
}

function hex_to_byte(hex_str) {
  return parseInt(hex_str, 16);
}

function splitByLength(str, length) {
  var resultArr = [];

  if (!str || !length || length < 1) {
    return resultArr;
  }

  var index = 0;
  var start = index;
  var end = start + length;

  while (start < str.length) {
    resultArr[index] = str.substring(start, end);
    index++;
    start = end;
    end = start + length;
  }

  return resultArr;
}
