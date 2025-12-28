// State management
const state = {
    macros: {
        protein: { current: 0, target: 120 },
        carbs: { current: 0, target: 200 },
        fat: { current: 0, target: 60 }
    },
    calories: { current: 0, target: 2000 },
    conversationHistory: [],
    settings: {
        apiProvider: 'claude',
        apiKey: '',
        userAge: '',
        userGoals: '',
        userContext: ''
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadSettings();
    updateDateDisplay();
    loadTodaysMacros();
});

function initializeApp() {
    console.log('Accountability Mirror initialized');
}

// Event Listeners
function setupEventListeners() {
    // Chat input
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    console.log('Setting up event listeners...');
    console.log('Send button found:', sendBtn);
    console.log('Chat input found:', chatInput);
    
    sendBtn.addEventListener('click', () => {
        console.log('Send button clicked!');
        handleSendMessage();
    });
    
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('Enter key pressed!');
            handleSendMessage();
        }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });
    
    // Quick action buttons
    document.getElementById('btn-today').addEventListener('click', () => {
        sendPredefinedMessage("How am I doing today? Give me a summary of my progress and any suggestions.");
    });
    
    document.getElementById('btn-suggestions').addEventListener('click', () => {
        sendPredefinedMessage("Based on my current macros, what should I eat next to stay on track?");
    });
    
    document.getElementById('btn-supplements').addEventListener('click', () => {
        sendPredefinedMessage("Tell me about supplements that are actually evidence-based and worth taking for my goals.");
    });
    
    // Settings
    const settingsBtn = document.getElementById('btn-settings');
    console.log('Settings button found:', settingsBtn);
    
    settingsBtn.addEventListener('click', () => {
        console.log('Settings button clicked!');
        openSettings();
    });
    
    document.getElementById('close-settings').addEventListener('click', () => {
        console.log('Close settings clicked!');
        closeSettings();
    });
    
    document.getElementById('save-settings').addEventListener('click', () => {
        console.log('Save settings clicked!');
        saveSettings();
    });
    
    // Close modal on outside click
    document.getElementById('settings-modal').addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') {
            closeSettings();
        }
    });
}

// Date display
function updateDateDisplay() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.querySelector('.date-display .day').textContent = days[now.getDay()];
    document.querySelector('.date-display .full-date').textContent = 
        `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Macro management
function loadTodaysMacros() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`macros_${today}`);
    
    if (stored) {
        const data = JSON.parse(stored);
        state.macros = data;
        updateMacroDisplay();
    } else {
        // Reset for new day
        state.macros.protein.current = 0;
        state.macros.carbs.current = 0;
        state.macros.fat.current = 0;
        state.calories.current = 0;
        updateMacroDisplay();
    }
}

function saveTodaysMacros() {
    const today = new Date().toDateString();
    localStorage.setItem(`macros_${today}`, JSON.stringify(state.macros));
}

function updateMacros(protein, carbs, fat) {
    state.macros.protein.current += protein;
    state.macros.carbs.current += carbs;
    state.macros.fat.current += fat;
    
    // Calculate calories (protein: 4cal/g, carbs: 4cal/g, fat: 9cal/g)
    state.calories.current = Math.round(
        (state.macros.protein.current * 4) +
        (state.macros.carbs.current * 4) +
        (state.macros.fat.current * 9)
    );
    
    updateMacroDisplay();
    saveTodaysMacros();
}

function updateMacroDisplay() {
    // Update protein
    document.getElementById('protein-current').textContent = Math.round(state.macros.protein.current);
    document.getElementById('protein-target').textContent = state.macros.protein.target;
    const proteinPercent = Math.min((state.macros.protein.current / state.macros.protein.target) * 100, 100);
    document.querySelector('.protein-fill').style.width = `${proteinPercent}%`;
    
    // Update carbs
    document.getElementById('carbs-current').textContent = Math.round(state.macros.carbs.current);
    document.getElementById('carbs-target').textContent = state.macros.carbs.target;
    const carbsPercent = Math.min((state.macros.carbs.current / state.macros.carbs.target) * 100, 100);
    document.querySelector('.carbs-fill').style.width = `${carbsPercent}%`;
    
    // Update fat
    document.getElementById('fat-current').textContent = Math.round(state.macros.fat.current);
    document.getElementById('fat-target').textContent = state.macros.fat.target;
    const fatPercent = Math.min((state.macros.fat.current / state.macros.fat.target) * 100, 100);
    document.querySelector('.fat-fill').style.width = `${fatPercent}%`;
    
    // Update calories
    document.getElementById('calories-current').textContent = state.calories.current;
    document.getElementById('calories-target').textContent = state.calories.target;
}

// Chat functionality
async function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    console.log('Send button clicked, message:', message);
    
    if (!message) return;
    
    // Check if API key is configured
    if (!state.settings.apiKey) {
        console.log('No API key configured');
        addAssistantMessage("Please configure your API key in Settings first. Click the ⚙ Settings button on the left.");
        return;
    }
    
    console.log('API key found, proceeding...');
    
    // Add user message to chat
    addUserMessage(message);
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        console.log('Calling AI API...');
        // Get AI response
        const response = await getAIResponse(message);
        console.log('AI response received:', response);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add assistant response
        addAssistantMessage(response.message);
        
        // Update macros if food was logged
        if (response.macros) {
            console.log('Updating macros:', response.macros);
            updateMacros(response.macros.protein, response.macros.carbs, response.macros.fat);
        }
    } catch (error) {
        console.error('Error in handleSendMessage:', error);
        removeTypingIndicator();
        addAssistantMessage(`Sorry, I encountered an error: ${error.message}. Please check your API key in Settings and ensure it's valid.`);
    }
}

