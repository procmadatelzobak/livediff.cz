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

  // 2. Main Zoom Function (NOW SMARTER)
  function zoomToNode(node) {
    if (activeNode) {
      activeNode.classList.remove('active');
    }
    
    activeNode = node;
    // CRITICAL: Add 'active' class BEFORE measuring
    // This makes the hidden content take up space
    activeNode.classList.add('active');
    document.body.classList.add('zoomed-in');

    // --- NEW LOGIC ---
    // Measure the node's dimensions *after* content is visible
    const nodeWidth = node.offsetWidth;
    const nodeHeight = node.offsetHeight;

    // Calculate the scale needed to fit the node to 90% of the viewport
    // Guard against division by zero
    const scaleX = nodeWidth > 0 ? (viewport.width * 0.9) / nodeWidth : 1;
    const scaleY = nodeHeight > 0 ? (viewport.height * 0.9) / nodeHeight : 1;
    
    // Use the *smaller* scale to ensure the whole node fits
    const scale = Math.min(scaleX, scaleY);
    // --- END NEW LOGIC ---

    // Calculate translation to center the node
    const nodeRect = node.getBoundingClientRect();
    const worldRect = world.getBoundingClientRect();
    
    const nodeCenterX = (nodeRect.left - worldRect.left) + (nodeRect.width / 2);
    const nodeCenterY = (nodeRect.top - worldRect.top) + (nodeRect.height / 2);

    const translateX = (viewport.width / 2) - (nodeCenterX * scale);
    const translateY = (viewport.height / 2) - (nodeCenterY * scale);

    // Apply the new, calculated transform
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
  world.addEventListener('click', (e) => {
    const clickedNode = e.target.closest('.node, .sub-node');
    
    if (clickedNode && !clickedNode.classList.contains('active')) {
      e.stopPropagation();
      zoomToNode(clickedNode);
    }
  });

  zoomOutBtn.addEventListener('click', zoomOut);
  
  // 5. --- FIX 1 ---
  // Automatically zoom to the intro node on page load
  const introNode = document.getElementById('node-intro');
  if (introNode) {
    // Use a small delay to ensure fonts/layout are ready
    setTimeout(() => {
      zoomToNode(introNode);
    }, 100);
  }
});
