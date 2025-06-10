#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * PR Body Parser Script
 * This script extracts and prints the pull request body and metadata
 */

const fs = require('fs');
const path = require('path');

function main() {
    console.log('🚀 PR Body Parser Script Started');
    console.log('================================');
    
    // Get PR information from environment variables
    const prBody = process.env.PR_BODY || 'No PR body provided';
    const prNumber = process.env.PR_NUMBER || 'Unknown';
    const prTitle = process.env.PR_TITLE || 'Unknown';
    const prAuthor = process.env.PR_AUTHOR || 'Unknown';
    
    // Print PR metadata
    console.log(`📝 Pull Request #${prNumber}`);
    console.log(`📌 Title: ${prTitle}`);
    console.log(`👤 Author: ${prAuthor}`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log('');
    
    // Print PR body
    console.log('📄 Pull Request Body:');
    console.log('=====================');
    
    if (prBody && prBody.trim() !== '' && prBody !== 'null') {
        // Parse and format the PR body
        const formattedBody = formatPRBody(prBody);
        console.log(formattedBody);
    } else {
        console.log('❌ No description provided in the pull request body.');
    }
    
    console.log('');
    console.log('=====================');
    
    // Optional: Save PR body to a file for other scripts to use
    const outputDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const prData = {
        number: prNumber,
        title: prTitle,
        author: prAuthor,
        body: prBody,
        timestamp: new Date().toISOString()
    };
    
    const outputFile = path.join(outputDir, 'pr-data.json');
    fs.writeFileSync(outputFile, JSON.stringify(prData, null, 2));
    console.log(`💾 PR data saved to: ${outputFile}`);
    
    // Extract checklist items if present
    extractChecklist(prBody);
    
    // Extract issue references
    extractIssueReferences(prBody);
    
    console.log('✅ PR Body Parser Script Completed');
}

function formatPRBody(body) {
    // Replace common markdown elements for better console display
    let formatted = body
        .replace(/###\s*/g, '🔸 ')
        .replace(/##\s*/g, '🔹 ')
        .replace(/#\s*/g, '🔶 ')
        .replace(/\*\*(.*?)\*\*/g, '🔥 $1')
        .replace(/\*(.*?)\*/g, '✨ $1')
        .replace(/`(.*?)`/g, '💻 $1')
        .replace(/```[\s\S]*?```/g, '[CODE BLOCK]')
        .replace(/\[(x|X)\]/g, '✅')
        .replace(/\[ \]/g, '☐');
    
    return formatted;
}

function extractChecklist(body) {
    const checklistItems = body.match(/- \[(x|X| )\] .+/g);
    
    if (checklistItems && checklistItems.length > 0) {
        console.log('📋 Checklist Items Found:');
        checklistItems.forEach((item, index) => {
            const isChecked = item.includes('[x]') || item.includes('[X]');
            const itemText = item.replace(/- \[(x|X| )\] /, '');
            console.log(`   ${index + 1}. ${isChecked ? '✅' : '☐'} ${itemText}`);
        });
        console.log('');
    }
}

function extractIssueReferences(body) {
    const issueRefs = body.match(/#\d+/g);
    const fixesRefs = body.match(/(?:fixes|closes|resolves)\s+#\d+/gi);
    
    if (issueRefs && issueRefs.length > 0) {
        console.log('🔗 Issue References Found:');
        const uniqueRefs = [...new Set(issueRefs)];
        uniqueRefs.forEach(ref => {
            console.log(`   ${ref}`);
        });
        console.log('');
    }
    
    if (fixesRefs && fixesRefs.length > 0) {
        console.log('🔧 Issues to be Fixed/Closed:');
        fixesRefs.forEach(ref => {
            console.log(`   ${ref}`);
        });
        console.log('');
    }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    console.error('❌ Script error:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the main function
if (require.main === module) {
    main();
}

module.exports = { main, formatPRBody, extractChecklist, extractIssueReferences };