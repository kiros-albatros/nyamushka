let cards = document.querySelectorAll(".item:not(disabled)");
let promo = document.querySelectorAll(".card__promo");

for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (event) {
        event.preventDefault();
        if (cards[i].classList.contains("selected")) {
            cards[i].classList.remove("selected");
            promo[i].innerHTML = "Сказочное заморское яство";
            promo[i].style.color = "#B3B3B3";
        } else {
            cards[i].classList.add("selected");
        }
    })
    cards[i].addEventListener("mouseleave", function () {
        if (cards[i].classList.contains("selected")) {
            setTimeout(() => changeSelected(i), 500);
        }
    })
}


function changeSelected(z) {
    promo[z].innerHTML = "Котэ не одобряет?";
    promo[z].style.color = "#E52E7A";
}