jb.ns('Todo_App')

jb.component('Todo_App.main', { /* TodoApp.main */
  type: 'control',
  impl: group({
    controls: [
      editableText({
        title: 'Whats need to be done?',
        databind: '%$new-task/task%',
        features: feature.onEnter(
          runActions(
              addToArray('%$todo%', '%$new-task%'),
              writeValue('%$new-task/task%', '')
            )
        )
      }),
      itemlist({
        title: 'todo-list',
        items: '%$todo%',
        controls: [
          group({
            style: layout.flex({alignItems: 'center', spacing: '20'}),
            controls: [
              editableText({databind: '%task%'}),
              editableBoolean('%completed%'),
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

jb.component('data-resource.new-task', { /* dataResource.newTask */
  watchableData: {
    task: 'sleep',
    completed: false
  }
})
