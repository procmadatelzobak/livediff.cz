# livediff.cz - Mapa Anarchokapitalismu

Interactive mind map visualization of anarcho-capitalist philosophy using vis.js network library.

## Features

- **Interactive Graph Visualization**: Professional network visualization using vis-network library
- **Hierarchical Structure**: 4 main topic nodes with 54 sub-topic nodes
- **Smooth Animations**: Physics-based layout with animated transitions
- **Content Modal**: Click on any sub-node to view detailed content
- **Zoom & Focus**: Click main nodes to expand and view sub-topics
- **Responsive Design**: Adapts to different screen sizes

## Main Topics

1. **Anarchokapitalismus** - Core texts explaining principles and functioning of stateless society (32 sub-topics)
2. **AMEN** - Anarcho-capitalist monthly magazine with extended essays (6 sub-topics)
3. **Ekonomie** - Economic arguments, myths and principles (6 sub-topics)
4. **Polemika** - Answers to frequent objections and criticisms (6 sub-topics)

## Technology Stack

- **vis-network**: Graph visualization library
- **Pure JavaScript**: No framework dependencies
- **CSS Custom Properties**: Theme colors and styling
- **IBM Plex Mono**: Monospace font for technical aesthetic

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Open `index.html` in a web browser or serve with any HTTP server

## Content Updates

The content data is stored in the `contentData` object in `script.js`. To populate it with actual content from the source website:

### Automated Scraping (Recommended)

1. Run the scraping script from a machine with access to ankap.urza.cz:
   ```bash
   node fetch-ankap-content.js
   ```
   This creates `ankap-content.json` with all 47 chapters.

2. Update script.js with the scraped content:
   ```bash
   node update-script-js.js
   ```

3. Test the changes:
   ```bash
   open index.html  # or serve with any HTTP server
   ```

See [CONTENT_SCRAPING.md](CONTENT_SCRAPING.md) for detailed instructions and troubleshooting.

### Manual Update

If the automated scraper doesn't work:
1. Visit each chapter URL on https://ankap.urza.cz/
2. Copy the article HTML content
3. Create `ankap-content.json` with the structure:
   ```json
   {
     "sub-node-uvod": "<h2>Title</h2><p>Content...</p>",
     ...
   }
   ```
4. Run `node update-script-js.js` to update script.js

## Development

- `index.html` - Main HTML structure with hidden data elements
- `script.js` - vis.js initialization and interaction logic
- `style.css` - Styling with CSS custom properties
- `vis-network.min.js` - vis-network library (local copy)

## License

Content source: https://ankap.urza.cz/
