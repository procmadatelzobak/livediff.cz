document.addEventListener('DOMContentLoaded', () => {
  const world = document.getElementById('world');
  const svgLines = document.getElementById('connection-lines');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const allNodes = document.querySelectorAll('.node, .sub-node');
  const mainNodes = document.querySelectorAll('.node');
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  let activeNode = null;
  let overviewState = { x: 0, y: 0, scale: 1 };
  const nodeConnections = [
    ['node-intro', 'node-rights'],
    ['node-intro', 'node-principles'],
    ['node-intro', 'node-notes'],
    ['node-rights', 'node-principles']
  ];

  // 1. Set initial positions
  allNodes.forEach(node => {
    node.style.setProperty('--x', `${node.dataset.x}px`);
    node.style.setProperty('--y', `${node.dataset.y}px`);
  });

  // 2. Main Zoom Function (FIXED)
  function zoomToNode(node) {
    if (activeNode) {
      activeNode.classList.remove('active');
    }
    
    activeNode = node;
    activeNode.classList.add('active');
    document.body.classList.add('zoomed-in');

    const nodeWidth = node.offsetWidth;
    const nodeHeight = node.offsetHeight;

    const scaleX = (viewport.width * 0.9) / nodeWidth;
    const scaleY = (viewport.height * 0.9) / nodeHeight;
    const scale = Math.min(scaleX, scaleY);

    // *** FIX: Centering logic for 'transform-origin: center' ***
    const translateX = -parseFloat(node.dataset.x) * scale;
    const translateY = -parseFloat(node.dataset.y) * scale;

    // Apply the transform to both world and SVG lines
    const transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    world.style.transform = transform;
    svgLines.style.transform = transform;
  }

  // 3. Zoom Out Function (FIXED)
  function zoomOut() {
    if (activeNode) {
      activeNode.classList.remove('active');
      activeNode = null;
    }
    document.body.classList.remove('zoomed-in');
    
    const transform = `translate(${overviewState.x}px, ${overviewState.y}px) scale(${overviewState.scale})`;
    world.style.transform = transform;
    svgLines.style.transform = transform;
  }
  
  // 4. Calculate Overview (FIXED)
  function calculateOverview() {
    if (mainNodes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    mainNodes.forEach(node => {
      const x = parseFloat(node.dataset.x);
      const y = parseFloat(node.dataset.y);
      const width = node.offsetWidth || 200;
      const height = node.offsetHeight || 100;

      minX = Math.min(minX, x - width / 2);
      maxX = Math.max(maxX, x + width / 2);
      minY = Math.min(minY, y - height / 2);
      maxY = Math.max(maxY, y + height / 2);
    });

    const mapWidth = maxX - minX;
    const mapHeight = maxY - minY;

    const scaleX = viewport.width / (mapWidth * 1.2);
    const scaleY = viewport.height / (mapHeight * 1.2);
    const scale = Math.min(scaleX, scaleY, 1);

    const mapCenterX = (minX + maxX) / 2;
    const mapCenterY = (minY + maxY) / 2;

    const translateX = -mapCenterX * scale;
    const translateY = -mapCenterY * scale;

    overviewState = { x: translateX, y: translateY, scale: scale };
  }

  // 5. POLISH: Draw Connection Lines
  function drawConnectionLines() {
    const worldRect = world.getBoundingClientRect();
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Set SVG viewport to match the 'world'
    // We position it from center, same as world
    svgLines.setAttribute('viewBox', `0 0 ${worldRect.width} ${worldRect.height}`);
    
    nodeConnections.forEach(pair => {
      const startNode = document.getElementById(pair[0]);
      const endNode = document.getElementById(pair[1]);

      if (startNode && endNode) {
        const line = document.createElementNS(svgNS, 'line');
        // Get center of world + node's offset
        const x1 = (worldRect.width / 2) + parseFloat(startNode.dataset.x);
        const y1 = (worldRect.height / 2) + parseFloat(startNode.dataset.y);
        const x2 = (worldRect.width / 2) + parseFloat(endNode.dataset.x);
        const y2 = (worldRect.height / 2) + parseFloat(endNode.dataset.y);
        
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        svgLines.appendChild(line);
      }
    });
  }

  // 6. Event Listeners
  world.addEventListener('click', (e) => {
    const clickedNode = e.target.closest('.node, .sub-node');
    
    if (clickedNode && !clickedNode.classList.contains('active')) {
      e.stopPropagation();
      zoomToNode(clickedNode);
    }
  });

  zoomOutBtn.addEventListener('click', zoomOut);
  
  // 7. INITIALIZATION
  calculateOverview();
  drawConnectionLines();
  zoomOut(); // Apply the overview state on load
});
