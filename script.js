const editor = document.getElementById('editor');
const themeSelect = document.getElementById('themeSelect');
let savedSelection;

// themes selection
themeSelect.addEventListener('change', (e) => {
    document.body.className = `theme-${e.target.value}`;
});

// save and restore selection
function saveSelection() {
    if (window.getSelection) {
        savedSelection = window.getSelection().getRangeAt(0); 
    }
}

function restoreSelection() {
    if (savedSelection) {
        if (window.getSelection) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedSelection);
        }
    }
}

// event listeners to save selection before each button click
const stylingButtons = ['boldBtn', 'italicBtn', 'underlineBtn'];
stylingButtons.forEach(btnId => {
    document.getElementById(btnId).addEventListener('mousedown', (e) => {
        e.preventDefault(); // preventing losing focus
        saveSelection(); 
    });
});

// styling handlers
document.getElementById('boldBtn').addEventListener('click', () => {
    restoreSelection();
    document.execCommand('bold', false, null);
    console.log("Yo mama fat!");
});

document.getElementById('italicBtn').addEventListener('click', () => {
    restoreSelection();
    document.execCommand('italic', false, null);
    console.log("Hey there, cutie.");
});

document.getElementById('underlineBtn').addEventListener('click', () => {
    restoreSelection();
    document.execCommand('underline', false, null);
    console.log("Emphasis because no one cares :(");
});

document.getElementById('bulletBtn').addEventListener('mousedown', (e) => {
    e.preventDefault();
    saveSelection();
});

document.getElementById('bulletBtn').addEventListener('click', () => {
    restoreSelection();
    document.execCommand('insertUnorderedList', false, null);
});

document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
    const size = e.target.value;
    if (size) {
        restoreSelection();
        document.execCommand('fontSize', false, size);
        console.log(`Font size set to ${size}. Big or small, it’s all about you.`);
    }
});

// download handlers
document.getElementById('downloadTxt').addEventListener('click', () => {
    const text = editor.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.txt';
    link.click();
    console.log("Downloading your crap, hold on.");
});

document.getElementById('downloadPdf').addEventListener('click', () => {
    const element = editor.cloneNode(true);

    const options = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
    console.log("PDF, because why not?");
});

// placeholder behavior
editor.addEventListener('focus', () => {
    if (editor.textContent === '') {
        editor.innerHTML = ''; 
    }
});

editor.addEventListener('blur', () => {
    if (editor.textContent === '') {
        editor.innerHTML = '<span style="color: #999;">' + editor.getAttribute('placeholder') + '</span>';
    }
});

// initial placeholder
editor.innerHTML = '<span style="color: #999;">' + editor.getAttribute('placeholder') + '</span>';
console.log("Starting off with placeholder. You know, just in case, people are dumb.");

// random sassy quote fetch and display
async function fetchRandomQuote() {
    try {
        const response = await fetch('quotes.txt');
        const data = await response.json();
        const quotes = data.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        const quoteContainer = document.getElementById('quoteContainer');
        quoteContainer.innerHTML = `${randomQuote.text}`;
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRandomQuote);