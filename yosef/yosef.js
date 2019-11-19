jb.ns('yosef')

jb.component('yosef.main', {
  type: 'control',
  impl: group({
    controls: [button('my button')]
  })
})
