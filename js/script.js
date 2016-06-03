/* --- Constants --- */

var CONSTANT_INSERT_TEXT = 'Vnesi besedilo';

/* --- Img group --- End */

function convert(numbOfImg, singleImageWidth) {
  var inputValue = inputText.value;
  document.getElementById('hiddenImg').innerHTML = inputValue;
  var inputImgs = toArray(document.getElementById('hiddenImg').getElementsByTagName('a'));

  var lists = toGroupArray(numbOfImg, inputImgs);

  var resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "";
  resultDiv.appendChild(createTextArea());
  for (itm in lists) {
    var imgArray = lists[itm];
    var imageRowHolder = document.createElement('div');
    imageRowHolder.setAttribute('id', generateUUID());
    imageRowHolder.setAttribute('class', 'image-row-holder');
    var centerDiv = document.createElement('div');
    centerDiv.setAttribute('class', 'center-div');
    for (i = 0; i < imgArray.length; i++) {
      var imageCell = document.createElement('div');
      imageCell.setAttribute('id', generateUUID());
      imageCell.setAttribute('class', 'image-cell');
      imageCell.setAttribute('draggable', 'true');
      var imgElement = imgArray[i];
      if (singleImageWidth !== undefined) { // Add style for single image
        imgElement.getElementsByTagName('img')[0].style = 'width: ' + singleImageWidth + '%; height: auto;';
        imgElement.getElementsByTagName('img')[0].src = imgElement.href;
      }
      imageCell.appendChild(imgElement);
      var imgCaption = document.createElement('span');
      imgCaption.appendChild(document.createTextNode(CONSTANT_INSERT_TEXT));
      imageCell.appendChild(imgCaption);
      centerDiv.appendChild(imageCell);
    } // end for
    var clearDiv = document.createElement('div');
    clearDiv.setAttribute('class', 'CSS_CLEAR_BOTH_NO_HEIGHT-cell');
    // centerDiv.appendChild(clearDiv);
    imageRowHolder.appendChild(centerDiv);
    imageRowHolder.appendChild(clearDiv);
    resultDiv.appendChild(imageRowHolder);
    resultDiv.appendChild(createTextArea(imageRowHolder.id));
  } // end for
  resultDiv.appendChild(createSignatureTextArea());

  prepareDraging();
  insertCreatePostBtn();
}

function insertCreatePostBtn() {
  var createPostBtn = document.createElement('button');
  document.getElementById('result').appendChild(document.createElement('hr'));
  createPostBtn.setAttribute('class', 'create-post-btn');
  createPostBtn.setAttribute('onclick', 'createPost();');
  createPostBtn.innerHTML = 'Ustvari post';
  document.getElementById('result').appendChild(createPostBtn);
  var clearDiv = document.createElement('span');
  clearDiv.setAttribute('class', 'clear');
  document.getElementById('result').appendChild(clearDiv);
}

function toArray(obj) {
  var array = [];
  for (var i = obj.length >>> 0; i--;) {
    array[i] = obj[i];
  }
  return array;
}

function toGroupArray(itemInGroup, inputArray) {
  var out = [],
    i = 0,
    n = Math.ceil((inputArray.length) / itemInGroup);
  while (i < n) {
    out.push(inputArray.splice(0, (i == n - 1) && itemInGroup < inputArray.length ? inputArray.length : itemInGroup));
    i++;
  }
  return out;
}

/* --- Img group --- End */

/* --- TextArea --- */

function createTextArea(elementId) {
  var textArea = document.createElement('textArea');
  if (elementId) {
    textArea.setAttribute('id', elementId + '-text');
  }
  textArea.setAttribute('class', 'post-text');
  return textArea;
}

function createSignatureTextArea() {
  var textArea = document.createElement('textArea');
  textArea.setAttribute('class', 'post-text signature-text');
  textArea.textContent = 'Zapisal: ; Foto:'
  return textArea;
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* --- TextArea --- End */

/* --- Convert to bigger image  --- */

function convertToBiggerImg(imgHolderElement, imageWidth, below) {
  var imgElement = imgHolderElement.firstChild;
  var imageRowHolder = document.createElement('div');
  imageRowHolder.setAttribute('id', generateUUID());
  imageRowHolder.setAttribute('class', 'image-row-holder');
  var centerDiv = document.createElement('div');
  centerDiv.setAttribute('class', 'center-div');
  var imageCell = document.createElement('div');
  imageCell.setAttribute('id', generateUUID());
  imageCell.setAttribute('class', 'image-cell');
  imageCell.setAttribute('draggable', 'true');
  imgElement.getElementsByTagName('img')[0].style = 'width: ' + imageWidth + '%; height: auto;';
  imgElement.getElementsByTagName('img')[0].src = imgElement.href;
  imageCell.appendChild(imgElement);
  var imgCaption = document.createElement('span');
  imgCaption.appendChild(document.createTextNode(CONSTANT_INSERT_TEXT));
  imageCell.appendChild(imgCaption);
  centerDiv.appendChild(imageCell);
  var clearDiv = document.createElement('div');
  clearDiv.setAttribute('class', 'CSS_CLEAR_BOTH_NO_HEIGHT-cell');
  imageRowHolder.appendChild(centerDiv);
  imageRowHolder.appendChild(clearDiv);
  var resultDiv = document.getElementById('result');

  if (below) {
    resultDiv.insertBefore(createTextArea(imageRowHolder.id), imgHolderElement.parentElement.parentElement.nextElementSibling.nextElementSibling);
    resultDiv.insertBefore(imageRowHolder, imgHolderElement.parentElement.parentElement.nextElementSibling.nextElementSibling);
  } else {
    resultDiv.insertBefore(imageRowHolder, imgHolderElement.parentElement.parentElement);
    resultDiv.insertBefore(createTextArea(imageRowHolder.id), imgHolderElement.parentElement.parentElement);
  }

  imgHolderElement.parentNode.removeChild(imgHolderElement);
}

/* --- Convert to bigger image  --- End */

/* --- Create post --- */

function createPost() {
  var resultDiv = document.getElementById('created-post');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.setAttribute('id', 'created-post');
    document.getElementsByTagName('body')[0].appendChild(resultDiv);
  } else {
    resultDiv.innerHTML = '';
  }
  var resultText = document.createElement('textarea');
  resultText.setAttribute('class', 'post-text');
  var elements = document.getElementById('result').childNodes;
  [].forEach.call(elements, function (element) {
    if (element.tagName === 'DIV') {
      resultText.textContent += getOuterHtml(element);
    } else if (element.tagName === 'TEXTAREA') {
      if (hasClass(element, 'signature-text')) {
        resultText.textContent += '<div style="color: #999999; font-family: monospace; text-align: right;">' + element.value + '</div>';
      } else {
        resultText.textContent += '<p>' + element.value + '</p>';
      }
    }
  });
  resultText.textContent = formatHtml(resultText.textContent);
  resultText.textContent = resultText.textContent.replace(/Vnesi besedilo/g, '');
  resultDiv.appendChild(document.createElement('hr'));
  resultDiv.appendChild(document.createTextNode('Kopiraj v Blogger:'));
  resultDiv.appendChild(resultText);
}

