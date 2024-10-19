import "./styles.css";

let resultData = [];
let favPosts = {};
const saveConfirmed = document.querySelector('.saveConfirmed');
const loader = document.querySelector('.loader');
const homebtn = document.querySelector('.homebtn');
const favbtn = document.querySelector('.favbtn');
const post = document.querySelector('.post');
const homenav = document.getElementById('homenav');
const homefav = document.getElementById('homefav');
const favnav = document.getElementById('favnav');
let date = new Date();
let endDate = new Date().toISOString().slice(0, 10);
let start = date.getDate() - 6;
let startDate = new Date(date.setDate(start)).toISOString().slice(0, 10);
let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`;
console.log(startDate);
console.log(endDate);


function saveFav(resultUrl) {
    resultData.forEach(result => {
        if(result.url.includes(resultUrl) && !favPosts[resultUrl]){
            favPosts[resultUrl] = result;
            localStorage.setItem('favpost', JSON.stringify(favPosts));
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 3000);
        }
    })
}

function removeFav(resultUrl) {
    if(favPosts[resultUrl]){
        delete favPosts[resultUrl];
        localStorage.setItem('favpost', JSON.stringify(favPosts));
        renderData('fav');
    }
}

function createDOM(data) {
    let renderArray = data === 'results' ? resultData : Object.values(favPosts);
    renderArray.forEach(result => {
        // Card
        const card = document.createElement('div');
        card.classList.add('card');

        //Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        //Image
        const img = document.createElement('img');
        img.src = result.url;
        img.alt = 'SPACE J IMAGE';
        img.loading = 'lazy';
        img.classList.add('card-img');

        //CardBody
        const cbody = document.createElement('div');
        cbody.classList.add('card-body');

        //Card Title
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerText = result.title;

        //Savebtn
        const savebtn = document.createElement('p');
        savebtn.classList.add('clickable');
        savebtn.style.color = 'dodgerblue';
        if (data === 'results') {
            savebtn.textContent = 'Add To Favorites';
            savebtn.addEventListener('click', function () {
                saveFav(`${result.url}`);
            });
        }
        else{
            savebtn.textContent = 'Remove Favorites';
            savebtn.addEventListener('click', function () {
                removeFav(`${result.url}`);
            });
        }

        //CardText
        const ctext = document.createElement('p');
        ctext.innerText = result.explanation;

        //Card Footer
        const cfooter = document.createElement('small');


        //CardDate
        const cdate = document.createElement('strong');
        cdate.innerText = result.date;

        //Author
        let author = result.copyright === undefined ? '' : result.copyright;
        const cauthor = document.createElement('span');
        cauthor.innerText = author;


        cfooter.append(cdate, cauthor);
        cbody.append(title, savebtn, ctext, cfooter);
        link.append(img);
        card.append(link, cbody);
        post.append(card);
    });
}

async function SpaceData() {
    loader.classList.remove('hidden');
    try {
        const r = await fetch(apiUrl);
        resultData = await r.json();
        renderData('results');
    } catch (error) {
        console.log("error", e);
    }
}


function changeNav(data) {
    loader.classList.add('hidden');
    if(data === 'results'){
        homenav.style.display = '';
        favnav.style.display = 'none';
    }
    else{
        homenav.style.display = 'none';
        favnav.style.display = '';
    }
}


function renderData(data) {
    if (localStorage.getItem('favpost')) {
        favPosts = JSON.parse(localStorage.getItem('favpost'));
    }
    post.innerHTML = '';
    createDOM(data);
    changeNav(data);
}

function init() {
    SpaceData();
    homebtn.addEventListener('click', SpaceData);
    homefav.addEventListener('click', SpaceData);
    favbtn.addEventListener('click', function () {
        renderData('fav');
    });
}

init();
