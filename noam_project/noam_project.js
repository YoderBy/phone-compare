jb.ns('noam_project')

jb.component('noam_project.main', { /* noamProject.main */
  type: 'control',
  impl: group({
    controls: [
      button({
        title: 'hello %$person/name%',
        features: watchRef({ref: '%$person/name%', allowSelfRefresh: true})
      }),
      editableText({databind: '%$person/name%'})
    ]
  })
})

jb.component('data-resource.noam's json', { /* dataResource.noam's json */
  watchableData: "%$noam's json%"
})

jb.component('data-resource.person', { /* dataResource.person */
  watchableData: {
    name: 'dan'
  }
})
