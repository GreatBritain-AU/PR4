document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

    const order = {
        answers: {}, 
        phone: ''
    };

    const questions = [
        {
            question: "Якого кольору бургер?",
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чорний', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                { title: 'Курка', url: './image/chickenMeat.png' },
                { title: 'Яловичина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: "Додаткові інгредієнти?",
            answers: [
                { title: 'Помідор', url: './image/tomato.png' },
                { title: 'Огірок', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Цибуля', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: "Додати соус?",
            answers: [
                { title: 'Часниковий', url: './image/sauce1.png' },
                { title: 'Томатний', url: './image/sauce2.png' },
                { title: 'Гірчичний', url: './image/sauce3.png' }
            ],
            type: 'radio'
        }
    ];


    let phoneContainer = null;
    const createPhoneUI = () => {
        if (phoneContainer) return;
        phoneContainer = document.createElement('div');
        phoneContainer.id = 'phoneContainer';
        phoneContainer.style.margin = '12px 0';
        phoneContainer.innerHTML = `
            <label style="display:block;margin-bottom:6px">Номер телефону:</label>
            <div style="display:flex;gap:8px;align-items:center">
                <input id="phoneInput" type="tel" inputmode="numeric" pattern="[0-9+]*"
                    placeholder="+380XXXXXXXXX" style="padding:6px;flex:1">
                <button id="clearPhone" type="button" style="padding:6px">C</button>
            </div>
        `;
        const modalBody = modalBlock.querySelector('.modal-body');
        if (modalBody) modalBody.prepend(phoneContainer); else modalBlock.prepend(phoneContainer);

        phoneContainer.querySelector('#clearPhone').addEventListener('click', () => {
            const inp = phoneContainer.querySelector('#phoneInput');
            inp.value = '';
            order.phone = '';
        });

        phoneContainer.style.display = 'none'; 
    };

    createPhoneUI(); 

   
    let isTestInitialized = false;

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');

        if (!isTestInitialized) {
            initTest();
            isTestInitialized = true;
        }

        renderQuestions(0);
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    let numberQuestion = 0; 

    const renderAnswers = (index) => {
       
        if (index === questions.length) {
            formAnswers.innerHTML = '';
            phoneContainer.style.display = 'block';
            const phoneInput = document.querySelector('#phoneInput');
            if (phoneInput) phoneInput.focus();
            return;
        }

        phoneContainer.style.display = 'none';
        formAnswers.innerHTML = '';


        questions[index].answers.forEach((answer, i) => {
            const inputId = `answer${index}_${i}`;
            const inputName = `answer${index}`;

            let isChecked = false;
            const saved = order.answers.hasOwnProperty(index) ? order.answers[index] : null;
            if (questions[index].type === 'radio' && saved === answer.title) isChecked = true;
            if (questions[index].type === 'checkbox' && Array.isArray(saved) && saved.includes(answer.title)) isChecked = true;

            const answerItem = document.createElement('div');
            answerItem.classList.add('answer-item', 'd-flex', 'flex-column');
            answerItem.innerHTML = `
                <div class="answers-item d-flex flex-column">
                    <input type="${questions[index].type}"
                        id="${inputId}"
                        name="${inputName}"
                        class="d-none" ${isChecked ? 'checked' : ''}>
                    <label for="${inputId}" class="d-flex flex-column justify-content-between" style="cursor:pointer">
                        <img class="answerImg" src="${answer.url}" alt="${answer.title}" style="max-width:120px">
                        <span>${answer.title}</span>
                    </label>
                </div>
            `;
            formAnswers.appendChild(answerItem);

            const inputEl = document.getElementById(inputId);
            inputEl.addEventListener('change', () => {
                saveCurrentAnswer(index);
                console.log('Проміжний об\'єкт замовлення:', order);
            });
        });
    };

    const saveCurrentAnswer = (index) => {
        if (index < 0 || index >= questions.length) return;
        const inputs = Array.from(document.querySelectorAll(`input[name="answer${index}"]`));
        if (questions[index].type === 'radio') {
            const checked = inputs.find(i => i.checked);
            if (checked) {
                const label = formAnswers.querySelector(`label[for="${checked.id}"]`);
                const title = label ? label.querySelector('span').textContent : '';
                order.answers[index] = title || '';
            }
        } else { 
            const checked = inputs.filter(i => i.checked);
            const titles = checked.map(ch => {
                const label = formAnswers.querySelector(`label[for="${ch.id}"]`);
                return label ? label.querySelector('span').textContent : null;
            }).filter(Boolean);
            order.answers[index] = titles;
        }
    };

    const renderPhoneMenu = () => {
        questionTitle.textContent = "Введіть ваш номер телефону";
        renderAnswers(questions.length); 
        nextButton.classList.add('d-none');
        sendButton.classList.remove('d-none');
        prevButton.classList.remove('d-none');
    };

    const renderQuestions = (index) => {
        numberQuestion = index;

        switch (true) {
            case (index < questions.length):
                questionTitle.textContent = questions[index].question;
                renderAnswers(index);

                prevButton.classList.toggle('d-none', index === 0);

                nextButton.classList.remove('d-none');

                sendButton.classList.add('d-none');
                break;

            case (index === questions.length):
                renderPhoneMenu();
                break;
        }
    };

    function initTest() {

        nextButton.addEventListener('click', () => {

            if (numberQuestion < questions.length) saveCurrentAnswer(numberQuestion);

            if (numberQuestion < questions.length) {
                numberQuestion++;
                renderQuestions(numberQuestion);
            }
        });

        prevButton.addEventListener('click', () => {
            if (numberQuestion > 0) {
                numberQuestion--;
                renderQuestions(numberQuestion);
            }
        });

        sendButton.addEventListener('click', () => {


            const phoneInput = document.querySelector('#phoneInput');
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            if (!phoneVal) {
                alert('Введіть номер телефону.');
                return;
            }
            order.phone = phoneVal;

            console.log('Фінальний об\'єкт замовлення:', order);

            const msgBlock = document.createElement('div');
            msgBlock.style.padding = '12px';
            msgBlock.style.marginTop = '12px';
            msgBlock.style.border = '1px solid #ddd';
            msgBlock.style.background = '#f9f9f9';
            msgBlock.innerHTML = `<h3>Дякуємо за замовлення! Наш менеджер зв’яжеться з вами.</h3>`;

            if (formAnswers && formAnswers.parentNode) {
                formAnswers.parentNode.replaceChild(msgBlock, formAnswers);
            } else if (phoneContainer && phoneContainer.parentNode) {
                phoneContainer.parentNode.replaceChild(msgBlock, phoneContainer);
            } else {
                modalBlock.appendChild(msgBlock);
            }

            nextButton.disabled = true;
            prevButton.disabled = true;
            sendButton.disabled = true;
        }, { once: true });
    }

});
