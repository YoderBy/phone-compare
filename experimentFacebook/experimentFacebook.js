jb.ns('experimentFacebook')

jb.component('experimentFacebook.main', {
  type: 'control',
  impl: group({
    controls: [button('my button')]
  })
})
