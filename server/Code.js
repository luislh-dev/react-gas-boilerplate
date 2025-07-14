function doGet() {
  return HtmlService
    .createTemplateFromFile('dist/index')
    .evaluate()
    .setTitle('Q&A Chat')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
