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

  // Constants
  const DEFAULT_NODE_WIDTH = 200;
  const DEFAULT_NODE_HEIGHT = 100;
  const OVERVIEW_PADDING_FACTOR = 1.2;
  const INIT_DELAY_MS = 100; // Delay for node rendering before measurement

  let activeNode = null;
  let overviewState = { x: 0, y: 0, scale: 1 };
  
  // NEW connections for AnKap map
  const nodeConnections = [
    ['node-uvod', 'node-principy'],
    ['node-uvod', 'node-stat'],
    ['node-uvod', 'node-trh'],
    ['node-trh', 'node-pravo'],
    ['node-trh', 'node-myty'],
    ['node-principy', 'node-pravo']
  ];

  // 1. Set initial positions
  allNodes.forEach(node => {
    // *** FIX for nested nodes ***
    // Sub-nodes are positioned *relative* to their parent node
    const isSubNode = node.classList.contains('sub-node');
    const parentNode = isSubNode ? node.closest('.node') : null;
    
    let x = parseFloat(node.dataset.x);
    let y = parseFloat(node.dataset.y);

    if (isSubNode && parentNode) {
      // Add parent's coordinates to get absolute world position
      const parentX = parseFloat(parentNode.dataset.x);
      const parentY = parseFloat(parentNode.dataset.y);
      x += parentX;
      y += parentY;
      
      // Store the *absolute* position back in the dataset
      // This simplifies the zoomToNode function
      node.dataset.absX = x;
      node.dataset.absY = y;
    } else {
      node.dataset.absX = x;
      node.dataset.absY = y;
    }
    
    // Set CSS variables for positioning
    node.style.setProperty('--x', `${x}px`);
    node.style.setProperty('--y', `${y}px`);
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

    // *** FIX: Centering logic now uses the pre-calculated absolute coordinates ***
    const translateX = -parseFloat(node.dataset.absX) * scale;
    const translateY = -parseFloat(node.dataset.absY) * scale;

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
      // Use the absolute coordinates for calculation
      const x = parseFloat(node.dataset.absX);
      const y = parseFloat(node.dataset.absY);
      const width = node.offsetWidth || DEFAULT_NODE_WIDTH;
      const height = node.offsetHeight || DEFAULT_NODE_HEIGHT;

      minX = Math.min(minX, x - width / 2);
      maxX = Math.max(maxX, x + width / 2);
      minY = Math.min(minY, y - height / 2);
      maxY = Math.max(maxY, y + height / 2);
    });

    const mapWidth = maxX - minX;
    const mapHeight = maxY - minY;

    // Guard against division by zero if all nodes are at the same position
    const scaleX = mapWidth > 0 ? viewport.width / (mapWidth * OVERVIEW_PADDING_FACTOR) : 1;
    const scaleY = mapHeight > 0 ? viewport.height / (mapHeight * OVERVIEW_PADDING_FACTOR) : 1;
    const scale = Math.min(scaleX, scaleY, 1);

    const mapCenterX = (minX + maxX) / 2;
    const mapCenterY = (minY + maxY) / 2;

    const translateX = -mapCenterX * scale;
    const translateY = -mapCenterY * scale;

    overviewState = { x: translateX, y: translateY, scale: scale };
  }

  // 5. Draw Connection Lines (FIXED)
  function drawConnectionLines() {
    const worldRect = world.getBoundingClientRect();
    const svgNS = "http://www.w3.org/2000/svg";
    
    svgLines.setAttribute('viewBox', `0 0 ${worldRect.width} ${worldRect.height}`);
    
    nodeConnections.forEach(pair => {
      const startNode = document.getElementById(pair[0]);
      const endNode = document.getElementById(pair[1]);

      if (startNode && endNode) {
        const line = document.createElementNS(svgNS, 'line');
        // Use absolute coordinates
        const x1 = (worldRect.width / 2) + parseFloat(startNode.dataset.absX);
        const y1 = (worldRect.height / 2) + parseFloat(startNode.dataset.absY);
        const x2 = (worldRect.width / 2) + parseFloat(endNode.dataset.absX);
        const y2 = (worldRect.height / 2) + parseFloat(endNode.dataset.absY);
        
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
  // Use a small delay to ensure nodes have rendered for measurement
  setTimeout(() => {
    calculateOverview();
    drawConnectionLines();
    zoomOut(); // Apply the overview state on load
  }, INIT_DELAY_MS);
});
