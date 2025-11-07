// ============================================
// Mind Map Visualization using vis.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  const container = document.getElementById('mind-map-container');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const modal = document.getElementById('content-modal');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  
  // Main connections between nodes
  const mainConnections = [
    ['node-ankap', 'node-amen'],
    ['node-ankap', 'node-ekonomie'],
    ['node-ankap', 'node-polemika']
  ];

  // Content data for each node (placeholder content for now)
  const contentData = {
    'node-ankap': '<h2>Anarchokapitalismus</h2><p>Hlavní texty vysvětlující principy a fungování bezstátní společnosti.</p>',
    'node-amen': '<h2>AMEN</h2><p>Anarchokapitalistický měsíčník. Rozšiřující eseje a úvahy.</p>',
    'node-ekonomie': '<h2>Ekonomie</h2><p>Ekonomické argumenty, mýty a principy.</p>',
    'node-polemika': '<h2>Polemika</h2><p>Odpovědi na časté námitky a kritiky.</p>',
    // Sub-nodes for Anarchokapitalismus
    'sub-node-uvod': '<h2>Úvod</h2><p>Úvodní text k anarchokapitalismu.</p><p>(Kompletní obsah bude doplněn ze zdroje ankap.urza.cz)</p>',
    'sub-node-ceny': '<h2>Vzácné zdroje a systém cen</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-planovani': '<h2>Proč selhává centrální plánování</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-kalkulace': '<h2>Nemožnost ekonomické kalkulace</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-kalkulace-jednotlivec': '<h2>Problém kalkulace očima jednotlivce</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-nap': '<h2>Princip neagrese</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-nezodpovednost': '<h2>Podpora nezodpovědnosti</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-penize': '<h2>Peníze</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-hasici': '<h2>Hasiči</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-kultura': '<h2>Umění a kultura</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-skolstvi': '<h2>Školství</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-skolstvi-svoboda': '<h2>Školství a svoboda</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-propaganda': '<h2>Vzdělávání a propaganda</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-social': '<h2>Sociální systém</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-zdravi': '<h2>Zdravotnictví</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-prostranstvi': '<h2>Veřejná prostranství a svoboda slova</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-silnice': '<h2>Silnice a dopravní pravidla</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-zivotni': '<h2>Životní prostředí</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-soudy': '<h2>Soudnictví</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-soudy-nap': '<h2>Svobodné soudnictví a princip neagrese</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-vymahani': '<h2>Vymáhání práva</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-trest': '<h2>Zločin a trest</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-armada': '<h2>Armáda</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-myty': '<h2>Boření mýtů</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-zaver': '<h2>Závěr</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-drogy': '<h2>Drogy</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-zbrane': '<h2>Zbraně</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-veda': '<h2>Věda</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-prace': '<h2>Práce</h2><p>(Obsah bude doplněn)</p>',
    // Sub-nodes for AMEN
    'sub-node-etika': '<h2>Etika</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-prava': '<h2>Lidská práva</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-nasili': '<h2>Anarchie je násilná</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-agrese': '<h2>Agrese</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-jednani': '<h2>Lidské jednání</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-nezodpovednost2': '<h2>Nezodpovědnost</h2><p>(Obsah bude doplněn)</p>',
    // Sub-nodes for Ekonomie
    'sub-node-monopoly': '<h2>Monopoly</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-kartely': '<h2>Kartely</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-dumping': '<h2>Dumpingové ceny</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-spekulanti': '<h2>Spekulanti</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-statky': '<h2>Veřejné statky</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-nekvalitni': '<h2>Nekvalitní soukromé instituce</h2><p>(Obsah bude doplněn)</p>',
    // Sub-nodes for Polemika
    'sub-node-praxe': '<h2>Teorie a praxe</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-vlastnosti': '<h2>Vlastnosti lidí</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-tradice': '<h2>Tradice státu</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-inzenyrstvi': '<h2>Sociální inženýrství</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-chyby': '<h2>Chyby anarchokapitalismu</h2><p>(Obsah bude doplněn)</p>',
    'sub-node-byrokracie': '<h2>Byrokracie v anarchokapitalismu</h2><p>(Obsah bude doplněn)</p>'
  };

  // ============================================
  // Parse Data from HTML
  // ============================================
  function parseDataFromDOM() {
    const nodes = [];
    const edges = [];
    
    // Parse main nodes
    const mainNodeElements = document.querySelectorAll('#data-source .node');
    mainNodeElements.forEach(nodeEl => {
      const id = nodeEl.id;
      const title = nodeEl.querySelector('.node-title')?.textContent || '';
      
      // Add main node
      nodes.push({
        id: id,
        label: title,
        shape: 'circle',
        size: 30,
        font: { size: 16, color: '#4D9DE0', face: 'IBM Plex Mono' },
        color: {
          background: '#111522cc',
          border: '#4D9DE088',
          highlight: { background: '#111522ee', border: '#E15554' },
          hover: { background: '#111522ee', border: '#E15554' }
        },
        borderWidth: 2,
        group: 'main'
      });
      
      // Parse sub-nodes
      const subNodeElements = nodeEl.querySelectorAll('.sub-node');
      subNodeElements.forEach(subNodeEl => {
        const subId = subNodeEl.id;
        const subTitle = subNodeEl.querySelector('.sub-node-title')?.textContent || '';
        
        nodes.push({
          id: subId,
          label: subTitle,
          shape: 'box',
          size: 20,
          font: { size: 12, color: '#D0D0E0', face: 'IBM Plex Mono' },
          color: {
            background: '#111522cc',
            border: '#4D9DE088',
            highlight: { background: '#111522ee', border: '#E15554' },
            hover: { background: '#111522ee', border: '#E15554' }
          },
          borderWidth: 2,
          hidden: true, // Initially hidden
          group: 'sub',
          parent: id
        });
        
        // Add edge from parent to child
        edges.push({
          from: id,
          to: subId,
          color: { color: '#4D9DE033', highlight: '#4D9DE088', hover: '#4D9DE088' },
          width: 2,
          smooth: { type: 'curvedCW', roundness: 0.2 },
          hidden: true
        });
      });
    });
    
    // Add main connections
    mainConnections.forEach(conn => {
      edges.push({
        from: conn[0],
        to: conn[1],
        color: { color: '#4D9DE033', highlight: '#4D9DE0', hover: '#4D9DE0' },
        width: 2,
        dashes: [4, 2],
        smooth: { type: 'continuous' }
      });
    });
    
    return { nodes, edges };
  }

  // ============================================
  // Initialize vis-network
  // ============================================
  const { nodes: nodesArray, edges: edgesArray } = parseDataFromDOM();
  
  const nodesDataset = new vis.DataSet(nodesArray);
  const edgesDataset = new vis.DataSet(edgesArray);
  
  const data = {
    nodes: nodesDataset,
    edges: edgesDataset
  };
  
  const options = {
    layout: {
      hierarchical: false
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 200,
        updateInterval: 25
      },
      barnesHut: {
        gravitationalConstant: -8000,
        centralGravity: 0.3,
        springLength: 200,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 0.5
      }
    },
    interaction: {
      hover: true,
      zoomView: true,
      dragView: true,
      navigationButtons: false,
      keyboard: {
        enabled: false
      }
    },
    edges: {
      smooth: {
        enabled: true,
        type: 'continuous'
      }
    },
    nodes: {
      borderWidthSelected: 3
    }
  };
  
  const network = new vis.Network(container, data, options);
  
  // Expose network for debugging
  window.network = network;
  window.nodesDataset = nodesDataset;
  window.edgesDataset = edgesDataset;
  
  // Track the currently focused node
  let currentFocusedNode = null;
  let visibleSubNodes = new Set();
  
  // ============================================
  // Event Handlers
  // ============================================
  
  // Click event handler
  network.on('click', (params) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = nodesDataset.get(nodeId);
      
      if (node.group === 'main') {
        // Main node clicked - focus and show sub-nodes
        handleMainNodeClick(nodeId);
      } else if (node.group === 'sub') {
        // Sub-node clicked - show content modal
        handleSubNodeClick(nodeId);
      }
    }
  });
  
  function handleMainNodeClick(nodeId) {
    currentFocusedNode = nodeId;
    
    // Focus on the main node
    network.focus(nodeId, {
      scale: 1.2,
      animation: {
        duration: 800,
        easingFunction: 'easeInOutQuad'
      }
    });
    
    // Show sub-nodes for this main node
    const allNodes = nodesDataset.get();
    allNodes.forEach(node => {
      if (node.parent === nodeId) {
        nodesDataset.update({ id: node.id, hidden: false });
        visibleSubNodes.add(node.id);
        
        // Show edges to this sub-node
        const connectedEdges = edgesDataset.get({
          filter: edge => edge.from === nodeId && edge.to === node.id
        });
        connectedEdges.forEach(edge => {
          edgesDataset.update({ id: edge.id, hidden: false });
        });
      }
    });
    
    // Show zoom out button
    zoomOutBtn.style.opacity = '1';
    zoomOutBtn.style.visibility = 'visible';
  }
  
  function handleSubNodeClick(nodeId) {
    // Get content for this node
    const content = contentData[nodeId] || '<p>Obsah není dostupný</p>';
    
    // Show modal
    modalContent.innerHTML = content;
    modal.style.display = 'block';
  }
  
  // Modal close handler
  modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'modal-overlay') {
      modal.style.display = 'none';
    }
  });
  
  // Zoom out button handler
  zoomOutBtn.addEventListener('click', () => {
    if (currentFocusedNode) {
      // Hide all sub-nodes
      visibleSubNodes.forEach(subNodeId => {
        nodesDataset.update({ id: subNodeId, hidden: true });
        
        // Hide edges
        const connectedEdges = edgesDataset.get({
          filter: edge => edge.to === subNodeId
        });
        connectedEdges.forEach(edge => {
          edgesDataset.update({ id: edge.id, hidden: true });
        });
      });
      
      visibleSubNodes.clear();
      currentFocusedNode = null;
    }
    
    // Fit the view to show all main nodes
    network.fit({
      animation: {
        duration: 800,
        easingFunction: 'easeInOutQuad'
      }
    });
    
    // Hide zoom out button
    zoomOutBtn.style.opacity = '0';
    zoomOutBtn.style.visibility = 'hidden';
  });
  
  // ============================================
  // Initialization
  // ============================================
  
  // Wait for stabilization and then fit the view
  network.once('stabilizationIterationsDone', () => {
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
    });
  });
  
  // Stop physics after stabilization for better performance
  network.on('stabilizationIterationsDone', () => {
    network.setOptions({ physics: { enabled: false } });
  });
});