function sendPredefinedMessage(message) {
    document.getElementById('chat-input').value = message;
    handleSendMessage();
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to conversation history
    state.conversationHistory.push({
        role: 'user',
        content: text
    });
}

function addAssistantMessage(text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant-message';
    
    // Convert markdown-style formatting to HTML
    const formattedText = formatMessage(text);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${formattedText}
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to conversation history
    state.conversationHistory.push({
        role: 'assistant',
        content: text
    });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const indicator = document.createElement('div');
    indicator.className = 'message assistant-message typing-message';
    indicator.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = document.querySelector('.typing-message');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// AI API Integration
async function getAIResponse(userMessage) {
    const systemPrompt = buildSystemPrompt();
    
    if (state.settings.apiProvider === 'claude') {
        return await getClaudeResponse(systemPrompt, userMessage);
    } else {
        return await getOpenAIResponse(systemPrompt, userMessage);
    }
}

function buildSystemPrompt() {
    const currentMacros = `
Current macros today:
- Protein: ${Math.round(state.macros.protein.current)}g / ${state.macros.protein.target}g
- Carbs: ${Math.round(state.macros.carbs.current)}g / ${state.macros.carbs.target}g
- Fat: ${Math.round(state.macros.fat.current)}g / ${state.macros.fat.target}g
- Calories: ${state.calories.current} / ${state.calories.target}
`;

    const userContext = state.settings.userAge || state.settings.userGoals || state.settings.userContext
        ? `
User context:
${state.settings.userAge ? `- Age: ${state.settings.userAge}` : ''}
${state.settings.userGoals ? `- Goals: ${state.settings.userGoals}` : ''}
${state.settings.userContext ? `- Additional context: ${state.settings.userContext}` : ''}
`
        : '';

    return `You are an accountability coach for health, fitness, and nutrition. You provide supportive, evidence-based guidance with a conversational, motivating tone.

${currentMacros}

${userContext}

When the user mentions food they've eaten:
1. Estimate the macros (protein, carbs, fat in grams)
2. Provide feedback on how it fits their goals
3. Respond with your message AND include macro data in this exact format at the end:
   MACROS: protein=X carbs=Y fat=Z

For example: "That's a great breakfast choice! Scrambled eggs with toast gives you solid protein to start the day.

MACROS: protein=25 carbs=30 fat=15"

Guidelines:
- Be supportive and realistic, not preachy
- Offer practical swaps and suggestions
- Consider their age, goals, and context
- Be honest about what works and what doesn't
- When discussing supplements, focus on evidence-based options (creatine, vitamin D, omega-3, protein powder, magnesium)
- Help them make decisions in the moment (temptations, cravings, fatigue)
- Celebrate progress and consistency over perfection
- Use UK terminology and foods

Keep responses conversational and not too long unless they ask for detailed information.`;
}

async function getClaudeResponse(systemPrompt, userMessage) {
    console.log('Getting Claude response...');
    
    const messages = [
        ...state.conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
    ];
    
    console.log('Making API request to Claude...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': state.settings.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages
        })
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed (${response.status}): ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    const messageText = data.content[0].text;
    
    return parseAIResponse(messageText);
}

