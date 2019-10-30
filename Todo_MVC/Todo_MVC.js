jb.ns('Todo_MVC')

jb.component('Todo_MVC.main', {
  type: 'control',
  impl: group({
    controls: [button('my button')]
  })
})
