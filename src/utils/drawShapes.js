export function drawOctagon(ctx, x, y, radius, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = ((Math.PI * 2) / 8) * i - Math.PI / 8;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawDiamond(ctx, x, y, width, height, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - height / 2);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x, y + height / 2);
  ctx.lineTo(x - width / 2, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawRectangle(ctx, x, y, width, height, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x - width / 2, y - height / 2, width, height);
  ctx.restore();
}

export function drawCross(
  ctx,
  x,
  y,
  size,
  thickness = size / 3,
  color = '#fff'
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x - thickness / 2, y - size / 2, thickness, size);
  ctx.fillRect(x - size / 2, y - thickness / 2, size, thickness);
  ctx.restore();
}

export function drawCircle(ctx, x, y, radius, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawSquare(ctx, x, y, size, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  ctx.restore();
}

export function drawTriangle(ctx, x, y, size, color = '#fff') {
  const h = (size * Math.sqrt(3)) / 2;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2);
  ctx.lineTo(x + size / 2, y + h / 2);
  ctx.lineTo(x - size / 2, y + h / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawPentagon(ctx, x, y, radius, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawHexagon(ctx, x, y, radius, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = ((Math.PI * 2) / 6) * i - Math.PI / 2;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawStar(ctx, x, y, radius, points = 5, color = '#fff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * 0.5;
    ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