function getOuterHtml(who) {
  if (!who || !who.tagName) return '';
  var txt, ax, el = document.createElement("div");
  el.appendChild(who.cloneNode(false));
  txt = el.innerHTML;
  ax = txt.indexOf('>') + 1;
  txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
  el = null;
  return txt;
}

/* --- Create post --- End */


/* --- Util --- */

function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function formatHtml(html) {
  var formatted = '';
  var reg = /(>)(<)(\/*)/g;
  html = html.replace(reg, '$1\r\n$2$3');
  var pad = 0;
  html.split('\r\n').forEach(function (node, index) {
    var indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad != 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    var padding = '';
    for (var i = 0; i < pad; i++) {
      padding += ' ';
    }
    formatted += padding + node + '\r\n';
    pad += indent;
  });
  return formatted;
}

function removeEmptyParent(element) {
  if (element.getElementsByTagName('a').length === 0) {
    element.parentElement.removeChild(document.getElementById(element.id + '-text'));
    element.parentElement.removeChild(element);
  }
}
/* --- Util --- End */

/* --- Image caption dialog --- */
var captionToEdit;

function openCaptionDialog(element) {
  captionToEdit = element;
  var dialogDiv = document.getElementById('caption-dialog');
  if (!dialogDiv) {
    dialogDiv = document.createElement('div');
    dialogDiv.setAttribute('id', 'caption-dialog');
    var dialogContentDiv = document.createElement('div');
    var captionFieldElement = document.createElement('input');
    captionFieldElement.setAttribute('id', 'captionField');
    captionFieldElement.setAttribute('onkeypress', 'hideCaptionDialog(event);');
    var confirmCaptionBtn = document.createElement('button');
    confirmCaptionBtn.setAttribute('onclick', 'hideCaptionDialog();');
    confirmCaptionBtn.innerHTML = 'OK';
    dialogContentDiv.appendChild(document.createTextNode('Vnesi besedilo pod sliko:'));
    dialogContentDiv.appendChild(captionFieldElement);
    dialogContentDiv.appendChild(confirmCaptionBtn);
    var clearDiv = document.createElement('span');
    clearDiv.setAttribute('class', 'clear');
    dialogContentDiv.appendChild(clearDiv);
    dialogDiv.appendChild(dialogContentDiv);

    document.body.appendChild(dialogDiv);
  } else {
    dialogDiv.removeAttribute('class');
  }
  captionField.value = element.innerHTML === CONSTANT_INSERT_TEXT ? '' : element.innerHTML;
  captionField.focus();
}

function hideCaptionDialog(keyEvent) {
  if (keyEvent && keyEvent.keyCode && keyEvent.keyCode !== 13) {
    return;
  }
  captionToEdit.innerHTML = captionField.value === '' ? CONSTANT_INSERT_TEXT : captionField.value;
  document.getElementById("caption-dialog").setAttribute("class", "hide");
  captionField.value = '';
}
/* --- Image caption dialog --- End */

/* --- Dragging --- */

var dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  e.dataTransfer.setData('text', this.id);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl != this) {
    if (e.ctrlKey) {
      var dropedElement = document.getElementById(e.dataTransfer.getData('text'))
      var dropedParentElement = dropedElement.parentElement.parentElement;
      dropedElement.getElementsByTagName('img')[0].removeAttribute('style');
      this.parentElement.appendChild(dropedElement);
      removeEmptyParent(dropedParentElement);
    } else {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
  }
  return false;
}

function handleDragEnd(e) {
  var cols = document.querySelectorAll('.image-cell');
        [].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });
}

function handleClick(e) {
  if (e.target.tagName === 'SPAN') {
    openCaptionDialog(e.target);
  } else {
    // TODO Prevent biger and biger image
    convertToBiggerImg(this, 80, e.altKey);
    prepareDraging();
  }
}

function prepareDraging() {
  var cols = document.querySelectorAll('.image-cell');
        [].forEach.call(cols, function (col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
    col.addEventListener('click', handleClick, false);
  });
}


/* --- Dragging --- End */