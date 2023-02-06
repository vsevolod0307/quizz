const questionWrap = document.querySelector(".question");
const wrapper = document.querySelector("#wrapper");
const answers = document.querySelectorAll(".answer");
const checked = document.querySelectorAll("input[type='checkbox']");
const btnNext = document.querySelector(".next-question");
const repeatBtn = document.querySelector(".repeat-btn.repeat");
const statBlock = document.querySelector(".stat-block");
const statText = document.querySelector(".stat-text");
const btnStart = document.querySelector(".start-quizz");
const btnCreate = document.querySelector(".create-quizz");
const btnCreateNext = document.createElement("button");
const createActionInput = document.querySelector(".create-actions input");
const createActionLabel = document.querySelector(".create-actions label");

const allQuestions = { 
    defaultTest: [
        {
            question: "В какой стране выведена порода собаки Лабрадор?",
            variants: [
                {
                    answer: "Англия",
                    correct: false
                },
                {
                    answer: "Канада",
                    correct: true
                },
                {
                    answer: "Финляндия",
                    correct: false
                },
                {
                    answer: "Эстония",
                    correct: false
                }
            ]
        },
        {
            question: "Самый ядовитый паук в Росии?",
            variants: [
                {
                    answer: "Тарантул",
                    correct: false
                },
                {
                    answer: "Чёрная вдова",
                    correct: false
                },
                {
                    answer: "Паук волк",
                    correct: false
                },
                {
                    answer: "Каракунт",
                    correct: true
                }
            ]
        },
        {
            question: "Как звали ребёнка которого воспитали волки?",
            variants: [
                {
                    answer: "Тарзан",
                    correct: false
                },
                {
                    answer: "Рэмбо",
                    correct: false
                },
                {
                    answer: "Маугли",
                    correct: true
                },
                {
                    answer: "Симба",
                    correct: false
                }
            ]
        },
        {
            question: "Название какой страны соответствует названию её столицы",
            variants: [
                {
                    answer: "Бразилия",
                    correct: false
                },
                {
                    answer: "Венесуэла",
                    correct: false
                },
                {
                    answer: "Люксембург",
                    correct: true
                },
                {
                    answer: "Литва",
                    correct: false
                }
            ]
        },
        {
            question: "Кто из перечисленных актёров НЕ получал премию Оскар",
            variants: [
                {
                    answer: "Леонардо Ди Каприо",
                    correct: false
                },
                {
                    answer: "Джаред Лето",
                    correct: false
                },
                {
                    answer: "Том Круз",
                    correct: true
                },
                {
                    answer: "Брэд Питт",
                    correct: false
                }
            ]
        },
    ]
} 
console.log(allQuestions)

mountAside = () => {
    const oldUl = document.querySelectorAll(".test-list");
    oldUl.forEach(ul => {
        ul.remove();
    })
    const ul = document.createElement("ul");
    ul.classList.add("test-list");
    Object.keys(allQuestions).forEach(key => {
        const li = document.createElement("li");
        const startQ = document.createElement("button");
        startQ.classList.add("repeat-btn", "start-quizz");
        startQ.textContent = "Начать тест";
        li.classList.add("test-link");
        li.textContent = key;
        li.append(startQ);
        ul.append(li);
        li.addEventListener("mouseenter", () => {
            startQ.style.display = "block";
            startQ.addEventListener("click", () => {
                const start = new DefaultQuizz(allQuestions[key], statBlock, statText);
                start.mounted();
            })
        })
        
        li.addEventListener("mouseleave", () => {
            startQ.style.display = "none";
        })
    })
    document.querySelector("aside").append(ul);
}

mountAside();

class DefaultQuizz {
    constructor(questions, resBlock, resText) {
        this.questions = questions;
        this.resBlock = resBlock;
        this.resText = resText;
    }

    static countQuestion = 0;
    checkAnswer;
    rightCount = 0;

    addContent() {
        questionWrap.textContent = this.questions[DefaultQuizz.countQuestion].question;
        answers.forEach((elem, idx) => {
            checked.forEach(check => check.checked = false);
            elem.textContent = this.questions[DefaultQuizz.countQuestion].variants[idx].answer;
        })
    }

    toggleVariants() {
        answers.forEach((answer, idx) => {
            btnNext.setAttribute("disabled", true);
            answer.addEventListener("click", () => {
                btnNext.removeAttribute("disabled");
                checked.forEach(check => check.checked = false);
                checked[idx].checked = true;
                this.checkAnswer = checked[idx].checked === this.questions[DefaultQuizz.countQuestion].variants[idx].correct;
            })
        })
    }

    repeat() {
        repeatBtn.addEventListener("click", () => {
            DefaultQuizz.countQuestion = 0;
            this.rightCount = 0;
            this.addContent();
            this.toggleVariants();
            wrapper.style.display = "flex";
            statBlock.style.display = "none";
        })
    }

