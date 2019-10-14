jb.ns('phone-compare')

jb.component('phone-compare.main', { /* htmlParsing.main */
  type: 'control',
  impl: group({
    title: '',
    controls: [
      itemlist({
        items: pipeline('%$phone%', keys()),
        controls: [
          text({title: 'property', text: '%%', features: field.columnWidth('200')}),
          text({title: 'value', text: pipeline('%$phone/{%%}%')})
        ],
        style: table.withHeaders(),
        features: [css.width('446')]
      }),
      itemlist({
        items: '%$phone/spec-list%',
        controls: [
          text({title: 'feature', text: '%feature%'}),
          text({title: 'value', text: '%val%'})
        ],
        style: table.withHeaders(),
        features: [css.width('400')]
      })
    ],
    features: variable({
      name: 'phone',
      value: pipeline('%$samsung_galaxy_m30s-9818%', phoneCompare.deviceParser())
    })
  })
})

jb.component('phone-compare.device-parser', { /* phoneCompare.deviceParser */
  impl: pipeline(
    Var('input', '%%'),
    dynamicObject({
        items: pipeline(
          extractText({
              startMarkers: ['id=\"specs-list'],
              endMarker: 'class=\"note\"',
              repeating: 'true'
            }),
          extractText({
              startMarkers: 'class=\"ttl\">',
              endMarker: '</tr>',
              repeating: 'true'
            })
        ),
        propertyName: extractText({startMarkers: '\">', endMarker: '<'}),
        value: extractText({startMarkers: ['data-spec=', '\">'], endMarker: '<'})
      }),
    assign(
        prop(
            'name',
            extractText({
              text: '%$input%',
              startMarkers: '<h1 class=\"specs-phone-name-title\" data-spec=\"modelname\">',
              endMarker: '</h1>'
            })
          ),
        prop(
            'image',
            extractText({
              text: '%$input%',
              startMarkers: ['<div class=\"specs-photo-main\">', '<a href=\"', 'src=\"'],
              endMarker: '\"'
            })
          ),
        prop(
            'battery',
            extractText({
              text: '%$input%',
              startMarkers: 'batdescription1\">',
              endMarker: '<'
            })
          )
      ),
    first()
  )
})



jb.component('phone-compare.makeToDevices', { /* phoneCompare.makeToDevices */
  type: 'control',
  impl: group({
    controls: [
      editableText({title: 'search-url', databind: '%$url%'}),
      button({
        title: 'parse make',
        action: writeValueAsynch(
          '%$deviceUrls%',
          pipe(
            http.get('%$url%'),
            extractText({startMarkers: 'class=\"makers\"', endMarker: '</ul>'}),
            extractText({startMarkers: '<a href=\"', endMarker: '.php', repeating: 'true'})
          )
        )
      }),
      button({
        title: 'crawl - devices url - parse device - store in results',
        action: runActionOnItems(
          pipeline('%$deviceUrls%', slice('0', '10')),
          runActions(
            writeValueAsynch(
                '%$devices/{%%}%',
                pipe(
                  http.get('https://www.gsmarena.com/%%.php'),
                  phoneCompare.deviceParser(),
                  first()
                )
              ),
            writeValue('%$progress/{%%}%', 'done')
          )
        )
      }),
      itemlist({
        items: '%$deviceUrls%',
        controls: [
          text({title: 'url', text: '%%'}),
          text({
            title: 'status',
            text: pipeline('%$progress/{%%}%'),
            features: field.columnWidth('100')
          })
        ],
        style: table.mdl(),
        visualSizeLimit: '4',
        features: [css.width('600'), watchRef({ref: '%$progress%', includeChildren: 'yes'})]
      })
    ]
  })
})


