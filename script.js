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
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
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
        this.resetGame(); // 確実に初期状態にリセット
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
    
    startGame() {
        console.log('ゲーム開始処理を実行中...');
        
        // シナリオデータを直接埋め込み
        this.currentScenario = {
            "title": "盗みの嫌疑",
            "description": "商家の金子が盗まれた事件",
            "crime": "窃盗",
            "severity": "軽犯罪",
            "initialMood": 0,
            "timeLimit": 30,
            "phases": [
                {
                    "id": "intro",
                    "title": "導入",
                    "background": "気がつくと、あなたは畳の上に座らされていた。目の前には威厳ある御奉行様が座している。",
                    "dialogue": [
                        {"speaker": "御奉行", "text": "おのれ、目を覚ましたか。"},
                        {"speaker": "御奉行", "text": "このたび、米問屋「丸八」より金子五両が盗まれた件につき、そなたに嫌疑がかかっておる。"},
                        {"speaker": "御奉行", "text": "まずは名前を申せ。"}
                    ],
                    "question": {
                        "type": "open",
                        "text": "お前の名前は何と申すか？",
                        "responses": [
                            {"keywords": ["覚えて", "記憶", "わからない", "忘れ"], "moodChange": -5, "reply": "記憶を失っておるのか？怪しい奴じゃ。"},
                            {"keywords": ["正直", "実は", "本当"], "moodChange": 5, "reply": "ほう、素直に答えるか。"},
                            {"keywords": ["無実", "無罪", "やって"], "moodChange": -3, "reply": "まだ何も聞いておらぬのに無実とは何事か。"}
                        ],
                        "defaultResponse": {"moodChange": 0, "reply": "その名、確かに聞き取った。"}
                    }
                },
                {
                    "id": "evidence1",
                    "title": "証拠品提示",
                    "background": "与力が一枚の手ぬぐいを持参した。",
                    "dialogue": [
                        {"speaker": "与力", "text": "御奉行様、現場にてこのような物が見つかりました。"},
                        {"speaker": "御奉行", "text": "ほほう、これは手ぬぐいじゃな。「○○」と染め抜いてある。"}
                    ],
                    "question": {
                        "type": "open",
                        "text": "この手ぬぐいに心当たりはあるか？",
                        "evidence": "血のついた手ぬぐい",
                        "responses": [
                            {"keywords": ["知らない", "見た", "ない", "わからない"], "moodChange": -3, "reply": "知らぬとは白々しい。よく見よ。"},
                            {"keywords": ["盗まれた", "なくし", "落とし"], "moodChange": 2, "reply": "盗まれたと申すか。いつのことじゃ？"},
                            {"keywords": ["自分", "私の", "俺の"], "moodChange": 10, "reply": "正直に申すか。感心じゃ。"}
                        ],
                        "defaultResponse": {"moodChange": -1, "reply": "はっきりせぬ答えじゃな。"}
                    }
                },
                {
                    "id": "motive",
                    "title": "動機の追求",
                    "dialogue": [
                        {"speaker": "御奉行", "text": "米問屋の主人によれば、そなたは先月より店に出入りしていたとのこと。"},
                        {"speaker": "御奉行", "text": "金子の在り処も知っていたであろう。"}
                    ],
                    "question": {
                        "type": "open",
                        "text": "なぜ米問屋に出入りしていたのじゃ？",
                        "responses": [
                            {"keywords": ["仕事", "働い", "雇われ", "手伝"], "moodChange": 8, "reply": "仕事で出入りしていたと申すか。真面目な者のようじゃな。"},
                            {"keywords": ["借金", "金", "困って", "貧乏"], "moodChange": -8, "reply": "金に困っていたのか。動機十分じゃな。"},
                            {"keywords": ["友人", "知り合い", "頼まれ"], "moodChange": 3, "reply": "知人の頼みとは？詳しく申せ。"}
                        ],
                        "defaultResponse": {"moodChange": -2, "reply": "曖昧な答えでは納得できぬ。"}
                    }
                },
                {
                    "id": "final",
                    "title": "最終弁明",
                    "dialogue": [
                        {"speaker": "御奉行", "text": "証拠品も揃い、動機もある。"},
                        {"speaker": "御奉行", "text": "最後に何か申すことはあるか？"}
                    ],
                    "question": {
                        "type": "open",
                        "text": "最後の弁明を聞こう。",
                        "responses": [
                            {"keywords": ["無実", "やって", "犯人", "別", "真犯人"], "moodChange": 5, "reply": "ほう、真犯人がいると申すか。"},
                            {"keywords": ["家族", "母", "父", "子", "妻"], "moodChange": 12, "reply": "家族を思う心、美しいものじゃ。"},
                            {"keywords": ["反省", "申し訳", "すまない", "悪かった"], "moodChange": 8, "reply": "素直に謝罪するか。心根は悪くないようじゃ。"},
                            {"keywords": ["金", "返す", "弁償", "償い"], "moodChange": 10, "reply": "償いをすると申すか。殊勝な心がけじゃ。"}
                        ],
                        "defaultResponse": {"moodChange": 0, "reply": "そうか、心得た。"}
                    }
                }
            ],
            "endings": {
                "無罪放免": {"minMood": 25, "title": "お上の慈悲", "text": "御奉行様は微笑みながら言った。「そなたの心根、よく分かった。この件は無罪放免とする。今後気をつけよ。」"},
                "叱責": {"minMood": 15, "title": "温情判決", "text": "御奉行様は厳しく言った。「証拠不十分につき放免とするが、今後は気をつけよ。」"},
                "過料": {"minMood": 5, "title": "軽微な処分", "text": "御奉行様は判決を下した。「過料銀三匁を申し付ける。二度とこのような事をするでないぞ。」"},
                "笞打ち": {"minMood": -5, "title": "軽き刑", "text": "御奉行様は冷たく言った。「笞打ち十回を申し付ける。これに懲りよ。」"},
                "遠島": {"minMood": -15, "title": "遠き島へ", "text": "御奉行様は重々しく言った。「八丈島遠島を申し付ける。島にて罪を償え。」"},
                "獄門": {"minMood": -25, "title": "見せしめ", "text": "御奉行様は無慈悲に言った。「獄門に処する。見せしめとして三日三晩晒すものとする。」"}
            }
        };
        
        console.log('シナリオデータ読み込み完了:', this.currentScenario);
        this.initializeGame();
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
        console.log('ゲームをリセット中...');
        this.gameState = 'menu';
        this.currentScenario = null;
        this.currentPhase = 0;
        this.currentDialogue = 0;
        this.mood = 0;
        this.evidenceList = [];
        this.playerName = '';
        this.stopTimer();
        
        // UI要素をリセット
        if (this.elements.evidenceItems) {
            this.elements.evidenceItems.innerHTML = '';
        }
        if (this.elements.endingScreen) {
            this.elements.endingScreen.classList.add('hidden');
        }
        
        this.hideGameElements();
        this.updateMoodDisplay();
        console.log('ゲームリセット完了');
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