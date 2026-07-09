// SECURE BACKEND WORKER ROUTER CONFIGURATION
const BACKEND_WORKER_URL = "https://stotraveda-ai-bridge.stotraveda.workers.dev";

// COMPLETE ECOSYSTEM AGENT DATA ENGINE MATRIX
const engines = {
    ask: {
        icon: "❓", title: "Ask StotraVeda AI", label: "Ask StotraVeda AI",
        sub: "Your universal Sanatana Dharma gateway",
        welcome: "Hari Om! I am your primary StotraVeda guide. Ask me any question concerning rituals, philosophies, or histories.",
        color: "#ff6f00",
        prompt: "You are the primary StotraVeda AI. Answer respectably across all aspects of Sanatana Dharma, philosophy, and history with high factual depth."
    },
    temple: {
        icon: "🛕", title: "Temple Guide AI", label: "Temple Guide AI",
        sub: "Architecture, History & Darshan timings",
        welcome: "Namaste! Inquire about any historic temple's architecture, history, or deity significance.",
        color: "#d32f2f",
        prompt: "You are Temple Guide AI. Provide rich detail about temple histories, visual architecture layout, and dynamic traditions."
    },
    panchang: {
        icon: "📅", title: "Panchang AI", label: "Panchang AI",
        sub: "Precise Solar & Lunar calculations",
        welcome: "Pranam! Provide your location or date to analyze Tithis, Nakshatras, and local sunrise configurations.",
        color: "#e65100",
        prompt: "You are Panchang AI. Focus on mathematical and scriptural accuracy regarding Tithis, Nakshatras, and cosmic hours."
    },
    muhurat: {
        icon: "⭐", title: "Muhurat AI", label: "Muhurat AI",
        sub: "Auspicious timings selector",
        welcome: "Pranam! Planning a marriage or housewarming? Tell me your requirements and I will check for Shubh timings.",
        color: "#fbc02d",
        prompt: "You are Muhurat AI. Calculate auspicious times (Shubh Muhurats) while pointing out warnings like Rahu Kaal."
    },
    stotra: {
        icon: "📿", title: "Stotra AI", label: "Stotra AI",
        sub: "Hymns, layout phrasing & meanings",
        welcome: "Hari Om! Share a hymn or deity name, and I will pull up verses with line-by-line translations.",
        color: "#8e24aa",
        prompt: "You are Stotra AI. Specialized in delivering Sanskrit verses paired with word-by-word breakdowns and summaries."
    },
    kundalini: {
        icon: "🐍", title: "Kundalini AI", label: "Kundalini AI",
        sub: "Chakra awakening & meditation paths",
        welcome: "Pranam! I am here to guide you through the understanding of the subtle energy body. Ask about Chakra alignment or meditative practices.",
        color: "#6a1b9a",
        prompt: "You are Kundalini AI. Explain the seven Chakra systems and awakening of latent energy, emphasizing safety, patience, and proper guidance."
    },
    marriage: {
        icon: "💍", title: "Vivaha (Marriage) AI", label: "Marriage AI",
        sub: "Vedic rituals, Rashi & Compatibility",
        welcome: "Namaste! I am your guide to Vedic marriage traditions and compatibility. Ask about Guna Milan or Rashi compatibility.",
        color: "#d81b60",
        prompt: "You are Vivaha (Marriage) AI. Expert in Vedic astrology (Jyotish) and marriage rituals. Explain Guna Milan, 36 Gunas, and the spiritual sanctity of the union."
    },
    puja: {
        icon: "🙏", title: "Puja AI", label: "Puja AI",
        sub: "Step-by-step deity worship methods",
        welcome: "Pranam! I will assist you with Shodashopachara (16-step) deity worship plans and checklist preparations.",
        color: "#00acc1",
        prompt: "You are Puja AI. Walk the user step-by-step through household altar setups and standard sequence (Sankalpa, Avahana, etc.)."
    },
    festival: {
        icon: "🎉", title: "Festival AI", label: "Festival AI",
        sub: "Origins, dates & fasting laws",
        welcome: "Jai Shri Krishna! Ask about festival timelines, Vrat (fasting) protocols, and regional traditions.",
        color: "#43a047",
        prompt: "You are Festival AI. Detail cultural festival backgrounds, fasting rules (Parana), and regional variants."
    },
    ayurveda: {
        icon: "🌿", title: "Ayurveda AI", label: "Ayurveda AI",
        sub: "Dosha balance & natural wellness",
        welcome: "Pranam! Explore natural ancient wellness. Ask about daily routines (Dinacharya) or herbal properties.",
        color: "#2e7d32",
        prompt: "You are Ayurveda AI. Educate users about bodily constitutions (Vata, Pitta, Kapha). Always include a clear medical disclaimer."
    }
};

