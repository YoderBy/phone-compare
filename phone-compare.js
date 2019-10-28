jb.ns('phone-compare')


jb.component('phone-compare.main', { /* phoneCompare.main */
  type: 'control',
  impl: group({
    title: '',
    controls: [
      d3g.chartScatter({
        title: 'phones',
        items: '%$fixed-devices%',
        frame: d3g.frame({width: 1200, height: 480, top: 20, right: 20, bottom: 40, left: 80}),
        pivots: [
          d3g.pivot({title: 'battery', value: '%battery%'}),
          d3g.pivot({title: 'size', value: '%size%'}),
          d3g.pivot({title: 'price', value: '%price%'}),
          d3g.pivot({title: 'price', value: '%price%'})
        ],
        itemTitle: '%name%',
        style: d3Scatter.plain()
      })
    ]
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
        value: firstSucceeding(
          extractText({startMarkers: ['<td', '>'], endMarker: '<'}),
          pipeline(
              extractText({startMarkers: list('<a', '>'), endMarker: '<', repeating: 'true'}),
              reverse(),
              first()
            )
        )
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

jb.component('phone-compare.facebook-parser', {
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
        value: firstSucceeding(
          extractText({startMarkers: ['<td', '>'], endMarker: '<'}),
          pipeline(
              extractText({startMarkers: list('<a', '>'), endMarker: '<', repeating: 'true'}),
              reverse(),
              first()
            )
        )
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
      button({
        title: 'parser check',
        action: writeValue(undefined, pipeline('%$phone-page%', phoneCompare.deviceParser()))
      }),
      editableText({title: 'search-url', databind: '%$url%'}),
      group({
        style: layout.horizontal(),
        controls: [
          button({
            title: 'parse-one-url',
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
              pipeline('%$deviceUrls%', slice('', '')),
              runActions(
                writeValue('%$progress/{%%}%', 'running'),
                writeValueAsynch(
                    '%$devices/{%%}%',
                    pipe(
                      http.get('https://www.gsmarena.com/%%.php'),
                      phoneCompare.deviceParser(),
                      first()
                    )
                  ),
                writeValue('%$progress/{%%}%', 'done'),
                refreshControlById('url-list')
              )
            )
          })
        ]
      }),
      button({
        title: 'parse urls from start to finish ',
        action: runActionOnItems(
          pipeline(
            range('6', '9'),
            replace({find: '{}', replace: '%%', text: '%$template-url%'})
          ),
          runActions(
            writeValueAsynch(
                '%$deviceUrls%',
                pipe(
                  http.get('%$url%'),
                  extractText({startMarkers: 'class=\"makers\"', endMarker: '</ul>'}),
                  extractText({startMarkers: '<a href=\"', endMarker: '.php', repeating: 'true'})
                )
              ),
            refreshControlById('url-list'),
            runActionOnItems(
                pipeline('%$deviceUrls%', slice('0', '10')),
                runActions(
                  writeValue('%$progress/{%%}%', 'running'),
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
        visualSizeLimit: '',
        features: [
          css.width('600'),
          watchRef({ref: '%$progress%', includeChildren: 'yes'}),
          id('url-list')
        ]
      })
    ]
  })
})


jb.component('data-resource.progress', { /* dataResource.progress */
  watchableData: {
    'xiaomi_mi_max-8057': 'done',
    'xiaomi_mi_mix-8400': 'done',
    'huawei_mate_9-8073': 'done',
    'lenovo_phab2_pro-8145': 'done',
    'meizu_m3_max-8321': 'done',
    'huawei_mate_10-8877': 'done',
    'xiaomi_pocophone_f1-9293': 'done',
    'samsung_galaxy_note9-9163': 'done',
    'huawei_mate_20_pro-9343': 'done',
    'xiaomi_mi_a2_lite_(redmi_6_pro)-9247': 'done',
    'xiaomi_redmi_note_6_pro-9333': 'done',
    'huawei_p20_pro-9106': 'done',
    'huawei_mate_20-9367': 'done',
    'xiaomi_redmi_5_plus_(redmi_note_5)-8959': 'done',
    'honor_view_20-9468': 'done',
    'xiaomi_mi_max_3-8963': 'done',
    'huawei_mate_10_pro-8854': 'done',
    'huawei_mate_20_x-9369': 'done',
    'asus_rog_phone_zs600kl-9224': 'done',
    'realme_2-9299': 'done',
    'xiaomi_redmi_note_5_ai_dual_camera-9120': 'done',
    'xiaomi_mi_max_2-8582': 'done',
    'samsung_galaxy_s8_active-8676': 'done',
    'oppo_f3_plus-8613': 'done',
    'vivo_nex_s-9227': 'done'
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
          text({title: 'name', text: '%name%', features: field.columnWidth('300')}),
          text({title: 'price', text: pipeline('%Price%', phoneCompare.priceParser())})
        ],
        style: table.withHeaders(),
        visualSizeLimit: '5',
        features: [
          itemlist.selection({
            databind: '%$selected%',
            selectedToDatabind: '%%',
            databindToSelected: ''
          }),
          itemlist.keyboardSelection({}),
          css.width('600')
        ]
      }),
      group({
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
          text({title: 'battery', text: matchRegex('[0-9]+', '%battery%')}),
          text({title: 'price', text: pipeline('%Price%', phoneCompare.priceParser())}),
          text({
            title: 'year',
            text: split({separator: 'sed', text: '%Status%', part: 'second'})
          }),
          image({
            url: '%image%',
            width: '100',
            height: '100',
            features: field.title('image')
          })
        ],
        features: [group.data('%$selected%'), watchRef('%$selected%')]
      }),
      button({
        title: 'create pivots ',
        action: writeValue(
          '%$fixed-devices%',
          pipeline(
            pipeline(
                '%$devices%',
                properties(),
                pipeline(
                    '%val%',
                    obj(
                        prop('price', pipeline('%Price%', phoneCompare.priceParser())),
                        prop('battery', matchRegex('[0-9]+', '%battery%')),
                        prop('size', split({separator: 'inches', text: '%Size%', part: 'first'})),
                        prop('weight', matchRegex('[0-9]+', '%Weight%')),
                        prop('name', '%name%')
                      )
                  )
              )
          )
        )
      })
    ]
  })
})

