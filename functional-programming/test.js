requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
  },
})

require(['ramda', 'jquery'], function (_, $) {
  const Impure = {
    getJSON: _.curry(function (callback, url) {
      $.getJSON(url, callback)
    }),

    setHtml: _.curry(function (sel, html) {
      $(sel).html(html)
    }),
  }

  const img = function (url) {
    return $('<img />', { src: url })
  }

  const trace = _.curry(function (tag, x) {
    console.log(tag, x)
    return x
  })

  const url = function () {
    return 'https://unsplash.com/napi/landing_pages/images?page=1&per_page=20'
  }

  const cover = _.compose(_.map(_.prop('cover_photo')), _.prop('popular_pages'))

  const imgUrl1 = _.compose(_.map(_.prop('download')), _.map(_.prop('links')), cover)

  const imgUrl2 = _.compose(_.map(_.compose(_.prop('download'), _.prop('links'))), cover)

  const images = _.compose(_.map(img), imgUrl1)

  const renderImages = _.compose(Impure.setHtml('body'), images)

  const app = _.compose(Impure.getJSON(renderImages), url)

  app()
})
