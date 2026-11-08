function loadPart(fileName, placeholderSelector) {
  const request = fetch(fileName);
  request.then(function (response) {
    return response.text();
  }).then(function (html) {
    const placeholder = document.querySelector(placeholderSelector);
    placeholder.innerHTML = html;
  });
}

loadPart("header.html", "#header-placeholder");
loadPart("footer.html", "#footer-placeholder"); 