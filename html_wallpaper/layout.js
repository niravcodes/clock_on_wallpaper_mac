const npdate = new NepaliDate();
const nepalidate = npdate.format("dd mmmm YYYY");

// The layout for the text and all that appears on the canvas
function createLayout(layoutEngine) {
  const layout = hstack(
    spacer(100, 150),
    vstack(
      spacer(80, 0),
      text(getTime(), "Podkova", "#FFC700", 130),
      spacer(-10, 0),
      hstack(
        text(getEnglishDate(), "Teko", "#FFC700", 45),
        spacer(0, 10),
        dot(),
        spacer(0, 10),
        text(nepalidate, "Teko", "#FFC700", 45)
      )
    )
  );

  layoutEngine.renderLayout(layout);
}
