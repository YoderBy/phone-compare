jb.ns('phone-compare')
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
          text({title: 'name', text: '%name%', features: field.columnWidth('300')}),
          text({title: 'price', text: pipeline('%Price%', matchRegex('[0-9]+'))})
        ],
        style: table.withHeaders(),
        visualSizeLimit: '',
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
          text({
            title: 'price',
            text: split({separator: 'out', text: '%Price%', part: 'second'})
          }),
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
      })
    ]
  })
})