jb.component('phone-compare.price-parser', { /* phoneCompare.priceParser */
  impl: pipeline(
    '%%'
  )
})

jb.component('data-resource.currency-converter', { /* dataResource.currencyConverter */
  passiveData: {
    '$': 3.52,
    USD: 3.52,
    inda: 0.049,
    INR: 0.049,
    eur: 3.87,
    EUR: 3.87,
    DOLLAR: 3.52,
    DOLLARS: 3.52
  }
})

jb.component('data-resource.selected', { /* dataResource.selected */
  watchableData: {
    Technology: 'GSM / HSPA / LTE',
    '2G bands': 'GSM 850 / 900 / 1800 / 1900 - SIM 1 & SIM 2',
    '3G bands': 'HSDPA 850 / 900 / 1900 / 2100',
    '4G bands': 'LTE band 1(2100), 2(1900), 3(1800), 4(1700/2100), 5(850), 7(2600), 8(900), 38(2600), 39(1900), 40(2300), 41(2500)',
    Speed: 'HSPA 42.2/5.76 Mbps, LTE-A (3CA) Cat12 600/150 Mbps',
    Announced: '2016, October',
    Status: 'Available. Released 2016, November',
    Dimensions: '158.8 x 81.9 x 7.9 mm (6.25 x 3.22 x 0.31 in)',
    Weight: '209 g (7.37 oz)',
    Build: 'Front glass, ceramic frame, back',
    SIM: 'Dual SIM (Nano-SIM, dual stand-by)',
    Type: 'IPS LCD capacitive touchscreen, 16M colors',
    Size: '6.4 inches, 108.7 cm',
    Resolution: '1080 x 2040 pixels, 17:9 ratio (~362 ppi density)',
    OS: 'Android 6.0 (Marshmallow), upgradable to 8.0 (Oreo); MIUI 10',
    Chipset: 'Qualcomm MSM8996 Snapdragon 821 (14 nm)',
    CPU: 'Quad-core (2x2.35 GHz Kryo & 2x2.19 GHz Kryo)',
    GPU: 'Adreno 530',
    'Card slot': 'No',
    Internal: '128GB 4GB RAM, 256GB 6GB RAM',
    Single: '5 MP, f/2.2',
    Features: 'Dual-LED dual-tone flash, HDR',
    Video: '1080p@30fps',
    Loudspeaker: undefined,
    '3.5mm jack': undefined,
    'Active noise cancellation with dedicated mic': 'Active noise cancellation with dedicated mic',
    WLAN: 'Wi-Fi 802.11 a/b/g/n/ac, dual-band, Wi-Fi Direct, hotspot',
    Bluetooth: '4.2, A2DP, LE',
    GPS: 'Yes, with A-GPS, GLONASS, BDS',
    NFC: 'Yes',
    Radio: 'No',
    USB: 'Type-C 1.0 reversible connector',
    Sensors: 'Fingerprint (rear-mounted), accelerometer, gyro, proximity, compass, barometer',
    'Non-removable Li-Ion 4400 mAh battery': 'Non-removable Li-Ion 4400 mAh battery',
    Charging: undefined,
    Colors: 'Black, White',
    Price: 'About 390 EUR',
    Performance: '',
    Display: undefined,
    Camera: undefined,
    'Audio quality': undefined,
    'Battery life': '',
    name: 'Xiaomi Mi Mix',
    image: 'https://www.gravatar.com/avatar/2900b88d10e585a546c9ff5140591320?r=g&s=50',
    battery: 'Non-removable Li-Ion 4400 mAh battery'
  }
})

jb.component('phone-compare.facebook', { /* phoneCompare.facebook */
  type: 'control',
  impl: group({
    controls: [
      button({
        title: 'click me',
        action: runActionOnItems(pipeline('%$Gantz%', phoneCompare.facebookParser()))
      })
    ]
  })
})