async function getOpenAIResponse(systemPrompt, userMessage) {
    const messages = [
        { role: 'system', content: systemPrompt },
        ...state.conversationHistory.slice(-10),
        { role: 'user', content: userMessage }
    ];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.settings.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: messages,
            max_tokens: 1024
        })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const messageText = data.choices[0].message.content;
    
    return parseAIResponse(messageText);
}

function parseAIResponse(text) {
    // Look for macro data in the format: MACROS: protein=X carbs=Y fat=Z
    const macroMatch = text.match(/MACROS:\s*protein=(\d+(?:\.\d+)?)\s*carbs=(\d+(?:\.\d+)?)\s*fat=(\d+(?:\.\d+)?)/i);
    
    let macros = null;
    let message = text;
    
    if (macroMatch) {
        macros = {
            protein: parseFloat(macroMatch[1]),
            carbs: parseFloat(macroMatch[2]),
            fat: parseFloat(macroMatch[3])
        };
        
        // Remove the MACROS line from the message
        message = text.replace(/MACROS:.*$/i, '').trim();
    }
    
    return { message, macros };
}

// Settings management
function openSettings() {
    console.log('openSettings called');
    const modal = document.getElementById('settings-modal');
    console.log('Modal element:', modal);
    modal.classList.add('active');
    console.log('Modal classes after adding active:', modal.classList);
    loadSettingsToForm();
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
}

function loadSettings() {
    const stored = localStorage.getItem('settings');
    if (stored) {
        state.settings = { ...state.settings, ...JSON.parse(stored) };
    }
    
    // Load macro targets
    const storedTargets = localStorage.getItem('macroTargets');
    if (storedTargets) {
        const targets = JSON.parse(storedTargets);
        state.macros.protein.target = targets.protein;
        state.macros.carbs.target = targets.carbs;
        state.macros.fat.target = targets.fat;
        state.calories.target = targets.calories;
        updateMacroDisplay();
    }
}

function loadSettingsToForm() {
    document.getElementById('api-provider').value = state.settings.apiProvider;
    document.getElementById('api-key').value = state.settings.apiKey;
    document.getElementById('target-protein').value = state.macros.protein.target;
    document.getElementById('target-carbs').value = state.macros.carbs.target;
    document.getElementById('target-fat').value = state.macros.fat.target;
    document.getElementById('user-age').value = state.settings.userAge;
    document.getElementById('user-goals').value = state.settings.userGoals;
    document.getElementById('user-context').value = state.settings.userContext;
}

function saveSettings() {
    // Save API settings
    state.settings.apiProvider = document.getElementById('api-provider').value;
    state.settings.apiKey = document.getElementById('api-key').value;
    state.settings.userAge = document.getElementById('user-age').value;
    state.settings.userGoals = document.getElementById('user-goals').value;
    state.settings.userContext = document.getElementById('user-context').value;
    
    localStorage.setItem('settings', JSON.stringify(state.settings));
    
    // Save macro targets
    state.macros.protein.target = parseInt(document.getElementById('target-protein').value);
    state.macros.carbs.target = parseInt(document.getElementById('target-carbs').value);
    state.macros.fat.target = parseInt(document.getElementById('target-fat').value);
    
    // Calculate calorie target
    state.calories.target = 
        (state.macros.protein.target * 4) +
        (state.macros.carbs.target * 4) +
        (state.macros.fat.target * 9);
    
    const targets = {
        protein: state.macros.protein.target,
        carbs: state.macros.carbs.target,
        fat: state.macros.fat.target,
        calories: state.calories.target
    };
    
    localStorage.setItem('macroTargets', JSON.stringify(targets));
    
    updateMacroDisplay();
    closeSettings();
    
    // Show confirmation
    addAssistantMessage("Settings saved! I'm ready to help you with your goals.");
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMessage(text) {
    // Convert newlines to paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map(p => {
        // Bold text: **text** or __text__
        p = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        p = p.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Code: `text`
        p = p.replace(/`(.+?)`/g, '<code>$1</code>');
        
        return `<p>${p}</p>`;
    }).join('');
}
