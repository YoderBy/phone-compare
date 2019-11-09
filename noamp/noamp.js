jb.ns('noamp')

jb.component('noamp.main', { /* noamp.main */
  type: 'control',
  impl: group({
    controls: [
      itemlist({
        title: 'to-show-yosef',
        items: '%$todo%',
        controls: [
          group({
            style: layout.flex({alignItems: 'center', spacing: '20'}),
            controls: [
              editableText({databind: '%task%'}),
              editableBoolean({
                databind: '%completed%',
                style: editableBoolean.mdlSlideToggle()
              }),
              button({
                title: 'delete',
                action: removeFromArray({array: '%$todo%', itemToRemove: '%%'}),
                style: button.x('66'),
                features: itemlist.shownOnlyOnItemHover()
              })
            ]
          })
        ]
      }),
      button('my button')
    ]
  })
})

jb.component('data-resource.todo', { /* dataResource.todo */
  watchableData: [
    {task: 'eat', completed: false},
    {task: 'drink', completed: true}
  ]
})

jb.component('data-resource.to_show_yosef', { /* dataResource.toShowYosef */
  watchableData: [
    {name: 'yoesf', is_diabetic: true},
    {name: 'noam', is_in_8200: true}
  ]
})
