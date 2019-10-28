jb.ns('todoMvc')

jb.component('todoMvc.main', { /* todoMvc.main */
  type: 'control',
  impl: group({
    controls: [
      button('my button'),
      itemlist({
        title: 'todo-list',
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
                style: button.x(),
                features: itemlist.shownOnlyOnItemHover()
              })
            ]
          })
        ],
        features: watchRef({ref: '%$todo%', includeChildren: 'yes', allowSelfRefresh: true})
      })
    ]
  })
})

jb.component('data-resource.todo', { /* dataResource.todo */
  watchableData: [
    {task: 'eat', completed: false},
    {task: 'drink', completed: true}
  ]
})
