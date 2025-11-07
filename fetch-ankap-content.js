#!/usr/bin/env node

/**
 * Web Scraper for ankap.urza.cz content
 * 
 * This script scrapes all chapter content from ankap.urza.cz
 * and generates a JSON file that can be used to update script.js
 * 
 * Usage:
 *   npm install axios cheerio
 *   node fetch-ankap-content.js
 * 
 * This will create: ankap-content.json
 * Then run: node update-script-js.js
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// URL mapping for all sub-nodes
const URL_MAPPING = {
  // Anarchokapitalismus (29 chapters)
  'sub-node-uvod': 'uvod',
  'sub-node-ceny': 'vzacne-zdroje-a-system-cen',
  'sub-node-planovani': 'proc-selhava-centralni-planovani',
  'sub-node-kalkulace': 'nemoznost-ekonomicke-kalkulace',
  'sub-node-kalkulace-jednotlivec': 'problem-kalkulace-ocima-jednotlivce',
  'sub-node-nap': 'princip-neagrese',
  'sub-node-nezodpovednost': 'podpora-nezodpovednosti',
  'sub-node-penize': 'penize',
  'sub-node-hasici': 'hasici',
  'sub-node-kultura': 'umeni-a-kultura',
  'sub-node-skolstvi': 'skolstvi',
  'sub-node-skolstvi-svoboda': 'skolstvi-a-svoboda',
  'sub-node-propaganda': 'vzdelavani-a-propaganda',
  'sub-node-social': 'socialni-system',
  'sub-node-zdravi': 'zdravotnictvi',
  'sub-node-prostranstvi': 'verejna-prostranstvi-a-svoboda-slova',
  'sub-node-silnice': 'silnice-a-dopravni-pravidla',
  'sub-node-zivotni': 'zivotni-prostredi',
  'sub-node-soudy': 'soudnictvi',
  'sub-node-soudy-nap': 'svobodne-soudnictvi-a-princip-neagrese',
  'sub-node-vymahani': 'vymahani-prava',
  'sub-node-trest': 'zlocin-a-trest',
  'sub-node-armada': 'armada',
  'sub-node-myty': 'boreni-mytu',
  'sub-node-zaver': 'zaver',
  'sub-node-drogy': 'drogy',
  'sub-node-zbrane': 'zbrane',
  'sub-node-veda': 'veda',
  'sub-node-prace': 'prace',
  // AMEN (6 chapters)
  'sub-node-etika': 'etika',
  'sub-node-prava': 'lidska-prava',
  'sub-node-nasili': 'anarchie-je-nasilna',
  'sub-node-agrese': 'agrese',
  'sub-node-jednani': 'lidske-jednani',
  'sub-node-nezodpovednost2': 'nezodpovednost',
  // Ekonomie (6 chapters)
  'sub-node-monopoly': 'monopoly',
  'sub-node-kartely': 'kartely',
  'sub-node-dumping': 'dumpingove-ceny',
  'sub-node-spekulanti': 'spekulanti',
  'sub-node-statky': 'verejne-statky',
  'sub-node-nekvalitni': 'nekvalitni-soukrome-instituce',
  // Polemika (6 chapters)
  'sub-node-praxe': 'teorie-a-praxe',
  'sub-node-vlastnosti': 'vlastnosti-lidi',
  'sub-node-tradice': 'tradice-statu',
  'sub-node-inzenyrstvi': 'socialni-inzenyrstvi',
  'sub-node-chyby': 'chyby-anarchokapitalismu',
  'sub-node-byrokracie': 'byrokracie-v-anarchokapitalismu'
};

async function fetchContent(nodeId, urlSlug) {
  const url = `https://ankap.urza.cz/${urlSlug}/`;
  
  try {
    console.log(`Fetching ${nodeId}... (${url})`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Try different selectors to find the main content
    let article = $('.entry-content').first();
    if (article.length === 0) article = $('article .content').first();
    if (article.length === 0) article = $('.post-content').first();
    if (article.length === 0) article = $('main article').first();
    if (article.length === 0) article = $('.content').first();
    
    if (article.length === 0) {
      console.log(`  ⚠️  Could not find content for ${nodeId}`);
      return null;
    }
    
    // Clean up unwanted elements
    article.find('script, style, nav, .navigation, .comments, .sidebar, .related-posts, .share-buttons').remove();
    
    // Get HTML content
    let html = article.html();
    
    if (!html || html.trim().length < 50) {
      console.log(`  ⚠️  Content too short for ${nodeId}`);
      return null;
    }
    
    // Clean and normalize the HTML
    html = html
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><');
    
    console.log(`  ✅ Successfully fetched ${nodeId} (${html.length} chars)`);
    return html;
    
  } catch (error) {
    console.log(`  ❌ Error fetching ${nodeId}: ${error.message}`);
    return null;
  }
}

async function scrapeAllContent() {
  const results = {};
  let successCount = 0;
  let failCount = 0;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('Starting content scraping from ankap.urza.cz');
  console.log(`Total chapters to scrape: ${Object.keys(URL_MAPPING).length}`);
  console.log(`${'='.repeat(80)}\n`);
  
  for (const [nodeId, urlSlug] of Object.entries(URL_MAPPING)) {
    const content = await fetchContent(nodeId, urlSlug);
    
    if (content) {
      results[nodeId] = content;
      successCount++;
    } else {
      failCount++;
    }
    
    // Be polite - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save results
  const outputPath = path.join(__dirname, 'ankap-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  
  console.log(`\n${'='.repeat(80)}`);
  console.log('Scraping Complete!');
  console.log(`${'='.repeat(80)}`);
  console.log(`✅ Successfully scraped: ${successCount} chapters`);
  console.log(`❌ Failed to scrape: ${failCount} chapters`);
  console.log(`📄 Output saved to: ${outputPath}`);
  console.log(`\nNext step: Run 'node update-script-js.js' to update script.js`);
  console.log(`${'='.repeat(80)}\n`);
  
  return results;
}

// Run if executed directly
if (require.main === module) {
  scrapeAllContent()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { scrapeAllContent, URL_MAPPING };
