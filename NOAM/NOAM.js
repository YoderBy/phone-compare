jb.ns('NOAM')

jb.component('NOAM.main', {
  type: 'control',
  impl: group({
    controls: [button('my button')]
  })
})
