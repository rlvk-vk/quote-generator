const loader = document.getElementById('loader')
const quoteContainer = document.getElementById('quote-container')
const quoteContent = document.getElementById('quote-content')
const quoteText = document.getElementById('quote')
const authorText = document.getElementById('author')
const twitterButton = document.getElementById('twitter')
const newQuoteButton = document.getElementById('new-quote')

// Used for making sure that the script will only attempt to fetch a quote 10 times
let errors = 0

async function getQuoteFromApi(toggleInitialLoading = true) {
    if (toggleInitialLoading) {
        toggleLoading()
    }

    // We need to use a Proxy URL to make our API call in order to avoid CORS issue
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
    const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'

    try {
        const response = await fetch(proxyUrl + apiUrl)
        const data = await response.json()

        authorText.innerText = data.quoteAuthor || 'unknown'
        quoteText.innerText = data.quoteText

        // Reduce font size for long quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote')
        } else {
            quoteText.classList.remove('long-quote')
        }

        toggleLoading()
    } catch (e) {
        if (errors < 20) {
            getQuoteFromApi(false)

            errors++
        }
    }
}

function tweetQuote() {
    if (!quoteContainer.classList.contains('loading')) {
        const quote = quoteText.innerText
        const author = authorText.innerText
        const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`

        window.open(twitterUrl, '_blank')
    }
}

function toggleLoading() {
    if (quoteContainer.classList.contains('loading')) {
        quoteContainer.classList.remove('loading')
    } else {
        quoteContainer.classList.add('loading')
    }
}

// Event Listeners
newQuoteButton.addEventListener('click', () => {
    if (!quoteContainer.classList.contains('loading')) {
        getQuoteFromApi()
    }
})

twitterButton.addEventListener('click', tweetQuote)

// On Load
getQuoteFromApi()
