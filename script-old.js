document.addEventListener('DOMContentLoaded', () => {
  const world = document.getElementById('world');
  const svgLines = document.getElementById('connection-lines');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const allNodes = document.querySelectorAll('.node, .sub-node');
  const mainNodes = document.querySelectorAll('.node');
  const subNodes = document.querySelectorAll('.sub-node');
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  let activeNode = null; // The node currently being viewed (zoomed & showing content)
  let zoomedNode = null; // The parent node that is zoomed (showing sub-nodes)
  let overviewState = { x: 0, y: 0, scale: 1 };
  
  // Connections between main nodes
  const mainConnections = [
    ['node-ankap', 'node-amen'],
    ['node-ankap', 'node-ekonomie'],
    ['node-ankap', 'node-polemika']
  ];

  // 1. Set initial positions and calculate absolute coordinates
  allNodes.forEach(node => {
    const isSubNode = node.classList.contains('sub-node');
    const parentNode = isSubNode ? node.closest('.node') : null;
    
    let x = parseFloat(node.dataset.x);
    let y = parseFloat(node.dataset.y);

    if (isSubNode && parentNode) {
      const parentX = parseFloat(parentNode.dataset.x);
      const parentY = parseFloat(parentNode.dataset.y);
      x += parentX;
      y += parentY;
    }
    
    node.dataset.absX = x;
    node.dataset.absY = y;
    
    node.style.setProperty('--x', `${x}px`);
    node.style.setProperty('--y', `${y}px`);
  });

  // 2. Main Zoom Function (NEW LOGIC)
  function zoomToNode(node) {
    // Clear previous states
    if (activeNode) activeNode.classList.remove('active');
    if (zoomedNode) zoomedNode.classList.remove('zoomed');
    
    document.body.classList.add('zoomed-in');

    // Check node type
    if (node.classList.contains('sub-node')) {
      // --- ZOOM TO SUB-NODE (Show content) ---
      activeNode = node;
      zoomedNode = node.closest('.node'); // Keep parent as 'zoomed'
      activeNode.classList.add('active');
      if (zoomedNode) zoomedNode.classList.add('zoomed');
      
    } else if (node.classList.contains('node')) {
      // --- ZOOM TO MAIN NODE (Show sub-nodes) ---
      activeNode = null; // We are not showing content, just sub-nodes
      zoomedNode = node;
      zoomedNode.classList.add('zoomed');
    }
    
    const nodeToCenter = activeNode || zoomedNode;
    if (!nodeToCenter) return;

    // Calculate scale
    const nodeWidth = nodeToCenter.offsetWidth;
    const nodeHeight = nodeToCenter.offsetHeight;
    const scaleX = (viewport.width * 0.9) / nodeWidth;
    const scaleY = (viewport.height * 0.9) / nodeHeight;
    let scale = Math.min(scaleX, scaleY);
    
    // If we are zooming to a parent node, don't zoom in *too* much
    if (!activeNode && zoomedNode) {
        scale = Math.min(scale, 1.5); // Limit zoom on parent nodes
    }

    // Use absolute coordinates for centering
    const translateX = -parseFloat(nodeToCenter.dataset.absX) * scale;
    const translateY = -parseFloat(nodeToCenter.dataset.absY) * scale;

    const transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    world.style.transform = transform;
    
    // Update lines
    drawConnectionLines();
  }

  // 3. Zoom Out Function (NEW LOGIC)
  function zoomOut() {
    if (activeNode) {
      // We are in a sub-node, go back to parent node view
      const parent = activeNode.closest('.node');
      activeNode.classList.remove('active');
      activeNode = null;
      if(parent) {
        zoomToNode(parent);
      } else {
        // Failsafe: go to overview
        zoomToOverview();
      }
    } else if (zoomedNode) {
      // We are in a parent node view, go back to overview
      zoomedNode.classList.remove('zoomed');
      zoomedNode = null;
      zoomToOverview();
    }
  }
  
  function zoomToOverview() {
      activeNode = null;
      zoomedNode = null;
      document.body.classList.remove('zoomed-in');
      const transform = `translate(${overviewState.x}px, ${overviewState.y}px) scale(${overviewState.scale})`;
      world.style.transform = transform;
      drawConnectionLines();
  }
  
  // 4. Calculate Overview
  function calculateOverview() {
    if (mainNodes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    mainNodes.forEach(node => {
      const x = parseFloat(node.dataset.absX);
      const y = parseFloat(node.dataset.absY);
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

  // 5. Draw Connection Lines
  function drawConnectionLines() {
    const worldRect = world.getBoundingClientRect();
    const svgNS = "[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)";
    svgLines.innerHTML = ''; // Clear old lines
    
    let connections = mainConnections;
    
    // If a parent node is zoomed, draw lines to its children
    if (zoomedNode && !activeNode) {
        connections = [];
        const children = zoomedNode.querySelectorAll('.sub-node');
        children.forEach(child => {
            connections.push([zoomedNode.id, child.id]);
        });
    }

    connections.forEach(pair => {
      const startNode = document.getElementById(pair[0]);
      const endNode = document.getElementById(pair[1]);
      if (startNode && endNode) {
        const line = document.createElementNS(svgNS, 'line');
        const x1 = (worldRect.width / 2) + parseFloat(startNode.dataset.absX);
        const y1 = (worldRect.height / 2) + parseFloat(startNode.dataset.absY);
        const x2 = (worldRect.width / 2) + parseFloat(endNode.dataset.absX);
        const y2 = (worldRect.height / 2) + parseFloat(endNode.dataset.absY);
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        if (zoomedNode && (startNode.id === zoomedNode.id || endNode.id === zoomedNode.id)) {
            line.classList.add('active');
        }
        svgLines.appendChild(line);
      }
    });
    
    svgLines.style.transform = world.style.transform;
  }

  // 6. Event Listeners
  world.addEventListener('click', (e) => {
    const clickedNode = e.target.closest('.node, .sub-node');
    if (!clickedNode) return;
    
    if (clickedNode.classList.contains('active')) {
      // Node is already active, do nothing
      return;
    }
    
    e.stopPropagation();
    zoomToNode(clickedNode);
  });

  zoomOutBtn.addEventListener('click', zoomOut);
  
  // 7. INITIALIZATION
  function initializeMap() {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    svgLines.setAttribute('viewBox', `0 0 ${viewport.width} ${viewport.height}`);
    calculateOverview();
    if (activeNode) {
      zoomToNode(activeNode);
    } else if (zoomedNode) {
      zoomToNode(zoomedNode);
    } else {
      zoomToOverview();
    }
  }

  setTimeout(() => {
    initializeMap();
    window.addEventListener('resize', initializeMap);
  }, 100);
});