let activeEngineKey = "ask";

window.addEventListener('DOMContentLoaded', () => {
    const sidebarMenu = document.getElementById('sidebarMenu');
    Object.keys(engines).forEach(key => {
        const item = engines[key];
        const card = document.createElement('div');
        card.className = `ai-card ${key === activeEngineKey ? 'active' : ''}`;
        if(key === activeEngineKey) card.style.borderLeftColor = item.color;
        card.setAttribute('data-id', key);
        card.onclick = () => switchEngine(key, card);
        card.innerHTML = `<div class="ai-card-title">${item.icon} ${item.label}</div><div class="ai-card-desc">${item.sub}</div>`;
        sidebarMenu.appendChild(card);
    });
});

function switchEngine(id, element) {
    activeEngineKey = id;
    const item = engines[id];
    document.querySelectorAll('.ai-card').forEach(card => {
        card.classList.remove('active');
        card.style.borderLeftColor = "transparent";
    });
    element.classList.add('active');
    element.style.borderLeftColor = item.color;
    document.getElementById('panelTitle').innerText = `${item.icon} ${item.title}`;
    document.getElementById('panelDesc').innerText = item.sub;
    document.getElementById('headerBanner').style.background = `linear-gradient(135deg, ${item.color}, #1d0f0a)`;
    const stream = document.getElementById('chatStream');
    const loader = document.getElementById('loader');
    stream.innerHTML = ""; 
    const welcomeBubble = document.createElement('div');
    welcomeBubble.className = 'bubble guru-msg';
    welcomeBubble.innerText = item.welcome;
    stream.appendChild(welcomeBubble);
    stream.appendChild(loader);
}

async function handleTransmission() {
    const inputField = document.getElementById('userInput');
    const stream = document.getElementById('chatStream');
    const loader = document.getElementById('loader');
    const query = inputField.value.trim();
    if (!query) return;
    const userBubble = document.createElement('div');
    userBubble.className = 'bubble user-msg';
    userBubble.innerText = query;
    stream.insertBefore(userBubble, loader);
    inputField.value = "";
    inputField.disabled = true;
    loader.style.display = 'flex';
    stream.scrollTop = stream.scrollHeight;
    const activeEngine = engines[activeEngineKey];
    try {
        const response = await fetch(BACKEND_WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enginePrompt: activeEngine.prompt, searchEngineTitle: activeEngine.title, query: query })
        });
        const data = await response.json();
        if (response.ok && data.choices && data.choices[0]) {
            const coreAnswer = data.choices[0].message.content;
            const guruBubble = document.createElement('div');
            guruBubble.className = 'bubble guru-msg';
            guruBubble.innerText = coreAnswer;
            stream.insertBefore(guruBubble, loader);
        } else {
            let errorMsg = "Worker error.";
            if (data.error) errorMsg = typeof data.error === 'object' ? (data.error.message || JSON.stringify(data.error)) : data.error;
            throw new Error(errorMsg);
        }
    } catch (e) {
        const errorBubble = document.createElement('div');
        errorBubble.className = 'bubble guru-msg';
        errorBubble.style.borderLeftColor = 'var(--sacred-red)';
        errorBubble.innerText = `System Status: ${e.message}`;
        stream.insertBefore(errorBubble, loader);
    }
    loader.style.display = 'none';
    inputField.disabled = false;
    inputField.focus();
    stream.scrollTop = stream.scrollHeight;
}
