// Terminal Portfolio CLI System with Anime Theme
class TerminalPortfolio {
    constructor() {
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentDirectory = '~';
        this.isTyping = false;
        this.currentTheme = localStorage.getItem('terminal_theme') || 'anime'; // default anime theme
        
        // Anime characters for random display
        this.animeCharacters = [
            '(´｡• ᵕ •｡`)', '(˶ᵔ ᵕ ᵔ˶)', '( ˶ˆᗜˆ˵ )', '(｡•̀ᴗ-)✧', '(◡ ω ◡)',
            '(⌒‿⌒)', '( ͡° ͜ʖ ͡°)', '(｡◕‿◕｡)', '(≧◡≦)', '(⊃｡•́‿•̀｡)⊃',
            '٩(◕‿◕)۶', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(◕‿◕)♡', '(づ｡◕‿‿◕｡)づ', '(☆▽☆)',
            '♡(˃͈ દ ˂͈ ༶ )', '(◍•ᴗ•◍)❤', '(´｡• ω •｡`)', '(⌒▽⌒)☆', '(◕ᴗ◕✿)',
            '🌸', '🎌', '🌺', '💮', '🏮', '⭐', '✨', '🎀', '💫', '🔮'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateTime();
        this.createAnimeCharacters();
        this.focusInput();
        this.applyTheme(this.currentTheme); // Apply saved theme
        
        // Initial welcome animation
        setTimeout(() => {
            this.typeText('🎌 System initialized... Welcome to the anime terminal! ✨', 'text-accent-purple');
        }, 1000);
    }
    
    createAnimeCharacters() {
        const container = document.getElementById('anime-characters');
        if (!container) return;
        
        // Create floating anime characters
        for (let i = 0; i < 15; i++) {
            const char = document.createElement('div');
            char.className = 'anime-character';
            char.textContent = this.animeCharacters[Math.floor(Math.random() * this.animeCharacters.length)];
            char.style.left = Math.random() * 100 + '%';
            char.style.top = Math.random() * 100 + '%';
            char.style.animationDelay = Math.random() * 3 + 's';
            char.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
            container.appendChild(char);
        }
        
        // Refresh characters periodically
        setInterval(() => {
            const characters = container.querySelectorAll('.anime-character');
            characters.forEach(char => {
                if (Math.random() < 0.3) {
                    char.textContent = this.animeCharacters[Math.floor(Math.random() * this.animeCharacters.length)];
                    char.style.left = Math.random() * 100 + '%';
                    char.style.top = Math.random() * 100 + '%';
                }
            });
        }, 5000);
    }
    
    setupEventListeners() {
        const input = document.getElementById('command-input');
        const terminal = document.querySelector('.terminal-glow');
        
        // Command input handling
        input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        input.addEventListener('input', () => this.updateInputDisplay());
        
        // Focus management
        terminal.addEventListener('click', () => input.focus());
        document.addEventListener('click', (e) => {
            if (!terminal.contains(e.target)) {
                input.blur();
            }
        });
        
        // Auto-focus on page load
        window.addEventListener('load', () => input.focus());
        
        // Initialize input display
        this.updateInputDisplay();
    }
    
    updateInputDisplay() {
        const input = document.getElementById('command-input');
        const display = document.getElementById('input-display');
        
        if (input && display) {
            display.textContent = input.value;
        }
    }
    
    handleKeyDown(e) {
        const input = e.target;
        
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                this.executeCommand(input.value);
                input.value = '';
                this.updateInputDisplay();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                this.updateInputDisplay();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                this.updateInputDisplay();
                break;
                
            case 'Tab':
                e.preventDefault();
                this.handleAutoComplete(input);
                this.updateInputDisplay();
                break;
                
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.executeCommand('clear');
                    this.updateInputDisplay();
                }
                break;
        }
    }
    
    executeCommand(command) {
        if (!command.trim()) return;
        
        // Add to history
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addToOutput(`<div class="flex items-center space-x-2 mb-2">
            <span class="text-accent-purple font-bold">nabil</span>
            <span class="text-text-secondary">@</span>
            <span class="text-anime-blue font-semibold">portfolio</span>
            <span class="text-text-secondary">:</span>
            <span class="text-accent-cyan">${this.currentDirectory}</span>
            <span class="text-anime-pink font-bold">$</span>
            <span class="text-text-primary">${command}</span>
        </div>`, '');
        
        // Parse and execute
        const [cmd, ...args] = command.trim().split(' ');
        this.processCommand(cmd.toLowerCase(), args);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    processCommand(cmd, args) {
        const commands = {
            'help': () => this.showHelp(),
            'whoami': () => this.showAbout(),
            'skills': () => this.showSkills(),
            'projects': () => this.showProjects(args[0]),
            'contact': () => this.showContact(),
            'sudo': () => this.handleSudo(args),
            'clear': () => this.clearTerminal(),
            'ls': () => this.listDirectory(),
            'cat': () => this.readFile(args[0]),
            'ssh': () => this.handleSSH(args),
            'pwd': () => this.showCurrentDir(),
            'cd': () => this.changeDirectory(args[0]),
            'history': () => this.showHistory(),
            'date': () => this.showDate(),
            'uname': () => this.showSystemInfo(),
            'ps': () => this.showProcesses(),
            'neofetch': () => this.showNeofetch(),
            'matrix': () => this.matrixEffect(),
            'cowsay': () => this.cowsay(args.join(' ') || 'Hello from Nabil!'),
            'figlet': () => this.figlet(args.join(' ') || 'NABIL'),
            'fortune': () => this.fortune(),
            'sl': () => this.steamLocomotive(),
            'tree': () => this.showTree(),
            'ping': () => this.pingHost(args[0] || 'google.com'),
            'curl': () => this.curlCommand(args[0]),
            'wget': () => this.wgetCommand(args[0]),
            'grep': () => this.grepCommand(args),
            'find': () => this.findCommand(args),
            'alias': () => this.showAliases(),
            'echo': () => this.echoCommand(args.join(' ')),
            'env': () => this.showEnvironment(),
            'top': () => this.showTop(),
            'kill': () => this.killProcess(args[0]),
            'man': () => this.showManual(args[0]),
            'which': () => this.whichCommand(args[0]),
            'file': () => this.fileCommand(args[0]),
            'head': () => this.headCommand(args[0]),
            'tail': () => this.tailCommand(args[0]),
            'wc': () => this.wordCount(args[0]),
            'df': () => this.diskFree(),
            'du': () => this.diskUsage(),
            'free': () => this.showMemory(),
            'uptime': () => this.showUptime(),
            'w': () => this.showUsers(),
            'id': () => this.showId(),
            'groups': () => this.showGroups(),
            'chmod': () => this.chmodCommand(args),
            'chown': () => this.chownCommand(args),
            'zip': () => this.zipCommand(args),
            'unzip': () => this.unzipCommand(args[0]),
            'tar': () => this.tarCommand(args),
            'git': () => this.gitCommand(args),
            'npm': () => this.npmCommand(args),
            'python': () => this.pythonCommand(args),
            'node': () => this.nodeCommand(args),
            'vim': () => this.vimCommand(args[0]),
            'nano': () => this.nanoCommand(args[0]),
            'code': () => this.codeCommand(args[0]),
            'htop': () => this.htopCommand(),
            'iftop': () => this.iftopCommand(),
            'netstat': () => this.netstatCommand(),
            'nmap': () => this.nmapCommand(args),
            'wireshark': () => this.wiresharkCommand(),
            'metasploit': () => this.metasploitCommand(),
            'john': () => this.johnCommand(args),
            'hashcat': () => this.hashcatCommand(args),
            'aircrack-ng': () => this.aircrackCommand(args),
            'sqlmap': () => this.sqlmapCommand(args),
            'gobuster': () => this.gobusterCommand(args),
            'hydra': () => this.hydraCommand(args),
            'nc': () => this.netcatCommand(args),
            'nslookup': () => this.nslookupCommand(args[0]),
            'dig': () => this.digCommand(args[0]),
            'whois': () => this.whoisCommand(args[0]),
            'cewl': () => this.cewlCommand(args[0]),
            'steghide': () => this.steghideCommand(args),
            'binwalk': () => this.binwalkCommand(args[0]),
            'strings': () => this.stringsCommand(args[0]),
            'hexdump': () => this.hexdumpCommand(args[0]),
            'xxd': () => this.xxdCommand(args[0]),
            'anime': () => this.animeCommand(),
            'kawaii': () => this.kawaiiCommand(),
            'baka': () => this.bakaCommand(),
            'message': () => this.startContactForm(),
            'view': () => this.handleViewCommand(args),
            'theme': () => this.handleThemeCommand(args)
        };
        
        if (this.contactFormStep) {
            this.handleContactFormInput(cmd + ' ' + args.join(' '));
            return;
        }
        
        if (this.awaitingPassword) {
            this.handlePasswordInput(cmd + ' ' + args.join(' '));
            return;
        }
        
        if (commands[cmd]) {
            commands[cmd]();
        } else {
            this.addToOutput(`<div class="command-output">
                <span class="text-red-400">❌ bash: ${cmd}: command not found</span>
                <div class="text-yellow-400 mt-1">💡 Type <span class="text-anime-purple font-semibold">'help'</span> or <span class="text-anime-purple font-semibold">'ls'</span> to see available commands</div>
            </div>`, '');
        }
    }
    
    showHelp() {
        const helpText = `
<div class="command-output">
<div class="text-center mb-4">
  <span class="text-anime-purple font-bold text-lg">✨ Available Commands ✨</span>
</div>

<div class="space-y-4">
  <div class="p-4 border-2 border-accent-cyan rounded-lg bg-accent-cyan/10 shadow-sm">
    <div class="text-accent-cyan font-semibold mb-3">Portfolio Commands:</div>
    <div class="space-y-2">
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-pink font-mono">whoami</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">About Nabil 🧠</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-pink font-mono">skills</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Technical skills and expertise 💻</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-pink font-mono">projects</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">View my projects (use 'cat project-name' for details) 🚀</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-pink font-mono">contact</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Get in touch 📧</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-pink font-mono">message</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Send me a direct message 💌</span>
      </div>
    </div>
  </div>

  <div class="p-4 border-2 border-anime-blue rounded-lg bg-anime-blue/10 shadow-sm">
    <div class="text-anime-blue font-semibold mb-3">System Commands:</div>
    <div class="space-y-2">
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-blue font-mono">clear</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Clear terminal output 🧹</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-blue font-mono">ls</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">List directory contents 📁</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-blue font-mono">pwd</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Show current directory 📍</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-blue font-mono">history</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Show command history 📜</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-blue font-mono">neofetch</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">System information 🖥️</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-anime-blue font-mono">theme [mode]</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Change theme (anime/light/dark) 🎨</span>
      </div>
    </div>
  </div>

  <div class="p-4 border-2 border-yellow-400 rounded-lg bg-yellow-400/10 shadow-sm">
    <div class="text-yellow-400 font-semibold mb-3">🎮 Fun & Easter Eggs:</div>
    <div class="space-y-2">
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-yellow-300 font-mono">sudo rm -rf /</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Don't try this at home 😈</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-yellow-300 font-mono">matrix</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Enter the matrix... 🕶️</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-yellow-300 font-mono">cowsay [text]</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Make the cow speak 🐄</span>
      </div>
      <div class="grid grid-cols-[auto_auto_1fr] gap-4 items-center">
        <span class="text-yellow-300 font-mono">fortune</span>
        <span class="text-gray-400">-</span>
        <span class="text-text-primary">Random wisdom 🔮</span>
      </div>
    </div>
  </div>
</div>
</div>`;
        this.addToOutput(helpText, '');
    }
    
    showAbout() {
        const aboutText = `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">About Me</span>
<div class="mt-3 p-4 border border-anime-purple/30 rounded-lg bg-anime-purple/5">
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-primary">
<div>
  <span class="text-accent-cyan font-semibold">Name:</span> Nabil 
  <br><span class="text-accent-cyan font-semibold">Role:</span> Programmer
  <br><span class="text-accent-cyan font-semibold">Location:</span> Pune
  <br><span class="text-accent-cyan font-semibold">Status:</span> Always Learning 
</div>
<div class="text-center">
  <img src="assets/profile.jpg" alt="Nabil's Photo" class="w-24 h-24 rounded-full mx-auto mb-2 border-2 border-anime-pink shadow-lg">
  <span class="text-anime-pink font-semibold">Yoo Sup!</span>
</div>
</div>

<div class="mt-4">
<div class="text-text-primary leading-relaxed">
Hey, I'm Nabil — a curious builder and problem-solver who loves exploring the edges of tech. 
I'm currently a <span class="text-anime-blue font-semibold">Google Student Ambassador</span> and spend most of my time working on projects that bring together code, creativity, and real-world impact.
</div>

<div class="mt-4">
<span class="text-anime-blue font-semibold">🎭 I wear many hats in the tech space:</span>
<div class="ml-4 mt-2 space-y-2 text-text-primary">
  <div>🛡️ <span class="text-accent-cyan">Cybersecurity Researcher & Analyst</span> — passionate about system security and research.</div>
  <div>🐍 <span class="text-accent-cyan">Python & C/C++ Developer</span> — solving problems and building efficient systems.</div>
  <div>🤖 <span class="text-accent-cyan">AI/ML Learner & Researcher</span> — experimenting with models, agents, and applied intelligence.</div>
  <div>☁️ <span class="text-accent-cyan">Cloud Developer</span> — deploying scalable apps and backend services.</div>
  <div>📱 <span class="text-accent-cyan">AOSP & Embedded Systems Specialist</span> — tinkering with low-level systems and device integrations.</div>
  <div>🔗 <span class="text-accent-cyan">API Developer & Integrator</span> — connecting services into seamless workflows.</div>
  <div>🌐 <span class="text-accent-cyan">Full-Stack Developer</span> — crafting both frontend experiences and backend logic.</div>
</div>
</div>

<div class="mt-4 p-3 bg-gradient-to-r from-anime-purple/10 to-anime-pink/10 rounded-lg border border-anime-purple/20">
<div class="text-text-primary mb-3">
At the core, I love creating things that push boundaries — whether it's building smarter developer tools, securing systems, or scaling applications. My journey is about learning fast, experimenting boldly, and sharing knowledge with others.
</div>
<div class="text-anime-pink">
Outside the world of code, you'll catch me watching anime, reading manga, or getting lost in sci-fi stories.
</div>
</div>

<div class="mt-4 text-center">
<span class="text-anime-purple font-semibold text-lg">⚡ Always open to collaborations, ideas, and challenges that can make a real difference. ⚡</span>
</div>
</div>
</div>
</div>`;
        this.addToOutput(aboutText, '');
    }
    
    showSkills() {
        const skillsText = `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">💻 Technical Skills & Expertise 💻</span>
<div class="mt-4 space-y-4">

<div class="p-3 border border-anime-blue/30 rounded-lg bg-anime-blue/5">
<span class="text-anime-blue font-semibold">💻 Programming & Languages:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-cyan">Python</span> — scripting, automation, web backends</div>
  <div>• <span class="text-accent-cyan">C / C++</span> — low-level systems, embedded, performance-critical code</div>
  <div>• <span class="text-accent-cyan">JavaScript / TypeScript</span> — frontend + backend</div>
  <div>• <span class="text-accent-cyan">Shell scripting</span> — Bash / Zsh</div>
</div>
</div>

<div class="p-3 border border-anime-pink/30 rounded-lg bg-anime-pink/5">
<span class="text-anime-pink font-semibold">🌐 Web & Backend / Full-Stack:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-cyan">Frontend:</span> HTML, CSS, React, Next.js</div>
  <div>• <span class="text-accent-cyan">Backend & APIs:</span> Node.js, Express, REST / GraphQL APIs</div>
  <div>• <span class="text-accent-cyan">Integration:</span> microservices, connecting systems</div>
</div>
</div>

<div class="p-3 border border-accent-cyan/30 rounded-lg bg-accent-cyan/5">
<span class="text-accent-cyan font-semibold">🤖 AI / ML / Research:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-purple">Model experimentation</span> — applying pre-trained models</div>
  <div>• <span class="text-accent-purple">Prompt engineering</span> — AI-powered tooling (e.g. IntelliGit project)</div>
  <div>• <span class="text-accent-purple">Research mindset</span> — security & intelligent systems</div>
</div>
</div>

<div class="p-3 border border-yellow-400/30 rounded-lg bg-yellow-400/5">
<span class="text-yellow-400 font-semibold">☁️ Cloud & DevOps:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-cyan">Cloud platforms:</span> Azure & Google Cloud Platform (GCP)</div>
  <div>• <span class="text-accent-cyan">CI/CD:</span> deployment pipelines, serverless, containerization (Docker)</div>
  <div>• <span class="text-accent-cyan">Infrastructure:</span> Infrastructure as code, automation</div>
</div>
</div>

<div class="p-3 border border-accent-purple/30 rounded-lg bg-accent-purple/5">
<span class="text-accent-purple font-semibold">🖥️ Systems / Embedded / OS & Mobile:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-cyan">AOSP / Android:</span> Android internals, custom ROM, kernel (Project Matrixx OS)</div>
  <div>• <span class="text-accent-cyan">Linux systems:</span> Ubuntu / Debian / Arch / system internals</div>
  <div>• <span class="text-accent-cyan">Embedded systems:</span> hardware interfacing</div>
</div>
</div>

<div class="p-3 border border-red-400/30 rounded-lg bg-red-400/5">
<span class="text-red-400 font-semibold">🛡️ Security & Cybersecurity:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-cyan">Security research:</span> ethical hacking exploration</div>
  <div>• <span class="text-accent-cyan">Vulnerability assessment:</span> threat modeling</div>
  <div>• <span class="text-accent-cyan">Secure coding:</span> secure practices, cryptography basics</div>
</div>
</div>

<div class="p-3 border border-green-400/30 rounded-lg bg-green-400/5">
<span class="text-green-400 font-semibold">🛠️ Tools, Frameworks & Ecosystem:</span>
<div class="mt-2 space-y-2 text-text-primary">
  <div>• <span class="text-accent-cyan">Version control:</span> Git / GitHub workflows / GitHub Actions</div>
  <div>• <span class="text-accent-cyan">Development:</span> VS Code extensions (IntelliGit), Tailwind CSS</div>
  <div>• <span class="text-accent-cyan">Backend services:</span> Firebase, serverless backends</div>
  <div>• <span class="text-accent-cyan">Databases:</span> MySQL, MongoDB</div>
  <div>• <span class="text-accent-cyan">Infrastructure:</span> Nginx, Apache, automation tools</div>
</div>
</div>

</div>
</div>`;
        this.addToOutput(skillsText, '');
    }
    
    showProjects(projectName) {
        if (projectName) {
            this.processCommand('cat', [projectName]);
            return;
        }
        
        const projectsText = `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">🚀 Project Portfolio 🚀</span>
<div class="mt-3 p-4 border border-anime-purple/30 rounded-lg bg-anime-purple/5">
<div class="mt-4 space-y-3">

<div class="text-cyan-400 font-bold">📂 Featured Projects:</div>
<div class="text-green-300 ml-4 space-y-1">
  <div>📱 <span class="text-accent-cyan">eviden</span> - Blockchain event attendance platform (Aptos + Move)</div>
  <div>🎨 <span class="text-accent-cyan">aptos-meme-nft</span> - Decentralized meme NFT minter on Aptos</div>
  <div>🤖 <span class="text-accent-cyan">intelligit</span> - AI-powered VS Code Git extension</div>
  <div>📱 <span class="text-accent-cyan">nutriwise</span> - Smart nutrition tracking app</div>
  <div>🔧 <span class="text-accent-cyan">android-device-cupida</span> - Device tree for Realme X7 Max</div>
  <div>⚙️ <span class="text-accent-cyan">kernel-cupida</span> - Custom kernel for Cupida device</div>
  <div>🌐 <span class="text-accent-cyan">portfolio-terminal</span> - This interactive terminal!</div>
</div>

<div class="mt-4 text-yellow-400">
💡 Use <span class="text-anime-purple font-semibold">'cat [project-name]'</span> to view detailed information about any project.
</div>

<div class="mt-3 text-accent-cyan">
🔗 More projects available at: <a href="https://github.com/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p</a>
</div>

</div>
</div>
</div>`;
        this.addToOutput(projectsText, '');
    }
    
    showContact() {
        const contactText = `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">📱 Contacts & Socials 📱</span>
<div class="mt-4 space-y-3">
  <div class="p-3 border border-anime-blue/30 rounded-lg bg-anime-blue/5">
    <span class="text-anime-blue font-semibold">📧 Primary:</span>
    <div class="mt-2 text-text-primary">
      <a href="mailto:n4bi10p@gmail.com" class="text-accent-cyan hover:text-anime-blue underline">n4bi10p@gmail.com</a>
    </div>
  </div>
  
  <div class="p-3 border border-anime-pink/30 rounded-lg bg-anime-pink/5">
    <span class="text-anime-pink font-semibold">🐈‍⬛ GitHub:</span>
    <div class="mt-2 text-text-primary">
      <a href="https://github.com/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-accent-cyan hover:text-anime-pink underline">github.com/n4bi10p</a>
    </div>
  </div>
  
  <div class="p-3 border border-accent-cyan/30 rounded-lg bg-accent-cyan/5">
    <span class="text-accent-cyan font-semibold">💼 LinkedIn:</span>
    <div class="mt-2 text-text-primary">
      <a href="https://linkedin.com/in/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-accent-cyan hover:text-anime-blue underline">linkedin.com/in/n4bi10p</a>
    </div>
  </div>
  
  <div class="p-3 border border-accent-purple/30 rounded-lg bg-accent-purple/5">
    <span class="text-accent-purple font-semibold">🎌 Discord:</span>
    <div class="mt-2 text-text-primary">
      <a href="https://discord.com/users/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-accent-cyan hover:text-accent-purple underline">@n4bi10p</a>
    </div>
  </div>
  
  <div class="p-3 border border-blue-400/30 rounded-lg bg-blue-400/5">
    <span class="text-blue-400 font-semibold">📱 Telegram:</span>
    <div class="mt-2 text-text-primary">
      <a href="https://t.me/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-accent-cyan hover:text-blue-400 underline">@n4bi10p</a>
    </div>
  </div>
  
  <div class="p-3 border border-gray-400/30 rounded-lg bg-gray-400/5">
    <span class="text-gray-400 font-semibold">🐦 X (Twitter):</span>
    <div class="mt-2 text-text-primary">
      <a href="https://x.com/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-accent-cyan hover:text-gray-400 underline">@n4bi10p</a>
    </div>
  </div>
  
  <div class="mt-4 text-center">
    <span class="text-anime-purple">✨ Always open to new opportunities and collaborations! ✨</span>
  </div>
</div>
</div>`;
        this.addToOutput(contactText, '');
    }
    
    handleSudo(args) {
        const subCommand = args.join(' ');
        
        if (subCommand === 'rm -rf /') {
            this.triggerGlitchEffect();
        } else {
            this.addToOutput('[sudo] password for nabil: ', 'text-yellow-400');
            setTimeout(() => {
                this.addToOutput('Sorry, user nabil is not in the sudoers file. This incident will be reported.', 'text-red-400');
            }, 1000);
        }
    }
    
    showFlex() {
        const flexText = `
<span class="text-purple-400 font-bold">🏆 Achievement Showcase</span>
<span class="text-green-300">
CTF Competitions:
  🥇 CyberApocalypse 2024 - 15th Place
  🥈 PicoCTF 2024 - Top 100
  🥉 HackTheBox - Pro Hacker Rank
  
Bug Bounties:
  💰 $2,500 - Critical RCE Discovery
  💰 $1,200 - SQL Injection Chain
  💰 $800  - Authentication Bypass
  
Certifications & Training:
  🎓 eLearnSecurity Certified Professional
  🎓 TryHackMe Top 1% User
  🎓 Over9000 Hours of Practical Training
  
Special Recognition:
  🌟 CVE Contributor (3 discoveries)
  🌟 Open Source Security Tool Contributor
  🌟 Cybersecurity Conference Speaker
</span>`;
        this.addToOutput(flexText, '');
    }
    
    readFile(filename) {
        const files = {
            'eviden': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">📱 Eviden</span>
<div class="mt-3 p-4 border border-anime-blue/30 rounded-lg bg-anime-blue/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">🔗 Blockchain-powered event attendance & verification platform</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Tech Stack:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">Frontend:</span> React + TypeScript, Tailwind, Framer Motion</div>
  <div>• <span class="text-accent-cyan">Backend:</span> Node.js + Express, JWT, Socket.IO, file uploads</div>
  <div>• <span class="text-accent-cyan">Blockchain:</span> Aptos using Move smart contracts</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Create/browse events with geolocation check-in</div>
  <div>• QR code & time-based validation</div>
  <div>• Peer validation system</div>
  <div>• NFT certificates upon confirmation</div>
  <div>• Immutable blockchain attendance records</div>
</div>
</div>

<div class="mt-3 text-yellow-400">
💡 <span class="text-text-primary">Bridges Web2 event management with Web3 proofs for anti-fraud guarantees</span>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p/Eviden" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p/Eviden</a></div>
</div>
</div>
</div>`,
            'aptos-meme-nft': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">🎨 Aptos Meme NFT Minter</span>
<div class="mt-3 p-4 border border-anime-pink/30 rounded-lg bg-anime-pink/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">🖼️ Decentralized meme-to-NFT platform on Aptos blockchain</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Tech Stack:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">Smart Contracts:</span> Move language on Aptos</div>
  <div>• <span class="text-accent-cyan">Storage:</span> IPFS for decentralized metadata & images</div>
  <div>• <span class="text-accent-cyan">Frontend:</span> Web3 integration with Aptos wallets</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Upload memes, add captions/tags, mint NFTs</div>
  <div>• Duplicate detection using hashing algorithms</div>
  <div>• Image compression & optimization</div>
  <div>• User profile system with category/tag filtering</div>
  <div>• Wallet integration for transaction signing</div>
</div>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p/aptos-meme-nft-minter" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p/aptos-meme-nft-minter</a></div>
</div>
</div>
</div>`,
            'intelligit': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">🤖 IntelliGit</span>
<div class="mt-3 p-4 border border-accent-cyan/30 rounded-lg bg-accent-cyan/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">🚀 AI-powered VS Code extension & web companion for Git workflows</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Tech Stack:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">AI:</span> Google Gemini 1.5 Pro integration</div>
  <div>• <span class="text-accent-cyan">Frontend:</span> Next.js, React, Tailwind CSS</div>
  <div>• <span class="text-accent-cyan">Extension:</span> VS Code Extension API</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Automated changelog generation (grouping commits by type)</div>
  <div>• README generation from code analysis & project metadata</div>
  <div>• AI-assisted refactoring & commit message suggestions</div>
  <div>• PR automation & Git status explanations</div>
  <div>• Integrated commit/push/PR control from UI</div>
</div>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p/intelligit" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p/intelligit</a></div>
</div>
</div>
</div>`,
            'nutriwise': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">🥗 NutriWise</span>
<div class="mt-3 p-4 border border-green-400/30 rounded-lg bg-green-400/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">🍎 Smart nutrition tracking & health analytics platform</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Tech Stack:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">ML/AI:</span> Image processing for meal analysis</div>
  <div>• <span class="text-accent-cyan">APIs:</span> Health & nutrition data integration</div>
  <div>• <span class="text-accent-cyan">Backend:</span> REST API for user tracking</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Meal logging with image analysis</div>
  <div>• Diet plan suggestions & nutrient tracking</div>
  <div>• User interface for viewing health metrics</div>
  <div>• Database integration for historical data</div>
</div>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p/NutriWise" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p/NutriWise</a></div>
</div>
</div>
</div>`,
            'android-device-cupida': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">📱 Android Device Cupida</span>
<div class="mt-3 p-4 border border-yellow-400/30 rounded-lg bg-yellow-400/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">🔧 Device tree for Realme X7 Max series (Oplus Cupida)</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Tech Stack:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">Base:</span> LineageOS 22.2 branch</div>
  <div>• <span class="text-accent-cyan">Build System:</span> Android.mk, device.mk, BoardConfig.mk</div>
  <div>• <span class="text-accent-cyan">Hardware:</span> HAL & firmware integration</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Configuration files for custom ROM building</div>
  <div>• Proprietary blob extraction scripts</div>
  <div>• Hardware abstraction layer linking</div>
  <div>• Camera, sensors & device feature enablement</div>
</div>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p/android_device_oplus_cupida" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p/android_device_oplus_cupida</a></div>
</div>
</div>
</div>`,
            'kernel-cupida': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">⚙️ Kernel Cupida</span>
<div class="mt-3 p-4 border border-red-400/30 rounded-lg bg-red-400/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">🔩 Custom kernel source for Realme X7 Max (Cupida) device</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Components:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">Patches:</span> Kernel modifications & enhancements</div>
  <div>• <span class="text-accent-cyan">Drivers:</span> Hardware driver modifications</div>
  <div>• <span class="text-accent-cyan">Config:</span> Device-specific configuration files</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Device stability improvements</div>
  <div>• Custom hardware feature enablement</div>
  <div>• Performance optimizations</div>
  <div>• Integration with custom ROMs</div>
</div>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p/kernel_cupida" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p/kernel_cupida</a></div>
</div>
</div>
</div>`,
            'portfolio-terminal': `
<div class="command-output">
<span class="text-anime-purple font-bold text-lg">🌐 Portfolio Terminal</span>
<div class="mt-3 p-4 border border-anime-purple/30 rounded-lg bg-anime-purple/5">
<div class="text-text-primary">
<div class="text-accent-cyan font-semibold mb-2">💻 This interactive terminal portfolio you're using right now!</div>

<div class="mt-3">
<span class="text-anime-pink font-semibold">🛠️ Tech Stack:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• <span class="text-accent-cyan">Frontend:</span> HTML5, Tailwind CSS, Vanilla JavaScript</div>
  <div>• <span class="text-accent-cyan">Features:</span> Terminal emulation with command history</div>
  <div>• <span class="text-accent-cyan">Design:</span> Anime-inspired cyberpunk aesthetics</div>
</div>
</div>

<div class="mt-3">
<span class="text-anime-blue font-semibold">✨ Features:</span>
<div class="ml-4 mt-1 space-y-1">
  <div>• Full terminal command simulation</div>
  <div>• Responsive design for all devices</div>
  <div>• Hidden easter eggs & achievements</div>
  <div>• Interactive project exploration</div>
</div>
</div>

<div class="mt-3 text-yellow-400">
📊 <span class="text-text-primary">Lines of Code: ~1200+ | Easter Eggs: 7+ hidden features</span>
</div>

<div class="mt-3 text-accent-purple">🔗 Repository: <a href="https://github.com/n4bi10p" target="_blank" rel="noopener noreferrer" class="text-anime-blue hover:text-accent-cyan underline">github.com/n4bi10p</a></div>
</div>
</div>
</div>`,
            'secrets/flag.txt': `
<span class="text-yellow-400 font-bold">🏁 CTF FLAG DISCOVERED!</span>
<span class="text-green-300">
flag{n4b1l_15_4_l337_h4ck3r_2024}

🎉 Congratulations! You found the hidden flag!
This demonstrates your curiosity and attention to detail.
Essential qualities for any cybersecurity professional.
</span>`
        };
        
        if (files[filename]) {
            this.addToOutput(files[filename], '');
        } else {
            this.addToOutput(`cat: ${filename}: No such file or directory`, 'text-red-400');
        }
    }
    
    handleSSH(args) {
        const target = args.join(' ');
        if (target === 'root@nabil.sh') {
            this.addToOutput('Connecting to nabil.sh...', 'text-yellow-400');
            setTimeout(() => {
                this.addToOutput('🔐 SSH Key Authentication Successful', 'text-green-400');
                this.addToOutput('Welcome to Nabil\'s Private Server!', 'text-cyan-400');
            }, 2000);
        } else {
            this.addToOutput(`ssh: connect to host ${target} port 22: Connection refused`, 'text-red-400');
        }
    }
    
    clearTerminal() {
        document.getElementById('terminal-output').innerHTML = '';
    }
    
    listDirectory() {
        // Call the same help content but with different context
        this.showHelp();
    }
    
    showCurrentDir() {
        this.addToOutput(`/home/nabil${this.currentDirectory === '~' ? '' : '/' + this.currentDirectory}`, 'text-green-400');
    }
    
    showHistory() {
        this.commandHistory.forEach((cmd, index) => {
            this.addToOutput(`${index + 1}  ${cmd}`, 'text-gray-400');
        });
    }
    
    showDate() {
        const now = new Date();
        this.addToOutput(now.toLocaleString(), 'text-green-400');
    }
    
    showSystemInfo() {
        this.addToOutput('Linux nabil-workstation 5.15.0-kali3-amd64 #1 SMP Debian 5.15.15-2kali1 x86_64 GNU/Linux', 'text-green-400');
    }
    
    showProcesses() {
        const processes = `
<span class="text-green-300">  PID TTY          TIME CMD</span>
<span class="text-white"> 1337 pts/0    00:00:42 portfolio-terminal</span>
<span class="text-white"> 1338 pts/0    00:01:15 nmap</span>
<span class="text-white"> 1339 pts/0    00:00:03 wireshark</span>
<span class="text-white"> 1340 pts/0    00:02:30 metasploit</span>`;
        this.addToOutput(processes, '');
    }
    
    showNeofetch() {
        const neofetch = `
<div class="command-output">
<pre class="text-cyan-400 font-mono text-sm leading-tight">
                   -\`                    <span class="text-green-400">nabil@blackrose</span>
                  .o+\`                   <span class="text-white">--------------</span>
                 \`ooo/                   <span class="text-green-400">OS:</span> Arch Linux x86_64
                \`+oooo:                  <span class="text-green-400">Host:</span> BlackRose
               \`+oooooo:                 <span class="text-green-400">Kernel:</span> 6.10.10-arch1-1
               -+oooooo+:                <span class="text-green-400">Uptime:</span> 7 hours, 4 mins
             \`/:-:++oooo+:              <span class="text-green-400">Packages:</span> 1970 (pacman), 57 (flatpak)
            \`/++++/+++++++:             <span class="text-green-400">Shell:</span> zsh 5.9
           \`/++++++++++++++:            <span class="text-green-400">Resolution:</span> 1920x1080
          \`/+++ooooooooooooo/\`         <span class="text-green-400">WM:</span> Hyprland
         ./ooosssso++osssssso+\`        <span class="text-green-400">Theme:</span> Adwaita [GTK2/3]
        .oossssso-\`\`\`\`/ossssss+\`       <span class="text-green-400">Icons:</span> Papirus-Dark [GTK2/3]
       -osssssso.      :ssssssso.      <span class="text-green-400">Terminal:</span> kitty
      :osssssss/        osssso+++.     <span class="text-green-400">CPU:</span> Intel i5-11400H (12) @ 4.50GHz
     /ossssssss/        +ssssooo/-     <span class="text-green-400">GPU:</span> NVIDIA GeForce GTX 1650 Mobile / Max-Q
   \`/ossssso+/:-        -:/+osssso+-   <span class="text-green-400">Memory:</span> 6626MiB / 31797MiB
  \`+sso+:-\`                 \`.-/+oso:  
 \`++:.                           \`-/+/ <span class="text-red-400">█</span><span class="text-green-400">█</span><span class="text-yellow-400">█</span><span class="text-blue-400">█</span><span class="text-purple-400">█</span><span class="text-cyan-400">█</span><span class="text-white">█</span><span class="text-gray-400">█</span>
 .\`                                 \`/ 
</pre>
</div>`;
        this.addToOutput(neofetch, '');
    }
    
    matrixEffect() {
        const matrixChars = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=',
            '[', ']', '{', '}', '|', '\\', ':', ';', '"', "'", '<', '>', ',',
            '.', '?', '/', '~', '`'
        ];
        
        // Generate lines one by one with falling animation
        let matrixLines = [];
        for (let i = 0; i < 15; i++) {
            let line = '';
            for (let j = 0; j < 80; j++) {
                line += matrixChars[Math.floor(Math.random() * matrixChars.length)] + ' ';
            }
            matrixLines.push(line);
        }
        
        let lineIndex = 0;
        const matrixInterval = setInterval(() => {
            if (lineIndex < matrixLines.length) {
                this.addToOutput(
                    `<pre class="text-green-400 font-mono text-xs leading-tight animate-pulse">${matrixLines[lineIndex]}</pre>`, 
                    ''
                );
                lineIndex++;
            } else {
                clearInterval(matrixInterval);
                // Add a small pause then show completion message
                setTimeout(() => {
                    this.addToOutput('<div class="text-green-400 font-mono text-center mt-2">[ MATRIX BREACH COMPLETE ]</div>', '');
                }, 500);
            }
        }, 150);
    }
    
    cowsay(message) {
        const cow = `
<div class="command-output">
<pre class="text-anime-pink font-mono">
 ${'-'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
</pre>
<div class="text-accent-cyan text-sm mt-2">🐄 Moo! The anime cow has spoken! ✨</div>
</div>`;
        this.addToOutput(cow, '');
    }
    
    triggerGlitchEffect() {
        const overlay = document.getElementById('glitch-overlay');
        overlay.classList.remove('hidden');
        
        // Play glitch sound effect (if available)
        this.addToOutput('⚠️  CRITICAL ERROR: PERMISSION DENIED', 'text-red-400 animate-pulse');
        this.addToOutput('System protection activated. Nice try diddy! 😏', 'text-yellow-400');
        
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 2000);
    }
    
    navigateHistory(direction) {
        const input = document.getElementById('command-input');
        
        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--;
            input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 1 && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 1 && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            input.value = '';
        }
    }
    
    handleAutoComplete(input) {
        const commands = ['help', 'whoami', 'skills', 'projects', 'contact', 'sudo', 'clear', 'ls', 'cat', 'ssh', 'pwd', 'cd', 'history', 'date', 'uname', 'ps', 'neofetch', 'matrix', 'cowsay'];
        const currentValue = input.value.toLowerCase();
        
        const matches = commands.filter(cmd => cmd.startsWith(currentValue));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.addToOutput(matches.join('  '), 'text-cyan-400');
        }
    }
    
    addToOutput(text, className = 'text-text-primary') {
        const output = document.getElementById('terminal-output');
        const div = document.createElement('div');
        div.className = `${className} animate-fade-in`;
        div.innerHTML = text;
        output.appendChild(div);
        this.scrollToBottom();
    }
    
    typeText(text, className = 'text-accent-purple', speed = 30) {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const output = document.getElementById('terminal-output');
        const div = document.createElement('div');
        div.className = `${className} animate-fade-in typing-indicator`;
        output.appendChild(div);
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                div.textContent += text[i];
                i++;
            } else {
                clearInterval(timer);
                div.classList.remove('typing-indicator');
                this.isTyping = false;
            }
        }, speed);
        
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        const output = document.getElementById('terminal-output');
        output.scrollTop = output.scrollHeight;
    }
    
    focusInput() {
        const input = document.getElementById('command-input');
        input.focus();
    }
    
    updateTime() {
        const timeElement = document.getElementById('current-time');
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
        
        setInterval(() => {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString();
        }, 1000);
    }
    
    changeDirectory(dir) {
        if (!dir) {
            this.currentDirectory = '~';
        } else if (dir === '..') {
            this.currentDirectory = '~';
        } else if (['documents', 'projects', 'secrets'].includes(dir)) {
            this.currentDirectory = dir;
        } else {
            this.addToOutput(`cd: ${dir}: No such file or directory`, 'text-red-400');
            return;
        }
        
        this.addToOutput(`Changed directory to ${this.currentDirectory}`, 'text-green-400');
    }
    
    // Additional command implementations
    figlet(text) {
        const figletText = `
<span class="text-cyan-400">
 ███▄    █  ▄▄▄       ▄▄▄▄    ██▓ ██▓    
 ██ ▀█   █ ▒████▄    ▓█████▄ ▓██▒▓██▒    
▓██  ▀█ ██▒▒██  ▀█▄  ▒██▒ ▄██▒██▒▒██░    
▓██▒  ▐▌██▒░██▄▄▄▄██ ▒██░█▀  ░██░▒██░    
▒██░   ▓██░ ▓█   ▓██▒░▓█  ▀█▓░██░░██████▒
░ ▒░   ▒ ▒  ▒▒   ▓▒█░░▒▓███▀▒░▓  ░ ▒░▓  ░
░ ░░   ░ ▒░  ▒   ▒▒ ░▒░▒   ░  ▒ ░░ ░ ▒  ░
   ░   ░ ░   ░   ▒    ░    ░  ▒ ░  ░ ░   
         ░       ░  ░ ░       ░      ░  ░
                           ░              
</span>`;
        this.addToOutput(figletText, '');
    }
    
    fortune() {
        const fortunes = [
            "The best way to predict the future is to invent it. - Alan Kay",
            "Security is not a product, but a process. - Bruce Schneier",
            "The only truly secure system is one that is powered off. - Gene Spafford",
            "Knowledge is power, but power without purpose is meaningless.",
            "In cybersecurity, paranoia is just good practice.",
            "A bug is never just a mistake. It represents something bigger. An error of thinking.",
            "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.",
            "Hackers solve problems and build things, and they believe in freedom and mutual aid."
        ];
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        this.addToOutput(`💭 ${randomFortune}`, 'text-yellow-400');
    }
    
    steamLocomotive() {
        const train = `
<span class="text-white">
                         (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O
                    (   )
                (@@@@)
             (    )
           (@@@)
        ====        ________                ___________
    _D _|  |_______/        \\__I_I_____===__|_________|
     |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
     /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
    |      |  |   H  |__--------------------| [___] |   =|                        |
    | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
    |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
  __/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
   |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
    \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/
</span>`;
        this.typeText(train, 'text-white animate-pulse', 30);
    }
    
    showTree() {
        const tree = `
<span class="text-green-300">
.
├── documents/
│   ├── resume.pdf
│   ├── certifications/
│   │   ├── CEH.pdf
│   │   └── OSCP.pdf
│   └── research/
├── projects/
│   ├── vulnerability-scanner/
│   ├── network-forensics-tool/
│   ├── ctf-writeups/
│   └── malware-lab/
├── secrets/
│   └── flag.txt
├── .bashrc
├── .vimrc
└── portfolio-terminal.html
</span>`;
        this.addToOutput(tree, '');
    }
    
    pingHost(host) {
        this.addToOutput(`PING ${host} (192.168.1.1): 56 data bytes`, 'text-green-400');
        let count = 0;
        const interval = setInterval(() => {
            count++;
            const time = (Math.random() * 50 + 10).toFixed(1);
            this.addToOutput(`64 bytes from ${host}: icmp_seq=${count} ttl=64 time=${time} ms`, 'text-green-300');
            
            if (count >= 4) {
                clearInterval(interval);
                this.addToOutput(`\n--- ${host} ping statistics ---`, 'text-cyan-400');
                this.addToOutput(`4 packets transmitted, 4 received, 0% packet loss`, 'text-green-400');
            }
        }, 1000);
    }
    
    nmapCommand(args) {
        const target = args[0] || 'localhost';
        this.addToOutput(`Starting Nmap scan on ${target}...`, 'text-cyan-400');
        
        setTimeout(() => {
            const scanResult = `
<span class="text-green-300">
Nmap scan report for ${target}
Host is up (0.00012s latency).
Not shown: 65530 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
8080/tcp open  http-proxy
3389/tcp open  ms-wbt-server

Nmap done: 1 IP address (1 host up) scanned in 2.15 seconds
</span>`;
            this.addToOutput(scanResult, '');
        }, 2000);
    }
    
    wiresharkCommand() {
        this.addToOutput('🦈 Starting Wireshark...', 'text-cyan-400');
        this.addToOutput('Capturing on interface eth0...', 'text-green-400');
        this.addToOutput('Packets captured: 1337 and counting...', 'text-yellow-400');
    }
    
    metasploitCommand() {
        const msfLogo = `
<span class="text-red-400">
 =[ metasploit v6.3.25-dev                          ]
+ -- --=[ 2328 exploits - 1219 auxiliary - 413 post       ]
+ -- --=[ 951 payloads - 45 encoders - 11 nops            ]
+ -- --=[ 9 evasion                                        ]

msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > exploit
</span>`;
        this.addToOutput(msfLogo, '');
    }
    
    sqlmapCommand(args) {
        const url = args[0] || 'http://example.com/vulnerable.php?id=1';
        this.addToOutput(`sqlmap.py -u "${url}"`, 'text-cyan-400');
        
        setTimeout(() => {
            this.addToOutput('🔍 Testing SQL injection vulnerabilities...', 'text-yellow-400');
            this.addToOutput('✅ Parameter "id" is vulnerable to SQL injection!', 'text-green-400');
            this.addToOutput('Database: MySQL 5.7.34', 'text-green-300');
        }, 2000);
    }
    
    johnCommand(args) {
        const hashFile = args[0] || 'passwords.txt';
        this.addToOutput(`John the Ripper - cracking ${hashFile}`, 'text-cyan-400');
        this.addToOutput('Loading hashes... Done!', 'text-green-400');
        this.addToOutput('🔓 Cracked: admin:password123', 'text-green-400');
        this.addToOutput('🔓 Cracked: user1:qwerty', 'text-green-400');
    }
    
    hashcatCommand(args) {
        this.addToOutput('hashcat - advanced password recovery', 'text-cyan-400');
        this.addToOutput('🔥 GPU acceleration enabled', 'text-green-400');
        this.addToOutput('Hash rate: 1,337,000 H/s', 'text-yellow-400');
    }
    
    gobusterCommand(args) {
        const url = args[0] || 'http://target.com';
        this.addToOutput(`Gobuster directory enumeration on ${url}`, 'text-cyan-400');
        this.addToOutput('Found: /admin (Status: 200)', 'text-green-400');
        this.addToOutput('Found: /backup (Status: 403)', 'text-yellow-400');
        this.addToOutput('Found: /config (Status: 200)', 'text-green-400');
    }
    
    hydraCommand(args) {
        this.addToOutput('THC-Hydra v9.3 starting...', 'text-cyan-400');
        this.addToOutput('🔨 Brute forcing SSH login...', 'text-yellow-400');
        this.addToOutput('✅ Login successful: admin:admin', 'text-green-400');
    }
    
    echoCommand(text) {
        this.addToOutput(text, 'text-green-400');
    }
    
    showEnvironment() {
        const env = `
<span class="text-green-300">
PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin
HOME=/home/nabil
USER=nabil
SHELL=/bin/zsh
TERM=xterm-256color
LANG=en_US.UTF-8
PWD=/home/nabil
EDITOR=vim
BROWSER=firefox
</span>`;
        this.addToOutput(env, '');
    }
    
    showTop() {
        const topOutput = `
<span class="text-green-300">
top - 14:30:15 up 13:37, 1 user, load average: 0.42, 0.37, 0.33
Tasks: 256 total, 2 running, 254 sleeping, 0 stopped, 0 zombie
%Cpu(s): 12.5 us, 3.2 sy, 0.0 ni, 84.1 id, 0.2 wa, 0.0 hi, 0.0 si, 0.0 st
MiB Mem: 32768.0 total, 24576.0 free, 6144.0 used, 2048.0 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1337 nabil     20   0  512.0m  128.0m   32.0m S  25.0   0.4   5:42.18 portfolio-term
 1338 nabil     20   0  256.0m   64.0m   16.0m S  12.5   0.2   2:15.33 firefox
 1339 nabil     20   0  128.0m   32.0m    8.0m S   6.2   0.1   1:08.67 code
</span>`;
        this.addToOutput(topOutput, '');
    }
    
    showMemory() {
        const memInfo = `
<span class="text-green-300">
               total        used        free      shared  buff/cache   available
Mem:       33554432     6291456    25165824      524288     2097152    26214400
Swap:       8388608           0     8388608
</span>`;
        this.addToOutput(memInfo, '');
    }
    
    showUptime() {
        const uptime = '14:30:15 up 13:37, 1 user, load average: 0.42, 0.37, 0.33';
        this.addToOutput(uptime, 'text-green-400');
    }
    
    showId() {
        this.addToOutput('uid=1000(nabil) gid=1000(nabil) groups=1000(nabil),4(adm),27(sudo),999(docker)', 'text-green-400');
    }
    
    showGroups() {
        this.addToOutput('nabil adm sudo docker', 'text-green-400');
    }
    
    diskFree() {
        const dfOutput = `
<span class="text-green-300">
Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/sda1     1048576000 524288000 524288000  50% /
tmpfs            8388608         0   8388608   0% /tmp
/dev/sda2     2097152000 104857600 1992294400   5% /home
</span>`;
        this.addToOutput(dfOutput, '');
    }
    
    gitCommand(args) {
        const subCmd = args[0];
        if (subCmd === 'status') {
            this.addToOutput('On branch main\nnothing to commit, working tree clean', 'text-green-400');
        } else if (subCmd === 'log') {
            this.addToOutput('commit 1337beef (HEAD -> main)\nAuthor: Nabil\nDate: Thu Jul 17 14:30:00 2024\n\n    Added terminal portfolio', 'text-green-400');
        } else {
            this.addToOutput(`git: '${subCmd}' is not a git command. See 'git --help'.`, 'text-red-400');
        }
    }
    
    vimCommand(file) {
        this.addToOutput('Starting vim...', 'text-cyan-400');
        this.addToOutput('Just kidding! This is a web terminal 😄', 'text-yellow-400');
        this.addToOutput('Use "code" command instead for VS Code experience', 'text-green-400');
    }
    
    codeCommand(file) {
        this.addToOutput('🎨 Opening VS Code...', 'text-cyan-400');
        this.addToOutput('Welcome to the matrix of code! 💻', 'text-green-400');
    }
    
    whoisCommand(domain) {
        const whoisResult = `
<span class="text-green-300">
Domain Name: ${domain || 'nabil.sh'}
Registry Domain ID: 2024071701337_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.com
Registrar URL: http://registrar.com
Updated Date: 2024-07-17T14:30:00Z
Creation Date: 2024-01-01T00:00:00Z
Registry Expiry Date: 2025-01-01T00:00:00Z
Registrant Name: Nabil
Registrant Country: CY
Name Server: NS1.CYBERSEC.LAB
Name Server: NS2.CYBERSEC.LAB
</span>`;
        this.addToOutput(whoisResult, '');
    }
    
    handleAutoComplete(input) {
        const commands = ['help', 'whoami', 'skills', 'projects', 'contact', 'sudo', 'clear', 'ls', 'cat', 'ssh', 'pwd', 'cd', 'history', 'date', 'uname', 'ps', 'neofetch', 'matrix', 'cowsay', 'figlet', 'fortune', 'sl', 'tree', 'ping', 'nmap', 'wireshark', 'metasploit', 'sqlmap', 'john', 'hashcat', 'gobuster', 'hydra', 'echo', 'env', 'top', 'free', 'uptime', 'id', 'groups', 'df', 'git', 'vim', 'code', 'whois', 'anime', 'kawaii', 'baka'];
        const currentValue = input.value.toLowerCase();
        
        const matches = commands.filter(cmd => cmd.startsWith(currentValue));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.addToOutput(`<div class="text-accent-cyan">${matches.join('  ')}</div>`, '');
        }
    }
    
    // Special anime commands
    animeCommand() {
        const animeQuotes = [
            "🌸 'Believe in yourself and create your own destiny!' - Naruto",
            "⭐ 'The world is not beautiful, therefore it is.' - Kino's Journey",
            "💫 'Even if we forget the faces of our friends, we will never forget the bonds that were carved into our souls.' - Bleach",
            "🎌 'If you don't take risks, you can't create a future.' - Monkey D. Luffy",
            "✨ 'Hard work is what makes your dreams come true!' - Rock Lee"
        ];
        
        const randomQuote = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];
        this.addToOutput(`<div class="command-output">
            <div class="text-anime-purple font-bold text-lg">🎌 Anime Wisdom 🎌</div>
            <div class="mt-3 p-4 border border-anime-pink/30 rounded-lg bg-anime-pink/5">
                <div class="text-text-primary italic">${randomQuote}</div>
            </div>
        </div>`, '');
    }
    
    kawaiiCommand() {
        const kawaiiArt = `<div class="command-output">
<div class="text-anime-pink font-bold text-lg">💖 Kawaii Mode Activated! 💖</div>
<div class="text-center mt-4">
<pre class="text-anime-purple font-mono">
    ♡( ◡   ‿   ◡ )♡
   ∩───∩
  ( ◕   ◡   ◕ )
 /               \\
(  ◕       ◕   )
 \\               /
  (◡   ◕   ◡)
</pre>
<div class="text-accent-cyan mt-2">Everything is kawaii desu! ♡</div>
</div>
</div>`;
        this.addToOutput(kawaiiArt, '');
        
        // Add some sparkle effects
        this.createTemporarySparkles();
    }
    
    bakaCommand() {
        const bakaText = `<div class="command-output">
            <div class="text-red-400 font-bold text-lg animate-bounce">🙄 Baka! 🙄</div>
            <div class="text-text-secondary mt-2">That's not a real command, you silly!</div>
            <div class="text-anime-blue mt-1">Try 'help' instead, ne? ✨</div>
        </div>`;
        this.addToOutput(bakaText, '');
    }
    
    createTemporarySparkles() {
        const container = document.getElementById('anime-characters');
        const sparkles = ['✨', '🌟', '⭐', '💫', '🌸', '💖'];
        
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'anime-character';
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '2rem';
            sparkle.style.animation = 'float 2s ease-in-out forwards';
            container.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => sparkle.remove(), 2000);
        }
    }
    
    // Theme System
    handleThemeCommand(args) {
        if (args.length === 0) {
            this.addToOutput(`
<div class="command-output">
<div class="text-center mb-4">
  <span class="text-anime-purple font-bold text-lg">🎨 Theme System</span>
</div>
<div class="p-4 border-2 border-anime-purple rounded-lg bg-anime-purple/10">
  <div class="text-accent-cyan mb-3">Current theme: <span class="text-anime-pink font-bold">${this.currentTheme}</span></div>
  <div class="text-gray-300 mb-2">Available themes:</div>
  <div class="space-y-1 ml-4">
    <div class="text-anime-purple">• anime - Cyberpunk anime theme (default)</div>
    <div class="text-gray-800">• light - Clean white and bright colors</div>
    <div class="text-green-400">• dark - Matrix green on black</div>
  </div>
  <div class="text-yellow-400 mt-3">Usage: theme [anime|light|dark]</div>
</div>
</div>`, '');
            return;
        }
        
        const theme = args[0].toLowerCase();
        if (['anime', 'light', 'dark'].includes(theme)) {
            this.switchTheme(theme);
        } else {
            this.addToOutput(`<div class="text-red-400">❌ Invalid theme: ${theme}. Use: anime, light, or dark</div>`, '');
        }
    }
    
    switchTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('terminal_theme', theme);
        
        this.addToOutput(`
<div class="command-output">
<div class="text-center p-4 border-2 border-green-400 rounded-lg bg-green-400/10">
  <div class="text-green-400 font-bold text-lg mb-2">✅ Theme Changed!</div>
  <div class="text-accent-cyan">Switching to <span class="font-bold">${theme}</span> theme...</div>
  <div class="text-gray-400 text-sm mt-2">Theme will apply in 2 seconds</div>
</div>
</div>`, '');
        
        // Apply theme with delay for smooth transition
        setTimeout(() => {
            this.applyTheme(theme);
        }, 2000);
    }
    
    applyTheme(theme) {
        const body = document.body;
        const terminalWindow = document.querySelector('.terminal-window');
        
        // Remove existing theme classes
        body.classList.remove('theme-anime', 'theme-light', 'theme-dark');
        
        // Add new theme class
        body.classList.add(`theme-${theme}`);
        
        // Apply theme-specific styles
        this.updateThemeStyles(theme);
        
        // Update welcome message based on theme
        this.updateWelcomeMessage(theme);
    }
    
    updateThemeStyles(theme) {
        // Remove existing theme stylesheet if exists
        const existingSheet = document.getElementById('theme-styles');
        if (existingSheet) {
            existingSheet.remove();
        }
        
        // Create new theme stylesheet
        const style = document.createElement('style');
        style.id = 'theme-styles';
        
        let css = '';
        
        switch (theme) {
            case 'light':
                css = `
                    .theme-light {
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%) !important;
                        color: #212529 !important;
                    }
                    .theme-light .anime-bg {
                        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%) !important;
                    }
                    .theme-light .anime-particles {
                        background: radial-gradient(circle, rgba(0,123,255,0.05) 0%, transparent 50%) !important;
                    }
                    .theme-light .terminal-window {
                        background: rgba(255, 255, 255, 0.95) !important;
                        border: 2px solid #6c757d !important;
                        box-shadow: 0 0 30px rgba(0, 123, 255, 0.3) !important;
                    }
                    .theme-light .window-controls {
                        background: rgba(248, 249, 250, 0.8) !important;
                        border-bottom: 1px solid #dee2e6 !important;
                    }
                    .theme-light .gradient-text {
                        background: linear-gradient(45deg, #007bff, #6610f2, #e83e8c, #fd7e14) !important;
                        -webkit-background-clip: text !important;
                        -webkit-text-fill-color: transparent !important;
                    }
                    .theme-light .text-accent-cyan { color: #17a2b8 !important; }
                    .theme-light .text-anime-purple { color: #6610f2 !important; }
                    .theme-light .text-anime-pink { color: #e83e8c !important; }
                    .theme-light .text-anime-blue { color: #007bff !important; }
                    .theme-light .text-text-primary { color: #212529 !important; }
                    .theme-light .text-text-secondary { color: #6c757d !important; }
                    .theme-light .terminal-prompt {
                        background: rgba(0, 123, 255, 0.1) !important;
                        border: 1px solid rgba(0, 123, 255, 0.3) !important;
                    }
                    .theme-light .border-anime-purple { border-color: #6610f2 !important; }
                    .theme-light .bg-anime-purple\/10 { background-color: rgba(102, 16, 242, 0.1) !important; }
                    .theme-light .profile-section {
                        background: rgba(255, 255, 255, 0.9) !important;
                        border: 1px solid #dee2e6 !important;
                        color: #212529 !important;
                    }
                    .theme-light .profile-name {
                        color: #212529 !important;
                        font-weight: 600 !important;
                    }
                    .theme-light .social-icon div {
                        background: rgba(255, 255, 255, 0.9) !important;
                        border: 1px solid #dee2e6 !important;
                    }
                `;
                break;
                
            case 'dark':
                css = `
                    .theme-dark {
                        background: #000000 !important;
                        color: #00ff00 !important;
                    }
                    .theme-dark .anime-bg {
                        background: #000000 !important;
                    }
                    .theme-dark .anime-particles {
                        background: radial-gradient(circle, rgba(0,255,0,0.05) 0%, transparent 50%) !important;
                    }
                    .theme-dark .terminal-window {
                        background: rgba(0, 0, 0, 0.95) !important;
                        border: 2px solid #00ff00 !important;
                        box-shadow: 0 0 30px rgba(0, 255, 0, 0.5) !important;
                    }
                    .theme-dark .window-controls {
                        background: rgba(0, 0, 0, 0.8) !important;
                        border-bottom: 1px solid #00ff00 !important;
                    }
                    .theme-dark .gradient-text {
                        background: linear-gradient(45deg, #00ff00, #32cd32, #7fff00, #9aff9a) !important;
                        -webkit-background-clip: text !important;
                        -webkit-text-fill-color: transparent !important;
                    }
                    .theme-dark .text-accent-cyan { color: #00ffff !important; }
                    .theme-dark .text-anime-purple { color: #00ff00 !important; }
                    .theme-dark .text-anime-pink { color: #7fff00 !important; }
                    .theme-dark .text-anime-blue { color: #32cd32 !important; }
                    .theme-dark .text-text-primary { color: #00ff00 !important; }
                    .theme-dark .text-text-secondary { color: #008000 !important; }
                    .theme-dark .terminal-prompt {
                        background: rgba(0, 255, 0, 0.1) !important;
                        border: 1px solid rgba(0, 255, 0, 0.3) !important;
                    }
                    .theme-dark .border-anime-purple { border-color: #00ff00 !important; }
                    .theme-dark .bg-anime-purple\/10 { background-color: rgba(0, 255, 0, 0.1) !important; }
                    .theme-dark .text-red-400 { color: #ff6b6b !important; }
                    .theme-dark .text-green-400 { color: #00ff00 !important; }
                    .theme-dark .text-yellow-400 { color: #ffff00 !important; }
                    .theme-dark .profile-section {
                        background: rgba(0, 0, 0, 0.9) !important;
                        border: 1px solid #00ff00 !important;
                        color: #00ff00 !important;
                    }
                    .theme-dark .social-icon div {
                        background: rgba(0, 0, 0, 0.9) !important;
                        border: 1px solid #00ff00 !important;
                    }
                    .theme-dark .social-icon svg {
                        color: #00ff00 !important;
                    }
                `;
                break;
                
            default: // anime theme
                css = `
                    .theme-anime {
                        background: linear-gradient(135deg, #0D1117 0%, #161B22 50%, #21262D 100%) !important;
                        color: #F0F6FC !important;
                    }
                    .theme-anime .anime-bg {
                        background: linear-gradient(135deg, #0D1117 0%, #161B22 50%, #21262D 100%) !important;
                    }
                    .theme-anime .anime-particles {
                        background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 50%) !important;
                    }
                `;
        }
        
        style.textContent = css;
        document.head.appendChild(style);
    }
    
    updateWelcomeMessage(theme) {
        const messages = {
            anime: '🎌 Anime theme activated! Welcome to the cyberpunk terminal! ✨',
            light: '☀️ Light theme activated! Clean and bright interface loaded! 💡',
            dark: '🌙 Dark theme activated! Welcome to the Matrix... 💚'
        };
        
        setTimeout(() => {
            this.addToOutput(`<div class="text-center text-lg font-bold animate-pulse">${messages[theme]}</div>`, '');
        }, 500);
    }
    handleViewCommand(args) {
        if (args.length === 0) {
            this.addToOutput(`
<div class="command-output">
<div class="text-red-400">❌ Usage: view [option]</div>
<div class="text-yellow-400 mt-2">Available options:</div>
<div class="text-gray-400 ml-4">• message - View stored messages (admin only)</div>
</div>`, '');
            return;
        }
        
        if (args[0] === 'message') {
            this.requestPassword();
        } else {
            this.addToOutput(`<div class="text-red-400">❌ Unknown option: ${args[0]}</div>`, '');
        }
    }
    
    requestPassword() {
        this.awaitingPassword = true;
        this.addToOutput(`
<div class="command-output">
<div class="text-center mb-4">
  <span class="text-anime-purple font-bold text-lg">🔐 Admin Access Required</span>
</div>
<div class="p-4 border-2 border-red-400 rounded-lg bg-red-400/10">
  <div class="text-red-400 font-semibold mb-2">⚠️ Restricted Area</div>
  <div class="text-gray-300 mb-2">This command requires administrator privileges.</div>
  <div class="text-anime-pink font-semibold">Enter password:</div>
  <div class="text-gray-400 text-sm mt-1">Type the admin password and press Enter</div>
</div>
</div>`, '');
    }
    
    handlePasswordInput(input) {
        const password = input.trim();
        
        if (password === 'gawd0p') {
            this.awaitingPassword = false;
            this.addToOutput(`
<div class="command-output">
<div class="text-green-400 font-bold mb-3">✅ Access Granted - Welcome Admin!</div>
</div>`, '');
            
            // Show messages after successful authentication
            setTimeout(() => {
                this.viewStoredMessages();
            }, 500);
        } else {
            this.awaitingPassword = false;
            this.addToOutput(`
<div class="command-output">
<div class="text-center p-4 border-2 border-red-400 rounded-lg bg-red-400/10">
  <div class="text-red-400 font-bold text-lg mb-2">❌ Access Denied</div>
  <div class="text-gray-300">Invalid password. This incident will be reported.</div>
  <div class="text-red-400 text-sm mt-2">🚨 Security Alert: Unauthorized access attempt detected</div>
</div>
</div>`, '');
        }
    }
    startContactForm() {
        this.contactFormStep = 'name';
        this.contactFormData = {};
        
        this.addToOutput(`
<div class="command-output">
<div class="text-center mb-4">
  <span class="text-anime-purple font-bold text-lg">📧 Contact Form</span>
</div>
<div class="p-4 border-2 border-anime-purple rounded-lg bg-anime-purple/10">
  <div class="text-accent-cyan mb-2">Let's get in touch! I'll ask you a few questions.</div>
  <div class="text-anime-pink font-semibold">What's your name?</div>
  <div class="text-gray-400 text-sm mt-1">Type your name and press Enter</div>
</div>
</div>`, '');
    }
    
    handleContactFormInput(input) {
        const value = input.trim();
        
        if (!value) {
            this.addToOutput('<div class="text-red-400">❌ Please enter a value</div>', '');
            return;
        }
        
        switch (this.contactFormStep) {
            case 'name':
                this.contactFormData.name = value;
                this.contactFormStep = 'email';
                this.addToOutput(`
<div class="command-output">
<div class="text-green-400">✅ Name: ${value}</div>
<div class="text-anime-pink font-semibold mt-3">What's your email address?</div>
<div class="text-gray-400 text-sm mt-1">Enter a valid email address</div>
</div>`, '');
                break;
                
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.addToOutput('<div class="text-red-400">❌ Please enter a valid email address</div>', '');
                    return;
                }
                this.contactFormData.email = value;
                this.contactFormStep = 'subject';
                this.addToOutput(`
<div class="command-output">
<div class="text-green-400">✅ Email: ${value}</div>
<div class="text-anime-pink font-semibold mt-3">What's the subject of your message?</div>
<div class="text-gray-400 text-sm mt-1">Enter a brief subject line</div>
</div>`, '');
                break;
                
            case 'subject':
                this.contactFormData.subject = value;
                this.contactFormStep = 'message';
                this.addToOutput(`
<div class="command-output">
<div class="text-green-400">✅ Subject: ${value}</div>
<div class="text-anime-pink font-semibold mt-3">What's your message?</div>
<div class="text-gray-400 text-sm mt-1">Type your message (can be multiple lines)</div>
</div>`, '');
                break;
                
            case 'message':
                this.contactFormData.message = value;
                this.contactFormData.timestamp = new Date().toISOString();
                this.contactFormData.id = Date.now();
                
                // Save message to localStorage
                this.saveMessage(this.contactFormData);
                
                this.addToOutput(`
<div class="command-output">
<div class="text-center p-4 border-2 border-green-400 rounded-lg bg-green-400/10">
  <div class="text-green-400 font-bold text-lg mb-2">✅ Message Sent Successfully!</div>
  <div class="text-accent-cyan mb-3">Thank you ${this.contactFormData.name}! Your message has been received.</div>
  <div class="text-gray-300 text-sm">
    <div><strong>Name:</strong> ${this.contactFormData.name}</div>
    <div><strong>Email:</strong> ${this.contactFormData.email}</div>
    <div><strong>Subject:</strong> ${this.contactFormData.subject}</div>
    <div><strong>Message:</strong> ${this.contactFormData.message}</div>
  </div>
  <div class="text-anime-purple mt-3">I'll get back to you soon! 🚀</div>
</div>
</div>`, '');
                
                // Reset form
                this.contactFormStep = null;
                this.contactFormData = null;
                break;
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    saveMessage(messageData) {
        let messages = [];
        try {
            const stored = localStorage.getItem('portfolio_messages');
            if (stored) {
                messages = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading messages:', e);
        }
        
        messages.push(messageData);
        
        try {
            localStorage.setItem('portfolio_messages', JSON.stringify(messages));
        } catch (e) {
            console.error('Error saving message:', e);
        }
    }
    
    viewStoredMessages() {
        let messages = [];
        try {
            const stored = localStorage.getItem('portfolio_messages');
            if (stored) {
                messages = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error loading messages:', e);
        }
        
        if (messages.length === 0) {
            this.addToOutput(`
<div class="command-output">
<div class="text-center p-4 border-2 border-anime-blue rounded-lg bg-anime-blue/10">
  <div class="text-anime-blue font-bold text-lg">📪 No Messages</div>
  <div class="text-gray-400 mt-2">No messages have been received yet.</div>
</div>
</div>`, '');
            return;
        }
        
        let output = `
<div class="command-output">
<div class="text-center mb-4">
  <span class="text-anime-purple font-bold text-lg">🔐 Admin Panel - Messages (${messages.length})</span>
</div>
<div class="space-y-4">`;
        
        messages.reverse().forEach((msg, index) => {
            const date = new Date(msg.timestamp).toLocaleString();
            output += `
<div class="p-4 border-2 border-accent-cyan rounded-lg bg-accent-cyan/10">
  <div class="flex justify-between items-start mb-2">
    <div class="text-accent-cyan font-semibold">Message #${msg.id}</div>
    <div class="text-gray-400 text-sm">${date}</div>
  </div>
  <div class="space-y-2 text-sm">
    <div><span class="text-anime-pink font-semibold">Name:</span> <span class="text-white">${msg.name}</span></div>
    <div><span class="text-anime-pink font-semibold">Email:</span> <span class="text-white">${msg.email}</span></div>
    <div><span class="text-anime-pink font-semibold">Subject:</span> <span class="text-white">${msg.subject}</span></div>
    <div><span class="text-anime-pink font-semibold">Message:</span></div>
    <div class="text-gray-300 pl-4 border-l-2 border-anime-purple/50">${msg.message}</div>
  </div>
</div>`;
        });
        
        output += `
</div>
<div class="mt-4 text-center">
  <div class="text-anime-purple text-sm">🔒 Secret admin command - messages are stored locally</div>
</div>
</div>`;
        
        this.addToOutput(output, '');
    }
}

// Initialize the terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TerminalPortfolio();
});

// Handle mobile responsiveness
window.addEventListener('resize', () => {
    const input = document.getElementById('command-input');
    if (window.innerWidth <= 768) {
        input.placeholder = 'Tap to type...';
    } else {
        input.placeholder = 'Type a command...';
    }
});

// Add some easter egg key combinations
document.addEventListener('keydown', (e) => {
    // Konami Code Easter Egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    if (!window.konamiIndex) window.konamiIndex = 0;
    
    if (e.keyCode === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            window.konamiIndex = 0;
            document.getElementById('terminal-output').innerHTML += 
                '<div class="text-rainbow animate-bounce">🌈 KONAMI CODE ACTIVATED! You are now in God Mode! 🌈</div>';
        }
    } else {
        window.konamiIndex = 0;
    }
});
