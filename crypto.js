import API_KEY from "./js/config.js";

//!Selectors
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
//.class1.class2 vs. .class1 .class2 
const msgSpan = document.querySelector(".container .msg");
const coinList = document.querySelector(".ajax-section .container .coins");

//!localStorage
localStorage.setItem("API_KEY", EncryptStringAES(API_KEY));

//!Events
form.addEventListener("submit", (e) => {
    e.preventDefault();
    input.value && getCoinDataFromApi();
    
    // e.target.reset()
    // e.currentTarget.reset()
    form.reset();
});

//!Functions
const getCoinDataFromApi = async () => {
    const API_KEY = DecryptStringAES(localStorage.getItem("API_KEY"));
    // console.log(API_KEY)
    //*   template literal using ==> ${input.value} since 2015 WITH ES6. SO ES6 HAS ARROWFUNCTION, CONST-LET
    const URL = `https://api.coinranking.com/v2/coins?search=${input.value}&limit=1`;

    const options = {
        headers: {
            "x-access-token": API_KEY,
        },
    };
    //fetch vs. axios
    //   const response = await fetch(URL, options)
    //     .then((response) => response.json())
    //     .then((result) => console.log(result.data.coins[0]));
    try {
        const response = await axios(URL, options)
    // console.log(response.data.data.coins[0])
    const { price, symbol, change, iconUrl, name } = response.data.data.coins[0];
    //? coin control
    const coinNameSpans = coinList.querySelectorAll("h2 span")
    // console.log(coinNameSpans)
    if (coinNameSpans.length > 0) {
        const filteredArray = [...coinNameSpans].filter(span => span.innerText == name);
        console.log(filteredArray)
        if (filteredArray.length > 0) {
            msgSpan.innerText = `You already know the data for ${name}, Please search for anathor coin 😉`
            setTimeout(() => {
                msgSpan.innerText = ""
            }, 3000)
            return;
        }
    }
    const createdLi = document.createElement("li");
    createdLi.classList.add("coin");
    createdLi.innerHTML = `
            <h2 class="coin-name" data-name=${name}>
                <span>${name}</span>
                <sup>${symbol}</sup>
            </h2>
            <div class="coin-temp">$${Number(price).toFixed(6)}</div>
            <figure>
                <img class="coin-icon" src=${iconUrl}>                
                <figcaption style='color:${change < 0 ? "red" : "green"}'>
                    <span><i class="fa-solid fa-chart-line"></i></span>
                    <span>${change}%</span>
                </figcaption>
            </figure>
            <span class="remove-icon">
                <i class="fas fa-window-close" style="color:red"></i>
            </span>`;
    //append vs. prepend
    coinList.prepend(createdLi)
    //!remove
    createdLi.querySelector(".remove-icon").addEventListener("click", () => {
        createdLi.remove()
    })
    } catch (error) {
        //error logging
        // postErrorLog("crypt.js", "getCoinDataFromApi" new Date(), error...)
        msgSpan.innerText = `Coin not found`
            setTimeout(() => {
                msgSpan.innerText = ""
            }, 3000)
    }
    
};
