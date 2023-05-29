/*jshint esversion: 9 */

function onPlayerEnded(event) {
  playNextPlaylistItem();
}


function playSong(path, name) {
  clearPlaylistActiveItems();
  markPlaylistItemActive(path);
  let el = document.getElementById('playing');
  el.innerText = name;
  let player = document.getElementById('player');
  player.src = path;
  player.play();
}

function stopSong() {
  let player = document.getElementById('player');
  player.pause();
}


function addImageToTitleDiv(image, div) {
  let el = document.createElement('div');
  let img = document.createElement('img');
  img.src = image;
  el.appendChild(img);
  div.prepend(el);
}

function loadPathIntoPlaylist(path) {
  loadPathAndThen(path,
                  (text) => {
                    parseTextLinesWithPath(text, path,
                                           (url, name) => { loadPathIntoPlaylist(url);},
                                           (url, name) => { addFileToPlaylist(url,name); },
                                           (image) => {});
                  });
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
  label.onclick = (event) => { loadPathIntoPlaylist(path); };
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
      disclose.innerText = '▼';
      disclose.classList.add('opened');
      loadPathIntoDiv(path, contents);
    }
  };
  return el;
}

function playNextPlaylistItem() {
  let currentPath;
  
  {
    let els = document.getElementsByClassName('active_playlist_item');
    for (let el of els) {
      let path = el.getElementsByClassName('playlist_path')[0].innerText;
      currentPath = path;
    }
  }
  {
    let next = false;
    let els = document.getElementsByClassName('playlist_item');
    for (let el of els) {
      let path = el.getElementsByClassName('playlist_path')[0].innerText;
      let name = el.getElementsByClassName('playlist_title')[0].innerHTML;
      if (next) {
        playSong(path, name);
        return;
      }
      if (path === currentPath) {
        next = true;
      }
    }
    /* If we got here, check for looping! */
    if (els.length > 0 && document.getElementById('playlist_loop').value) {
      let el = els[0];
      let path = el.getElementsByClassName('playlist_path')[0].innerText;
      let name = el.getElementsByClassName('playlist_title')[0].innerHTML;
      playSong(path, name);
    }
  }
}

function markPlaylistItemActive(activePath) {
  let els = document.getElementsByClassName('playlist_item');
  for (let el of els) {
    let path = el.getElementsByClassName('playlist_path')[0].innerText;
    let file = el.getElementsByClassName('playlist_title')[0].innerHTML;
    if (activePath === path) {
      el.classList.add('active_playlist_item');
    }
  }
}

function clearPlaylistActiveItems() {
  let els = document.getElementsByClassName('active_playlist_item');
  for (let el of els) {
    el.classList.remove('active_playlist_item');
  }
}


function playlistElementFor(path,name) {
  let el = document.createElement('div');
  el.classList.add('playlist_item');

  let minus = document.createElement('span');
  minus.classList.add('playlist_remove_item');
  minus.innerText = '[✕]';
  el.appendChild(minus);
  minus.onclick = (event) => {
    el.remove();
  };

  let pathEl = document.createElement('span');
  pathEl.classList.add("playlist_path");
  pathEl.innerText = path;
  el.appendChild(pathEl);

  let title = document.createElement('span');
  title.classList.add('playlist_title');
  title.innerHTML = name;
  title.onclick = (event) => {
    playSong(path, name);
  };
  el.appendChild(title);
  return el;
}


function clearPlaylist(event) {
  stopSong();
  let els = document.getElementsByClassName('playlist_item');
  while (els.length > 0) {
    let el = els[0];
    el.remove();
  }
}


function addFileToPlaylist(path, name) {
  let els = document.getElementsByClassName('playlist_item');
  for (let el of els) {
    let thisPath = el.getElementsByClassName('playlist_path')[0].innerText;
    if (thisPath === path) {
      return;
    }
  }
  {
    let el = document.getElementById('playlist');
    el.appendChild(playlistElementFor(path, name));
  }
}

function elementForSong(path, name) {
  let el = document.createElement('div');
  el.id = path;
  
  let disclose = document.createElement('span');
  disclose.classList.add('disclosure');
  disclose.innerText = '🎶';
  disclose.onclick = (event) => {
    addFileToPlaylist(path, name);
  };
  el.appendChild(disclose);
  let label = document.createElement('span');
  label.innerHTML = name;
  label.onclick = (event) => {
    addFileToPlaylist(path, name);
  };
  el.appendChild(label);

  /*
  let play = document.createElement('span');
  play.innerText = '⏵';
  play.onclick = (event) => {
    playSong(path, name);
  };
  
  let add = document.createElement('span');
  add.innerText = '+';
  add.onclick = (event) => {
    addFileToPlaylist(path, name);
  };
  el.appendChild(play);
  el.appendChild(add);
  */


  return el;
}

function addUrlToPath(url, path) {
  const separator = (url.startsWith('/') || path.endsWith('/')) ? '' : '/';
  return path + separator + url;
}

function parseTextLinesWithPath(text, path, onDirectory, onFile, onImage) {
  let parentEl = document.createElement('div');
  parentEl.innerHTML = text;
  
  var anchors = parentEl.getElementsByTagName('a');
  for (let el of anchors) {
    var name = el.innerText;
    var url = el.getAttribute('href');
    if (!(url.startsWith('http:') || url.startsWith('https:')))
    {
      url = addUrlToPath(url, path);
    }
    if (name.startsWith('.')) {
    } else if (name.endsWith('/')) {
      onDirectory(url,name);
    } else if (name.endsWith('.mp3')) {
      onFile(url,name.substr(0, name.length - 4));
    } else if (name == "AlbumArtSmall.jpg") {
      image = name;
    } else if (name.startsWith('AlbumArt_') && name.endsWith('_Small.jpg')) {
      image = name;
    } else {
    }
  }
}


function loadPathAndThen(path, then) {
  let r = new XMLHttpRequest();
  r.open("GET", path, true);
  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    then(r.responseText);
  };
  r.send();
}


function loadPathIntoDiv(path, div) {
  loadPathAndThen(path,
                  (text) => {
                    div.innerHTML = '';
                    parseTextLinesWithPath(text,path,
                                           (url,name) => { div.appendChild(elementForDirectory(url,name)); },
                                           (url,name) => { div.appendChild(elementForSong(url,name)); },
                                           (image) => { addImageToTitleDiv(addUrlToPath(image,path,div)); });
                  });
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

