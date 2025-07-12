class DaishuGokumonGame {
    constructor() {
        this.gameState = 'menu'; // menu, playing, ended
        this.currentScenario = null;
        this.currentPhase = 0;
        this.currentDialogue = 0;
        this.mood = 0; // -100 to +100
        this.evidenceList = [];
        this.timeLeft = 30;
        this.timer = null;
        this.playerName = '';
        
        this.elements = {
            sceneDescription: document.getElementById('scene-description'),
            speakerName: document.getElementById('speaker-name'),
            dialogueText: document.getElementById('dialogue-text'),
            questionText: document.getElementById('question-text'),
            evidenceDisplay: document.getElementById('evidence-display'),
            playerInput: document.getElementById('player-input'),
            submitBtn: document.getElementById('submit-btn'),
            timer: document.getElementById('timer'),
            moodFill: document.getElementById('mood-fill'),
            moodText: document.getElementById('mood-text'),
            crimeDescription: document.getElementById('crime-description'),
            evidenceItems: document.getElementById('evidence-items'),
            endingScreen: document.getElementById('ending-screen'),
            endingTitle: document.getElementById('ending-title'),
            endingText: document.getElementById('ending-text')
        };
        
        this.setupEventListeners();
        this.hideGameElements();
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn').addEventListener('click', () => this.loadGame());
        this.elements.submitBtn.addEventListener('click', () => this.submitAnswer());
        document.getElementById('restart-btn').addEventListener('click', () => this.resetGame());
        
        // Enter key for submit
        this.elements.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitAnswer();
            }
        });
    }
    
    async startGame() {
        try {
            const response = await fetch('data/scenario1.json');
            this.currentScenario = await response.json();
            this.initializeGame();
        } catch (error) {
            console.error('シナリオデータの読み込みに失敗しました:', error);
            alert('ゲームデータの読み込みに失敗しました。');
        }
    }
    
    initializeGame() {
        this.gameState = 'playing';
        this.currentPhase = 0;
        this.currentDialogue = 0;
        this.mood = this.currentScenario.initialMood || 0;
        this.evidenceList = [];
        this.timeLeft = this.currentScenario.timeLimit || 30;
        
        this.showGameElements();
        this.updateCrimeInfo();
        this.updateMoodDisplay();
        this.startPhase();
    }
    
    startPhase() {
        const phase = this.currentScenario.phases[this.currentPhase];
        if (!phase) {
            this.endGame();
            return;
        }
        
        this.currentDialogue = 0;
        this.elements.sceneDescription.textContent = phase.background || '';
        this.showNextDialogue();
    }
    
    showNextDialogue() {
        const phase = this.currentScenario.phases[this.currentPhase];
        
        if (this.currentDialogue < phase.dialogue.length) {
            const dialogue = phase.dialogue[this.currentDialogue];
            this.elements.speakerName.textContent = dialogue.speaker;
            this.elements.dialogueText.textContent = dialogue.text;
            this.currentDialogue++;
            
            setTimeout(() => this.showNextDialogue(), 2000);
        } else {
            this.showQuestion();
        }
    }
    
    showQuestion() {
        const phase = this.currentScenario.phases[this.currentPhase];
        const question = phase.question;
        
        this.elements.questionText.textContent = question.text;
        
        if (question.evidence) {
            this.elements.evidenceDisplay.textContent = `証拠品: ${question.evidence}`;
            this.elements.evidenceDisplay.style.display = 'block';
            this.addEvidence(question.evidence);
        }
        
        this.elements.playerInput.style.display = 'block';
        this.elements.submitBtn.style.display = 'block';
        this.elements.playerInput.focus();
        
        this.startTimer();
    }
    
    startTimer() {
        this.timeLeft = this.currentScenario.timeLimit || 30;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    timeUp() {
        this.stopTimer();
        this.mood -= 10;
        this.updateMoodDisplay();
        
        this.elements.speakerName.textContent = '御奉行';
        this.elements.dialogueText.textContent = '時間切れじゃ！答えぬとは不届きな！';
        
        setTimeout(() => this.nextPhase(), 2000);
    }
    
    submitAnswer() {
        if (this.gameState !== 'playing') return;
        
        const answer = this.elements.playerInput.value.trim();
        if (!answer) {
            alert('回答を入力してください。');
            return;
        }
        
        this.stopTimer();
        this.processAnswer(answer);
        this.elements.playerInput.value = '';
        this.elements.playerInput.style.display = 'none';
        this.elements.submitBtn.style.display = 'none';
        this.elements.evidenceDisplay.style.display = 'none';
    }
    
    processAnswer(answer) {
        const phase = this.currentScenario.phases[this.currentPhase];
        const question = phase.question;
        
        let response = question.defaultResponse;
        let moodChange = response.moodChange;
        
        // キーワードマッチング
        for (const responseOption of question.responses) {
            for (const keyword of responseOption.keywords) {
                if (answer.includes(keyword)) {
                    response = responseOption;
                    moodChange = responseOption.moodChange;
                    break;
                }
            }
            if (response !== question.defaultResponse) break;
        }
        
        // 特別な処理（名前の記録など）
        if (this.currentPhase === 0 && !this.playerName) {
            this.playerName = answer;
        }
        
        this.mood += moodChange;
        this.mood = Math.max(-100, Math.min(100, this.mood));
        this.updateMoodDisplay();
        
        this.elements.speakerName.textContent = '御奉行';
        this.elements.dialogueText.textContent = response.reply;
        
        setTimeout(() => this.nextPhase(), 3000);
    }
    
    nextPhase() {
        this.currentPhase++;
        if (this.currentPhase < this.currentScenario.phases.length) {
            this.startPhase();
        } else {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameState = 'ended';
        this.stopTimer();
        
        const ending = this.determineEnding();
        this.showEnding(ending);
    }
    
    determineEnding() {
        const endings = this.currentScenario.endings;
        const endingKeys = Object.keys(endings).sort((a, b) => 
            endings[b].minMood - endings[a].minMood
        );
        
        for (const key of endingKeys) {
            if (this.mood >= endings[key].minMood) {
                return endings[key];
            }
        }
        
        return endings[endingKeys[endingKeys.length - 1]];
    }
    
    showEnding(ending) {
        this.elements.endingTitle.textContent = ending.title;
        this.elements.endingText.textContent = ending.text;
        this.elements.endingScreen.classList.remove('hidden');
    }
    
    updateMoodDisplay() {
        const percentage = ((this.mood + 100) / 200) * 100;
        this.elements.moodFill.style.width = `${percentage}%`;
        
        let moodText = '普通';
        if (this.mood >= 50) moodText = '非常に良い';
        else if (this.mood >= 20) moodText = '良い';
        else if (this.mood >= -20) moodText = '普通';
        else if (this.mood >= -50) moodText = '悪い';
        else moodText = '非常に悪い';
        
        this.elements.moodText.textContent = moodText;
    }
    
    updateCrimeInfo() {
        this.elements.crimeDescription.textContent = 
            `${this.currentScenario.crime} - ${this.currentScenario.description}`;
    }
    
    updateTimer() {
        this.elements.timer.textContent = this.timeLeft;
        
        if (this.timeLeft <= 5) {
            this.elements.timer.style.color = '#dc143c';
            this.elements.timer.style.fontWeight = 'bold';
        } else {
            this.elements.timer.style.color = '#dc143c';
            this.elements.timer.style.fontWeight = 'normal';
        }
    }
    
    addEvidence(evidence) {
        if (!this.evidenceList.includes(evidence)) {
            this.evidenceList.push(evidence);
            const li = document.createElement('li');
            li.textContent = evidence;
            this.elements.evidenceItems.appendChild(li);
        }
    }
    
    hideGameElements() {
        this.elements.playerInput.style.display = 'none';
        this.elements.submitBtn.style.display = 'none';
        this.elements.evidenceDisplay.style.display = 'none';
        this.elements.sceneDescription.textContent = 'ゲーム開始ボタンを押してください';
        this.elements.speakerName.textContent = '';
        this.elements.dialogueText.textContent = '';
        this.elements.questionText.textContent = '';
    }
    
    showGameElements() {
        // ゲーム要素を表示（必要に応じて）
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.currentScenario = null;
        this.currentPhase = 0;
        this.currentDialogue = 0;
        this.mood = 0;
        this.evidenceList = [];
        this.playerName = '';
        this.stopTimer();
        
        this.elements.evidenceItems.innerHTML = '';
        this.elements.endingScreen.classList.add('hidden');
        this.hideGameElements();
        this.updateMoodDisplay();
    }
    
    saveGame() {
        const saveData = {
            gameState: this.gameState,
            currentPhase: this.currentPhase,
            currentDialogue: this.currentDialogue,
            mood: this.mood,
            evidenceList: this.evidenceList,
            playerName: this.playerName,
            timeLeft: this.timeLeft
        };
        
        localStorage.setItem('daishu-gokumon-save', JSON.stringify(saveData));
        alert('ゲームを記録しました。');
    }
    
    loadGame() {
        const saveData = localStorage.getItem('daishu-gokumon-save');
        if (!saveData) {
            alert('記録されたデータがありません。');
            return;
        }
        
        try {
            const data = JSON.parse(saveData);
            this.gameState = data.gameState;
            this.currentPhase = data.currentPhase;
            this.currentDialogue = data.currentDialogue;
            this.mood = data.mood;
            this.evidenceList = data.evidenceList;
            this.playerName = data.playerName;
            this.timeLeft = data.timeLeft;
            
            // 証拠品リストを復元
            this.elements.evidenceItems.innerHTML = '';
            this.evidenceList.forEach(evidence => this.addEvidence(evidence));
            
            this.updateMoodDisplay();
            alert('ゲームを読み込みました。');
        } catch (error) {
            alert('データの読み込みに失敗しました。');
        }
    }
}

// ゲーム初期化
window.addEventListener('load', () => {
    const game = new DaishuGokumonGame();
    window.game = game; // デバッグ用
});