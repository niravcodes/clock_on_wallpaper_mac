const dot = () => {
  return customItem(new BBox({ width: 7, height: 7 }), (ctx) => {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.roundRect(0, 23, 7, 10, 3);
    ctx.fill();
  });
};

function marginTop(distance, ...args) {
  return vstack(spacer(0, distance), ...args);
}
function marginBottom(distance, ...args) {
  return vstack(...args, spacer(0, distance));
}
function marginLeft(distance, ...args) {
  return hstack(spacer(distance, 0), ...args);
}
function marginRight(distance, ...args) {
  return hstack(...args, spacer(distance, 0));
}