    showStatBlock() {
        let text;
        if(this.rightCount < 3) {
            text = `Есть куда стремиться, правильных ответов ${this.rightCount}`;
        } else if (this.rightCount < 5 && this.rightCount > 2) {
            text = `Очень хороший результат, ${this.rightCount} правильных ответов`;
        } else {
            text = `Превосходно, у вас ${this.rightCount} правильных ответов`;
        }
        this.resBlock.style.display = "block";
        this.resText.textContent = text;
    }

    mounted() {
        wrapper.style.display = "flex";
        document.querySelector(".create-wrapper").style.display = "none";
        this.addContent();
        this.toggleVariants();
        btnNext.addEventListener("click", () => {
            DefaultQuizz.countQuestion++;
            if(this.checkAnswer) this.rightCount++;

            if(DefaultQuizz.countQuestion < this.questions.length) {
                this.addContent();
                this.toggleVariants();
            } else {
                this.showStatBlock();
                wrapper.style.display = "none";
                this.repeat();
            }

            btnNext.setAttribute("disabled", true);

            if(DefaultQuizz.countQuestion === this.questions.length - 1) {
                btnNext.textContent = "Завершить";
            } else {
                btnNext.textContent = "Следующий вопрос";
            }
        })
    }
}

class CreateQuizz {
    static idxQ = 1;
    static totalQ = 0;

    dataCreated = [];
    wrap = document.createElement("div");
    input = document.createElement("input");
    varyants = [1, 2, 3, 4];
    indexQ = document.createElement("span");
    nameInput = document.createElement("input");
    isCreate = true;

    mounted() {
        btnCreate.addEventListener("click", () => {
            CreateQuizz.totalQ = Number(document.querySelector("input[name='count']").value);
            this.wrap.style.display = "flex";
            wrapper.style.display = "none";
            createActionInput.style.display = "none";
            createActionLabel.style.display = "none";
            this.create();
        })
    }

    create() {
        if(this.isCreate) {
            const descr = document.createElement("span").textContent = "Введите варианты ответов и галочкой пометьте правильный";
            this.varyants = this.varyants.map(varN => {
                const variantWrap = document.createElement("div");
                const variant = document.createElement("div");
                const vCheckbox = document.createElement("input");
                const vInput = document.createElement("input");
                variantWrap.classList.add("variants-wrap");
                vCheckbox.setAttribute("type", "checkbox");
                vInput.setAttribute("type", "text");
                vInput.setAttribute("placeholder", "Вариант ответа");
                variant.classList.add("answer");
                variant.textContent = varN;
                variantWrap.append(variant, vCheckbox, vInput);
                return variantWrap;
            });
            btnCreateNext.classList.add("repeat-btn");
            btnCreateNext.textContent = "Далее";
            this.nameInput.setAttribute("placeholder", "Введите название теста");
            this.nameInput.value = "Тест-1";
            this.nameInput.classList.add("title-test");
            this.wrap.classList.add("create-wrapper");
            this.input.classList.add("question");
            this.input.placeholder = "Введите вопрос";
            this.indexQ.textContent = `Вопрос номер ${CreateQuizz.idxQ}`;
            document.body.appendChild(this.wrap);
            this.wrap.append(this.nameInput, this.indexQ, this.input, descr, ...this.varyants, btnCreateNext);
        }
        this.isCreate = false;
    }

    createNextQuestion() {
        btnCreateNext.addEventListener("click", () => {
            const isCheckbox = this.varyants.some(item => item.children[1].checked === true);
            const isValue = this.varyants.every(item => !!item.children[2].value);
            const isQuestion = !!this.input.value;
            if (isCheckbox && isValue && isQuestion) {
                const createdVariants = this.varyants.map(v => {
                    return {
                        answer: v.children[2].value,
                        correct: v.children[1].checked
                    }
                })
                this.dataCreated.push({ question: this.input.value, variants: { ...createdVariants } })
                CreateQuizz.idxQ++;
                this.varyants.forEach(v => {
                    v.children[2].value = "";
                    v.children[1].checked = false;
                })
                this.input.value = "";
                this.indexQ.textContent = `Вопрос номер ${CreateQuizz.idxQ}`;
                if (CreateQuizz.idxQ === CreateQuizz.totalQ + 1) {
                    allQuestions[this.nameInput.value] = this.dataCreated;
                    this.dataCreated = [];
                    CreateQuizz.idxQ = 1;
                    this.wrap.style.display = "none";
                    createActionInput.style.display = "block";
                    createActionLabel.style.display = "block";
                    this.indexQ.textContent = `Вопрос номер ${CreateQuizz.idxQ}`;
                    mountAside();
                    this.mounted()
                }
            } else {
                document.querySelector(".validate-variants").style.display = "block";
                return;
            }
        })
    }
}

const create = new CreateQuizz();
create.mounted();
create.createNextQuestion();
