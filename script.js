document.addEventListener('DOMContentLoaded', () => {
  const world = document.getElementById('world');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const allNodes = document.querySelectorAll('.node, .sub-node');
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  let activeNode = null;
  const originalState = {
    x: 0,
    y: 0,
    scale: 1
  };

  // 1. Set initial positions for all nodes
  allNodes.forEach(node => {
    node.style.setProperty('--x', `${node.dataset.x}px`);
    node.style.setProperty('--y', `${node.dataset.y}px`);
  });

  // 2. Main Zoom Function
  function zoomToNode(node) {
    if (activeNode) {
      activeNode.classList.remove('active');
    }
    
    activeNode = node;
    activeNode.classList.add('active');
    document.body.classList.add('zoomed-in');

    let scale = parseFloat(node.dataset.scale) || 1;
    // Validate scale to prevent unexpected behavior
    if (scale <= 0 || scale > 10) {
      scale = 1;
    }
    
    // Calculate translation to center the node
    // We get the node's bounding box *in the un-scaled world*
    const nodeRect = node.getBoundingClientRect();
    const worldRect = world.getBoundingClientRect();

    // Calculate center of node relative to world's origin
    const nodeCenterX = (nodeRect.left - worldRect.left) + (nodeRect.width / 2);
    const nodeCenterY = (nodeRect.top - worldRect.top) + (nodeRect.height / 2);

    // Calculate translation needed
    // We want the node's center to be at the viewport's center
    const translateX = (viewport.width / 2) - (nodeCenterX * scale);
    const translateY = (viewport.height / 2) - (nodeCenterY * scale);

    // Apply the transform
    world.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // 3. Zoom Out Function
  function zoomOut() {
    if (activeNode) {
      activeNode.classList.remove('active');
      activeNode = null;
    }
    document.body.classList.remove('zoomed-in');
    
    // Reset transform
    world.style.transform = `translate(${originalState.x}px, ${originalState.y}px) scale(${originalState.scale})`;
  }

  // 4. Event Listeners
  
  // Click on a node title to zoom
  world.addEventListener('click', (e) => {
    // Find the clicked node (either title or the node itself)
    const clickedNode = e.target.closest('.node, .sub-node');
    
    if (clickedNode && !clickedNode.classList.contains('active')) {
      // Don't re-zoom if already active
      e.stopPropagation();
      zoomToNode(clickedNode);
    }
  });

  // Click on "Zoom Out" button
  zoomOutBtn.addEventListener('click', zoomOut);
});
