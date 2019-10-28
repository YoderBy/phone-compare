jb.ns('exp')

jb.component('exp.main', { /* exp.main */
  type: 'control',
  impl: group({
    controls: [
      editableText({}),
      button('my button'),
      itemlist({
        items: '%$todolist%',
        controls: [
          editableText({databind: '%task%'}),
          editableBoolean({databind: '%completed%', style: editableBoolean.checkbox()}),
          button({
            title: 'click me',
            action: splice({
              array: '%$todolist%',
              fromIndex: indexOf('%$todolist%', '%%'),
              noOfItemsToRemove: '1'
            }),
            style: button.x()
          })
        ],
        features: watchRef({ref: '%$todolist%', allowSelfRefresh: true})
      })
    ]
  })
})

jb.component('data-resource.todolist', { /* dataResource.todolist */
  watchableData: [
    {task: 'eat', completed: false},
    {task: 'drink', completed: true}
  ]
})
