jb.component('xx.main', { /* xx.main */
  type: 'control',
  impl: group({
    controls: [
      button({title: 'my button', features: feature.hoverTitle('saass')}),
      itemlist({
        items: '%$people%',
        controls: [
          group({
            style: layout.horizontal(),
            controls: [
              label('%name%'),
              button({
                title: 'delete',
                style: button.x(),
                features: itemlist.shownOnlyOnItemHover()
              })
            ],
            features: css.width('500')
          })
        ],
        style: table.withHeaders()
      })
    ]
  })
})

jb.component('data-resource.people', { /* dataResource.people */
  watchableData: [
    {name: 'aa', x: 1},
    {name: 'aa', x: 1},
    {name: 'aa', x: 1},
    {name: 'aa', x: 1}
  ]
})
