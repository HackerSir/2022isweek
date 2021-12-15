// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
//var CardGame = function (targetId) {
// private variables

var cards = []; // 前 12 張是題目卡，後 12 張是答案卡
var cards_num = 12;
var is_deal = false;
var card_value = [];
var question = ["1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "11C", "12C"]
var answer = ["1H", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "11H", "12H"]

// 圖書館出的題目
var library_question = ["1C", "1C", "1C", "1C", "1C", "1C", "1C", "1C", "1C", "1C", "1C", "1C"]
var library_answer = ["1H", "1H", "1H", "1H", "1H", "1H", "1H", "1H", "1H", "1H", "1H", "2H",]


var matches_found = 0;
var card1 = false,
    card2 = false;
var clickable = [];

//隱藏卡片
var hideCard = function (id) // turn card face down
{
    setTimeout(function () {
        clickable.pop(id);
    }, 500);
    if (id < cards_num)
        cards[id].firstChild.src = "./images/question.png";
    else
        cards[id].firstChild.src = "./images/ans.png";
    with (cards[id].style) {
        WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
    }
};

var moveToPack = function (id) // move card to pack
{
    hideCard(id);
    cards[id].clicked = true;
    if (id < cards_num)
        with (cards[id].style) {
            zIndex = "1000";
            top = "15px";
            left = "15px";
            WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
            zIndex = "0";
        }
    else
        with (cards[id].style) {
            zIndex = "1000";
            top = "15px";
            left = 15 + window.innerWidth / 4 + "px";
            WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
            zIndex = "0";
        }
};


var moveToPlace = function (id) // deal card
{
    setTimeout(function () {
        clickable.push(id);
    }, 500);

    cards[id].clicked = false;
    with (cards[id].style) {
        zIndex = "1000";
        top = cards[id].fromtop + "px";
        left = cards[id].fromleft + "px";
        WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
        zIndex = "0";
    }
};
//dolist:點擊之後
var showCard = function (id) // turn card face up, check for match
{
    clickable.splice($.inArray(id, clickable), 1);
    if (id === card1) return;
    if (cards[id].clicked) return;
    cards[id].className = "card";
    cards[id].firstChild.src = "./images/" + card_value[id] + ".png";
    //點擊後放大並旋轉-5度
    // with (cards[id].style) {
    //     WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(-5deg)";
    // }

    if (card1 !== false) {
        card2 = id;
        for (i = 0; i < cards_num; i++) {
            if (i == card2)
                continue
            (function (idx) {
                setTimeout(function () {
                    moveToPack(idx + cards_num);
                }, idx * 100);
            })(i);
        }
        if (parseInt(card_value[card1]) == parseInt(card_value[card2])) { // match found

            if (++matches_found == 2) { // game over, reset
                matches_found = 0;
                is_deal = true;
                for (i = 0; i < cards_num; i++) {
                    (function (idx) {
                        setTimeout(function () {
                            moveToPack(idx);
                        }, idx * 100);
                    })(i);
                }
                setTimeout(function () {
                    is_deal = false;
                }, i * 100);
                setTimeout(function () {
                    startCard();
                    alertify.confirm('快至攤位兌換獎品吧！').set({
                        title: '恭喜完成闖關',
                        labels: { ok: '重新開始', cancel: '查看解析' },
                        closable: false,
                        onok: function (event) {
                            card1 = card2 = false;
                            card_value = ["1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "11C", "12C", "13C", "1C", "2C", "3C", "1H", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "11H", "12H", "13H", "1H", "2H", "3H"];
                            deal();
                        },
                        oncancel: function (event) {
                            window.location = './explain.html';
                        }

                    });
                }, cards_num * 100);
            }
            else {
                alertify.alert('繼續挑戰下一關吧').set({
                    title: '恭喜！答對了',
                    labels: {
                        ok: '下一關',
                    },
                    closable: false,
                    onok: function (event) {
                        moveToPack(card1);
                        moveToPack(card2);
                        card1 = card2 = false;
                        deal();

                    },
                });
            }
        } else { // no match
            alertify.alert('再重新抽一次題目吧').set({
                title: '哎呀！答錯了',
                labels: {
                    ok: '重新開始',
                },
                closable: false,
                onok: function (event) {
                    moveToPack(card1);
                    moveToPack(card2);
                    card1 = card2 = false;
                    //startCard();
                    setTimeout(function () {
                        deal();
                    }, 500);
                },
            });
        }
    } else { // first card turned over
        card1 = id;
        is_deal = true;
        for (i = 0; i < cards_num; i++) {
            if (i == id) {
                continue;
            }
            (function (idx) {
                setTimeout(function () {
                    moveToPack(idx);
                }, idx * 100);
            })(i);
        }
        setTimeout(function () {
            is_deal = false;
        }, i * 100);
        with (cards[id].style) {
            //WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.8)";
            top = "15px";
            left = 15 + window.innerWidth / 4 * 2 + "px";
        }
        setTimeout(function () {
            deal_answer();
        }, (cards_num + 1) * 100);

    }
};

//點擊第一張之後亂數決定卡片位置
var cardClick = function (id) {
    //防止連點或動畫中點擊
    if (is_deal) return;
    if ($.inArray(id, clickable) === -1) return;
    showCard(id);
};

//發題目牌
var deal = function () {
    // shuffle and deal cards
    if (matches_found == 0)
        sort_tmp = question;
    else
        sort_tmp = library_question;
    sort_tmp.sort(function () {
        return Math.round(Math.random()) - 0.5;
    });
    card_value = sort_tmp;
    is_deal = true;
    for (i = 0; i < cards_num; i++) {
        (function (idx) {
            setTimeout(function () {
                moveToPlace(idx);
            }, idx * 100);
        })(i);
    }
    setTimeout(function () {
        is_deal = false;
    }, i * 100);

};

//發答案牌
var deal_answer = function () {
    // shuffle and deal cards
    if (matches_found == 0)
        sort_tmp = answer;
    else
        sort_tmp = library_answer;
    sort_tmp.sort(function () {
        return Math.round(Math.random()) - 0.5;
    });
    card_value = card_value.concat(sort_tmp);
    is_deal = true;
    for (i = 0; i < cards_num; i++) {
        (function (idx) {
            setTimeout(function () {
                moveToPlace(idx + cards_num);
                cards[idx + cards_num].firstChild.src = "./images/" + card_value[idx + cards_num] + ".png";
            }, idx * 100);
        })(i);
    }
    setTimeout(function () {
        is_deal = false;
    }, i * 100);
};

// initialise 初始化
var startCard = function () {
    cards = [];
    $('.card').remove();

    // template for card
    var card = document.createElement("div");
    card.innerHTML = "<img src=\"./images/question.png\">";
    card.className = "card";

    // 題目卡
    for (var i = 0; i < cards_num; i++) {
        var newCard = card.cloneNode(true);
        newCard.className = "card";
        newCard.fromtop = 15 + window.innerHeight / 4 + window.innerHeight / 4 * Math.floor(i / 4);
        newCard.fromleft = 15 + window.innerWidth / 4 * (i % 4);
        (function (idx) {
            newCard.addEventListener("click", function () {
                cardClick(idx);
            }, false);
        })(i);

        document.body.appendChild(newCard);
        cards.push(newCard);
    }

    // 答案卡
    card.innerHTML = "<img src=\"./images/ans.png\">";
    for (var i = 0; i < cards_num; i++) {
        var newCard = card.cloneNode(true);
        newCard.className = "card";
        with (newCard.style) {
            left = 15 + window.innerWidth / 4 + "px";
        }
        newCard.fromtop = 15 + window.innerHeight / 4 + window.innerHeight / 4 * Math.floor(i / 4);
        newCard.fromleft = 15 + window.innerWidth / 4 * (i % 4);
        (function (idx) {
            newCard.addEventListener("click", function () {
                cardClick(idx + cards_num);
            }, false);
        })(i);

        document.body.appendChild(newCard);
        cards.push(newCard);
    }

};

alertify.alert('駭，你好！', '<div>請根據卡牌上的題目找到相對應的答案！</br>卡牌說明：</br><img style="height:20vh;" src="images/question.png">  <img style="height:20vh;" src="images/ans.png">  <img style="height:20vh;" src="images/back.png"></div>').set({
    label: '開始',
    closable: false,
    onok: function (closeEvent) {
        deal();
    }
});

startCard();
//};