jb.component('data-resource.progress', { /* dataResource.progress */
  watchableData: {
    'xiaomi_redmi_note_8_pro-9812': 'done',
    'xiaomi_redmi_8-9800': 'done',
    'samsung_galaxy_m30s-9818': 'done',
    'samsung_galaxy_a70s-9899': 'done',
    'samsung_galaxy_a70-9646': 'done',
    'samsung_galaxy_note10+-9732': 'done',
    'infinix_hot_8-9856': 'done',
    'vivo_v17_pro-9849': 'done',
    'realme_5-9802': 'done',
    'huawei_p30_pro-9635': 'done',
    'oppo_a5_(2020)-9883': 'done',
    'samsung_galaxy_s10+-9535': 'done',
    'huawei_mate_30_pro-9885': 'done',
    'asus_rog_phone_ii_zs660kl-9770': 'done',
    'xiaomi_redmi_8a-9897': 'done',
    'vivo_s1-9766': 'done',
    'vivo_z1pro-9743': 'done',
    'samsung_galaxy_m30-9505': 'done',
    'realme_3-9558': 'done',
    'vivo_y12-9729': 'done',
    'samsung_galaxy_m20-9506': 'done',
    'vivo_nex_3_5g-9817': 'done',
    'huawei_mate_30_pro_5g-9880': 'done',
    'asus_zenfone_6_zs630kl-9698': 'done',
    'vivo_z1x-9820': 'done',
    'vivo_y17-9666': 'done',
    'vivo_u10-9890': 'done',
    'samsung_galaxy_s10_5g-9588': 'done',
    'samsung_galaxy_note10+_5g-9787': 'done',
    'huawei_mate_30-9886': 'done',
    'vivo_y15-9719': 'done',
    'motorola_moto_g7_power-9527': 'done',
    'vivo_nex_3-9873': 'done',
    'zte_nubia_red_magic_3s-9839': 'done',
    'zte_nubia_red_magic_3-9692': 'done',
    'realme_3i-9768': 'done',
    'huawei_mate_20_x_(5g)-9705': 'done',
    'huawei_mate_30_5g-9881': 'done',
    'vivo_iqoo_pro_5g-9794': 'done',
    'vivo_z5-9782': 'done',
    'vivo_v17_neo-9783': 'done',
    'vivo_iqoo_pro-9807': 'done',
    'energizer_power_max_p8100s-9590': 'done',
    'vivo_iqoo_neo-9750': 'done',
    'vivo_z5x-9717': 'done',
    'realme_c1_(2019)-9539': 'done',
    'oppo_a7n-9653': 'done',
    'archos_oxygen_68xl-9594': 'done'
  }
})


jb.component('phone-compare.data-compare', { /* phoneCompare.dataCompare */
  type: 'control',
  impl: group({
    style: layout.horizontal(),
    controls: [
      text({
        title: 'fix values',
        text: pipeline(
          '%$devices%',
          properties(),
          wrapAsObject({
              propertyName: '%id%',
              value: pipeline(
                '%val%',
                assign(prop('Size', split({separator: 'inch', text: '%Size%', part: 'first'})))
              )
            })
        )
      }),
      itemlist({
        items: pipeline('%$devices%', properties(), '%val%'),
        controls: [
          group({
            style: layout.horizontalFixedSplit({}),
            controls: [
              text({title: 'name', text: '%name%'}),
              text({text: '%Price%'})
            ]
          })
        ],
        style: itemlist.ulLi(),
        visualSizeLimit: '20',
        features: itemlist.selection({
          onSelection: openDialog({
            style: dialog.contextMenuPopup(undefined, '1000px'),
            content: group({
              style: propertySheet.titlesLeft({}),
              controls: [
                text({
                  title: 'size',
                  text: split({separator: 'inches', text: '%Size%', part: 'first'})
                }),
                text({
                  title: 'weight',
                  text: split({separator: ' ', text: '%Weight%', part: 'first'})
                }),
                text({title: 'battery', text: split({text: '%battery%'})}),
                text({
                  title: 'price',
                  text: split({separator: 'out', text: '%Price%', part: 'second'})
                }),
                text({
                  title: 'year',
                  text: split({separator: 'sed', text: '%Status%', part: 'second'})
                })
              ]
            })
          })
        })
      })
    ]
  })
})