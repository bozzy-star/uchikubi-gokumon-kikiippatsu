class DaishuGokumonGame {
    constructor() {
        this.gameState = 'menu';
        this.currentQuestion = 0;
        this.totalQuestions = 30;
        this.mood = 0;
        this.evidenceList = [];
        this.playerAnswers = [];
        this.questions = [];
        this.crimePoints = {
            murder: 0,
            theft: 0,
            fraud: 0,
            arson: 0,
            adultery: 0
        };
        
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
            currentQuestion: document.getElementById('current-question'),
            totalQuestions: document.getElementById('total-questions'),
            choicesArea: document.getElementById('choices-area'),
            choiceA: document.getElementById('choice-a'),
            choiceB: document.getElementById('choice-b'),
            choiceC: document.getElementById('choice-c'),
            choiceD: document.getElementById('choice-d'),
            selectedAnswer: document.getElementById('selected-answer'),
            moodFill: document.getElementById('mood-fill'),
            moodText: document.getElementById('mood-text'),
            crimeDescription: document.getElementById('crime-description'),
            evidenceItems: document.getElementById('evidence-items'),
            endingScreen: document.getElementById('ending-screen'),
            endingTitle: document.getElementById('ending-title'),
            endingText: document.getElementById('ending-text')
        };
        
        this.setupEventListeners();
        this.resetGame();
        this.hideGameElements();
        this.setupQuestions();
    }
    
    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.resetGame());
        
        // 選択肢ボタンのイベント
        this.elements.choiceA.addEventListener('click', () => this.selectChoice('a'));
        this.elements.choiceB.addEventListener('click', () => this.selectChoice('b'));
        this.elements.choiceC.addEventListener('click', () => this.selectChoice('c'));
        this.elements.choiceD.addEventListener('click', () => this.selectChoice('d'));
    }
    
    setupQuestions() {
        this.questions = [
            {
                speaker: "御奉行",
                text: "そなたの名前と身分を申せ。正直に答えるのじゃ。",
                choices: [
                    { text: "拙者は武士の端くれ、○○と申します", mood: 2, crime: { murder: 1 }, evidence: null },
                    { text: "商いを営んでおります、○○と申します", mood: 0, crime: { fraud: 1 }, evidence: null },
                    { text: "職人をしております、○○と申します", mood: 1, crime: { theft: 1 }, evidence: null },
                    { text: "記憶が曖昧で...名前も思い出せません", mood: -5, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "武士か。ならば刀の扱いに長けておろうな。",
                    "商人じゃな。金銭に関わる諍いがありそうじゃ。",
                    "職人か。手先が器用でなければ務まらぬ仕事じゃな。",
                    "記憶がないとは都合の良いことじゃ。怪しいぞ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "昨夜の子の刻（午前0時頃）、そなたは何をしておったか？",
                choices: [
                    { text: "家で家族と共に眠っておりました", mood: 3, crime: {}, evidence: null },
                    { text: "酒場で酒を飲んでおりました", mood: -2, crime: { murder: 1 }, evidence: null },
                    { text: "仕事の関係で外を歩いておりました", mood: 0, crime: { theft: 1 }, evidence: null },
                    { text: "覚えておりません...酒に酔っていたもので", mood: -4, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "家族と共にか。平和な夜を過ごしておったのじゃな。",
                    "酒場にいたと申すか。酒が入ると人は変わるものじゃ。",
                    "仕事とは殊勝じゃ。どのような仕事だったのじゃ？",
                    "また記憶がないと申すか。これで二度目じゃぞ。"
                ]
            },
            {
                speaker: "与力",
                text: "現場で発見されたこの血のついた短刀、心当たりはございませんか？",
                choices: [
                    { text: "それは間違いなく拙者の刀でございます", mood: 8, crime: { murder: -1 }, evidence: "血のついた短刀" },
                    { text: "似ているが、拙者の物ではありません", mood: -3, crime: { murder: 1 }, evidence: "血のついた短刀" },
                    { text: "見覚えがありません。初めて見ます", mood: -5, crime: { murder: 2 }, evidence: "血のついた短刀" },
                    { text: "数日前から行方不明になっていた刀です", mood: 2, crime: { theft: 1 }, evidence: "血のついた短刀" }
                ],
                replies: [
                    "正直に申すか。では、なぜ血がついておるのじゃ？",
                    "似ているだけと申すか。しかし刀身に名前が...。",
                    "知らぬと申すか。ならばなぜ名前が刻まれておる？",
                    "盗まれたと申すか。誰に盗まれたか心当たりは？"
                ]
            },
            {
                speaker: "御奉行",
                text: "血のついた衣に関してはどう申し開きをするのじゃ？",
                choices: [
                    { text: "人を斬った血です。隠しても無駄でしょう", mood: 10, crime: { murder: -2 }, evidence: null },
                    { text: "魚を捌いた時の血です", mood: -1, crime: { theft: 1 }, evidence: null },
                    { text: "転んで怪我をした自分の血です", mood: 1, crime: {}, evidence: null },
                    { text: "記憶にございません", mood: -6, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "正直に申すとは...その潔さ、見事じゃ。",
                    "魚の血と申すか。人の血と魚の血は違うものじゃ。",
                    "自分の血か。しかし量が多すぎるのではないか？",
                    "またしても記憶にないと申すか。呆れるばかりじゃ。"
                ]
            },
            {
                speaker: "女将",
                text: "昨夜、この方は確かに店におられました。田中屋様と激しく言い争っておりました。",
                choices: [
                    { text: "確かに口論になりました。申し訳ございません", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "それは誤解です。穏やかに話していました", mood: -4, crime: { fraud: 1 }, evidence: null },
                    { text: "田中屋とは初対面でした", mood: -8, crime: { murder: 2 }, evidence: null },
                    { text: "覚えておりません", mood: -7, crime: { murder: 1 }, evidence: null }
                ],
                replies: [
                    "素直に申すな。では、何について言い争ったのじゃ？",
                    "女将の証言と食い違うぞ。どちらが真実じゃ？",
                    "初対面と申すか？女将の証言と大きく異なるぞ！",
                    "目撃者がおるのに覚えていないとは不自然じゃ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "田中屋久兵衛との金銭の貸し借りについて申せ。",
                choices: [
                    { text: "家族の病気の薬代として借りました", mood: 8, crime: { murder: -1 }, evidence: null },
                    { text: "商売の資金として借りました", mood: 3, crime: { fraud: -1 }, evidence: null },
                    { text: "博打の借金でした...恥ずかしい限りです", mood: -3, crime: { murder: 1 }, evidence: null },
                    { text: "金銭の貸し借りはありません", mood: -6, crime: { fraud: 2 }, evidence: null }
                ],
                replies: [
                    "家族のためか。それは切ない事情じゃな。",
                    "商売のためか。真面目な心がけと見える。",
                    "博打とは...情けない話じゃ。それで返せなんだのか。",
                    "ないと申すか？帳簿には明確に記録があるぞ。"
                ]
            },
            {
                speaker: "同心",
                text: "田中屋の帳簿によれば、返済期限は一月前に過ぎております。",
                choices: [
                    { text: "申し訳ございません。必ず返すつもりでした", mood: 5, crime: { murder: -1 }, evidence: null },
                    { text: "田中屋が勝手に期限を早めたのです", mood: -2, crime: { fraud: 1 }, evidence: null },
                    { text: "そのような約束はしておりません", mood: -5, crime: { fraud: 2 }, evidence: null },
                    { text: "返済の意思はありませんでした", mood: -8, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "返済の意思があったか。それならば殺す理由もあるまい。",
                    "期限を早めたと申すか。証拠はあるのか？",
                    "帳簿に明記されておるのに、約束していないとは？",
                    "返済の意思がないとは...それでは確かに動機がある。"
                ]
            },
            {
                speaker: "御奉行",
                text: "田中屋を殺害する動機について、正直に申してみよ。",
                choices: [
                    { text: "動機などありません。無実です", mood: 2, crime: { murder: -2 }, evidence: null },
                    { text: "確かに恨みはありましたが、殺しはしません", mood: 1, crime: { murder: -1 }, evidence: null },
                    { text: "魔が差しました...許してください", mood: 8, crime: { murder: -3 }, evidence: null },
                    { text: "正当防衛でした。向こうから襲いかかってきたのです", mood: 6, crime: { murder: -2 }, evidence: null }
                ],
                replies: [
                    "無実を主張するか。ならば真犯人の心当たりはあるか？",
                    "恨みがあったと認めるか。しかし殺していないと申すのじゃな。",
                    "魔が差したか...素直に罪を認める心、受け取った。",
                    "正当防衛と申すか。詳しく話してみよ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "現場近くで倒れていたそなたの状況を説明せよ。",
                choices: [
                    { text: "田中屋の死体を発見し、驚いて気を失いました", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "何者かに後ろから殴られました", mood: 3, crime: { murder: -1 }, evidence: null },
                    { text: "酒に酔って倒れていただけです", mood: -2, crime: { murder: 1 }, evidence: null },
                    { text: "覚えておりません", mood: -5, crime: { murder: 1 }, evidence: null }
                ],
                replies: [
                    "死体を見て気絶したと申すか。それほど驚いたのじゃな。",
                    "何者かに殴られたか。真犯人がおると申すのじゃな？",
                    "酒に酔っていたと申すか。それで血まみれになったのか？",
                    "またしても覚えていないと申すか。都合が良すぎるぞ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "そなたの家族について申してみよ。",
                choices: [
                    { text: "病気の母と幼い子供がおります", mood: 10, crime: { murder: -2 }, evidence: null },
                    { text: "身寄りはございません。天涯孤独の身です", mood: 2, crime: {}, evidence: null },
                    { text: "妻がおりますが、最近仲が悪くなりました", mood: -1, crime: { adultery: 1 }, evidence: null },
                    { text: "家族のことは申したくありません", mood: -3, crime: { murder: 1 }, evidence: null }
                ],
                replies: [
                    "家族思いじゃな。そのような者が人を殺めるとは思えん。",
                    "天涯孤独か。それは寂しいことじゃな。",
                    "夫婦仲が悪いと申すか。それも心の重荷であろう。",
                    "申したくないとは...何か隠しておるのか？"
                ]
            },
            {
                speaker: "同心",
                text: "田中屋の死体の傷は深く、一撃で致命傷となっております。",
                choices: [
                    { text: "それほど深い傷だったとは...驚きました", mood: 1, crime: {}, evidence: null },
                    { text: "武器の扱いに慣れた者の仕業ですね", mood: 0, crime: { murder: 1 }, evidence: null },
                    { text: "偶然刺さってしまったのかもしれません", mood: -2, crime: { murder: 1 }, evidence: null },
                    { text: "そんな話は聞きたくありません", mood: -4, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "驚いたと申すか。確かに残酷な傷じゃった。",
                    "武器に慣れた者か。そなたも武器は扱えるのではないか？",
                    "偶然一撃で急所を?そのようなことがあるものか。",
                    "聞きたくないとは...心当たりがあるからではないか？"
                ]
            },
            {
                speaker: "御奉行",
                text: "田中屋の人柄についてどう思っておったか？",
                choices: [
                    { text: "厳しいが、根は良い人でした", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "冷酷で金の亡者でした", mood: -2, crime: { murder: 1 }, evidence: null },
                    { text: "あまり深く知りませんでした", mood: 0, crime: {}, evidence: null },
                    { text: "憎らしい人でした", mood: -6, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "良い人だったと申すか。ならばなおさら殺す理由がない。",
                    "金の亡者と申すか。それでも人の命には代えられぬ。",
                    "深く知らなかったか。それならば恨みもあるまい。",
                    "憎らしいと申すか。それは立派な殺害の動機じゃな。"
                ]
            },
            {
                speaker: "御奉行",
                text: "もし田中屋が生きていたら、そなたはどうしたかったか？",
                choices: [
                    { text: "誠心誠意謝って、分割での返済をお願いしたかった", mood: 8, crime: { murder: -2 }, evidence: null },
                    { text: "法的な手段で解決したかった", mood: 3, crime: { fraud: -1 }, evidence: null },
                    { text: "どうにかして返済を免除してもらいたかった", mood: -1, crime: { fraud: 1 }, evidence: null },
                    { text: "考えたことはありません", mood: -3, crime: { murder: 1 }, evidence: null }
                ],
                replies: [
                    "誠意を示そうとしていたか。それは良心的じゃ。",
                    "法的手段とは穏当な考えじゃな。",
                    "返済を免除してもらいたいとは...虫の良い話じゃ。",
                    "考えたことがないとは...無責任ではないか？"
                ]
            },
            {
                speaker: "御奉行",
                text: "そなたの過去に、人を傷つけたことはあるか？",
                choices: [
                    { text: "一度もありません。争いは好みません", mood: 5, crime: { murder: -2 }, evidence: null },
                    { text: "正当防衛で一度だけ", mood: 1, crime: { murder: -1 }, evidence: null },
                    { text: "若い頃、喧嘩をしたことがあります", mood: -1, crime: { murder: 1 }, evidence: null },
                    { text: "数えきれないほど", mood: -8, crime: { murder: 3 }, evidence: null }
                ],
                replies: [
                    "争いを好まぬか。平和を愛する心の持ち主じゃな。",
                    "正当防衛での一度だけか。やむを得ない事情があったのじゃな。",
                    "若い頃の喧嘩か。血気盛んな時期もあったのじゃな。",
                    "数えきれぬほどとは...そなた、相当な乱暴者じゃな！"
                ]
            },
            {
                speaker: "御奉行",
                text: "事件の夜、酒は飲んでおったか？",
                choices: [
                    { text: "一滴も飲んでおりません", mood: 3, crime: {}, evidence: null },
                    { text: "少しだけ飲みました", mood: 0, crime: {}, evidence: null },
                    { text: "かなり飲んでいました", mood: -3, crime: { murder: 1 }, evidence: null },
                    { text: "記憶を失くすほど飲んでいました", mood: -6, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "一滴も飲まずか。しらふでの行動ということじゃな。",
                    "少しだけか。判断力に問題はなかったであろう。",
                    "かなり飲んでいたか。酒が判断を鈍らせたか？",
                    "記憶を失くすほどとは...それで何をしたか覚えておらぬのか。"
                ]
            },
            {
                speaker: "御奉行",
                text: "田中屋以外に金を借りている相手はおるか？",
                choices: [
                    { text: "田中屋だけです", mood: 2, crime: {}, evidence: null },
                    { text: "他にも数人います", mood: -2, crime: { fraud: 1 }, evidence: null },
                    { text: "高利貸しから借りています", mood: -4, crime: { murder: 1 }, evidence: null },
                    { text: "借金はありません", mood: -5, crime: { fraud: 2 }, evidence: null }
                ],
                replies: [
                    "田中屋だけか。それならば事情も単純じゃな。",
                    "他にも借金があるとは...相当苦しい台所事情じゃな。",
                    "高利貸しとは...そちらの方が危険ではないか？",
                    "借金がないと申すか？では田中屋との関係は何だったのじゃ？"
                ]
            },
            {
                speaker: "同心",
                text: "現場に残された足跡について、心当たりはございますか？",
                choices: [
                    { text: "自分の足跡かもしれません", mood: 6, crime: { murder: -1 }, evidence: "足跡" },
                    { text: "似ているが自分のものではありません", mood: -2, crime: { murder: 1 }, evidence: "足跡" },
                    { text: "全く心当たりがありません", mood: -4, crime: { murder: 1 }, evidence: "足跡" },
                    { text: "足跡なんて見ても分かりません", mood: -1, crime: {}, evidence: "足跡" }
                ],
                replies: [
                    "自分の足跡と認めるか。正直な態度じゃ。",
                    "似ているだけと申すか。しかし大きさがぴったりじゃが？",
                    "心当たりがないと申すか。では他の誰のものか？",
                    "確かに足跡だけでは判断は難しいものじゃ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "そなたにとって田中屋の死は都合が良かったか？",
                choices: [
                    { text: "とんでもございません。大変悲しく思います", mood: 6, crime: { murder: -2 }, evidence: null },
                    { text: "借金の催促はなくなりましたが、喜んではいません", mood: 1, crime: { murder: -1 }, evidence: null },
                    { text: "正直、少しは楽になりました", mood: -4, crime: { murder: 2 }, evidence: null },
                    { text: "非常に都合が良かったです", mood: -8, crime: { murder: 3 }, evidence: null }
                ],
                replies: [
                    "悲しく思うか。人情味のある答えじゃ。",
                    "催促がなくなったのは確かじゃが、喜んでいないと申すか。",
                    "楽になったと申すか...正直だが不謹慎じゃな。",
                    "都合が良かったと言い切るか。それは動機として十分じゃ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "真犯人の心当たりはあるか？",
                choices: [
                    { text: "田中屋の番頭が怪しいと思います", mood: 3, crime: { murder: -1 }, evidence: null },
                    { text: "同じく借金していた者がいるはずです", mood: 2, crime: { murder: -1 }, evidence: null },
                    { text: "盗賊の仕業だと思います", mood: 0, crime: { theft: 1 }, evidence: null },
                    { text: "心当たりはありません", mood: -2, crime: { murder: 1 }, evidence: null }
                ],
                replies: [
                    "番頭が怪しいと申すか。なぜそう思うのじゃ？",
                    "他にも借金している者がいると申すか。調べてみよう。",
                    "盗賊の仕業と申すか。しかし金品は盗まれていないぞ。",
                    "心当たりがないか。それでは無実の証明は難しいな。"
                ]
            },
            {
                speaker: "御奉行",
                text: "最後の晩餐で田中屋と何を話したか？",
                choices: [
                    { text: "返済の相談をしました", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "世間話をしただけです", mood: -1, crime: { fraud: 1 }, evidence: null },
                    { text: "激しく言い合いになりました", mood: 2, crime: { murder: -1 }, evidence: null },
                    { text: "話などしていません", mood: -6, crime: { fraud: 2 }, evidence: null }
                ],
                replies: [
                    "返済の相談をしたか。真摯な姿勢じゃな。",
                    "世間話だけと申すか。女将の証言と異なるぞ。",
                    "激しい言い合いになったか。何について争ったのじゃ？",
                    "話していないと申すか。では何をしに行ったのじゃ？"
                ]
            },
            {
                speaker: "御奉行",
                text: "田中屋の死体を最初に発見した時の気持ちを申せ。",
                choices: [
                    { text: "恐ろしくて震えが止まりませんでした", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "驚きましたが、冷静でした", mood: 1, crime: {}, evidence: null },
                    { text: "何も感じませんでした", mood: -5, crime: { murder: 2 }, evidence: null },
                    { text: "安堵しました", mood: -8, crime: { murder: 3 }, evidence: null }
                ],
                replies: [
                    "恐ろしかったか。初めて死体を見た者の自然な反応じゃ。",
                    "冷静だったと申すか。度胸があるか、慣れているかじゃな。",
                    "何も感じなかったとは...冷酷な心の持ち主か？",
                    "安堵したと申すか！これは重大な発言じゃぞ！"
                ]
            },
            {
                speaker: "御奉行",
                text: "事件後、そなたの生活に変化はあったか？",
                choices: [
                    { text: "恐怖で夜も眠れません", mood: 3, crime: { murder: -1 }, evidence: null },
                    { text: "特に変わりません", mood: -1, crime: {}, evidence: null },
                    { text: "借金の心配がなくなり、安心しています", mood: -6, crime: { murder: 2 }, evidence: null },
                    { text: "罪悪感に苛まれています", mood: 8, crime: { murder: -3 }, evidence: null }
                ],
                replies: [
                    "眠れぬほど恐ろしいか。無実の者の反応として自然じゃ。",
                    "変わらないと申すか。強い心の持ち主じゃな。",
                    "安心していると申すか...それは不適切な感情では？",
                    "罪悪感に苛まれているか。何に対する罪悪感じゃ？"
                ]
            },
            {
                speaker: "御奉行",
                text: "もし無罪となった場合、今後どうするつもりか？",
                choices: [
                    { text: "田中屋の冥福を祈り、真面目に生きます", mood: 8, crime: { murder: -2 }, evidence: null },
                    { text: "真犯人を探し出したいと思います", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "普通の生活に戻りたいです", mood: 1, crime: {}, evidence: null },
                    { text: "何も考えていません", mood: -2, crime: { murder: 1 }, evidence: null }
                ],
                replies: [
                    "冥福を祈ると申すか。慈悲深い心じゃな。",
                    "真犯人を探すと申すか。正義感のある者じゃ。",
                    "普通の生活に戻りたいか。平凡だが健全な願いじゃ。",
                    "何も考えていないとは...将来への責任感がないのか？"
                ]
            },
            {
                speaker: "御奉行",
                text: "田中屋に感謝していることはあったか？",
                choices: [
                    { text: "困った時に金を貸してくれたことです", mood: 6, crime: { murder: -2 }, evidence: null },
                    { text: "商売のアドバイスをもらったことです", mood: 3, crime: { fraud: -1 }, evidence: null },
                    { text: "特にありません", mood: -2, crime: { murder: 1 }, evidence: null },
                    { text: "感謝など一切していません", mood: -6, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "金を貸してくれたことに感謝していたか。恩を知る者じゃな。",
                    "商売のアドバイスに感謝していたか。師として慕っていたのじゃな。",
                    "特にないと申すか。冷たい関係だったのじゃな。",
                    "一切感謝していないとは...恩知らずもよいところじゃ！"
                ]
            },
            {
                speaker: "御奉行",
                text: "そなたの人生で最も後悔していることは何じゃ？",
                choices: [
                    { text: "借金をしてしまったことです", mood: 4, crime: { murder: -1 }, evidence: null },
                    { text: "家族を苦労させていることです", mood: 8, crime: { murder: -2 }, evidence: null },
                    { text: "田中屋を憎んでしまったことです", mood: 6, crime: { murder: -2 }, evidence: null },
                    { text: "後悔はありません", mood: -4, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "借金を後悔しているか。分相応の生活の大切さを知ったのじゃな。",
                    "家族を苦労させていることを後悔しているか。家族思いじゃな。",
                    "憎んでしまったことを後悔しているか。今は心を入れ替えたのじゃな。",
                    "後悔がないと申すか...反省の色が見えぬぞ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "最後に、そなたは本当に田中屋久兵衛を殺めたのか？",
                choices: [
                    { text: "はい、魔が差して殺してしまいました", mood: 15, crime: { murder: -5 }, evidence: null },
                    { text: "いいえ、断じて殺していません", mood: 5, crime: { murder: -3 }, evidence: null },
                    { text: "正当防衛でした", mood: 10, crime: { murder: -4 }, evidence: null },
                    { text: "覚えていません", mood: -10, crime: { murder: 3 }, evidence: null }
                ],
                replies: [
                    "ついに白状したか。その正直さ、あっぱれじゃ。",
                    "最後まで無実を主張するか。その意志の強さ、見事じゃ。",
                    "正当防衛と申すか。詳しい状況を聞かせてもらおう。",
                    "この期に及んで覚えていないとは...言語道断じゃ！"
                ]
            },
            {
                speaker: "御奉行",
                text: "そなたが望む判決は何じゃ？",
                choices: [
                    { text: "無罪放免をお願いします", mood: 2, crime: { murder: -1 }, evidence: null },
                    { text: "情状酌量をお願いします", mood: 5, crime: { murder: -2 }, evidence: null },
                    { text: "厳正な処罰をお願いします", mood: 12, crime: { murder: -4 }, evidence: null },
                    { text: "どのような判決でも受け入れます", mood: 8, crime: { murder: -2 }, evidence: null }
                ],
                replies: [
                    "無罪を望むか。それならば無実の証拠を示せ。",
                    "情状酌量を望むか。それなりの事情があるということじゃな。",
                    "厳正な処罰を望むとは...覚悟を決めた潔い心じゃ。",
                    "どのような判決でも受け入れると申すか。殊勝な心がけじゃ。"
                ]
            },
            {
                speaker: "御奉行",
                text: "そなたの最後の言葉を聞こう。心の底から申してみよ。",
                choices: [
                    { text: "家族を愛していると伝えてください", mood: 15, crime: { murder: -3 }, evidence: null },
                    { text: "田中屋様に心からお詫び申し上げます", mood: 12, crime: { murder: -3 }, evidence: null },
                    { text: "真犯人が必ず見つかることを祈ります", mood: 8, crime: { murder: -2 }, evidence: null },
                    { text: "特に申すことはありません", mood: -5, crime: { murder: 2 }, evidence: null }
                ],
                replies: [
                    "家族への愛を語るか...その心、美しいものじゃ。",
                    "心からの詫びの言葉か...誠意が感じられる。",
                    "真犯人を見つけてほしいと申すか。最後まで無実を主張するのじゃな。",
                    "何も申すことがないとは...あまりに淡白ではないか。"
                ]
            }
        ];
        
        this.elements.totalQuestions.textContent = this.totalQuestions;
    }
    
    startGame() {
        console.log('ゲーム開始処理を実行中...');
        this.gameState = 'playing';
        this.currentQuestion = 0;
        this.mood = 0;
        this.crimePoints = {
            murder: 0,
            theft: 0,
            fraud: 0,
            arson: 0,
            adultery: 0
        };
        this.playerAnswers = [];
        this.evidenceList = [];
        
        this.updateCrimeInfo();
        this.updateMoodDisplay();
        this.showGameElements();
        this.showQuestion();
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.totalQuestions) {
            this.endGame();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        this.elements.currentQuestion.textContent = this.currentQuestion + 1;
        this.elements.speakerName.textContent = question.speaker;
        this.elements.dialogueText.textContent = question.text;
        this.elements.questionText.textContent = question.text;
        
        // 選択肢を設定
        this.elements.choiceA.textContent = `A. ${question.choices[0].text}`;
        this.elements.choiceB.textContent = `B. ${question.choices[1].text}`;
        this.elements.choiceC.textContent = `C. ${question.choices[2].text}`;
        this.elements.choiceD.textContent = `D. ${question.choices[3].text}`;
        
        // 選択状態をリセット
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.elements.selectedAnswer.style.display = 'none';
        this.elements.choicesArea.style.display = 'grid';
    }
    
    selectChoice(choice) {
        const question = this.questions[this.currentQuestion];
        const choiceIndex = ['a', 'b', 'c', 'd'].indexOf(choice);
        const selectedChoice = question.choices[choiceIndex];
        
        // 選択状態を更新
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.getElementById(`choice-${choice}`).classList.add('selected');
        
        // 回答を記録
        this.playerAnswers[this.currentQuestion] = {
            choice: choice,
            text: selectedChoice.text,
            mood: selectedChoice.mood,
            crime: selectedChoice.crime,
            evidence: selectedChoice.evidence
        };
        
        // 回答を表示
        this.elements.selectedAnswer.textContent = `あなたの回答: ${selectedChoice.text}`;
        this.elements.selectedAnswer.style.display = 'block';
        
        // 結果を適用
        this.mood += selectedChoice.mood;
        Object.keys(selectedChoice.crime).forEach(crimeType => {
            this.crimePoints[crimeType] += selectedChoice.crime[crimeType];
        });
        
        if (selectedChoice.evidence) {
            this.addEvidence(selectedChoice.evidence);
        }
        
        this.updateMoodDisplay();
        
        // 御奉行の返答を表示
        setTimeout(() => {
            this.elements.speakerName.textContent = '御奉行';
            this.elements.dialogueText.textContent = question.replies[choiceIndex];
            
            setTimeout(() => {
                this.currentQuestion++;
                this.showQuestion();
            }, 3000);
        }, 2000);
    }
    
    endGame() {
        this.gameState = 'ended';
        
        // 最も高い犯罪ポイントを特定
        const maxCrime = Object.keys(this.crimePoints).reduce((a, b) => 
            this.crimePoints[a] > this.crimePoints[b] ? a : b
        );
        
        const finalCrime = this.determineFinalCrime(maxCrime);
        const ending = this.determineEnding(finalCrime);
        this.showEnding(ending);
    }
    
    determineFinalCrime(maxCrime) {
        const crimeNames = {
            murder: '殺人',
            theft: '窃盗', 
            fraud: '詐欺',
            arson: '放火',
            adultery: '密通'
        };
        
        return crimeNames[maxCrime] || '殺人';
    }
    
    determineEnding(crime) {
        let title, text;
        
        if (this.mood >= 40) {
            title = "無罪放免";
            text = `「証拠と証言を総合的に判断した結果、${crime}の嫌疑は晴れたものと判断する。この件、無罪放免とする。今後は身を慎んで生きよ。」`;
        } else if (this.mood >= 20) {
            title = "軽い処分";
            text = `「${crime}の疑いはあるが、情状酌量の余地があると認める。過料銀十匁を申し付ける。二度とこのような場に立つでないぞ。」`;
        } else if (this.mood >= 0) {
            title = "遠島";
            text = `「${crime}の罪により、八丈島遠島を申し付ける。島にて十分に罪を償い、心を入れ替えよ。」`;
        } else if (this.mood >= -20) {
            title = "入墨刑";
            text = `「${crime}の重い罪により、入墨の刑に処する。生涯その罪を背負って生きよ。」`;
        } else if (this.mood >= -40) {
            title = "獄門";
            text = `「${crime}という重大な犯罪により、獄門に処す。見せしめとして三日三晩晒すものとする。」`;
        } else {
            title = "打首獄門";
            text = `「冷酷非情なる${crime}の罪人め。打首獄門に処し、その首を晒してくれる！」`;
        }
        
        // 犯罪内容を更新
        this.elements.crimeDescription.textContent = `${crime} - 御奉行様の厳正なる審理により判明`;
        
        return { title, text };
    }
    
    showEnding(ending) {
        this.elements.endingTitle.textContent = ending.title;
        this.elements.endingText.textContent = ending.text;
        this.elements.endingScreen.classList.remove('hidden');
        this.elements.endingScreen.classList.add('show');
    }
    
    updateMoodDisplay() {
        const percentage = Math.max(0, Math.min(100, ((this.mood + 50) / 100) * 100));
        this.elements.moodFill.style.width = `${percentage}%`;
        
        let moodText = '普通';
        if (this.mood >= 30) moodText = '非常に良い';
        else if (this.mood >= 15) moodText = '良い';
        else if (this.mood >= -15) moodText = '普通';
        else if (this.mood >= -30) moodText = '悪い';
        else moodText = '非常に悪い';
        
        this.elements.moodText.textContent = moodText;
    }
    
    updateCrimeInfo() {
        this.elements.crimeDescription.textContent = '殺人容疑 - 商人・田中屋久兵衛殺害事件';
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
        this.elements.choicesArea.style.display = 'none';
        this.elements.selectedAnswer.style.display = 'none';
        this.elements.sceneDescription.textContent = 'ゲーム開始ボタンを押してください';
        this.elements.speakerName.textContent = '';
        this.elements.dialogueText.textContent = '';
        this.elements.questionText.textContent = '';
    }
    
    showGameElements() {
        this.elements.choicesArea.style.display = 'grid';
    }
    
    resetGame() {
        console.log('ゲームをリセット中...');
        this.gameState = 'menu';
        this.currentQuestion = 0;
        this.mood = 0;
        this.crimePoints = {
            murder: 0,
            theft: 0,
            fraud: 0,
            arson: 0,
            adultery: 0
        };
        this.playerAnswers = [];
        this.evidenceList = [];
        
        if (this.elements.evidenceItems) {
            this.elements.evidenceItems.innerHTML = '';
        }
        if (this.elements.endingScreen) {
            this.elements.endingScreen.classList.add('hidden');
            this.elements.endingScreen.classList.remove('show');
        }
        
        this.hideGameElements();
        this.updateMoodDisplay();
        this.updateCrimeInfo();
        console.log('ゲームリセット完了');
    }
}

// ゲーム初期化
window.addEventListener('load', () => {
    const game = new DaishuGokumonGame();
    window.game = game; // デバッグ用
});