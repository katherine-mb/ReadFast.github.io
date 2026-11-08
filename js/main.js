fetch("header.html")
  .then(response => response.text())
  .then(html => {
    document.querySelector("#header-placeholder").innerHTML = html;
  });

fetch("footer.html")
  .then(response => response.text())
  .then(html => {
    document.querySelector("#footer-placeholder").innerHTML = html;
  });