const template = document.createElement('template')
template.innerHTML = `<li class="card">
  <h2 class="card--title"></h2>
  <div class="card--image-wrapper">
    <button class="card--image-button"><</button>
        <img
            width="256"
            class="card--img"
            src=""
        />
    <button class="card--image-button">></button>
  </div>
    <p class="card--current-image-index"></p>

  <ul class="card--text">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</li>
`

function drawCards(){

    const cardList = document.querySelector('.cards')
    cardList.innerHTML = ''

    data.forEach((c) => {
        // Clone card template
        const card = template.content.cloneNode(true)

        // Find and change value of header/title
        const header = card.querySelector('.card--title')
        header.innerHTML = c.name.charAt(0).toUpperCase() + c.name.slice(1)

        // Find and change value of img
        const image = card.querySelector('img')

        if(!c.currentImageIndex){
            c.currentImageIndex = 0
        } 

        const imageUrls = findAllImageStrings(c)
        image.src = imageUrls[c.currentImageIndex]

        const currentImageIndexDisplay = card.querySelector('.card--current-image-index')
        currentImageIndexDisplay.innerHTML = `${c.currentImageIndex+1}/${imageUrls.length+1}`

        // Find swap-image buttons and add eventlisteners
        const buttons = card.querySelectorAll('button')
        buttons[0].addEventListener('click', () => {
            //changeImage(c, 1)
            previousCard(c)
        })
        buttons[1].addEventListener('click', () => {
            //changeImage(c, -1)
            nextCard(c)
        })

        // Find list of <li> as stats and update with correct value
        const statsList = card.querySelector('.card--text')
        const statsListItems = statsList.querySelectorAll('li')

        statsListItems.forEach((element, key) => {
            element.innerHTML = `<b>${c.stats[key].stat.name.toUpperCase()}</b>: ${c.stats[key].base_stat}`
        });

        const gamesLI = document.createElement('li')
        const gameAppearances = c.game_indices.map((i) => ` ${(i.version.name).charAt(0).toUpperCase() + (i.version.name).slice(1)}`)
        gamesLI.innerHTML = `<b>Appears in:</b> ${gameAppearances}`

        statsList.appendChild(gamesLI)
        

        // Append card to cardlist
        cardList.appendChild(card)
    })
}

drawCards()

function nextCard(c){
    const imageUrls = findAllImageStrings(c)

    if(c.currentImageIndex === imageUrls.length){
        return null
    }
    c.currentImageIndex+=1
    drawCards()

}

function previousCard(c){
    if(!c.currentImageIndex){
        c.currentImageIndex = 0
    }

    if(c.currentImageIndex === 0){
        return null
    }
    c.currentImageIndex-=1
    drawCards()

}

function findAllImageStrings(c){
    let sprites = []

    // Uses recursion to find all image strings
    function rec(obj){
        if(typeof obj === 'string' && obj.startsWith('https:')){
            sprites.push(obj)
        } else if(typeof obj === 'object' && obj !== null){
            const nestedObjects = Object.values(obj)
            nestedObjects.forEach((o) => {
                    rec(o)
            })
        }
    }
    rec(c.sprites)

    // Moves offical artwork sprite to front of list
    sprites.unshift(sprites.splice(sprites.indexOf(sprites.find(s => s.includes('official-artwork'))), 1))

    return sprites
}