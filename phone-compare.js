jb.ns('gsmArena','phone-compare')

jb.component('phone-compare.main', { /* htmlParsing.main */
  type: 'control',
  impl: group({
    title: '',
    controls: [
      itemlist({
        items: pipeline('%$phone%', keys()),
        controls: [
          text({title: 'property', text: '%%', features: field.columnWidth('200')}),
          text({title: 'value', text: pipeline('%$phone/{%%}%')})
        ],
        style: table.withHeaders(),
        features: [css.width('446')]
      }),
      itemlist({
        items: '%$phone/spec-list%',
        controls: [
          text({title: 'feature', text: '%feature%'}),
          text({title: 'value', text: '%val%'})
        ],
        style: table.withHeaders(),
        features: [css.width('400')]
      })
    ],
    features: variable({
      name: 'phone',
      value: pipeline('%$samsung_galaxy_m30s-9818%', gsmArena.deviceParser())
    })
  })
})

jb.component('gsm-arena.device-parser', { /* gsmArena.deviceParser */
  impl: pipeline(
    Var('input', '%%'),
    dynamicObject({
        items: pipeline(
          extractText({
              startMarkers: ['id=\"specs-list'],
              endMarker: 'class=\"note\"',
              repeating: 'true'
            }),
          extractText({
              startMarkers: 'class=\"ttl\">',
              endMarker: '</tr>',
              repeating: 'true'
            })
        ),
        propertyName: extractText({startMarkers: '\">', endMarker: '<'}),
        value: extractText({startMarkers: ['data-spec=', '\">'], endMarker: '<'})
      }),
    assign(
        prop(
            'name',
            extractText({
              text: '%$input%',
              startMarkers: '<h1 class=\"specs-phone-name-title\" data-spec=\"modelname\">',
              endMarker: '</h1>'
            })
          ),
        prop(
            'image',
            extractText({
              text: '%$input%',
              startMarkers: ['<div class=\"specs-photo-main\">', '<a href=\"', 'src=\"'],
              endMarker: '\"'
            })
          )
      ),
    first()
  )
})



jb.component('phone-compare.makeToDevices', { /* phoneCompare.makeToDevices */
  type: 'control',
  impl: group({
    controls: [
      editableText({title: 'search-url', databind: '%$url%'}),
      button({
        title: 'parse make',
        action: writeValue(
          '%$deviceUrls%',
          pipeline(
            http.get('%$url%'),
            extractText({startMarkers: 'class=\"makers\"', endMarker: '</ul>'}),
            extractText({startMarkers: '<a href=\"', endMarker: '.php', repeating: 'true'})
          )
        )
      }),
      button({
        title: 'crawl - devices url - parse device - store in results',
        action: runActionOnItems(
          pipeline('%$deviceUrls%', slice('0', '10')),
          runActions(
            writeValueAsynch(
                '%$devices/{%%}%',
                pipe(
                  http.get({url: 'https://www.gsmarena.com/%%.php'}),
                  gsmArena.deviceParser(),
                  first()
                )
              ),
            writeValue('%$progress/{%%}%', 'done')
          )
        )
      }),
      itemlist({
        items: '%$deviceUrls%',
        controls: [
          text({title: 'url', text: '%%'}),
          text({
            title: 'status',
            text: pipeline('%$progress/{%%}%'),
            features: field.columnWidth('100')
          })
        ],
        style: table.mdl(),
        visualSizeLimit: '4',
        features: [css.width('600'), watchRef({ref: '%$progress%', includeChildren: 'yes'})]
      })
    ]
  })
})


jb.component('data-resource.progress', { /* dataResource.progress */
  watchableData: {

  }
})


jb.component('phone-compare.data-compare', { /* phoneCompare.dataCompare */
  type: 'control',
  impl: group({
    controls: [
      text({
        title: 'fix values',
        text: pipeline(
          '%$devices%',
          properties(),
          wrapAsObject(
              '%id%',
              pipeline(
                '%val%',
                assign(prop('Size', split({separator: 'inch', text: '%Size%', part: 'first'})))
              )
            )
        )
      }),
      d3g.chartScatter({
        title: 'phones',
        items: pipeline('%$devices%', properties(), '%val%'),
        frame: d3g.frame({width: 1400, height: 500, top: 30, right: 50, bottom: 40, left: 60}),
        pivots: [
          d3g.pivot({title: 'price', value: '%Price%'}),
          d3g.pivot({title: 'size', value: '%Size%'})
        ],
        itemTitle: '%name%'
      }),
      itemlist({
        items: pipeline('%$devices%', properties(), '%val%'),
        controls: [
          label('%Price%'),
          text({
            title: 'size',
            text: split({separator: 'inches', text: '%Size%', part: 'first'})
          })
        ],
        style: table.mdl()
      })
    ]
  })
})