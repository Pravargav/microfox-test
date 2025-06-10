// scripts/generate-sdk.js
import { post } from 'axios';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Get PR information from environment
const prBody = process.env.PR_BODY || '';
const prNumber = process.env.PR_NUMBER || 'unknown';
const prTitle = process.env.PR_TITLE || 'Unknown PR';
const prAuthor = process.env.PR_AUTHOR || 'unknown';

console.log('🚀 Starting SDK Generation Process');
console.log(`📋 PR #${prNumber}: ${prTitle}`);
console.log(`👤 Author: ${prAuthor}`);
console.log('=' .repeat(50));

// Function to parse PR body for app information
function parsePRBody(body) {
  const appInfo = {
    appName: null,
    apiKeys: {},
    description: '',
    features: []
  };

  try {
    // Extract app name
    const appMatch = body.match(/(?:APP|app):\s*([^\n\r]+)/i);
    if (appMatch) {
      appInfo.appName = appMatch[1].trim().toLowerCase();
    }

    // Extract API keys (looking for various patterns)
    const apiKeyPatterns = [
      /(?:API_KEY|api_key|apikey):\s*([^\n\r\s]+)/gi,
      /(?:CLIENT_ID|client_id):\s*([^\n\r\s]+)/gi,
      /(?:CLIENT_SECRET|client_secret):\s*([^\n\r\s]+)/gi,
      /(?:ACCESS_TOKEN|access_token):\s*([^\n\r\s]+)/gi,
      /(?:SECRET_KEY|secret_key):\s*([^\n\r\s]+)/gi,
      /(?:APP_ID|app_id):\s*([^\n\r\s]+)/gi,
      /(?:WEBHOOK_SECRET|webhook_secret):\s*([^\n\r\s]+)/gi,
      /([A-Z_]+_KEY|[A-Z_]+_ID|[A-Z_]+_SECRET|[A-Z_]+_TOKEN):\s*([^\n\r\s]+)/gi
    ];

    apiKeyPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(body)) !== null) {
        const keyName = match[1] || match[0].split(':')[0];
        const keyValue = match[2] || match[1];
        if (keyName && keyValue) {
          appInfo.apiKeys[keyName.toLowerCase()] = keyValue;
        }
      }
    });

    // Extract features/description
    const descMatch = body.match(/(?:DESCRIPTION|description|FEATURES|features):\s*([^\n]*(?:\n(?!\s*[A-Z_]+:)[^\n]*)*)/i);
    if (descMatch) {
      appInfo.description = descMatch[1].trim();
    }

    // Extract specific features list
    const featuresMatch = body.match(/(?:FEATURES|features):\s*((?:[-*]\s*[^\n]+\n?)+)/i);
    if (featuresMatch) {
      appInfo.features = featuresMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(feature => feature.length > 0);
    }

  } catch (error) {
    console.error('❌ Error parsing PR body:', error.message);
  }

  return appInfo;
}

// Function to generate SDK using Gemini API
async function generateSDK(appInfo) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const prompt = `Generate a comprehensive JavaScript micro SDK for ${appInfo.appName} integration.

App Details:
- Name: ${appInfo.appName}
- Description: ${appInfo.description}
- Features: ${appInfo.features.join(', ')}
- Available API Keys: ${Object.keys(appInfo.apiKeys).join(', ')}

Requirements:
1. Create a clean, modern JavaScript class-based SDK
2. Include authentication methods using the provided API keys
3. Add common API methods for ${appInfo.appName} (like posting, fetching data, user management, etc.)
4. Include proper error handling and validation
5. Add JSDoc comments for all methods
6. Use async/await for API calls
7. Include a usage example at the bottom
8. Make it production-ready with proper error messages
9. Add rate limiting considerations
10. Include type checking where possible

The SDK should be self-contained and ready to use. Focus on the most common use cases for ${appInfo.appName} integration.

Please generate only the JavaScript code without any explanation or markdown formatting.`;

  console.log('🤖 Calling Gemini API to generate SDK...');
  
  try {
    const response = await post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Function to save SDK to file
function saveSDK(appName, sdkCode, appInfo) {
  const sdksDir = join(process.cwd(), 'sdks');
  
  // Ensure sdks directory exists
  if (!existsSync(sdksDir)) {
    mkdirSync(sdksDir, { recursive: true });
  }

  // Clean app name for filename
  const cleanAppName = appName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const filename = `${cleanAppName}-sdk.js`;
  const filepath = join(sdksDir, filename);

  // Add header comment to the SDK
  const header = `/**
 * ${appName.toUpperCase()} Micro SDK
 * Generated automatically from PR #${prNumber}
 * Author: ${prAuthor}
 * Generated: ${new Date().toISOString()}
 * 
 * App Information:
 * - Name: ${appInfo.appName}
 * - Description: ${appInfo.description}
 * - Features: ${appInfo.features.join(', ')}
 * 
 * Available API Keys: ${Object.keys(appInfo.apiKeys).join(', ')}
 */

`;

  const fullCode = header + sdkCode;

  writeFileSync(filepath, fullCode, 'utf8');
  console.log(`💾 SDK saved to: ${filepath}`);

  // Also create a README for the SDK
  const readmeContent = `# ${appName.toUpperCase()} SDK

Generated from PR #${prNumber} by ${prAuthor}

## Installation

\`\`\`javascript
const ${cleanAppName.replace(/-/g, '')}SDK = require('./${filename}');
\`\`\`

## Configuration

Make sure to set up your API keys:

${Object.keys(appInfo.apiKeys).map(key => `- ${key.toUpperCase()}: Your ${key} from ${appName}`).join('\n')}

## Features

${appInfo.features.map(feature => `- ${feature}`).join('\n')}

## Description

${appInfo.description}

---

*This SDK was automatically generated using Gemini AI based on the pull request specifications.*
`;

  writeFileSync(join(sdksDir, `${cleanAppName}-README.md`), readmeContent, 'utf8');
  console.log(`📖 README saved to: ${cleanAppName}-README.md`);

  return filepath;
}

// Main execution
async function main() {
  try {
    console.log('📝 Parsing PR body...');
    const appInfo = parsePRBody(prBody);

    if (!appInfo.appName) {
      console.error('❌ No app name found in PR body. Please specify APP: <app_name>');
      process.exit(1);
    }

    console.log(`✅ Found app: ${appInfo.appName}`);
    console.log(`🔑 Found ${Object.keys(appInfo.apiKeys).length} API keys`);
    console.log(`📋 Features: ${appInfo.features.length} items`);

    console.log('🤖 Generating SDK with Gemini AI...');
    const sdkCode = await generateSDK(appInfo);

    console.log('💾 Saving SDK files...');
    const savedPath = saveSDK(appInfo.appName, sdkCode, appInfo);

    console.log('✅ SDK Generation Complete!');
    console.log(`📂 Files created in: sdks/`);
    console.log(`🎉 SDK for ${appInfo.appName} is ready to use!`);

    // Create a summary file
    const summary = {
      prNumber,
      prTitle,
      prAuthor,
      appName: appInfo.appName,
      generatedAt: new Date().toISOString(),
      apiKeysCount: Object.keys(appInfo.apiKeys).length,
      featuresCount: appInfo.features.length,
      sdkFile: savedPath
    };

    writeFileSync('sdks/generation-summary.json', JSON.stringify(summary, null, 2));
    console.log('📊 Generation summary saved to: sdks/generation-summary.json');

  } catch (error) {
    console.error('❌ SDK Generation failed:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();