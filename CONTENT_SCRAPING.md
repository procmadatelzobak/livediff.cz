# Content Scraping Guide

This directory contains scripts to populate the `contentData` object in `script.js` with actual content from https://ankap.urza.cz/.

## Problem

The `contentData` object in `script.js` currently contains only placeholder content like "(Obsah bude doplněn)". This needs to be replaced with actual HTML content scraped from the source website.

## Solution

We provide two scripts that work together:

1. **`fetch-ankap-content.js`** - Scrapes all 47 chapters from ankap.urza.cz
2. **`update-script-js.js`** - Updates script.js with the scraped content

## Prerequisites

```bash
npm install axios cheerio
```

## Usage

### Step 1: Scrape Content

Run this command to scrape all content from ankap.urza.cz:

```bash
node fetch-ankap-content.js
```

This will:
- Fetch content from all 47 chapter URLs
- Save the results to `ankap-content.json`
- Display progress and success/failure statistics

**Note:** This script must be run from a machine that can access ankap.urza.cz. The GitHub Actions environment has network restrictions that block this domain.

### Step 2: Update script.js

Once you have `ankap-content.json`, update script.js:

```bash
node update-script-js.js
```

This will:
- Read the scraped content from `ankap-content.json`
- Create a backup of script.js (`script.js.backup`)
- Replace the `contentData` object with populated content
- Display update statistics

### Step 3: Test

Open `index.html` in a web browser and verify:
- Click on main nodes to expand sub-nodes
- Click on sub-nodes to view content in modals
- Verify all content displays correctly

### Step 4: Commit

```bash
git add script.js
git commit -m "feat: Populate contentData with complete chapter content from ankap.urza.cz"
git push
```

## Chapter Mapping

The scraper handles all 47 sub-nodes across 4 main categories:

### Anarchokapitalismus (29 chapters)
- uvod, ceny, planovani, kalkulace, kalkulace-jednotlivec, nap, nezodpovednost, penize, hasici, kultura, skolstvi, skolstvi-svoboda, propaganda, social, zdravi, prostranstvi, silnice, zivotni, soudy, soudy-nap, vymahani, trest, armada, myty, zaver, drogy, zbrane, veda, prace

### AMEN (6 chapters)
- etika, prava, nasili, agrese, jednani, nezodpovednost2

### Ekonomie (6 chapters)
- monopoly, kartely, dumping, spekulanti, statky, nekvalitni

### Polemika (6 chapters)
- praxe, vlastnosti, tradice, inzenyrstvi, chyby, byrokracie

## Troubleshooting

### "Error: Content file not found"
Run `fetch-ankap-content.js` first to create the content file.

### "Could not find content for [node-id]"
The scraper may need different CSS selectors for that page. Check the HTML structure of the page and adjust the selectors in `fetch-ankap-content.js`.

### "Error fetching [node-id]: ENOTFOUND"
The website may be down or blocked. Try:
1. Using a VPN
2. Accessing from a different network
3. Using Google Cache or Wayback Machine

### Some chapters have short/missing content
Manually review those chapters and adjust the content in `ankap-content.json` before running the update script.

## Manual Alternative

If the scraper doesn't work, you can manually create `ankap-content.json`:

```json
{
  "sub-node-uvod": "<h2>Úvod</h2><p>Full HTML content here...</p>",
  "sub-node-ceny": "<h2>Vzácné zdroje...</h2><p>Content...</p>",
  ...
}
```

Then run `node update-script-js.js` to update script.js.

## File Structure

```
livediff.cz/
├── fetch-ankap-content.js    # Scraper script
├── update-script-js.js        # Update script  
├── ankap-content.json         # Scraped content (generated)
├── script.js                  # Main JS file (to be updated)
├── script.js.backup           # Backup (generated)
└── CONTENT_SCRAPING.md        # This file
```

## Support

For issues or questions:
1. Check the console output for specific error messages
2. Verify ankap.urza.cz is accessible from your machine
3. Review the backup file if something goes wrong
