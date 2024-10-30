const files = document.getElementById('load-file');
const button = document.getElementById('btn');
const fileInputLabel = document.getElementById('label-load-file');
const container = document.getElementsByClassName('switch-file');

let flag = false;

function addForm(object){
    let h1 = document.createElement('h1');
    console.log(object.name);
    switch(object.name){
        case 'addpost': h1.innerHTML = 'Добавить пост'; break;
        case 'website_color_scheme': h1.innerHTML = "Цветовая палитра"; break;
        case 'login': h1.innerHTML = 'Авторизация'; break;
        case 'register': h1.innerHTML = 'Регистрация'; break;
        case 'interview': h1.innerHTML = 'Интервью'; break;
        default: h1.innerHTML = 'Заголовок'; break
    }
    h1.id = 'h1';
    container[0].append(h1);
    let form = document.createElement('form');
    form.id = 'form';
    container[0].append(form);
}

function addInputs(object){
    let inputs = object.fields;
    let form = document.getElementById('form');
    inputs.forEach(element => {
        if(element.label !== undefined){
            let label = document.createElement('label');
            label.innerHTML = element.label;
            form.append(label);
        }
        let inputObject = element.input;
        let input = document.createElement('input');
        for(let key in inputObject){
            if(inputObject[key] !== undefined){
                (inputObject.placeholder === undefined) ? (inputObject.mask === undefined) ? input.placeholder = '' : input.placeholder = inputObject.mask : input.placeholder = inputObject.placeholder;
                if(inputObject.type !== 'technology'){
                    input[key] = inputObject[key];
                }
                if(inputObject.type === 'technology'){
                    console.log('Блок select');
                    console.log(inputObject);
                    let select = document.createElement('select');
                    select.multiple = true;
                    for(let key2 in inputObject.technologies){
                        let option = document.createElement('option');
                        option.value = key2;
                        option.innerHTML = inputObject.technologies[key2];
                        select.append(option);
                    }
                    input = select;
                }
            }
        }
        form.append(input);
    });
}

function addReferences(object){
    if(object.references){
        let references = object.references;
        console.log(`Референсы: `);
        console.log(references);
        let form = document.getElementById('form');
        references.forEach((element, index) => {
            if('input' in element){
                let inputObject = element.input;
                let input = document.createElement('input');
                for(let key in inputObject){
                    if(inputObject[key] !== undefined){
                        input[key] = inputObject[key];
                    }
                }
                let divRef = document.createElement('div');
                divRef.id = `divRef${index}`;
                divRef.append(input);
                form.append(divRef);
            }else if("text without ref" in element){
                console.log(element["text without ref"]);
                let label = document.createElement('label');
                let a = document.createElement('a');
                label.innerHTML = element["text without ref"];
                a.innerHTML = element.text;
                a.href = `#${element.ref}`;
                label.append(' ');
                label.append(a);
                let divRef = document.getElementById(`divRef${index-1}`);
                if(divRef){
                    divRef.append(label);
                    divRef.style.display = 'flex';
                    divRef.style.gap = 10 + 'px'; 
                    divRef.style.alignItems = 'center';
                    form.append(divRef);
                }else{
                    divRef = document.createElement('div');
                    divRef.id = `divRef${index+1}`;
                    divRef.append(label);
                    divRef.style.display = 'flex';
                    divRef.style.gap = 10 + 'px'; 
                    divRef.style.alignItems = 'center';
                    form.append(divRef);
                }
            }else{
                let a = document.createElement('a');
                a.innerHTML = element.text;
                a.href = element.ref;
                form.append(a);
            }
        })
    }
}

function addButtons(object){
    let form = document.getElementById('form');
    if(object.buttons){
        object.buttons.forEach(buttonData => {
            let button = document.createElement('button');
            button.innerHTML = buttonData.text;
            form.append(button);
        });
    }
}

function parseObject(object){
    console.log(object);
    addForm(object);
    addInputs(object);
    addReferences(object);
    addButtons(object);
}

function readFile(file){
    const reader = new FileReader();
    let objectFile;
    reader.onload = (event) => {
        const content = event.target.result;
        objectFile = JSON.parse(content);
        parseObject(objectFile);
    }
    reader.readAsText(file);
}

async function show() {
    let file = files.files[0];
    if(flag == true){
        let form = document.getElementById('form');
        form.remove();
        let h1 = document.getElementById('h1');
        h1.remove();
        readFile(file);
    }else{
        readFile(file);
        flag = true;
    }
}

button.addEventListener('click', show);
files.addEventListener('change', function() {
    if(this.files && this.files.length > 0){
        const fileName = this.files[0].name;
        fileInputLabel.textContent = fileName;
    }else{
        fileInputLabel.textContent = "Выберите файл";
    }
})