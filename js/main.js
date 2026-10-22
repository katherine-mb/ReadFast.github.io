fetch("header.html")
  .then(response => response.text())
  .then(html => {
    document.querySelector("#header-placeholder").innerHTML = html;
  });