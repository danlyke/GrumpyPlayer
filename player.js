

function addImageToTitleDiv(image, div) {
  let el = document.createElement('div');;
  let img = document.createElement('img');
  img.src = image;
  el.appendChild(img);
  div.prepend(el);
}

function elementForDirectory(path, name) {
  let el = document.createElement('div');
  el.id = path;

  let header = document.createElement('div');
  let disclose = document.createElement('span');
  disclose.classList.add('disclosure');
  disclose.innerText = '►';
  header.appendChild(disclose);
  let label = document.createElement('span');
  label.innerHTML = name;
  header.appendChild(label);
  header.classList.add('header');

  el.appendChild(header);
  
  let contents =document.createElement('div');
  contents.classList.add('contents');
  el.appendChild(contents);

  disclose.onclick = (event) => {
    if (disclose.classList.contains('opened')) {
      disclose.classList.remove('opened');
      disclose.innerText = '►';
      contents.innerHTML = '';
    } else {
      disclose.innerText = '▼'
      disclose.classList.add('opened');
      loadPathIntoDiv(path, contents);
    }
  };
  return el;
}

function playlistElementFor(path,name) {
  let el = document.createElement('div');
  let title = document.createElement('span');
  title.innerHtml = name;
  el.appendChild(title);
  let minus = document.createElement('span');
  minus.innerText = '[✕]';
  el.appendChild(minus);
  minus.onclick = (event) => {
    el.remove();
  };
  return el;
}


function playFile(path, name) {
  let el = document.getElementById('playing');
  el.innerText = path;
}

function addFileToPlaylist(path, name) {
  let el = document.getElementById('playlist');
  el.appendChild(playlistElementFor(path, name));
}

function elementForSong(path, name) {
  let el = document.createElement('div');
  el.id = path;
  
  let disclose = document.createElement('span');
  disclose.classList.add('disclosure');
  disclose.innerText = '🎶';
  disclose.onclick = (event) => {
    console.log('Click to play ' + el.id);
  };
  el.appendChild(disclose);
  let label = document.createElement('span');
  label.innerHTML = name;
  el.appendChild(label);

  let play = document.createElement('span');
  play.innerText = '⏵';
  play.onclick = (event) => {
    playFile(path, name);
  };
  
  let add = document.createElement('span');
  add.innerText = '+';
  add.onclick = (event) => {
    addFileToPlaylist(path, name);
  };

  el.appendChild(play);
  el.appendChild(add);
  
  
  return el;
}

function addUrlToPath(url, path) {
  const separator = (url.startsWith('/') || path.endsWith('/')) ? '' : '/';
  return path + separator + url;
}

function addLinesFromTextToElementWithPath(text, div, path) {
  const regex = /<a href=".*?">.*?<\/a>/g;
  div.innerHTML = '';
  let image;
  const lines = text.match(regex);
  for (let line of lines) {
    const arr = line.split('">');
    let name = arr[1];
    if (name.endsWith('</a>')) {
      name = name.substr(0, name.length - 4);
    }
    let url = arr[0];
    if (url.startsWith('<a href="')) {
      url = url.substr(9);
    }
    if (!(url.startsWith('http:') || url.startsWith('https:')))
    {
      url = addUrlToPath(url, path);
    }
        
    if (name.startsWith('.')) {
    } else if (name.endsWith('/')) {
      div.appendChild(elementForDirectory(url,name));
    } else if (name.endsWith('.mp3')) {
      div.appendChild(elementForSong(url,name));
    } else if (name == "AlbumArtSmall.jpg") {
      image = name;
    } else if (name.startsWith('AlbumArt_') && name.endsWith('_Small.jpg')) {
      image = name;
    } else {
      console.log(`Unknown file type ${name}`);
    }
  }
  if (image) {
    addImageToTitleDiv(addUrlToPath(image,path),div);
  }
}


function loadPathIntoDiv(path, div) {
  let r = new XMLHttpRequest();
  r.open("GET", path, true);
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    addLinesFromTextToElementWithPath(r.responseText, div, path);
  };
  r.send();
}


function start() {
  let div = document.getElementById('tree');
  loadPathIntoDiv('./Music/', div);
}

// wait for page to load before signalling Mesh
if (document.readyState === "complete") {
    start();
} else {
    window.addEventListener('load', start);
}

