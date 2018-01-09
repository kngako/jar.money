var words = [
    "lorem",
    "ipsum",
    "elit",
    "dolor",
    "donec",
    "odio",
    "eros",
    "erit",
    "turpis",
    "semper",
    "pede",
    "nec",
    "justo",
    "eget",
    "felis",
    "mauris",
    "orci",
    "morbi",
    "sem",
    "quis",
    "dui",
    "ornare",
    "nisi",
    "diam",
    "sed",
    "arcu",
    "cras",
    "neque",
    "cursus",
    "tortor",
    "augue",
    "magna",
    "nam",
    "luctus",
    "metus",
    "nulla",
    "nibh",
    "ligula",
    "quam",
    "auctor",
    "nunc",
    "risus",
    "vel",
    "velit"
] // TODO: append to this word list...

var wordsWithMeaning = [
    "brand",
    "king",
    "power",
    "queen",
    "goat",
    "book",
    "money",
    "ugly",
    "sigidli",
    "lover",
    "crazy",
    "flow",
    "period",
    "globe",
    "bank",
    "phone",
    "dineo",
    "koleka",
    "thato",
    "banksy",
    "smart"
]


$(document).ready(function(){
    setInterval(function(){
        var index = Math.floor(Math.random()*words.length);
        document.getElementById("jar-short-code").innerHTML = words[index];
    }, 400);
});