#!/usr/bin/env node

/**
 * Update script.js with scraped content
 * 
 * Usage:
 *   node update-script-js.js [path-to-ankap-content.json]
 * 
 * This script reads the scraped content from ankap-content.json
 * and updates the contentData object in script.js
 */

const fs = require('fs');
const path = require('path');

// Default paths
const CONTENT_JSON_PATH = process.argv[2] || path.join(__dirname, 'ankap-content.json');
const SCRIPT_JS_PATH = path.join(__dirname, 'script.js');
const BACKUP_PATH = path.join(__dirname, 'script.js.backup');

function escapeForJS(str) {
  // Escape backticks, backslashes, and dollar signs for template literals
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

function updateScriptJS() {
  console.log('\n' + '='.repeat(80));
  console.log('Updating script.js with scraped content');
  console.log('='.repeat(80) + '\n');
  
  // 1. Check if content JSON exists
  if (!fs.existsSync(CONTENT_JSON_PATH)) {
    console.error(`❌ Error: Content file not found: ${CONTENT_JSON_PATH}`);
    console.error('\nPlease run "node fetch-ankap-content.js" first to scrape the content.');
    process.exit(1);
  }
  
  // 2. Read the scraped content
  console.log(`📖 Reading content from: ${CONTENT_JSON_PATH}`);
  const scrapedContent = JSON.parse(fs.readFileSync(CONTENT_JSON_PATH, 'utf8'));
  const nodeCount = Object.keys(scrapedContent).length;
  console.log(`   Found ${nodeCount} nodes with content\n`);
  
  // 3. Read current script.js
  console.log(`📖 Reading current script.js: ${SCRIPT_JS_PATH}`);
  let scriptContent = fs.readFileSync(SCRIPT_JS_PATH, 'utf8');
  
  // 4. Create backup
  console.log(`💾 Creating backup: ${BACKUP_PATH}`);
  fs.writeFileSync(BACKUP_PATH, scriptContent, 'utf8');
  
  // 5. Extract existing contentData to preserve unmodified nodes
  console.log(`🔄 Parsing existing contentData...\n`);
  
  const contentDataStart = scriptContent.indexOf('const contentData = {');
  const contentDataEnd = scriptContent.indexOf('};', contentDataStart) + 2;
  
  if (contentDataStart === -1 || contentDataEnd === -1) {
    console.error('❌ Error: Could not find contentData object in script.js');
    process.exit(1);
  }
  
  // Extract existing contentData using custom parsing
  const contentDataCode = scriptContent.substring(contentDataStart, contentDataEnd);
  const existingContentData = {};
  
  try {
    // Parse each line that looks like a key-value pair
    const lines = contentDataCode.split('\n');
    let currentKey = null;
    let currentValue = '';
    let inValue = false;
    
    for (const line of lines) {
      // Skip comments and empty lines
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed === 'const contentData = {' || trimmed === '};') {
        continue;
      }
      
      // Check if this line starts a new key-value pair
      const keyMatch = trimmed.match(/^['"]([^'"]+)['"]\s*:\s*(.+)$/);
      if (keyMatch) {
        // Save previous key-value if exists
        if (currentKey && currentValue) {
          existingContentData[currentKey] = currentValue.replace(/,\s*$/, '').trim();
        }
        
        currentKey = keyMatch[1];
        let valueStart = keyMatch[2].trim();
        
        // Check if value is complete on this line
        if ((valueStart.startsWith("'") && valueStart.endsWith("',")) ||
            (valueStart.startsWith('"') && valueStart.endsWith('",')) ||
            (valueStart.startsWith('`') && valueStart.endsWith('`,')) ||
            (valueStart.startsWith('<') && valueStart.endsWith(">',")) ||
            (valueStart.startsWith('<') && valueStart.endsWith('>'))) {
          // Single-line value
          currentValue = valueStart.replace(/^['"`]/, '').replace(/['"`],?\s*$/, '');
          existingContentData[currentKey] = currentValue;
          currentKey = null;
          currentValue = '';
        } else {
          // Multi-line value
          currentValue = valueStart;
          inValue = true;
        }
      } else if (inValue) {
        // Continue multi-line value
        currentValue += '\n' + trimmed;
        if (trimmed.endsWith("',") || trimmed.endsWith('",') || trimmed.endsWith('`,')) {
          existingContentData[currentKey] = currentValue.replace(/^['"`]/, '').replace(/['"`],?\s*$/, '');
          currentKey = null;
          currentValue = '';
          inValue = false;
        }
      }
    }
    
    // Save last key-value if exists
    if (currentKey && currentValue) {
      existingContentData[currentKey] = currentValue.replace(/^['"`]/, '').replace(/['"`],?\s*$/, '');
    }
  } catch (error) {
    console.error('❌ Error parsing existing contentData:', error.message);
    console.error('Falling back to empty contentData...');
  }
  
  console.log(`   Found ${Object.keys(existingContentData).length} existing nodes\n`);
  
  // 6. Merge scraped content with existing content
  console.log(`🔄 Merging new content with existing nodes...\n`);
  
  const mergedContent = { ...existingContentData, ...scrapedContent };
  
  // Build new contentData object
  let newContentData = '  const contentData = {\n';
  
  let updatedCount = 0;
  let preservedCount = 0;
  
  for (const [nodeId, content] of Object.entries(mergedContent)) {
    const escapedContent = escapeForJS(content);
    newContentData += `    '${nodeId}': \`${escapedContent}\`,\n`;
    
    if (scrapedContent[nodeId]) {
      updatedCount++;
      console.log(`   ✅ Updated: ${nodeId}`);
    } else {
      preservedCount++;
    }
  }
  
  newContentData += '  };\n';
  
  // Replace old contentData with new one
  const before = scriptContent.substring(0, contentDataStart);
  const after = scriptContent.substring(contentDataEnd);
  const updatedScript = before + newContentData + after;
  
  // 6. Write updated script.js
  console.log(`\n💾 Writing updated script.js...`);
  fs.writeFileSync(SCRIPT_JS_PATH, updatedScript, 'utf8');
  
  // 7. Summary
  console.log('\n' + '='.repeat(80));
  console.log('✅ Update Complete!');
  console.log('='.repeat(80));
  console.log(`📊 Statistics:`);
  console.log(`   - Total nodes: ${Object.keys(mergedContent).length}`);
  console.log(`   - Updated nodes: ${updatedCount}`);
  console.log(`   - Preserved nodes: ${preservedCount}`);
  console.log(`   - Backup saved to: ${BACKUP_PATH}`);
  console.log(`   - Updated file: ${SCRIPT_JS_PATH}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Test the application: open index.html in a browser');
  console.log('   2. Verify content displays correctly in modals');
  console.log('   3. Commit changes: git add script.js && git commit -m "Populate contentData with scraped content"');
  console.log('='.repeat(80) + '\n');
}

// Run if executed directly
if (require.main === module) {
  try {
    updateScriptJS();
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { updateScriptJS };
