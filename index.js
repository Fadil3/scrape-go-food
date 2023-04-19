const axios = require('axios')
const cheerio = require('cheerio')
const BASE_URL = 'https://gofood.co.id/en/jakarta/restaurants/near_me'
const restaurants = []

axios(BASE_URL)
  .then((response) => {
    const html = response.data
    const $ = cheerio.load(html)
    const links = []

    // Get all restaurants in page
    $('a').attr('href', function (i, link) {
      if (link.includes('restaurant')) {
        // depth first search
        links.push(`https://gofood.co.id${link}`)
      }
    })

    // remove 2 first links
    links.splice(0, 2)

    links.forEach((link) => {
      // console.log(link)
      axios(link)
        .then((response) => {
          const html = response.data
          const $ = cheerio.load(html)
          const restaurant = {
            name: $('h1').text().split(',')[0],
            address: $(
              'p[class="relative mt-3 text-gf-content-secondary line-clamp-1 gf-body-s md:gf-body-m lg:gf-body-l"]'
            ).text(),
            rating: $('p[class="gf-label-s"]').first().text(),
            restaurant_image: $(
              'div[class="relative h-full shrink-0 overflow-hidden rounded-2xl border border-gf-background-border-secondary"]'
            )
              .find('img')
              .attr('src'),
            menu: {},
            link,
          }
          restaurants.push(restaurant)
        })
        .catch((error) => {})
        .finally(() => {
          console.log(restaurants)
        })
    })
  })
  .catch((error) => {
    console.log(error)
  })
  .finally(() => {
    console.log(restaurants)
  })
