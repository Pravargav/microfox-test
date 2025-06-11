#!/usr/bin/env node

/**
 * PR Body Parser Script with SDK Generation
 * This script extracts PR body and generates SDK files using Gemini AI
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hardcoded Gemini API key
const GEMINI_API_KEY = 'AIzaSyDv2cri_hE0DCXfxv9YLeiY2r2o06y5tko'; // Replace with your actual API key

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
        
        // Generate SDK based on PR body
        generateSDK(prBody, prNumber, prTitle);
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

async function generateSDK(prBody, prNumber, prTitle) {
    console.log('🤖 Generating SDK using Gemini AI...');
    
    try {
        // Create sdks directory if it doesn't exist
        const sdksDir = path.join(process.cwd(), 'sdks');
        if (!fs.existsSync(sdksDir)) {
            fs.mkdirSync(sdksDir, { recursive: true });
            console.log(`📁 Created sdks directory: ${sdksDir}`);
        }
        
        // Extract app name from PR body or title
        const appName = extractAppName(prBody, prTitle);
        
        // Create prompt for Gemini AI
        const prompt = createGeminiPrompt(prBody, appName);
        
        // Call Gemini AI API
        const sdkCode = await callGeminiAPI(prompt);
        
        if (sdkCode) {
            // Generate filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${appName}-sdk-${timestamp}.js`;
            const filepath = path.join(sdksDir, filename);
            
            // Write SDK file
            fs.writeFileSync(filepath, sdkCode, 'utf8');
            console.log(`📦 SDK file created: ${filepath}`);
            console.log(`📊 File size: ${fs.statSync(filepath).size} bytes`);
        }
        
    } catch (error) {
        console.error(`❌ Error generating SDK: ${error.message}`);
    }
}

function extractAppName(prBody, prTitle) {
    // Try to extract app name from PR body or title
    const appNameMatch = prBody.match(/app[:\s]+([a-zA-Z0-9-_]+)/i) || 
                         prTitle.match(/([a-zA-Z0-9-_]+)/i);
    
    if (appNameMatch) {
        return appNameMatch[1].toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    
    return 'default-app';
}

function createGeminiPrompt(prBody, appName) {
    return `
You are a JavaScript SDK generator. Based on the following pull request description, generate a simple JavaScript SDK.

Pull Request Body:
${prBody}

App Name: ${appName}

Please generate a JavaScript SDK that includes:
1. A main class for the ${appName} SDK
2. Basic methods based on the functionality described in the PR
3. Error handling
4. JSDoc comments
5. Export the SDK class as default

The SDK should be simple, clean, and follow JavaScript best practices. Focus only on the core functionality mentioned in the PR description.

Generate only the JavaScript code, no explanations or markdown formatting.
`;
}

async function callGeminiAPI(prompt) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let generatedCode = data.candidates[0].content.parts[0].text;
            
            // Clean up the generated code (remove markdown formatting if present)
            generatedCode = generatedCode.replace(/```javascript\n?/g, '').replace(/```\n?/g, '');
            
            return generatedCode;
        } else {
            throw new Error('No content generated by Gemini AI');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        // Fallback: Generate a basic SDK template
        return generateFallbackSDK(extractAppName(process.env.PR_BODY || '', process.env.PR_TITLE || ''));
    }
}

function generateFallbackSDK(appName) {
    const className = appName.charAt(0).toUpperCase() + appName.slice(1) + 'SDK';
    
    return `/**
 * ${className} - Auto-generated SDK
 * Generated on: ${new Date().toISOString()}
 */

class ${className} {
    /**
     * Initialize the ${appName} SDK
     * @param {Object} config - Configuration object
     * @param {string} config.apiKey - API key for authentication
     * @param {string} config.baseUrl - Base URL for API calls
     */
    constructor(config = {}) {
        this.apiKey = config.apiKey || '';
        this.baseUrl = config.baseUrl || 'https://api.${appName}.com';
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${this.apiKey}\`
        };
    }

    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint) {
        try {
            const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    /**
     * Get SDK version
     * @returns {string} SDK version
     */
    getVersion() {
        return '1.0.0';
    }
}

export default ${className};
`;
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

// Run the main function - ES module way to detect if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main, formatPRBody, extractChecklist, extractIssueReferences, generateSDK };
