jb.ns('fry')

jb.component('fry.main', { /* fry.main */
  type: 'control',
  impl: group({
    controls: [
      button({title: 'new task', action: addToArray('%$todolist%', '%$new-task%')}),
      editableText({title: 'whas need to be done?', databind: '%$new-task/task%'}),
      itemlist({
        title: 'todolist',
        items: '%$todolist%',
        controls: [
          editableBoolean('%completed%'),
          editableText({databind: '%task%'}),
          button({
            title: 'delete',
            action: removeFromArray({array: '%$todolist%', itemToRemove: '%%'}),
            style: button.x()
          })
        ],
        features: watchRef({ref: '%$todolist%', includeChildren: 'yes', allowSelfRefresh: true})
      })
    ]
  })
})

jb.component('data-resource.todolist', { /* dataResource.todolist */
  watchableData: [
    {task: 'drink', completed: false},
    {task: 'drink', completed: false},
    {task: 'drink', completed: false},
    {task: 'drink', completed: false},
    {task: 'drink', completed: false}
  ]
})

jb.component('data-resource.new-task', { /* dataResource.newTask */
  watchableData: {
    task: 'drinkfada',
    completed: false
  }
})
