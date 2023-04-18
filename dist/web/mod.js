var Os = Object.defineProperty;
var js = (o, e) => {
  for (var t in e) Os(o, t, { get: e[t], enumerable: !0 });
};
var _n = {
  cborHex:
    "5910e15910de01000032323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232222533303c323232533303f3370e90010010999119baf304337586460886014606800260866066002004646084606400260820020082646464a66608466e1d2002002133223375e608c6eb0c8c11cc034c0dc004c118c0d8004008c8c114c0d4004c11001001c4ccc888c8c8c8c8c8c8c8c8c8c8c8c94ccc144cdc3a40040042c2646464a6660a866e1d2002002132323232325330503370e6eb4c16cc16800d20021533050323375e6e9cc130060dd39826000982d8048a99828198139999111919191981b1998179bad3061003375a60c20046eb4c184004ccc0bcdd6983098300019bad30613060002375a60c260c000260a0006609e006609c00666605e60b600460b60026eacc16cc16803cccc0bcc16c008c16c004dd5982d801982d982d00099981438233302870066605e60b600460b60026eacc16c014ccc0bcc16c008c16c004dd5982d982d007199817982d801182d8009bab305b0041533050330273332223232323303633302f375a60c20066eb4c184008dd698308009998179bad30613060003375a60c260c00046eb4c184c180004c14000cc13c00cc13800cccc0bcc16c008c16c004dd5982d982d007999817982d801182d8009bab305b003305b305a001333028704666050e00ccc0bcc16c008c16c004dd5982d802999817982d801182d8009bab305b00c33302f305b002305b001375660b60082a660a06644646466e24cdc118229bad305f002375a60be60bc00266e08dd6982f982f0011bad305f001304e003304d0013332223232323303633302f375a60c20066eb4c184008dd698308009998179bad30613060003375a60c260c00046eb4c184c180004c14000cc13c00cc13800cccc0bcc16c008c16c004dd5982d982d007999817982d801182d8009bab305b003305b305a00133302f305b002305b001303330333330377006eacc16c030cc0f4104dd5982d982d007099999111199119baf374c0046e98004c8c8c8c0e8ccc0f9c01998191bae3062003375c60c460c20066eb4c188004ccc0c8dd718310011bae30623061002375a60c460c200260a200860a0008609e00800260b600460b600266605e60b600460b60026066606666606ee00dd5982d8061981e8209bab305b305a00e303330333330377006eacc16c030cc0f4104dd5982d982d007182c800982480a182b800982b000982a9823182b0008b182b001182b0009baa303b323054303b304400132305430533044001303c3303d303e3053007375860a601660a600460a60026ea8c0e0c140c13c004c138004c0f8c0dccc0e0c0e8c13800cdd61827002981e9918271826981f000981b1981b981c18268011bac304d006304b001304a001303a006304800130470013037304730370013044004304400100730440023044001375464646464012a66608466e1d20000021323232323232324994ccc11400452616304800653330463370e900000109919191919191919191919191919191919191924ca6660aa0022930b182c003299982b19b87480000084c8c8c8c8c8c8c9265333059001149858c17000cdd6800982d800982c8019bad00130580011630580023058001375400260a800260a400ca6660a066e1d20000021323232533305353304c3370e0029000099b87001480e04c8c8c94ccc158cdc49b8d001481004c8c9265333054001149858c15c00c58dd7000982b000982a0020b1b8d001375c00260a40022c60a400460a40026ea8004c138004c1300194ccc128cdc3a40000042646464a66609aa6608c66e1c005200013370e002901c0991919299982819b89371a00290200991924ca66609c0022930b18288018b1bae0013050001304e00416371a0026eb8004c13000458c130008c130004dd500098240008b182400118240009baa0013044001153330423370e900100109924ca66607e0022930b0b182200118220009baa0053041002304100137546464646400ea66607e66e1d20000021323232323232324994ccc10800452616304500653330433370e900000109919299982299b87371a002901c09919191919191919191919191919191919191924ca6660a80022930b182b80298241bab0033304f2337606464a6660aea660a066e1c005200013370e002901c0982d8018b1b8d001375c60b2002646460b4006660a2466ec0c94ccc160cdc49b8d001481004c17000858dd7182d80099182d8011bad305a001001375660b00020026eac004c150004c1480194ccc140cdc3a40000042646464a6660a6a6609866e1c005200013370e002901c0991919299982b19b89371a00290200991924ca6660a80022930b182b8018b1bae0013056001305400416371a0026eb8004c14800458c148008c148004dd500098270009826003299982519b87480000084c8c8c94ccc1354cc118cdc3800a4000266e1c005203813232325333050337126e340052040132324994ccc13800452616305100316375c00260a0002609c0082c6e34004dd700098260008b182600118260009baa0013048001304600316375c002608a0022c608a004608a0026ea8004c10400454ccc0fccdc3a40040042646464646464649329998210008a4c2c608a00ca66608666e1d20000021323253330453370e6e340052038132323232323232323232323232323232323232324994ccc154004526163058003375a00260ae00260aa00a608c6eac00ccc1348cdd81919299982aa9982719b87001480004cdc3800a4070260b20062c6e34004dd7182b8009919182c00199827919bb0325333056337126e3400520401305a00216375c60b20026460b20046eb4c160004004dd5982b0008009bab001305200130500053041375600666090466ec0c8c94ccc1414cc124cdc3800a4000266e1c00520381305400316371a0026eb8c148004c8c8c14c00ccc1288cdd819299982899b89371a00290200982a8010b1bae3054001323054002375a60a60020026eacc144004004dd580098268009825802981e1bab003330432337606464a666096a6608866e1c005200013370e002901c098278018b1b8d001375c609a0026464609c0066608a466ec0c94ccc130cdc49b8d001481004c14000858dd718278009918278011bad304e001001375660980020026eac004c120004c11800c58dd700098228008b182280118228009baa0013041001163041002304100137540062930b1181d18010009181c98010009181c18010009181b98010009181b18010009181a980e80091191929981699b89375a60700046eb4c0e00044cdc49bad30383037001375a6070606e004604e004604c00444464646601a6600a6eb4c0e0008dd6981c000998029bad30383037002375a6070606e002604e004604c00444466e0ccdc10019980219b8000248008004cc010008004c0ac8894ccc0c8cdc3800a40002900109919b8233704002002a66606666e1ccdc30012400890000a400420066600600466e0c005200422253330313370e002900008178998020019980280100091198021ba9002374c00244660066ea4008dd4000911981619bb000200102b2223233005300100430010033006001223374a9000198151ba80023302a375000200697ae02232333019003375c60580026eb8c0b0c0ac004c06c0048cc0088c94ccc0a4c0140044894004488c00800ccc01494ccc0a4cdd78009ba8480004894004488c00800c0040048c00c8ccc008dd58009191118010019ba600112250015746446604244a666048002204a26466600a6056605400446605066ec0c0b4c0ac00c0040084004c008c0a0004004888ccc01088ccc01c0140080040080048c00c88dd3198019bab002375600246004446ea0cc00cdd68011bad0012223333004003220020020012301b30020012232322330010030022225333020001133022003002132323253330263375e00400226604a66ec0008cc024c0a4018c0a400cccc02088008014c09c01054ccc098cdc81bae002375c00226604a00c666601044002006604e00800a26604a00666660104400200c00a604e00860520046050008604a00244a66603c0042002266660064400260460046044004002446600646600a0060020024600646e98c008dd58009180111ba83002375a002446602e44a666034002203626603866ec0c084c07c004c010c080c07c004c008c0780040048cdc0a40000024603260320024646464a66603466e1d20040021323232323020005533301d3370e900000109919191919191924ca6660400022930b1811803299981099b87480000084c8c94ccc08ccdc39b8d001480e04c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c9265333032001149858c0d4014c098dd580199816919bb03232533303553302e3370e0029000099b87001480e04c0e400c58dc68009bae3037001323230380033302f23376064a66606c66e24dc6800a4080260740042c6eb8c0e4004c8c0e4008dd6981c0008009bab303600100137560026064002606000ca66605c66e1d20000021323232533303153302a3370e0029000099b87001480e04c8c8c94ccc0d0cdc49b8d001481004c8c9265333032001149858c0d400c58dd7000981a00098190020b1b8d001375c00260600022c606000460600026ea8004c0b0004c0a80194ccc0a0cdc3a40000042646464a666056a6604866e1c005200013370e002901c0991919299981719b89371a00290200991924ca6660580022930b18178018b1bae001302e001302c00416371a0026eb8004c0a800458c0a8008c0a8004dd5000981300098120018b1bae001302300116302300230230013754002603e0022a66603a66e1d20020021323232323232324994ccc08000452616302300653330213370e900000109919299981199b87371a002901c0991919191919191919191919191919191919191924ca6660660022930b181b0019bad001303500130330053024375600666056466ec0c8c94ccc0cd4cc0b0cdc3800a4000266e1c00520381303700316371a0026eb8c0d4004c8c8c0d800ccc0b48cdd819299981a19b89371a00290200981c0010b1bae3037001323037002375a606c0020026eacc0d0004004dd580098180009817002980f9bab003330262337606464a66605ca6604e66e1c005200013370e002901c098190018b1b8d001375c60600026464606200666050466ec0c94ccc0bccdc49b8d001481004c0cc00858dd718190009918190011bad30310010013756605e0020026eac004c0ac004c0a4014c068dd580199810919bb0323253330295330223370e0029000099b87001480e04c0b400c58dc68009bae302b0013232302c0033302323376064a66605466e24dc6800a40802605c0042c6eb8c0b4004c8c0b4008dd698160008009bab302a0010013756002604c00260480062c6eb8004c08c00458c08c008c08c004dd5000980f8008b180f801180f8009baa301c00116301c002301c001375400246600240022c6020444a666028002244a0022a66602e60046032002264446004006603200226600600460300024466006004602e602c600e002446466e1cccc010dd5980b980b18038011bae3017001375c602e602c002900118030011111999802001240004666600a00490003ad3756002006460046ea40048888cc03c894ccc048004401454ccc054cdd7980c980b80080309802180c180b80089801180b000800918091baa0012533300e33002233004233710900000080080088008b1119802118019bab3012001001223300323003375a60220020024600e44a666014002294454cc010c00cc03c0044c008c03800488ccc02c00800400c5281198040008010a512300222533300500110061330073003300a001300230090012323002233002002001230022330020020015573e97adef6c605740ae695d12ba15573caae741",
  rawHex:
    "5910de01000032323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232222533303c323232533303f3370e90010010999119baf304337586460886014606800260866066002004646084606400260820020082646464a66608466e1d2002002133223375e608c6eb0c8c11cc034c0dc004c118c0d8004008c8c114c0d4004c11001001c4ccc888c8c8c8c8c8c8c8c8c8c8c8c94ccc144cdc3a40040042c2646464a6660a866e1d2002002132323232325330503370e6eb4c16cc16800d20021533050323375e6e9cc130060dd39826000982d8048a99828198139999111919191981b1998179bad3061003375a60c20046eb4c184004ccc0bcdd6983098300019bad30613060002375a60c260c000260a0006609e006609c00666605e60b600460b60026eacc16cc16803cccc0bcc16c008c16c004dd5982d801982d982d00099981438233302870066605e60b600460b60026eacc16c014ccc0bcc16c008c16c004dd5982d982d007199817982d801182d8009bab305b0041533050330273332223232323303633302f375a60c20066eb4c184008dd698308009998179bad30613060003375a60c260c00046eb4c184c180004c14000cc13c00cc13800cccc0bcc16c008c16c004dd5982d982d007999817982d801182d8009bab305b003305b305a001333028704666050e00ccc0bcc16c008c16c004dd5982d802999817982d801182d8009bab305b00c33302f305b002305b001375660b60082a660a06644646466e24cdc118229bad305f002375a60be60bc00266e08dd6982f982f0011bad305f001304e003304d0013332223232323303633302f375a60c20066eb4c184008dd698308009998179bad30613060003375a60c260c00046eb4c184c180004c14000cc13c00cc13800cccc0bcc16c008c16c004dd5982d982d007999817982d801182d8009bab305b003305b305a00133302f305b002305b001303330333330377006eacc16c030cc0f4104dd5982d982d007099999111199119baf374c0046e98004c8c8c8c0e8ccc0f9c01998191bae3062003375c60c460c20066eb4c188004ccc0c8dd718310011bae30623061002375a60c460c200260a200860a0008609e00800260b600460b600266605e60b600460b60026066606666606ee00dd5982d8061981e8209bab305b305a00e303330333330377006eacc16c030cc0f4104dd5982d982d007182c800982480a182b800982b000982a9823182b0008b182b001182b0009baa303b323054303b304400132305430533044001303c3303d303e3053007375860a601660a600460a60026ea8c0e0c140c13c004c138004c0f8c0dccc0e0c0e8c13800cdd61827002981e9918271826981f000981b1981b981c18268011bac304d006304b001304a001303a006304800130470013037304730370013044004304400100730440023044001375464646464012a66608466e1d20000021323232323232324994ccc11400452616304800653330463370e900000109919191919191919191919191919191919191924ca6660aa0022930b182c003299982b19b87480000084c8c8c8c8c8c8c9265333059001149858c17000cdd6800982d800982c8019bad00130580011630580023058001375400260a800260a400ca6660a066e1d20000021323232533305353304c3370e0029000099b87001480e04c8c8c94ccc158cdc49b8d001481004c8c9265333054001149858c15c00c58dd7000982b000982a0020b1b8d001375c00260a40022c60a400460a40026ea8004c138004c1300194ccc128cdc3a40000042646464a66609aa6608c66e1c005200013370e002901c0991919299982819b89371a00290200991924ca66609c0022930b18288018b1bae0013050001304e00416371a0026eb8004c13000458c130008c130004dd500098240008b182400118240009baa0013044001153330423370e900100109924ca66607e0022930b0b182200118220009baa0053041002304100137546464646400ea66607e66e1d20000021323232323232324994ccc10800452616304500653330433370e900000109919299982299b87371a002901c09919191919191919191919191919191919191924ca6660a80022930b182b80298241bab0033304f2337606464a6660aea660a066e1c005200013370e002901c0982d8018b1b8d001375c60b2002646460b4006660a2466ec0c94ccc160cdc49b8d001481004c17000858dd7182d80099182d8011bad305a001001375660b00020026eac004c150004c1480194ccc140cdc3a40000042646464a6660a6a6609866e1c005200013370e002901c0991919299982b19b89371a00290200991924ca6660a80022930b182b8018b1bae0013056001305400416371a0026eb8004c14800458c148008c148004dd500098270009826003299982519b87480000084c8c8c94ccc1354cc118cdc3800a4000266e1c005203813232325333050337126e340052040132324994ccc13800452616305100316375c00260a0002609c0082c6e34004dd700098260008b182600118260009baa0013048001304600316375c002608a0022c608a004608a0026ea8004c10400454ccc0fccdc3a40040042646464646464649329998210008a4c2c608a00ca66608666e1d20000021323253330453370e6e340052038132323232323232323232323232323232323232324994ccc154004526163058003375a00260ae00260aa00a608c6eac00ccc1348cdd81919299982aa9982719b87001480004cdc3800a4070260b20062c6e34004dd7182b8009919182c00199827919bb0325333056337126e3400520401305a00216375c60b20026460b20046eb4c160004004dd5982b0008009bab001305200130500053041375600666090466ec0c8c94ccc1414cc124cdc3800a4000266e1c00520381305400316371a0026eb8c148004c8c8c14c00ccc1288cdd819299982899b89371a00290200982a8010b1bae3054001323054002375a60a60020026eacc144004004dd580098268009825802981e1bab003330432337606464a666096a6608866e1c005200013370e002901c098278018b1b8d001375c609a0026464609c0066608a466ec0c94ccc130cdc49b8d001481004c14000858dd718278009918278011bad304e001001375660980020026eac004c120004c11800c58dd700098228008b182280118228009baa0013041001163041002304100137540062930b1181d18010009181c98010009181c18010009181b98010009181b18010009181a980e80091191929981699b89375a60700046eb4c0e00044cdc49bad30383037001375a6070606e004604e004604c00444464646601a6600a6eb4c0e0008dd6981c000998029bad30383037002375a6070606e002604e004604c00444466e0ccdc10019980219b8000248008004cc010008004c0ac8894ccc0c8cdc3800a40002900109919b8233704002002a66606666e1ccdc30012400890000a400420066600600466e0c005200422253330313370e002900008178998020019980280100091198021ba9002374c00244660066ea4008dd4000911981619bb000200102b2223233005300100430010033006001223374a9000198151ba80023302a375000200697ae02232333019003375c60580026eb8c0b0c0ac004c06c0048cc0088c94ccc0a4c0140044894004488c00800ccc01494ccc0a4cdd78009ba8480004894004488c00800c0040048c00c8ccc008dd58009191118010019ba600112250015746446604244a666048002204a26466600a6056605400446605066ec0c0b4c0ac00c0040084004c008c0a0004004888ccc01088ccc01c0140080040080048c00c88dd3198019bab002375600246004446ea0cc00cdd68011bad0012223333004003220020020012301b30020012232322330010030022225333020001133022003002132323253330263375e00400226604a66ec0008cc024c0a4018c0a400cccc02088008014c09c01054ccc098cdc81bae002375c00226604a00c666601044002006604e00800a26604a00666660104400200c00a604e00860520046050008604a00244a66603c0042002266660064400260460046044004002446600646600a0060020024600646e98c008dd58009180111ba83002375a002446602e44a666034002203626603866ec0c084c07c004c010c080c07c004c008c0780040048cdc0a40000024603260320024646464a66603466e1d20040021323232323020005533301d3370e900000109919191919191924ca6660400022930b1811803299981099b87480000084c8c94ccc08ccdc39b8d001480e04c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c9265333032001149858c0d4014c098dd580199816919bb03232533303553302e3370e0029000099b87001480e04c0e400c58dc68009bae3037001323230380033302f23376064a66606c66e24dc6800a4080260740042c6eb8c0e4004c8c0e4008dd6981c0008009bab303600100137560026064002606000ca66605c66e1d20000021323232533303153302a3370e0029000099b87001480e04c8c8c94ccc0d0cdc49b8d001481004c8c9265333032001149858c0d400c58dd7000981a00098190020b1b8d001375c00260600022c606000460600026ea8004c0b0004c0a80194ccc0a0cdc3a40000042646464a666056a6604866e1c005200013370e002901c0991919299981719b89371a00290200991924ca6660580022930b18178018b1bae001302e001302c00416371a0026eb8004c0a800458c0a8008c0a8004dd5000981300098120018b1bae001302300116302300230230013754002603e0022a66603a66e1d20020021323232323232324994ccc08000452616302300653330213370e900000109919299981199b87371a002901c0991919191919191919191919191919191919191924ca6660660022930b181b0019bad001303500130330053024375600666056466ec0c8c94ccc0cd4cc0b0cdc3800a4000266e1c00520381303700316371a0026eb8c0d4004c8c8c0d800ccc0b48cdd819299981a19b89371a00290200981c0010b1bae3037001323037002375a606c0020026eacc0d0004004dd580098180009817002980f9bab003330262337606464a66605ca6604e66e1c005200013370e002901c098190018b1b8d001375c60600026464606200666050466ec0c94ccc0bccdc49b8d001481004c0cc00858dd718190009918190011bad30310010013756605e0020026eac004c0ac004c0a4014c068dd580199810919bb0323253330295330223370e0029000099b87001480e04c0b400c58dc68009bae302b0013232302c0033302323376064a66605466e24dc6800a40802605c0042c6eb8c0b4004c8c0b4008dd698160008009bab302a0010013756002604c00260480062c6eb8004c08c00458c08c008c08c004dd5000980f8008b180f801180f8009baa301c00116301c002301c001375400246600240022c6020444a666028002244a0022a66602e60046032002264446004006603200226600600460300024466006004602e602c600e002446466e1cccc010dd5980b980b18038011bae3017001375c602e602c002900118030011111999802001240004666600a00490003ad3756002006460046ea40048888cc03c894ccc048004401454ccc054cdd7980c980b80080309802180c180b80089801180b000800918091baa0012533300e33002233004233710900000080080088008b1119802118019bab3012001001223300323003375a60220020024600e44a666014002294454cc010c00cc03c0044c008c03800488ccc02c00800400c5281198040008010a512300222533300500110061330073003300a001300230090012323002233002002001230022330020020015573e97adef6c605740ae695d12ba15573caae741",
};
var kn = {
  cborHex:
    "58e958e701000032323232323232323232223253330065332233300800200114a066e3cdd7180398059bab300b0014890013004300a300a37566016002266600a444a666012600e0022930998019b9200233230092253335573e002297adef6c60132533300d300400113357400026006602200426006602200460220024646660160029412899b8f375c60160020060026eb8c02cdd61805980418050009bab300d300b300a375660160022c6460146010002601660146016002ae8c8c8c0088cc0080080048c0088cc0080080055cd2ab9d2300330020012300230020015744ae848c008dd5000aab9e1",
  rawHex:
    "58e701000032323232323232323232223253330065332233300800200114a066e3cdd7180398059bab300b0014890013004300a300a37566016002266600a444a666012600e0022930998019b9200233230092253335573e002297adef6c60132533300d300400113357400026006602200426006602200460220024646660160029412899b8f375c60160020060026eb8c02cdd61805980418050009bab300d300b300a375660160022c6460146010002601660146016002ae8c8c8c0088cc0080080048c0088cc0080080055cd2ab9d2300330020012300230020015744ae848c008dd5000aab9e1",
};
var Ss = {}, kr = $s(globalThis, Ss);
function $s(o, e) {
  return new Proxy(o, {
    get(t, r, n) {
      return r in e ? e[r] : o[r];
    },
    set(t, r, n) {
      return r in e && delete e[r], o[r] = n, !0;
    },
    deleteProperty(t, r) {
      let n = !1;
      return r in e && (delete e[r], n = !0),
        r in o && (delete o[r], n = !0),
        n;
    },
    ownKeys(t) {
      let r = Reflect.ownKeys(o), n = Reflect.ownKeys(e), s = new Set(n);
      return [...r.filter((i) => !s.has(i)), ...n];
    },
    defineProperty(t, r, n) {
      return r in e && delete e[r], Reflect.defineProperty(o, r, n), !0;
    },
    getOwnPropertyDescriptor(t, r) {
      return r in e
        ? Reflect.getOwnPropertyDescriptor(e, r)
        : Reflect.getOwnPropertyDescriptor(o, r);
    },
    has(t, r) {
      return r in e || r in o;
    },
  });
}
var { Deno: jn } = kr,
  Ts = typeof jn?.noColor == "boolean" ? jn.noColor : !0,
  As = !Ts;
function kt(o, e) {
  return {
    open: `\x1B[${o.join(";")}m`,
    close: `\x1B[${e}m`,
    regexp: new RegExp(`\\x1b\\[${e}m`, "g"),
  };
}
function Ot(o, e) {
  return As ? `${e.open}${o.replace(e.regexp, e.open)}${e.close}` : o;
}
function Ut(o) {
  return Ot(o, kt([1], 22));
}
function Xt(o) {
  return Ot(o, kt([31], 39));
}
function Yr(o) {
  return Ot(o, kt([32], 39));
}
function Or(o) {
  return Ot(o, kt([37], 39));
}
function Sn(o) {
  return Es(o);
}
function Es(o) {
  return Ot(o, kt([90], 39));
}
function $n(o) {
  return Ot(o, kt([41], 49));
}
function Tn(o) {
  return Ot(o, kt([42], 49));
}
var To = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|"),
  "g",
);
var ee;
(function (o) {
  o.removed = "removed", o.common = "common", o.added = "added";
})(ee || (ee = {}));
var An = 1, Is = 2, En = 3;
function In(o, e, t) {
  let r = [];
  if (o.length === 0 || e.length === 0) return [];
  for (let n = 0; n < Math.min(o.length, e.length); n += 1) {
    if (o[t ? o.length - n - 1 : n] === e[t ? e.length - n - 1 : n]) {
      r.push(o[t ? o.length - n - 1 : n]);
    } else return r;
  }
  return r;
}
function jr(o, e) {
  let t = In(o, e), r = In(o.slice(t.length), e.slice(t.length), !0).reverse();
  o = r.length ? o.slice(t.length, -r.length) : o.slice(t.length),
    e = r.length ? e.slice(t.length, -r.length) : e.slice(t.length);
  let n = e.length > o.length;
  [o, e] = n ? [e, o] : [o, e];
  let s = o.length, i = e.length;
  if (!s && !i && !r.length && !t.length) return [];
  if (!i) {
    return [
      ...t.map((x) => ({ type: ee.common, value: x })),
      ...o.map((x) => ({ type: n ? ee.added : ee.removed, value: x })),
      ...r.map((x) => ({ type: ee.common, value: x })),
    ];
  }
  let a = i,
    c = s - i,
    d = s + i + 1,
    f = Array.from({ length: d }, () => ({ y: -1, id: -1 })),
    p = new Uint32Array((s * i + d + 1) * 2),
    h = p.length / 2,
    m = 0,
    g = -1;
  function O(x, F, D, L) {
    let G = x.length,
      _e = F.length,
      pe = [],
      X = G - 1,
      Q = _e - 1,
      ce = p[D.id],
      b = p[D.id + h];
    for (; !(!ce && !b);) {
      let P = ce;
      b === An
        ? (pe.unshift({ type: L ? ee.removed : ee.added, value: F[Q] }), Q -= 1)
        : b === En
        ? (pe.unshift({ type: L ? ee.added : ee.removed, value: x[X] }), X -= 1)
        : (pe.unshift({ type: ee.common, value: x[X] }), X -= 1, Q -= 1),
        ce = p[P],
        b = p[P + h];
    }
    return pe;
  }
  function v(x, F, D, L) {
    if (x && x.y === -1 && F && F.y === -1) return { y: 0, id: 0 };
    if (F && F.y === -1 || D === L || (x && x.y) > (F && F.y) + 1) {
      let G = x.id;
      return m++, p[m] = G, p[m + h] = En, { y: x.y, id: m };
    } else {
      let G = F.id;
      return m++, p[m] = G, p[m + h] = An, { y: F.y + 1, id: m };
    }
  }
  function C(x, F, D, L, G, _e) {
    let pe = G.length, X = _e.length;
    if (x < -X || pe < x) return { y: -1, id: -1 };
    let Q = v(F, D, x, pe);
    for (; Q.y + x < pe && Q.y < X && G[Q.y + x] === _e[Q.y];) {
      let ce = Q.id;
      m++, Q.id = m, Q.y += 1, p[m] = ce, p[m + h] = Is;
    }
    return Q;
  }
  for (; f[c + a].y < i;) {
    g = g + 1;
    for (let x = -g; x < c; ++x) {
      f[x + a] = C(x, f[x - 1 + a], f[x + 1 + a], a, o, e);
    }
    for (let x = c + g; x > c; --x) {
      f[x + a] = C(x, f[x - 1 + a], f[x + 1 + a], a, o, e);
    }
    f[c + a] = C(c, f[c - 1 + a], f[c + 1 + a], a, o, e);
  }
  return [
    ...t.map((x) => ({ type: ee.common, value: x })),
    ...O(o, e, f[c + a], n),
    ...r.map((x) => ({ type: ee.common, value: x })),
  ];
}
function Nn(o, e) {
  function t(f) {
    return f.replaceAll("\b", "\\b").replaceAll("\f", "\\f").replaceAll(
      "	",
      "\\t",
    ).replaceAll("\v", "\\v").replaceAll(
      /\r\n|\r|\n/g,
      (p) =>
        p === "\r" ? "\\r" : p === `
`
          ? `\\n
`
          : `\\r\\n\r
`,
    );
  }
  function r(f, { wordDiff: p = !1 } = {}) {
    if (p) {
      let h = f.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),
        m =
          /^[a-zA-Z\u{C0}-\u{FF}\u{D8}-\u{F6}\u{F8}-\u{2C6}\u{2C8}-\u{2D7}\u{2DE}-\u{2FF}\u{1E00}-\u{1EFF}]+$/u;
      for (let g = 0; g < h.length - 1; g++) {
        !h[g + 1] && h[g + 2] && m.test(h[g]) && m.test(h[g + 2]) &&
          (h[g] += h[g + 2], h.splice(g + 1, 2), g--);
      }
      return h.filter((g) => g);
    } else {
      let h = [], m = f.split(/(\n|\r\n)/);
      m[m.length - 1] || m.pop();
      for (let g = 0; g < m.length; g++) {
        g % 2 ? h[h.length - 1] += m[g] : h.push(m[g]);
      }
      return h;
    }
  }
  function n(f, p) {
    return p.filter(({ type: h }) => h === f.type || h === ee.common).map((
      h,
      m,
      g,
    ) => (h.type === ee.common && g[m - 1] &&
      g[m - 1]?.type === g[m + 1]?.type && /\s+/.test(h.value) &&
      (h.type = g[m - 1].type),
      h)
    );
  }
  let s = jr(
      r(`${t(o)}
`),
      r(`${t(e)}
`),
    ),
    i = [],
    a = [];
  for (let f of s) {
    f.type === ee.added && i.push(f), f.type === ee.removed && a.push(f);
  }
  let c = i.length < a.length ? i : a, d = c === a ? i : a;
  for (let f of c) {
    let p = [], h;
    for (
      ;
      d.length &&
      (h = d.shift(),
        p = jr(
          r(f.value, { wordDiff: !0 }),
          r(h?.value ?? "", { wordDiff: !0 }),
        ),
        !p.some(({ type: m, value: g }) => m === ee.common && g.trim().length));
    );
    f.details = n(f, p), h && (h.details = n(h, p));
  }
  return s;
}
function Cn(o, { background: e = !1 } = {}) {
  switch (e = !1, o) {
    case ee.added:
      return (t) => e ? Tn(Or(t)) : Yr(Ut(t));
    case ee.removed:
      return (t) => e ? $n(Or(t)) : Xt(Ut(t));
    default:
      return Or;
  }
}
function Cs(o) {
  switch (o) {
    case ee.added:
      return "+   ";
    case ee.removed:
      return "-   ";
    default:
      return "    ";
  }
}
function Bn(o, { stringDiff: e = !1 } = {}) {
  let t = [], r = [];
  return t.push(""),
    t.push(""),
    t.push(
      `    ${Sn(Ut("[Diff]"))} ${Xt(Ut("Actual"))} / ${Yr(Ut("Expected"))}`,
    ),
    t.push(""),
    t.push(""),
    o.forEach((n) => {
      let s = Cn(n.type),
        i = n.details?.map((a) =>
          a.type !== ee.common
            ? Cn(a.type, { background: !0 })(a.value)
            : a.value
        ).join("") ?? n.value;
      r.push(s(`${Cs(n.type)}${i}`));
    }),
    t.push(...e ? [r.join("")] : r),
    t.push(""),
    t;
}
function Xr(o) {
  let { Deno: e } = kr;
  return typeof e?.inspect == "function"
    ? e.inspect(o, {
      depth: 1 / 0,
      sorted: !0,
      trailingComma: !0,
      compact: !1,
      iterableLimit: 1 / 0,
      getters: !0,
    })
    : `"${String(o).replace(/(?=["\\])/g, "\\")}"`;
}
var Ns = "[Cannot display]",
  Sr = class extends Error {
    constructor(e) {
      super(e),
        Object.defineProperty(this, "name", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: "AssertionError",
        });
    }
  };
function Dn(o) {
  return [Symbol.iterator, "size"].every((e) => e in o);
}
function Bs(o, e) {
  let t = new Map();
  return function r(n, s) {
    if (
      n && s &&
      (n instanceof RegExp && s instanceof RegExp ||
        n instanceof URL && s instanceof URL)
    ) return String(n) === String(s);
    if (n instanceof Date && s instanceof Date) {
      let i = n.getTime(), a = s.getTime();
      return Number.isNaN(i) && Number.isNaN(a) ? !0 : i === a;
    }
    if (typeof n == "number" && typeof s == "number") {
      return Number.isNaN(n) && Number.isNaN(s) || n === s;
    }
    if (Object.is(n, s)) return !0;
    if (n && typeof n == "object" && s && typeof s == "object") {
      if (n && s && !Ds(n, s)) return !1;
      if (n instanceof WeakMap || s instanceof WeakMap) {
        if (!(n instanceof WeakMap && s instanceof WeakMap)) return !1;
        throw new TypeError("cannot compare WeakMap instances");
      }
      if (n instanceof WeakSet || s instanceof WeakSet) {
        if (!(n instanceof WeakSet && s instanceof WeakSet)) return !1;
        throw new TypeError("cannot compare WeakSet instances");
      }
      if (t.get(n) === s) return !0;
      if (Object.keys(n || {}).length !== Object.keys(s || {}).length) {
        return !1;
      }
      if (t.set(n, s), Dn(n) && Dn(s)) {
        if (n.size !== s.size) return !1;
        let a = n.size;
        for (let [c, d] of n.entries()) {
          for (let [f, p] of s.entries()) {
            if (c === d && f === p && r(c, f) || r(c, f) && r(d, p)) {
              a--;
              break;
            }
          }
        }
        return a === 0;
      }
      let i = { ...n, ...s };
      for (
        let a of [
          ...Object.getOwnPropertyNames(i),
          ...Object.getOwnPropertySymbols(i),
        ]
      ) {
        if (
          !r(n && n[a], s && s[a]) || a in n && !(a in s) || a in s && !(a in n)
        ) return !1;
      }
      return n instanceof WeakRef || s instanceof WeakRef
        ? n instanceof WeakRef && s instanceof WeakRef
          ? r(n.deref(), s.deref())
          : !1
        : !0;
    }
    return !1;
  }(o, e);
}
function Ds(o, e) {
  return o.constructor === e.constructor ||
    o.constructor === Object && !e.constructor ||
    !o.constructor && e.constructor === Object;
}
function l(o, e = "") {
  if (!o) throw new Sr(e);
}
function Qt(o, e, t) {
  if (Bs(o, e)) return;
  let r = "", n = Xr(o), s = Xr(e);
  try {
    let i = typeof o == "string" && typeof e == "string",
      a = i ? Nn(o, e) : jr(
        n.split(`
`),
        s.split(`
`),
      );
    r = `Values are not equal:
${
      Bn(a, { stringDiff: i }).join(`
`)
    }`;
  } catch {
    r = `
${Xt(Ns)} + 

`;
  }
  throw t && (r = t), new Sr(r);
}
var S = {};
js(S, {
  Blockfrost: () => ln,
  C: () => u,
  Constr: () => he,
  Data: () => Ft,
  Emulator: () => fr,
  Kupmios: () => dn,
  Lucid: () => pr,
  M: () => M,
  MerkleTree: () => ar,
  PROTOCOL_PARAMETERS_DEFAULT: () => en,
  SLOT_CONFIG_NETWORK: () => Tt,
  Tx: () => lr,
  TxComplete: () => Et,
  TxSigned: () => ur,
  Utils: () => rr,
  applyDoubleCborEncoding: () => De,
  applyParamsToScript: () => oo,
  assetsToValue: () => nr,
  combineHash: () => Nr,
  concat: () => cn,
  coreToUtxo: () => sr,
  createCostModels: () => Qr,
  datumJsonToCbor: () => uo,
  equals: () => or,
  fromHex: () => w,
  fromLabel: () => ls,
  fromScriptRef: () => as,
  fromText: () => un,
  fromUnit: () => Cr,
  generatePrivateKey: () => ss,
  generateSeedPhrase: () => os,
  getAddressDetails: () => me,
  nativeScriptFromJson: () => ds,
  networkToId: () => rt,
  paymentCredentialOf: () => nt,
  sha256: () => ir,
  slotToBeginUnixTime: () => sn,
  stakeCredentialOf: () => ns,
  toHex: () => k,
  toLabel: () => cs,
  toPublicKey: () => no,
  toScriptRef: () => Ir,
  toText: () => ro,
  toUnit: () => so,
  unixTimeToEnclosingSlot: () => on,
  utxoToCore: () => pt,
  valueToAssets: () => is,
});
import * as u from "../esm/lucid/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js";
import * as M from "../esm/lucid/src/core/libs/cardano_message_signing/cardano_message_signing.generated.js";
var $r = {
  name: "lucid-cardano",
  version: "0.9.8",
  license: "MIT",
  author: "Alessandro Konrad",
  description:
    "Lucid is a library, which allows you to create Cardano transactions and off-chain code for your Plutus contracts in JavaScript, Deno and Node.js.",
  repository: "https://github.com/spacebudz/lucid",
};
async function Un(o, e) {
  try {
    await o.instantiate({
      url: new URL(e, `https://deno.land/x/lucid@${$r.version}/src/core/libs/`),
    });
  } catch {}
}
await Promise.all([
  Un(u, "cardano_multiplatform_lib/cardano_multiplatform_lib_bg.wasm"),
  Un(M, "cardano_message_signing/cardano_message_signing_bg.wasm"),
]);
function Qr(o) {
  let e = u.Costmdls.new(), t = u.CostModel.new();
  Object.values(o.PlutusV1).forEach((n, s) => {
    t.set(s, u.Int.new(u.BigNum.from_str(n.toString())));
  }), e.insert(u.Language.new_plutus_v1(), t);
  let r = u.CostModel.new_plutus_v2();
  return Object.values(o.PlutusV2 || []).forEach((n, s) => {
    r.set(s, u.Int.new(u.BigNum.from_str(n.toString())));
  }),
    e.insert(u.Language.new_plutus_v2(), r),
    e;
}
var en = {
  minFeeA: 44,
  minFeeB: 155381,
  maxTxSize: 16384,
  maxValSize: 5e3,
  keyDeposit: 2000000n,
  poolDeposit: 500000000n,
  priceMem: .0577,
  priceStep: 721e-7,
  maxTxExMem: 14000000n,
  maxTxExSteps: 10000000000n,
  coinsPerUtxoByte: 4310n,
  collateralPercentage: 150,
  maxCollateralInputs: 3,
  costModels: {
    PlutusV1: {
      "addInteger-cpu-arguments-intercept": 205665,
      "addInteger-cpu-arguments-slope": 812,
      "addInteger-memory-arguments-intercept": 1,
      "addInteger-memory-arguments-slope": 1,
      "appendByteString-cpu-arguments-intercept": 1e3,
      "appendByteString-cpu-arguments-slope": 571,
      "appendByteString-memory-arguments-intercept": 0,
      "appendByteString-memory-arguments-slope": 1,
      "appendString-cpu-arguments-intercept": 1e3,
      "appendString-cpu-arguments-slope": 24177,
      "appendString-memory-arguments-intercept": 4,
      "appendString-memory-arguments-slope": 1,
      "bData-cpu-arguments": 1e3,
      "bData-memory-arguments": 32,
      "blake2b_256-cpu-arguments-intercept": 117366,
      "blake2b_256-cpu-arguments-slope": 10475,
      "blake2b_256-memory-arguments": 4,
      "cekApplyCost-exBudgetCPU": 23e3,
      "cekApplyCost-exBudgetMemory": 100,
      "cekBuiltinCost-exBudgetCPU": 23e3,
      "cekBuiltinCost-exBudgetMemory": 100,
      "cekConstCost-exBudgetCPU": 23e3,
      "cekConstCost-exBudgetMemory": 100,
      "cekDelayCost-exBudgetCPU": 23e3,
      "cekDelayCost-exBudgetMemory": 100,
      "cekForceCost-exBudgetCPU": 23e3,
      "cekForceCost-exBudgetMemory": 100,
      "cekLamCost-exBudgetCPU": 23e3,
      "cekLamCost-exBudgetMemory": 100,
      "cekStartupCost-exBudgetCPU": 100,
      "cekStartupCost-exBudgetMemory": 100,
      "cekVarCost-exBudgetCPU": 23e3,
      "cekVarCost-exBudgetMemory": 100,
      "chooseData-cpu-arguments": 19537,
      "chooseData-memory-arguments": 32,
      "chooseList-cpu-arguments": 175354,
      "chooseList-memory-arguments": 32,
      "chooseUnit-cpu-arguments": 46417,
      "chooseUnit-memory-arguments": 4,
      "consByteString-cpu-arguments-intercept": 221973,
      "consByteString-cpu-arguments-slope": 511,
      "consByteString-memory-arguments-intercept": 0,
      "consByteString-memory-arguments-slope": 1,
      "constrData-cpu-arguments": 89141,
      "constrData-memory-arguments": 32,
      "decodeUtf8-cpu-arguments-intercept": 497525,
      "decodeUtf8-cpu-arguments-slope": 14068,
      "decodeUtf8-memory-arguments-intercept": 4,
      "decodeUtf8-memory-arguments-slope": 2,
      "divideInteger-cpu-arguments-constant": 196500,
      "divideInteger-cpu-arguments-model-arguments-intercept": 453240,
      "divideInteger-cpu-arguments-model-arguments-slope": 220,
      "divideInteger-memory-arguments-intercept": 0,
      "divideInteger-memory-arguments-minimum": 1,
      "divideInteger-memory-arguments-slope": 1,
      "encodeUtf8-cpu-arguments-intercept": 1e3,
      "encodeUtf8-cpu-arguments-slope": 28662,
      "encodeUtf8-memory-arguments-intercept": 4,
      "encodeUtf8-memory-arguments-slope": 2,
      "equalsByteString-cpu-arguments-constant": 245e3,
      "equalsByteString-cpu-arguments-intercept": 216773,
      "equalsByteString-cpu-arguments-slope": 62,
      "equalsByteString-memory-arguments": 1,
      "equalsData-cpu-arguments-intercept": 1060367,
      "equalsData-cpu-arguments-slope": 12586,
      "equalsData-memory-arguments": 1,
      "equalsInteger-cpu-arguments-intercept": 208512,
      "equalsInteger-cpu-arguments-slope": 421,
      "equalsInteger-memory-arguments": 1,
      "equalsString-cpu-arguments-constant": 187e3,
      "equalsString-cpu-arguments-intercept": 1e3,
      "equalsString-cpu-arguments-slope": 52998,
      "equalsString-memory-arguments": 1,
      "fstPair-cpu-arguments": 80436,
      "fstPair-memory-arguments": 32,
      "headList-cpu-arguments": 43249,
      "headList-memory-arguments": 32,
      "iData-cpu-arguments": 1e3,
      "iData-memory-arguments": 32,
      "ifThenElse-cpu-arguments": 80556,
      "ifThenElse-memory-arguments": 1,
      "indexByteString-cpu-arguments": 57667,
      "indexByteString-memory-arguments": 4,
      "lengthOfByteString-cpu-arguments": 1e3,
      "lengthOfByteString-memory-arguments": 10,
      "lessThanByteString-cpu-arguments-intercept": 197145,
      "lessThanByteString-cpu-arguments-slope": 156,
      "lessThanByteString-memory-arguments": 1,
      "lessThanEqualsByteString-cpu-arguments-intercept": 197145,
      "lessThanEqualsByteString-cpu-arguments-slope": 156,
      "lessThanEqualsByteString-memory-arguments": 1,
      "lessThanEqualsInteger-cpu-arguments-intercept": 204924,
      "lessThanEqualsInteger-cpu-arguments-slope": 473,
      "lessThanEqualsInteger-memory-arguments": 1,
      "lessThanInteger-cpu-arguments-intercept": 208896,
      "lessThanInteger-cpu-arguments-slope": 511,
      "lessThanInteger-memory-arguments": 1,
      "listData-cpu-arguments": 52467,
      "listData-memory-arguments": 32,
      "mapData-cpu-arguments": 64832,
      "mapData-memory-arguments": 32,
      "mkCons-cpu-arguments": 65493,
      "mkCons-memory-arguments": 32,
      "mkNilData-cpu-arguments": 22558,
      "mkNilData-memory-arguments": 32,
      "mkNilPairData-cpu-arguments": 16563,
      "mkNilPairData-memory-arguments": 32,
      "mkPairData-cpu-arguments": 76511,
      "mkPairData-memory-arguments": 32,
      "modInteger-cpu-arguments-constant": 196500,
      "modInteger-cpu-arguments-model-arguments-intercept": 453240,
      "modInteger-cpu-arguments-model-arguments-slope": 220,
      "modInteger-memory-arguments-intercept": 0,
      "modInteger-memory-arguments-minimum": 1,
      "modInteger-memory-arguments-slope": 1,
      "multiplyInteger-cpu-arguments-intercept": 69522,
      "multiplyInteger-cpu-arguments-slope": 11687,
      "multiplyInteger-memory-arguments-intercept": 0,
      "multiplyInteger-memory-arguments-slope": 1,
      "nullList-cpu-arguments": 60091,
      "nullList-memory-arguments": 32,
      "quotientInteger-cpu-arguments-constant": 196500,
      "quotientInteger-cpu-arguments-model-arguments-intercept": 453240,
      "quotientInteger-cpu-arguments-model-arguments-slope": 220,
      "quotientInteger-memory-arguments-intercept": 0,
      "quotientInteger-memory-arguments-minimum": 1,
      "quotientInteger-memory-arguments-slope": 1,
      "remainderInteger-cpu-arguments-constant": 196500,
      "remainderInteger-cpu-arguments-model-arguments-intercept": 453240,
      "remainderInteger-cpu-arguments-model-arguments-slope": 220,
      "remainderInteger-memory-arguments-intercept": 0,
      "remainderInteger-memory-arguments-minimum": 1,
      "remainderInteger-memory-arguments-slope": 1,
      "sha2_256-cpu-arguments-intercept": 806990,
      "sha2_256-cpu-arguments-slope": 30482,
      "sha2_256-memory-arguments": 4,
      "sha3_256-cpu-arguments-intercept": 1927926,
      "sha3_256-cpu-arguments-slope": 82523,
      "sha3_256-memory-arguments": 4,
      "sliceByteString-cpu-arguments-intercept": 265318,
      "sliceByteString-cpu-arguments-slope": 0,
      "sliceByteString-memory-arguments-intercept": 4,
      "sliceByteString-memory-arguments-slope": 0,
      "sndPair-cpu-arguments": 85931,
      "sndPair-memory-arguments": 32,
      "subtractInteger-cpu-arguments-intercept": 205665,
      "subtractInteger-cpu-arguments-slope": 812,
      "subtractInteger-memory-arguments-intercept": 1,
      "subtractInteger-memory-arguments-slope": 1,
      "tailList-cpu-arguments": 41182,
      "tailList-memory-arguments": 32,
      "trace-cpu-arguments": 212342,
      "trace-memory-arguments": 32,
      "unBData-cpu-arguments": 31220,
      "unBData-memory-arguments": 32,
      "unConstrData-cpu-arguments": 32696,
      "unConstrData-memory-arguments": 32,
      "unIData-cpu-arguments": 43357,
      "unIData-memory-arguments": 32,
      "unListData-cpu-arguments": 32247,
      "unListData-memory-arguments": 32,
      "unMapData-cpu-arguments": 38314,
      "unMapData-memory-arguments": 32,
      "verifyEd25519Signature-cpu-arguments-intercept": 9462713,
      "verifyEd25519Signature-cpu-arguments-slope": 1021,
      "verifyEd25519Signature-memory-arguments": 10,
    },
    PlutusV2: {
      "addInteger-cpu-arguments-intercept": 205665,
      "addInteger-cpu-arguments-slope": 812,
      "addInteger-memory-arguments-intercept": 1,
      "addInteger-memory-arguments-slope": 1,
      "appendByteString-cpu-arguments-intercept": 1e3,
      "appendByteString-cpu-arguments-slope": 571,
      "appendByteString-memory-arguments-intercept": 0,
      "appendByteString-memory-arguments-slope": 1,
      "appendString-cpu-arguments-intercept": 1e3,
      "appendString-cpu-arguments-slope": 24177,
      "appendString-memory-arguments-intercept": 4,
      "appendString-memory-arguments-slope": 1,
      "bData-cpu-arguments": 1e3,
      "bData-memory-arguments": 32,
      "blake2b_256-cpu-arguments-intercept": 117366,
      "blake2b_256-cpu-arguments-slope": 10475,
      "blake2b_256-memory-arguments": 4,
      "cekApplyCost-exBudgetCPU": 23e3,
      "cekApplyCost-exBudgetMemory": 100,
      "cekBuiltinCost-exBudgetCPU": 23e3,
      "cekBuiltinCost-exBudgetMemory": 100,
      "cekConstCost-exBudgetCPU": 23e3,
      "cekConstCost-exBudgetMemory": 100,
      "cekDelayCost-exBudgetCPU": 23e3,
      "cekDelayCost-exBudgetMemory": 100,
      "cekForceCost-exBudgetCPU": 23e3,
      "cekForceCost-exBudgetMemory": 100,
      "cekLamCost-exBudgetCPU": 23e3,
      "cekLamCost-exBudgetMemory": 100,
      "cekStartupCost-exBudgetCPU": 100,
      "cekStartupCost-exBudgetMemory": 100,
      "cekVarCost-exBudgetCPU": 23e3,
      "cekVarCost-exBudgetMemory": 100,
      "chooseData-cpu-arguments": 19537,
      "chooseData-memory-arguments": 32,
      "chooseList-cpu-arguments": 175354,
      "chooseList-memory-arguments": 32,
      "chooseUnit-cpu-arguments": 46417,
      "chooseUnit-memory-arguments": 4,
      "consByteString-cpu-arguments-intercept": 221973,
      "consByteString-cpu-arguments-slope": 511,
      "consByteString-memory-arguments-intercept": 0,
      "consByteString-memory-arguments-slope": 1,
      "constrData-cpu-arguments": 89141,
      "constrData-memory-arguments": 32,
      "decodeUtf8-cpu-arguments-intercept": 497525,
      "decodeUtf8-cpu-arguments-slope": 14068,
      "decodeUtf8-memory-arguments-intercept": 4,
      "decodeUtf8-memory-arguments-slope": 2,
      "divideInteger-cpu-arguments-constant": 196500,
      "divideInteger-cpu-arguments-model-arguments-intercept": 453240,
      "divideInteger-cpu-arguments-model-arguments-slope": 220,
      "divideInteger-memory-arguments-intercept": 0,
      "divideInteger-memory-arguments-minimum": 1,
      "divideInteger-memory-arguments-slope": 1,
      "encodeUtf8-cpu-arguments-intercept": 1e3,
      "encodeUtf8-cpu-arguments-slope": 28662,
      "encodeUtf8-memory-arguments-intercept": 4,
      "encodeUtf8-memory-arguments-slope": 2,
      "equalsByteString-cpu-arguments-constant": 245e3,
      "equalsByteString-cpu-arguments-intercept": 216773,
      "equalsByteString-cpu-arguments-slope": 62,
      "equalsByteString-memory-arguments": 1,
      "equalsData-cpu-arguments-intercept": 1060367,
      "equalsData-cpu-arguments-slope": 12586,
      "equalsData-memory-arguments": 1,
      "equalsInteger-cpu-arguments-intercept": 208512,
      "equalsInteger-cpu-arguments-slope": 421,
      "equalsInteger-memory-arguments": 1,
      "equalsString-cpu-arguments-constant": 187e3,
      "equalsString-cpu-arguments-intercept": 1e3,
      "equalsString-cpu-arguments-slope": 52998,
      "equalsString-memory-arguments": 1,
      "fstPair-cpu-arguments": 80436,
      "fstPair-memory-arguments": 32,
      "headList-cpu-arguments": 43249,
      "headList-memory-arguments": 32,
      "iData-cpu-arguments": 1e3,
      "iData-memory-arguments": 32,
      "ifThenElse-cpu-arguments": 80556,
      "ifThenElse-memory-arguments": 1,
      "indexByteString-cpu-arguments": 57667,
      "indexByteString-memory-arguments": 4,
      "lengthOfByteString-cpu-arguments": 1e3,
      "lengthOfByteString-memory-arguments": 10,
      "lessThanByteString-cpu-arguments-intercept": 197145,
      "lessThanByteString-cpu-arguments-slope": 156,
      "lessThanByteString-memory-arguments": 1,
      "lessThanEqualsByteString-cpu-arguments-intercept": 197145,
      "lessThanEqualsByteString-cpu-arguments-slope": 156,
      "lessThanEqualsByteString-memory-arguments": 1,
      "lessThanEqualsInteger-cpu-arguments-intercept": 204924,
      "lessThanEqualsInteger-cpu-arguments-slope": 473,
      "lessThanEqualsInteger-memory-arguments": 1,
      "lessThanInteger-cpu-arguments-intercept": 208896,
      "lessThanInteger-cpu-arguments-slope": 511,
      "lessThanInteger-memory-arguments": 1,
      "listData-cpu-arguments": 52467,
      "listData-memory-arguments": 32,
      "mapData-cpu-arguments": 64832,
      "mapData-memory-arguments": 32,
      "mkCons-cpu-arguments": 65493,
      "mkCons-memory-arguments": 32,
      "mkNilData-cpu-arguments": 22558,
      "mkNilData-memory-arguments": 32,
      "mkNilPairData-cpu-arguments": 16563,
      "mkNilPairData-memory-arguments": 32,
      "mkPairData-cpu-arguments": 76511,
      "mkPairData-memory-arguments": 32,
      "modInteger-cpu-arguments-constant": 196500,
      "modInteger-cpu-arguments-model-arguments-intercept": 453240,
      "modInteger-cpu-arguments-model-arguments-slope": 220,
      "modInteger-memory-arguments-intercept": 0,
      "modInteger-memory-arguments-minimum": 1,
      "modInteger-memory-arguments-slope": 1,
      "multiplyInteger-cpu-arguments-intercept": 69522,
      "multiplyInteger-cpu-arguments-slope": 11687,
      "multiplyInteger-memory-arguments-intercept": 0,
      "multiplyInteger-memory-arguments-slope": 1,
      "nullList-cpu-arguments": 60091,
      "nullList-memory-arguments": 32,
      "quotientInteger-cpu-arguments-constant": 196500,
      "quotientInteger-cpu-arguments-model-arguments-intercept": 453240,
      "quotientInteger-cpu-arguments-model-arguments-slope": 220,
      "quotientInteger-memory-arguments-intercept": 0,
      "quotientInteger-memory-arguments-minimum": 1,
      "quotientInteger-memory-arguments-slope": 1,
      "remainderInteger-cpu-arguments-constant": 196500,
      "remainderInteger-cpu-arguments-model-arguments-intercept": 453240,
      "remainderInteger-cpu-arguments-model-arguments-slope": 220,
      "remainderInteger-memory-arguments-intercept": 0,
      "remainderInteger-memory-arguments-minimum": 1,
      "remainderInteger-memory-arguments-slope": 1,
      "serialiseData-cpu-arguments-intercept": 1159724,
      "serialiseData-cpu-arguments-slope": 392670,
      "serialiseData-memory-arguments-intercept": 0,
      "serialiseData-memory-arguments-slope": 2,
      "sha2_256-cpu-arguments-intercept": 806990,
      "sha2_256-cpu-arguments-slope": 30482,
      "sha2_256-memory-arguments": 4,
      "sha3_256-cpu-arguments-intercept": 1927926,
      "sha3_256-cpu-arguments-slope": 82523,
      "sha3_256-memory-arguments": 4,
      "sliceByteString-cpu-arguments-intercept": 265318,
      "sliceByteString-cpu-arguments-slope": 0,
      "sliceByteString-memory-arguments-intercept": 4,
      "sliceByteString-memory-arguments-slope": 0,
      "sndPair-cpu-arguments": 85931,
      "sndPair-memory-arguments": 32,
      "subtractInteger-cpu-arguments-intercept": 205665,
      "subtractInteger-cpu-arguments-slope": 812,
      "subtractInteger-memory-arguments-intercept": 1,
      "subtractInteger-memory-arguments-slope": 1,
      "tailList-cpu-arguments": 41182,
      "tailList-memory-arguments": 32,
      "trace-cpu-arguments": 212342,
      "trace-memory-arguments": 32,
      "unBData-cpu-arguments": 31220,
      "unBData-memory-arguments": 32,
      "unConstrData-cpu-arguments": 32696,
      "unConstrData-memory-arguments": 32,
      "unIData-cpu-arguments": 43357,
      "unIData-memory-arguments": 32,
      "unListData-cpu-arguments": 32247,
      "unListData-memory-arguments": 32,
      "unMapData-cpu-arguments": 38314,
      "unMapData-memory-arguments": 32,
      "verifyEcdsaSecp256k1Signature-cpu-arguments": 35892428,
      "verifyEcdsaSecp256k1Signature-memory-arguments": 10,
      "verifyEd25519Signature-cpu-arguments-intercept": 57996947,
      "verifyEd25519Signature-cpu-arguments-slope": 18975,
      "verifyEd25519Signature-memory-arguments": 10,
      "verifySchnorrSecp256k1Signature-cpu-arguments-intercept": 38887044,
      "verifySchnorrSecp256k1Signature-cpu-arguments-slope": 32947,
      "verifySchnorrSecp256k1Signature-memory-arguments": 10,
    },
  },
};
var Mn = new TextEncoder().encode("0123456789abcdef");
function Us(o) {
  return new Error(
    "encoding/hex: invalid byte: " +
      new TextDecoder().decode(new Uint8Array([o])),
  );
}
function Ms() {
  return new Error("encoding/hex: odd length hex string");
}
function tn(o) {
  if (48 <= o && o <= 57) return o - 48;
  if (97 <= o && o <= 102) return o - 97 + 10;
  if (65 <= o && o <= 70) return o - 65 + 10;
  throw Us(o);
}
function Hs(o) {
  return o * 2;
}
function Ls(o) {
  let e = new Uint8Array(Hs(o.length));
  for (let t = 0; t < e.length; t++) {
    let r = o[t];
    e[t * 2] = Mn[r >> 4], e[t * 2 + 1] = Mn[r & 15];
  }
  return e;
}
function Hn(o) {
  return new TextDecoder().decode(Ls(o));
}
function rn(o) {
  let e = new Uint8Array(Fs(o.length));
  for (let t = 0; t < e.length; t++) {
    let r = tn(o[t * 2]), n = tn(o[t * 2 + 1]);
    e[t] = r << 4 | n;
  }
  if (o.length % 2 == 1) throw tn(o[e.length * 2]), Ms();
  return e;
}
function Fs(o) {
  return o >>> 1;
}
function Ln(o) {
  return rn(new TextEncoder().encode(o));
}
var N = function (o, e, t, r, n) {
    if (r === "m") throw new TypeError("Private method is not writable");
    if (r === "a" && !n) {
      throw new TypeError("Private accessor was defined without a setter");
    }
    if (typeof e == "function" ? o !== e || !n : !e.has(o)) {
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it",
      );
    }
    return r === "a" ? n.call(o, t) : n ? n.value = t : e.set(o, t), t;
  },
  _ = function (o, e, t, r) {
    if (t === "a" && !r) {
      throw new TypeError(
        "Private accessor was defined without a getter",
      );
    }
    if (typeof e == "function" ? o !== e || !r : !e.has(o)) {
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it",
      );
    }
    return t === "m" ? r : t === "a" ? r.call(o) : r ? r.value : e.get(o);
  },
  lt,
  jt,
  Be,
  Mt,
  er,
  Re,
  ze,
  qe,
  Ke,
  We,
  Ve,
  Je,
  Ge,
  St,
  Ht,
  dt,
  Ar,
  ft,
  Rs,
  zs,
  qs,
  Ks,
  j = "0123456789abcdef".split(""),
  Ws = [-2147483648, 8388608, 32768, 128],
  Ne = [24, 16, 8, 0],
  Tr = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298,
  ],
  ie = [],
  Lt = class {
    constructor(e = !1, t = !1) {
      lt.set(this, void 0),
        jt.set(this, void 0),
        Be.set(this, void 0),
        Mt.set(this, void 0),
        er.set(this, void 0),
        Re.set(this, void 0),
        ze.set(this, void 0),
        qe.set(this, void 0),
        Ke.set(this, void 0),
        We.set(this, void 0),
        Ve.set(this, void 0),
        Je.set(this, void 0),
        Ge.set(this, void 0),
        St.set(this, void 0),
        Ht.set(this, void 0),
        dt.set(this, void 0),
        Ar.set(this, 0),
        ft.set(this, void 0),
        this.init(e, t);
    }
    init(e, t) {
      t
        ? (ie[0] =
          ie[16] =
          ie[1] =
          ie[2] =
          ie[3] =
          ie[4] =
          ie[5] =
          ie[6] =
          ie[7] =
          ie[8] =
          ie[9] =
          ie[10] =
          ie[11] =
          ie[12] =
          ie[13] =
          ie[14] =
          ie[15] =
            0,
          N(this, jt, ie, "f"))
        : N(this, jt, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "f"),
        e
          ? (N(this, Re, 3238371032, "f"),
            N(this, ze, 914150663, "f"),
            N(this, qe, 812702999, "f"),
            N(this, Ke, 4144912697, "f"),
            N(this, We, 4290775857, "f"),
            N(this, Ve, 1750603025, "f"),
            N(this, Je, 1694076839, "f"),
            N(this, Ge, 3204075428, "f"))
          : (N(this, Re, 1779033703, "f"),
            N(this, ze, 3144134277, "f"),
            N(this, qe, 1013904242, "f"),
            N(this, Ke, 2773480762, "f"),
            N(this, We, 1359893119, "f"),
            N(this, Ve, 2600822924, "f"),
            N(this, Je, 528734635, "f"),
            N(this, Ge, 1541459225, "f")),
        N(
          this,
          lt,
          N(this, ft, N(this, Be, N(this, Ht, 0, "f"), "f"), "f"),
          "f",
        ),
        N(this, Mt, N(this, St, !1, "f"), "f"),
        N(this, er, !0, "f"),
        N(this, dt, e, "f");
    }
    update(e) {
      if (_(this, Mt, "f")) return this;
      let t;
      e instanceof ArrayBuffer ? t = new Uint8Array(e) : t = e;
      let r = 0, n = t.length, s = _(this, jt, "f");
      for (; r < n;) {
        let i;
        if (
          _(this, St, "f") &&
          (N(this, St, !1, "f"),
            s[0] = _(this, lt, "f"),
            s[16] =
              s[1] =
              s[2] =
              s[3] =
              s[4] =
              s[5] =
              s[6] =
              s[7] =
              s[8] =
              s[9] =
              s[10] =
              s[11] =
              s[12] =
              s[13] =
              s[14] =
              s[15] =
                0), typeof t != "string"
        ) {
          for (i = _(this, ft, "f"); r < n && i < 64; ++r) {
            s[i >> 2] |= t[r] << Ne[i++ & 3];
          }
        } else {for (
            i = _(this, ft, "f");
            r < n && i < 64;
            ++r
          ) {
            let a = t.charCodeAt(r);
            a < 128
              ? s[i >> 2] |= a << Ne[i++ & 3]
              : a < 2048
              ? (s[i >> 2] |= (192 | a >> 6) << Ne[i++ & 3],
                s[i >> 2] |= (128 | a & 63) << Ne[i++ & 3])
              : a < 55296 || a >= 57344
              ? (s[i >> 2] |= (224 | a >> 12) << Ne[i++ & 3],
                s[i >> 2] |= (128 | a >> 6 & 63) << Ne[i++ & 3],
                s[i >> 2] |= (128 | a & 63) << Ne[i++ & 3])
              : (a = 65536 + ((a & 1023) << 10 | t.charCodeAt(++r) & 1023),
                s[i >> 2] |= (240 | a >> 18) << Ne[i++ & 3],
                s[i >> 2] |= (128 | a >> 12 & 63) << Ne[i++ & 3],
                s[i >> 2] |= (128 | a >> 6 & 63) << Ne[i++ & 3],
                s[i >> 2] |= (128 | a & 63) << Ne[i++ & 3]);
          }}
        N(this, Ar, i, "f"),
          N(this, Be, _(this, Be, "f") + (i - _(this, ft, "f")), "f"),
          i >= 64
            ? (N(this, lt, s[16], "f"),
              N(this, ft, i - 64, "f"),
              this.hash(),
              N(this, St, !0, "f"))
            : N(this, ft, i, "f");
      }
      return _(this, Be, "f") > 4294967295 &&
        (N(
          this,
          Ht,
          _(this, Ht, "f") + (_(this, Be, "f") / 4294967296 << 0),
          "f",
        ),
          N(this, Be, _(this, Be, "f") % 4294967296, "f")),
        this;
    }
    finalize() {
      if (_(this, Mt, "f")) return;
      N(this, Mt, !0, "f");
      let e = _(this, jt, "f"), t = _(this, Ar, "f");
      e[16] = _(this, lt, "f"),
        e[t >> 2] |= Ws[t & 3],
        N(this, lt, e[16], "f"),
        t >= 56 &&
        (_(this, St, "f") || this.hash(),
          e[0] = _(this, lt, "f"),
          e[16] =
            e[1] =
            e[2] =
            e[3] =
            e[4] =
            e[5] =
            e[6] =
            e[7] =
            e[8] =
            e[9] =
            e[10] =
            e[11] =
            e[12] =
            e[13] =
            e[14] =
            e[15] =
              0),
        e[14] = _(this, Ht, "f") << 3 | _(this, Be, "f") >>> 29,
        e[15] = _(this, Be, "f") << 3,
        this.hash();
    }
    hash() {
      let e = _(this, Re, "f"),
        t = _(this, ze, "f"),
        r = _(this, qe, "f"),
        n = _(this, Ke, "f"),
        s = _(this, We, "f"),
        i = _(this, Ve, "f"),
        a = _(this, Je, "f"),
        c = _(this, Ge, "f"),
        d = _(this, jt, "f"),
        f,
        p,
        h,
        m,
        g,
        O,
        v,
        C,
        x,
        F;
      for (let D = 16; D < 64; ++D) {
        m = d[D - 15],
          f = (m >>> 7 | m << 25) ^ (m >>> 18 | m << 14) ^ m >>> 3,
          m = d[D - 2],
          p = (m >>> 17 | m << 15) ^ (m >>> 19 | m << 13) ^ m >>> 10,
          d[D] = d[D - 16] + f + d[D - 7] + p << 0;
      }
      F = t & r;
      for (let D = 0; D < 64; D += 4) {
        _(this, er, "f")
          ? (_(this, dt, "f")
            ? (v = 300032,
              m = d[0] - 1413257819,
              c = m - 150054599 << 0,
              n = m + 24177077 << 0)
            : (v = 704751109,
              m = d[0] - 210244248,
              c = m - 1521486534 << 0,
              n = m + 143694565 << 0),
            N(this, er, !1, "f"))
          : (f = (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^
            (e >>> 22 | e << 10),
            p = (s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^
              (s >>> 25 | s << 7),
            v = e & t,
            h = v ^ e & r ^ F,
            O = s & i ^ ~s & a,
            m = c + p + O + Tr[D] + d[D],
            g = f + h,
            c = n + m << 0,
            n = m + g << 0),
          f = (n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10),
          p = (c >>> 6 | c << 26) ^ (c >>> 11 | c << 21) ^ (c >>> 25 | c << 7),
          C = n & e,
          h = C ^ n & t ^ v,
          O = c & s ^ ~c & i,
          m = a + p + O + Tr[D + 1] + d[D + 1],
          g = f + h,
          a = r + m << 0,
          r = m + g << 0,
          f = (r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10),
          p = (a >>> 6 | a << 26) ^ (a >>> 11 | a << 21) ^ (a >>> 25 | a << 7),
          x = r & n,
          h = x ^ r & e ^ C,
          O = a & c ^ ~a & s,
          m = i + p + O + Tr[D + 2] + d[D + 2],
          g = f + h,
          i = t + m << 0,
          t = m + g << 0,
          f = (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10),
          p = (i >>> 6 | i << 26) ^ (i >>> 11 | i << 21) ^ (i >>> 25 | i << 7),
          F = t & r,
          h = F ^ t & n ^ x,
          O = i & a ^ ~i & c,
          m = s + p + O + Tr[D + 3] + d[D + 3],
          g = f + h,
          s = e + m << 0,
          e = m + g << 0;
      }
      N(this, Re, _(this, Re, "f") + e << 0, "f"),
        N(this, ze, _(this, ze, "f") + t << 0, "f"),
        N(this, qe, _(this, qe, "f") + r << 0, "f"),
        N(this, Ke, _(this, Ke, "f") + n << 0, "f"),
        N(this, We, _(this, We, "f") + s << 0, "f"),
        N(this, Ve, _(this, Ve, "f") + i << 0, "f"),
        N(this, Je, _(this, Je, "f") + a << 0, "f"),
        N(this, Ge, _(this, Ge, "f") + c << 0, "f");
    }
    hex() {
      this.finalize();
      let e = _(this, Re, "f"),
        t = _(this, ze, "f"),
        r = _(this, qe, "f"),
        n = _(this, Ke, "f"),
        s = _(this, We, "f"),
        i = _(this, Ve, "f"),
        a = _(this, Je, "f"),
        c = _(this, Ge, "f"),
        d = j[e >> 28 & 15] + j[e >> 24 & 15] + j[e >> 20 & 15] +
          j[e >> 16 & 15] + j[e >> 12 & 15] + j[e >> 8 & 15] + j[e >> 4 & 15] +
          j[e & 15] + j[t >> 28 & 15] + j[t >> 24 & 15] + j[t >> 20 & 15] +
          j[t >> 16 & 15] + j[t >> 12 & 15] + j[t >> 8 & 15] + j[t >> 4 & 15] +
          j[t & 15] + j[r >> 28 & 15] + j[r >> 24 & 15] + j[r >> 20 & 15] +
          j[r >> 16 & 15] + j[r >> 12 & 15] + j[r >> 8 & 15] + j[r >> 4 & 15] +
          j[r & 15] + j[n >> 28 & 15] + j[n >> 24 & 15] + j[n >> 20 & 15] +
          j[n >> 16 & 15] + j[n >> 12 & 15] + j[n >> 8 & 15] + j[n >> 4 & 15] +
          j[n & 15] + j[s >> 28 & 15] + j[s >> 24 & 15] + j[s >> 20 & 15] +
          j[s >> 16 & 15] + j[s >> 12 & 15] + j[s >> 8 & 15] + j[s >> 4 & 15] +
          j[s & 15] + j[i >> 28 & 15] + j[i >> 24 & 15] + j[i >> 20 & 15] +
          j[i >> 16 & 15] + j[i >> 12 & 15] + j[i >> 8 & 15] + j[i >> 4 & 15] +
          j[i & 15] + j[a >> 28 & 15] + j[a >> 24 & 15] + j[a >> 20 & 15] +
          j[a >> 16 & 15] + j[a >> 12 & 15] + j[a >> 8 & 15] + j[a >> 4 & 15] +
          j[a & 15];
      return _(this, dt, "f") ||
        (d += j[c >> 28 & 15] + j[c >> 24 & 15] + j[c >> 20 & 15] +
          j[c >> 16 & 15] + j[c >> 12 & 15] + j[c >> 8 & 15] + j[c >> 4 & 15] +
          j[c & 15]),
        d;
    }
    toString() {
      return this.hex();
    }
    digest() {
      this.finalize();
      let e = _(this, Re, "f"),
        t = _(this, ze, "f"),
        r = _(this, qe, "f"),
        n = _(this, Ke, "f"),
        s = _(this, We, "f"),
        i = _(this, Ve, "f"),
        a = _(this, Je, "f"),
        c = _(this, Ge, "f"),
        d = [
          e >> 24 & 255,
          e >> 16 & 255,
          e >> 8 & 255,
          e & 255,
          t >> 24 & 255,
          t >> 16 & 255,
          t >> 8 & 255,
          t & 255,
          r >> 24 & 255,
          r >> 16 & 255,
          r >> 8 & 255,
          r & 255,
          n >> 24 & 255,
          n >> 16 & 255,
          n >> 8 & 255,
          n & 255,
          s >> 24 & 255,
          s >> 16 & 255,
          s >> 8 & 255,
          s & 255,
          i >> 24 & 255,
          i >> 16 & 255,
          i >> 8 & 255,
          i & 255,
          a >> 24 & 255,
          a >> 16 & 255,
          a >> 8 & 255,
          a & 255,
        ];
      return _(this, dt, "f") ||
        d.push(c >> 24 & 255, c >> 16 & 255, c >> 8 & 255, c & 255),
        d;
    }
    array() {
      return this.digest();
    }
    arrayBuffer() {
      this.finalize();
      let e = new ArrayBuffer(_(this, dt, "f") ? 28 : 32), t = new DataView(e);
      return t.setUint32(0, _(this, Re, "f")),
        t.setUint32(4, _(this, ze, "f")),
        t.setUint32(8, _(this, qe, "f")),
        t.setUint32(12, _(this, Ke, "f")),
        t.setUint32(16, _(this, We, "f")),
        t.setUint32(20, _(this, Ve, "f")),
        t.setUint32(24, _(this, Je, "f")),
        _(this, dt, "f") || t.setUint32(28, _(this, Ge, "f")),
        e;
    }
  };
lt = new WeakMap(),
  jt = new WeakMap(),
  Be = new WeakMap(),
  Mt = new WeakMap(),
  er = new WeakMap(),
  Re = new WeakMap(),
  ze = new WeakMap(),
  qe = new WeakMap(),
  Ke = new WeakMap(),
  We = new WeakMap(),
  Ve = new WeakMap(),
  Je = new WeakMap(),
  Ge = new WeakMap(),
  St = new WeakMap(),
  Ht = new WeakMap(),
  dt = new WeakMap(),
  Ar = new WeakMap(),
  ft = new WeakMap();
Rs = new WeakMap(), zs = new WeakMap(), qs = new WeakMap(), Ks = new WeakMap();
var Fn = "Invalid mnemonic",
  $t = "Invalid entropy",
  Vs = "Invalid mnemonic checksum",
  Rn = `A wordlist is required but a default could not be found.
Please pass a 2048 word array explicitly.`;
function zn(o, e) {
  if (e = e || Gn, !e) throw new Error(Rn);
  let t = Zs(o).split(" ");
  if (t.length % 3 !== 0) throw new Error(Fn);
  let r = t.map((f) => {
      let p = e.indexOf(f);
      if (p === -1) throw new Error(Fn);
      return Wn(p.toString(2), "0", 11);
    }).join(""),
    n = Math.floor(r.length / 33) * 32,
    s = r.slice(0, n),
    i = r.slice(n),
    a = s.match(/(.{1,8})/g).map(Jn);
  if (a.length < 16) throw new Error($t);
  if (a.length > 32) throw new Error($t);
  if (a.length % 4 !== 0) throw new Error($t);
  let c = new Uint8Array(a);
  if (Kn(c) !== i) throw new Error(Vs);
  return k(c);
}
function Js(o) {
  let r = new Uint8Array(o);
  if (o > 4294967295) throw new RangeError("requested too many random bytes");
  if (o > 0) {
    if (o > 65536) {
      for (let n = 0; n < o; n += 65536) {
        crypto.getRandomValues(r.slice(n, n + 65536));
      }
    } else crypto.getRandomValues(r);
  }
  return r;
}
function qn(o, e, t) {
  if (o = o || 128, o % 32 !== 0) throw new TypeError($t);
  return e = e || Js, Gs(e(o / 8), t);
}
function Gs(o, e) {
  if (e = e || Gn, !e) throw new Error(Rn);
  if (o.length < 16) throw new TypeError($t);
  if (o.length > 32) throw new TypeError($t);
  if (o.length % 4 !== 0) throw new TypeError($t);
  let t = Vn(Array.from(o)),
    r = Kn(o),
    i = (t + r).match(/(.{1,11})/g).map((a) => {
      let c = Jn(a);
      return e[c];
    });
  return e[0] === "\u3042\u3044\u3053\u304F\u3057\u3093"
    ? i.join("\u3000")
    : i.join(" ");
}
function Kn(o) {
  let t = o.length * 8 / 32, r = new Lt().update(o).digest();
  return Vn(Array.from(r)).slice(0, t);
}
function Wn(o, e, t) {
  for (; o.length < t;) o = e + o;
  return o;
}
function Vn(o) {
  return o.map((e) => Wn(e.toString(2), "0", 8)).join("");
}
function Zs(o) {
  return (o || "").normalize("NFKD");
}
function Jn(o) {
  return parseInt(o, 2);
}
var Gn = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acoustic",
  "acquire",
  "across",
  "act",
  "action",
  "actor",
  "actress",
  "actual",
  "adapt",
  "add",
  "addict",
  "address",
  "adjust",
  "admit",
  "adult",
  "advance",
  "advice",
  "aerobic",
  "affair",
  "afford",
  "afraid",
  "again",
  "age",
  "agent",
  "agree",
  "ahead",
  "aim",
  "air",
  "airport",
  "aisle",
  "alarm",
  "album",
  "alcohol",
  "alert",
  "alien",
  "all",
  "alley",
  "allow",
  "almost",
  "alone",
  "alpha",
  "already",
  "also",
  "alter",
  "always",
  "amateur",
  "amazing",
  "among",
  "amount",
  "amused",
  "analyst",
  "anchor",
  "ancient",
  "anger",
  "angle",
  "angry",
  "animal",
  "ankle",
  "announce",
  "annual",
  "another",
  "answer",
  "antenna",
  "antique",
  "anxiety",
  "any",
  "apart",
  "apology",
  "appear",
  "apple",
  "approve",
  "april",
  "arch",
  "arctic",
  "area",
  "arena",
  "argue",
  "arm",
  "armed",
  "armor",
  "army",
  "around",
  "arrange",
  "arrest",
  "arrive",
  "arrow",
  "art",
  "artefact",
  "artist",
  "artwork",
  "ask",
  "aspect",
  "assault",
  "asset",
  "assist",
  "assume",
  "asthma",
  "athlete",
  "atom",
  "attack",
  "attend",
  "attitude",
  "attract",
  "auction",
  "audit",
  "august",
  "aunt",
  "author",
  "auto",
  "autumn",
  "average",
  "avocado",
  "avoid",
  "awake",
  "aware",
  "away",
  "awesome",
  "awful",
  "awkward",
  "axis",
  "baby",
  "bachelor",
  "bacon",
  "badge",
  "bag",
  "balance",
  "balcony",
  "ball",
  "bamboo",
  "banana",
  "banner",
  "bar",
  "barely",
  "bargain",
  "barrel",
  "base",
  "basic",
  "basket",
  "battle",
  "beach",
  "bean",
  "beauty",
  "because",
  "become",
  "beef",
  "before",
  "begin",
  "behave",
  "behind",
  "believe",
  "below",
  "belt",
  "bench",
  "benefit",
  "best",
  "betray",
  "better",
  "between",
  "beyond",
  "bicycle",
  "bid",
  "bike",
  "bind",
  "biology",
  "bird",
  "birth",
  "bitter",
  "black",
  "blade",
  "blame",
  "blanket",
  "blast",
  "bleak",
  "bless",
  "blind",
  "blood",
  "blossom",
  "blouse",
  "blue",
  "blur",
  "blush",
  "board",
  "boat",
  "body",
  "boil",
  "bomb",
  "bone",
  "bonus",
  "book",
  "boost",
  "border",
  "boring",
  "borrow",
  "boss",
  "bottom",
  "bounce",
  "box",
  "boy",
  "bracket",
  "brain",
  "brand",
  "brass",
  "brave",
  "bread",
  "breeze",
  "brick",
  "bridge",
  "brief",
  "bright",
  "bring",
  "brisk",
  "broccoli",
  "broken",
  "bronze",
  "broom",
  "brother",
  "brown",
  "brush",
  "bubble",
  "buddy",
  "budget",
  "buffalo",
  "build",
  "bulb",
  "bulk",
  "bullet",
  "bundle",
  "bunker",
  "burden",
  "burger",
  "burst",
  "bus",
  "business",
  "busy",
  "butter",
  "buyer",
  "buzz",
  "cabbage",
  "cabin",
  "cable",
  "cactus",
  "cage",
  "cake",
  "call",
  "calm",
  "camera",
  "camp",
  "can",
  "canal",
  "cancel",
  "candy",
  "cannon",
  "canoe",
  "canvas",
  "canyon",
  "capable",
  "capital",
  "captain",
  "car",
  "carbon",
  "card",
  "cargo",
  "carpet",
  "carry",
  "cart",
  "case",
  "cash",
  "casino",
  "castle",
  "casual",
  "cat",
  "catalog",
  "catch",
  "category",
  "cattle",
  "caught",
  "cause",
  "caution",
  "cave",
  "ceiling",
  "celery",
  "cement",
  "census",
  "century",
  "cereal",
  "certain",
  "chair",
  "chalk",
  "champion",
  "change",
  "chaos",
  "chapter",
  "charge",
  "chase",
  "chat",
  "cheap",
  "check",
  "cheese",
  "chef",
  "cherry",
  "chest",
  "chicken",
  "chief",
  "child",
  "chimney",
  "choice",
  "choose",
  "chronic",
  "chuckle",
  "chunk",
  "churn",
  "cigar",
  "cinnamon",
  "circle",
  "citizen",
  "city",
  "civil",
  "claim",
  "clap",
  "clarify",
  "claw",
  "clay",
  "clean",
  "clerk",
  "clever",
  "click",
  "client",
  "cliff",
  "climb",
  "clinic",
  "clip",
  "clock",
  "clog",
  "close",
  "cloth",
  "cloud",
  "clown",
  "club",
  "clump",
  "cluster",
  "clutch",
  "coach",
  "coast",
  "coconut",
  "code",
  "coffee",
  "coil",
  "coin",
  "collect",
  "color",
  "column",
  "combine",
  "come",
  "comfort",
  "comic",
  "common",
  "company",
  "concert",
  "conduct",
  "confirm",
  "congress",
  "connect",
  "consider",
  "control",
  "convince",
  "cook",
  "cool",
  "copper",
  "copy",
  "coral",
  "core",
  "corn",
  "correct",
  "cost",
  "cotton",
  "couch",
  "country",
  "couple",
  "course",
  "cousin",
  "cover",
  "coyote",
  "crack",
  "cradle",
  "craft",
  "cram",
  "crane",
  "crash",
  "crater",
  "crawl",
  "crazy",
  "cream",
  "credit",
  "creek",
  "crew",
  "cricket",
  "crime",
  "crisp",
  "critic",
  "crop",
  "cross",
  "crouch",
  "crowd",
  "crucial",
  "cruel",
  "cruise",
  "crumble",
  "crunch",
  "crush",
  "cry",
  "crystal",
  "cube",
  "culture",
  "cup",
  "cupboard",
  "curious",
  "current",
  "curtain",
  "curve",
  "cushion",
  "custom",
  "cute",
  "cycle",
  "dad",
  "damage",
  "damp",
  "dance",
  "danger",
  "daring",
  "dash",
  "daughter",
  "dawn",
  "day",
  "deal",
  "debate",
  "debris",
  "decade",
  "december",
  "decide",
  "decline",
  "decorate",
  "decrease",
  "deer",
  "defense",
  "define",
  "defy",
  "degree",
  "delay",
  "deliver",
  "demand",
  "demise",
  "denial",
  "dentist",
  "deny",
  "depart",
  "depend",
  "deposit",
  "depth",
  "deputy",
  "derive",
  "describe",
  "desert",
  "design",
  "desk",
  "despair",
  "destroy",
  "detail",
  "detect",
  "develop",
  "device",
  "devote",
  "diagram",
  "dial",
  "diamond",
  "diary",
  "dice",
  "diesel",
  "diet",
  "differ",
  "digital",
  "dignity",
  "dilemma",
  "dinner",
  "dinosaur",
  "direct",
  "dirt",
  "disagree",
  "discover",
  "disease",
  "dish",
  "dismiss",
  "disorder",
  "display",
  "distance",
  "divert",
  "divide",
  "divorce",
  "dizzy",
  "doctor",
  "document",
  "dog",
  "doll",
  "dolphin",
  "domain",
  "donate",
  "donkey",
  "donor",
  "door",
  "dose",
  "double",
  "dove",
  "draft",
  "dragon",
  "drama",
  "drastic",
  "draw",
  "dream",
  "dress",
  "drift",
  "drill",
  "drink",
  "drip",
  "drive",
  "drop",
  "drum",
  "dry",
  "duck",
  "dumb",
  "dune",
  "during",
  "dust",
  "dutch",
  "duty",
  "dwarf",
  "dynamic",
  "eager",
  "eagle",
  "early",
  "earn",
  "earth",
  "easily",
  "east",
  "easy",
  "echo",
  "ecology",
  "economy",
  "edge",
  "edit",
  "educate",
  "effort",
  "egg",
  "eight",
  "either",
  "elbow",
  "elder",
  "electric",
  "elegant",
  "element",
  "elephant",
  "elevator",
  "elite",
  "else",
  "embark",
  "embody",
  "embrace",
  "emerge",
  "emotion",
  "employ",
  "empower",
  "empty",
  "enable",
  "enact",
  "end",
  "endless",
  "endorse",
  "enemy",
  "energy",
  "enforce",
  "engage",
  "engine",
  "enhance",
  "enjoy",
  "enlist",
  "enough",
  "enrich",
  "enroll",
  "ensure",
  "enter",
  "entire",
  "entry",
  "envelope",
  "episode",
  "equal",
  "equip",
  "era",
  "erase",
  "erode",
  "erosion",
  "error",
  "erupt",
  "escape",
  "essay",
  "essence",
  "estate",
  "eternal",
  "ethics",
  "evidence",
  "evil",
  "evoke",
  "evolve",
  "exact",
  "example",
  "excess",
  "exchange",
  "excite",
  "exclude",
  "excuse",
  "execute",
  "exercise",
  "exhaust",
  "exhibit",
  "exile",
  "exist",
  "exit",
  "exotic",
  "expand",
  "expect",
  "expire",
  "explain",
  "expose",
  "express",
  "extend",
  "extra",
  "eye",
  "eyebrow",
  "fabric",
  "face",
  "faculty",
  "fade",
  "faint",
  "faith",
  "fall",
  "false",
  "fame",
  "family",
  "famous",
  "fan",
  "fancy",
  "fantasy",
  "farm",
  "fashion",
  "fat",
  "fatal",
  "father",
  "fatigue",
  "fault",
  "favorite",
  "feature",
  "february",
  "federal",
  "fee",
  "feed",
  "feel",
  "female",
  "fence",
  "festival",
  "fetch",
  "fever",
  "few",
  "fiber",
  "fiction",
  "field",
  "figure",
  "file",
  "film",
  "filter",
  "final",
  "find",
  "fine",
  "finger",
  "finish",
  "fire",
  "firm",
  "first",
  "fiscal",
  "fish",
  "fit",
  "fitness",
  "fix",
  "flag",
  "flame",
  "flash",
  "flat",
  "flavor",
  "flee",
  "flight",
  "flip",
  "float",
  "flock",
  "floor",
  "flower",
  "fluid",
  "flush",
  "fly",
  "foam",
  "focus",
  "fog",
  "foil",
  "fold",
  "follow",
  "food",
  "foot",
  "force",
  "forest",
  "forget",
  "fork",
  "fortune",
  "forum",
  "forward",
  "fossil",
  "foster",
  "found",
  "fox",
  "fragile",
  "frame",
  "frequent",
  "fresh",
  "friend",
  "fringe",
  "frog",
  "front",
  "frost",
  "frown",
  "frozen",
  "fruit",
  "fuel",
  "fun",
  "funny",
  "furnace",
  "fury",
  "future",
  "gadget",
  "gain",
  "galaxy",
  "gallery",
  "game",
  "gap",
  "garage",
  "garbage",
  "garden",
  "garlic",
  "garment",
  "gas",
  "gasp",
  "gate",
  "gather",
  "gauge",
  "gaze",
  "general",
  "genius",
  "genre",
  "gentle",
  "genuine",
  "gesture",
  "ghost",
  "giant",
  "gift",
  "giggle",
  "ginger",
  "giraffe",
  "girl",
  "give",
  "glad",
  "glance",
  "glare",
  "glass",
  "glide",
  "glimpse",
  "globe",
  "gloom",
  "glory",
  "glove",
  "glow",
  "glue",
  "goat",
  "goddess",
  "gold",
  "good",
  "goose",
  "gorilla",
  "gospel",
  "gossip",
  "govern",
  "gown",
  "grab",
  "grace",
  "grain",
  "grant",
  "grape",
  "grass",
  "gravity",
  "great",
  "green",
  "grid",
  "grief",
  "grit",
  "grocery",
  "group",
  "grow",
  "grunt",
  "guard",
  "guess",
  "guide",
  "guilt",
  "guitar",
  "gun",
  "gym",
  "habit",
  "hair",
  "half",
  "hammer",
  "hamster",
  "hand",
  "happy",
  "harbor",
  "hard",
  "harsh",
  "harvest",
  "hat",
  "have",
  "hawk",
  "hazard",
  "head",
  "health",
  "heart",
  "heavy",
  "hedgehog",
  "height",
  "hello",
  "helmet",
  "help",
  "hen",
  "hero",
  "hidden",
  "high",
  "hill",
  "hint",
  "hip",
  "hire",
  "history",
  "hobby",
  "hockey",
  "hold",
  "hole",
  "holiday",
  "hollow",
  "home",
  "honey",
  "hood",
  "hope",
  "horn",
  "horror",
  "horse",
  "hospital",
  "host",
  "hotel",
  "hour",
  "hover",
  "hub",
  "huge",
  "human",
  "humble",
  "humor",
  "hundred",
  "hungry",
  "hunt",
  "hurdle",
  "hurry",
  "hurt",
  "husband",
  "hybrid",
  "ice",
  "icon",
  "idea",
  "identify",
  "idle",
  "ignore",
  "ill",
  "illegal",
  "illness",
  "image",
  "imitate",
  "immense",
  "immune",
  "impact",
  "impose",
  "improve",
  "impulse",
  "inch",
  "include",
  "income",
  "increase",
  "index",
  "indicate",
  "indoor",
  "industry",
  "infant",
  "inflict",
  "inform",
  "inhale",
  "inherit",
  "initial",
  "inject",
  "injury",
  "inmate",
  "inner",
  "innocent",
  "input",
  "inquiry",
  "insane",
  "insect",
  "inside",
  "inspire",
  "install",
  "intact",
  "interest",
  "into",
  "invest",
  "invite",
  "involve",
  "iron",
  "island",
  "isolate",
  "issue",
  "item",
  "ivory",
  "jacket",
  "jaguar",
  "jar",
  "jazz",
  "jealous",
  "jeans",
  "jelly",
  "jewel",
  "job",
  "join",
  "joke",
  "journey",
  "joy",
  "judge",
  "juice",
  "jump",
  "jungle",
  "junior",
  "junk",
  "just",
  "kangaroo",
  "keen",
  "keep",
  "ketchup",
  "key",
  "kick",
  "kid",
  "kidney",
  "kind",
  "kingdom",
  "kiss",
  "kit",
  "kitchen",
  "kite",
  "kitten",
  "kiwi",
  "knee",
  "knife",
  "knock",
  "know",
  "lab",
  "label",
  "labor",
  "ladder",
  "lady",
  "lake",
  "lamp",
  "language",
  "laptop",
  "large",
  "later",
  "latin",
  "laugh",
  "laundry",
  "lava",
  "law",
  "lawn",
  "lawsuit",
  "layer",
  "lazy",
  "leader",
  "leaf",
  "learn",
  "leave",
  "lecture",
  "left",
  "leg",
  "legal",
  "legend",
  "leisure",
  "lemon",
  "lend",
  "length",
  "lens",
  "leopard",
  "lesson",
  "letter",
  "level",
  "liar",
  "liberty",
  "library",
  "license",
  "life",
  "lift",
  "light",
  "like",
  "limb",
  "limit",
  "link",
  "lion",
  "liquid",
  "list",
  "little",
  "live",
  "lizard",
  "load",
  "loan",
  "lobster",
  "local",
  "lock",
  "logic",
  "lonely",
  "long",
  "loop",
  "lottery",
  "loud",
  "lounge",
  "love",
  "loyal",
  "lucky",
  "luggage",
  "lumber",
  "lunar",
  "lunch",
  "luxury",
  "lyrics",
  "machine",
  "mad",
  "magic",
  "magnet",
  "maid",
  "mail",
  "main",
  "major",
  "make",
  "mammal",
  "man",
  "manage",
  "mandate",
  "mango",
  "mansion",
  "manual",
  "maple",
  "marble",
  "march",
  "margin",
  "marine",
  "market",
  "marriage",
  "mask",
  "mass",
  "master",
  "match",
  "material",
  "math",
  "matrix",
  "matter",
  "maximum",
  "maze",
  "meadow",
  "mean",
  "measure",
  "meat",
  "mechanic",
  "medal",
  "media",
  "melody",
  "melt",
  "member",
  "memory",
  "mention",
  "menu",
  "mercy",
  "merge",
  "merit",
  "merry",
  "mesh",
  "message",
  "metal",
  "method",
  "middle",
  "midnight",
  "milk",
  "million",
  "mimic",
  "mind",
  "minimum",
  "minor",
  "minute",
  "miracle",
  "mirror",
  "misery",
  "miss",
  "mistake",
  "mix",
  "mixed",
  "mixture",
  "mobile",
  "model",
  "modify",
  "mom",
  "moment",
  "monitor",
  "monkey",
  "monster",
  "month",
  "moon",
  "moral",
  "more",
  "morning",
  "mosquito",
  "mother",
  "motion",
  "motor",
  "mountain",
  "mouse",
  "move",
  "movie",
  "much",
  "muffin",
  "mule",
  "multiply",
  "muscle",
  "museum",
  "mushroom",
  "music",
  "must",
  "mutual",
  "myself",
  "mystery",
  "myth",
  "naive",
  "name",
  "napkin",
  "narrow",
  "nasty",
  "nation",
  "nature",
  "near",
  "neck",
  "need",
  "negative",
  "neglect",
  "neither",
  "nephew",
  "nerve",
  "nest",
  "net",
  "network",
  "neutral",
  "never",
  "news",
  "next",
  "nice",
  "night",
  "noble",
  "noise",
  "nominee",
  "noodle",
  "normal",
  "north",
  "nose",
  "notable",
  "note",
  "nothing",
  "notice",
  "novel",
  "now",
  "nuclear",
  "number",
  "nurse",
  "nut",
  "oak",
  "obey",
  "object",
  "oblige",
  "obscure",
  "observe",
  "obtain",
  "obvious",
  "occur",
  "ocean",
  "october",
  "odor",
  "off",
  "offer",
  "office",
  "often",
  "oil",
  "okay",
  "old",
  "olive",
  "olympic",
  "omit",
  "once",
  "one",
  "onion",
  "online",
  "only",
  "open",
  "opera",
  "opinion",
  "oppose",
  "option",
  "orange",
  "orbit",
  "orchard",
  "order",
  "ordinary",
  "organ",
  "orient",
  "original",
  "orphan",
  "ostrich",
  "other",
  "outdoor",
  "outer",
  "output",
  "outside",
  "oval",
  "oven",
  "over",
  "own",
  "owner",
  "oxygen",
  "oyster",
  "ozone",
  "pact",
  "paddle",
  "page",
  "pair",
  "palace",
  "palm",
  "panda",
  "panel",
  "panic",
  "panther",
  "paper",
  "parade",
  "parent",
  "park",
  "parrot",
  "party",
  "pass",
  "patch",
  "path",
  "patient",
  "patrol",
  "pattern",
  "pause",
  "pave",
  "payment",
  "peace",
  "peanut",
  "pear",
  "peasant",
  "pelican",
  "pen",
  "penalty",
  "pencil",
  "people",
  "pepper",
  "perfect",
  "permit",
  "person",
  "pet",
  "phone",
  "photo",
  "phrase",
  "physical",
  "piano",
  "picnic",
  "picture",
  "piece",
  "pig",
  "pigeon",
  "pill",
  "pilot",
  "pink",
  "pioneer",
  "pipe",
  "pistol",
  "pitch",
  "pizza",
  "place",
  "planet",
  "plastic",
  "plate",
  "play",
  "please",
  "pledge",
  "pluck",
  "plug",
  "plunge",
  "poem",
  "poet",
  "point",
  "polar",
  "pole",
  "police",
  "pond",
  "pony",
  "pool",
  "popular",
  "portion",
  "position",
  "possible",
  "post",
  "potato",
  "pottery",
  "poverty",
  "powder",
  "power",
  "practice",
  "praise",
  "predict",
  "prefer",
  "prepare",
  "present",
  "pretty",
  "prevent",
  "price",
  "pride",
  "primary",
  "print",
  "priority",
  "prison",
  "private",
  "prize",
  "problem",
  "process",
  "produce",
  "profit",
  "program",
  "project",
  "promote",
  "proof",
  "property",
  "prosper",
  "protect",
  "proud",
  "provide",
  "public",
  "pudding",
  "pull",
  "pulp",
  "pulse",
  "pumpkin",
  "punch",
  "pupil",
  "puppy",
  "purchase",
  "purity",
  "purpose",
  "purse",
  "push",
  "put",
  "puzzle",
  "pyramid",
  "quality",
  "quantum",
  "quarter",
  "question",
  "quick",
  "quit",
  "quiz",
  "quote",
  "rabbit",
  "raccoon",
  "race",
  "rack",
  "radar",
  "radio",
  "rail",
  "rain",
  "raise",
  "rally",
  "ramp",
  "ranch",
  "random",
  "range",
  "rapid",
  "rare",
  "rate",
  "rather",
  "raven",
  "raw",
  "razor",
  "ready",
  "real",
  "reason",
  "rebel",
  "rebuild",
  "recall",
  "receive",
  "recipe",
  "record",
  "recycle",
  "reduce",
  "reflect",
  "reform",
  "refuse",
  "region",
  "regret",
  "regular",
  "reject",
  "relax",
  "release",
  "relief",
  "rely",
  "remain",
  "remember",
  "remind",
  "remove",
  "render",
  "renew",
  "rent",
  "reopen",
  "repair",
  "repeat",
  "replace",
  "report",
  "require",
  "rescue",
  "resemble",
  "resist",
  "resource",
  "response",
  "result",
  "retire",
  "retreat",
  "return",
  "reunion",
  "reveal",
  "review",
  "reward",
  "rhythm",
  "rib",
  "ribbon",
  "rice",
  "rich",
  "ride",
  "ridge",
  "rifle",
  "right",
  "rigid",
  "ring",
  "riot",
  "ripple",
  "risk",
  "ritual",
  "rival",
  "river",
  "road",
  "roast",
  "robot",
  "robust",
  "rocket",
  "romance",
  "roof",
  "rookie",
  "room",
  "rose",
  "rotate",
  "rough",
  "round",
  "route",
  "royal",
  "rubber",
  "rude",
  "rug",
  "rule",
  "run",
  "runway",
  "rural",
  "sad",
  "saddle",
  "sadness",
  "safe",
  "sail",
  "salad",
  "salmon",
  "salon",
  "salt",
  "salute",
  "same",
  "sample",
  "sand",
  "satisfy",
  "satoshi",
  "sauce",
  "sausage",
  "save",
  "say",
  "scale",
  "scan",
  "scare",
  "scatter",
  "scene",
  "scheme",
  "school",
  "science",
  "scissors",
  "scorpion",
  "scout",
  "scrap",
  "screen",
  "script",
  "scrub",
  "sea",
  "search",
  "season",
  "seat",
  "second",
  "secret",
  "section",
  "security",
  "seed",
  "seek",
  "segment",
  "select",
  "sell",
  "seminar",
  "senior",
  "sense",
  "sentence",
  "series",
  "service",
  "session",
  "settle",
  "setup",
  "seven",
  "shadow",
  "shaft",
  "shallow",
  "share",
  "shed",
  "shell",
  "sheriff",
  "shield",
  "shift",
  "shine",
  "ship",
  "shiver",
  "shock",
  "shoe",
  "shoot",
  "shop",
  "short",
  "shoulder",
  "shove",
  "shrimp",
  "shrug",
  "shuffle",
  "shy",
  "sibling",
  "sick",
  "side",
  "siege",
  "sight",
  "sign",
  "silent",
  "silk",
  "silly",
  "silver",
  "similar",
  "simple",
  "since",
  "sing",
  "siren",
  "sister",
  "situate",
  "six",
  "size",
  "skate",
  "sketch",
  "ski",
  "skill",
  "skin",
  "skirt",
  "skull",
  "slab",
  "slam",
  "sleep",
  "slender",
  "slice",
  "slide",
  "slight",
  "slim",
  "slogan",
  "slot",
  "slow",
  "slush",
  "small",
  "smart",
  "smile",
  "smoke",
  "smooth",
  "snack",
  "snake",
  "snap",
  "sniff",
  "snow",
  "soap",
  "soccer",
  "social",
  "sock",
  "soda",
  "soft",
  "solar",
  "soldier",
  "solid",
  "solution",
  "solve",
  "someone",
  "song",
  "soon",
  "sorry",
  "sort",
  "soul",
  "sound",
  "soup",
  "source",
  "south",
  "space",
  "spare",
  "spatial",
  "spawn",
  "speak",
  "special",
  "speed",
  "spell",
  "spend",
  "sphere",
  "spice",
  "spider",
  "spike",
  "spin",
  "spirit",
  "split",
  "spoil",
  "sponsor",
  "spoon",
  "sport",
  "spot",
  "spray",
  "spread",
  "spring",
  "spy",
  "square",
  "squeeze",
  "squirrel",
  "stable",
  "stadium",
  "staff",
  "stage",
  "stairs",
  "stamp",
  "stand",
  "start",
  "state",
  "stay",
  "steak",
  "steel",
  "stem",
  "step",
  "stereo",
  "stick",
  "still",
  "sting",
  "stock",
  "stomach",
  "stone",
  "stool",
  "story",
  "stove",
  "strategy",
  "street",
  "strike",
  "strong",
  "struggle",
  "student",
  "stuff",
  "stumble",
  "style",
  "subject",
  "submit",
  "subway",
  "success",
  "such",
  "sudden",
  "suffer",
  "sugar",
  "suggest",
  "suit",
  "summer",
  "sun",
  "sunny",
  "sunset",
  "super",
  "supply",
  "supreme",
  "sure",
  "surface",
  "surge",
  "surprise",
  "surround",
  "survey",
  "suspect",
  "sustain",
  "swallow",
  "swamp",
  "swap",
  "swarm",
  "swear",
  "sweet",
  "swift",
  "swim",
  "swing",
  "switch",
  "sword",
  "symbol",
  "symptom",
  "syrup",
  "system",
  "table",
  "tackle",
  "tag",
  "tail",
  "talent",
  "talk",
  "tank",
  "tape",
  "target",
  "task",
  "taste",
  "tattoo",
  "taxi",
  "teach",
  "team",
  "tell",
  "ten",
  "tenant",
  "tennis",
  "tent",
  "term",
  "test",
  "text",
  "thank",
  "that",
  "theme",
  "then",
  "theory",
  "there",
  "they",
  "thing",
  "this",
  "thought",
  "three",
  "thrive",
  "throw",
  "thumb",
  "thunder",
  "ticket",
  "tide",
  "tiger",
  "tilt",
  "timber",
  "time",
  "tiny",
  "tip",
  "tired",
  "tissue",
  "title",
  "toast",
  "tobacco",
  "today",
  "toddler",
  "toe",
  "together",
  "toilet",
  "token",
  "tomato",
  "tomorrow",
  "tone",
  "tongue",
  "tonight",
  "tool",
  "tooth",
  "top",
  "topic",
  "topple",
  "torch",
  "tornado",
  "tortoise",
  "toss",
  "total",
  "tourist",
  "toward",
  "tower",
  "town",
  "toy",
  "track",
  "trade",
  "traffic",
  "tragic",
  "train",
  "transfer",
  "trap",
  "trash",
  "travel",
  "tray",
  "treat",
  "tree",
  "trend",
  "trial",
  "tribe",
  "trick",
  "trigger",
  "trim",
  "trip",
  "trophy",
  "trouble",
  "truck",
  "true",
  "truly",
  "trumpet",
  "trust",
  "truth",
  "try",
  "tube",
  "tuition",
  "tumble",
  "tuna",
  "tunnel",
  "turkey",
  "turn",
  "turtle",
  "twelve",
  "twenty",
  "twice",
  "twin",
  "twist",
  "two",
  "type",
  "typical",
  "ugly",
  "umbrella",
  "unable",
  "unaware",
  "uncle",
  "uncover",
  "under",
  "undo",
  "unfair",
  "unfold",
  "unhappy",
  "uniform",
  "unique",
  "unit",
  "universe",
  "unknown",
  "unlock",
  "until",
  "unusual",
  "unveil",
  "update",
  "upgrade",
  "uphold",
  "upon",
  "upper",
  "upset",
  "urban",
  "urge",
  "usage",
  "use",
  "used",
  "useful",
  "useless",
  "usual",
  "utility",
  "vacant",
  "vacuum",
  "vague",
  "valid",
  "valley",
  "valve",
  "van",
  "vanish",
  "vapor",
  "various",
  "vast",
  "vault",
  "vehicle",
  "velvet",
  "vendor",
  "venture",
  "venue",
  "verb",
  "verify",
  "version",
  "very",
  "vessel",
  "veteran",
  "viable",
  "vibrant",
  "vicious",
  "victory",
  "video",
  "view",
  "village",
  "vintage",
  "violin",
  "virtual",
  "virus",
  "visa",
  "visit",
  "visual",
  "vital",
  "vivid",
  "vocal",
  "voice",
  "void",
  "volcano",
  "volume",
  "vote",
  "voyage",
  "wage",
  "wagon",
  "wait",
  "walk",
  "wall",
  "walnut",
  "want",
  "warfare",
  "warm",
  "warrior",
  "wash",
  "wasp",
  "waste",
  "water",
  "wave",
  "way",
  "wealth",
  "weapon",
  "wear",
  "weasel",
  "weather",
  "web",
  "wedding",
  "weekend",
  "weird",
  "welcome",
  "west",
  "wet",
  "whale",
  "what",
  "wheat",
  "wheel",
  "when",
  "where",
  "whip",
  "whisper",
  "wide",
  "width",
  "wife",
  "wild",
  "will",
  "win",
  "window",
  "wine",
  "wing",
  "wink",
  "winner",
  "winter",
  "wire",
  "wisdom",
  "wise",
  "wish",
  "witness",
  "wolf",
  "woman",
  "wonder",
  "wood",
  "wool",
  "word",
  "work",
  "world",
  "worry",
  "worth",
  "wrap",
  "wreck",
  "wrestle",
  "wrist",
  "write",
  "wrong",
  "yard",
  "year",
  "yellow",
  "you",
  "young",
  "youth",
  "zebra",
  "zero",
  "zone",
  "zoo",
];
var nn = [
  0,
  7,
  14,
  9,
  28,
  27,
  18,
  21,
  56,
  63,
  54,
  49,
  36,
  35,
  42,
  45,
  112,
  119,
  126,
  121,
  108,
  107,
  98,
  101,
  72,
  79,
  70,
  65,
  84,
  83,
  90,
  93,
  224,
  231,
  238,
  233,
  252,
  251,
  242,
  245,
  216,
  223,
  214,
  209,
  196,
  195,
  202,
  205,
  144,
  151,
  158,
  153,
  140,
  139,
  130,
  133,
  168,
  175,
  166,
  161,
  180,
  179,
  186,
  189,
  199,
  192,
  201,
  206,
  219,
  220,
  213,
  210,
  255,
  248,
  241,
  246,
  227,
  228,
  237,
  234,
  183,
  176,
  185,
  190,
  171,
  172,
  165,
  162,
  143,
  136,
  129,
  134,
  147,
  148,
  157,
  154,
  39,
  32,
  41,
  46,
  59,
  60,
  53,
  50,
  31,
  24,
  17,
  22,
  3,
  4,
  13,
  10,
  87,
  80,
  89,
  94,
  75,
  76,
  69,
  66,
  111,
  104,
  97,
  102,
  115,
  116,
  125,
  122,
  137,
  142,
  135,
  128,
  149,
  146,
  155,
  156,
  177,
  182,
  191,
  184,
  173,
  170,
  163,
  164,
  249,
  254,
  247,
  240,
  229,
  226,
  235,
  236,
  193,
  198,
  207,
  200,
  221,
  218,
  211,
  212,
  105,
  110,
  103,
  96,
  117,
  114,
  123,
  124,
  81,
  86,
  95,
  88,
  77,
  74,
  67,
  68,
  25,
  30,
  23,
  16,
  5,
  2,
  11,
  12,
  33,
  38,
  47,
  40,
  61,
  58,
  51,
  52,
  78,
  73,
  64,
  71,
  82,
  85,
  92,
  91,
  118,
  113,
  120,
  127,
  106,
  109,
  100,
  99,
  62,
  57,
  48,
  55,
  34,
  37,
  44,
  43,
  6,
  1,
  8,
  15,
  26,
  29,
  20,
  19,
  174,
  169,
  160,
  167,
  178,
  181,
  188,
  187,
  150,
  145,
  152,
  159,
  138,
  141,
  132,
  131,
  222,
  217,
  208,
  215,
  194,
  197,
  204,
  203,
  230,
  225,
  232,
  239,
  250,
  253,
  244,
  243,
];
typeof Int32Array < "u" && (nn = new Int32Array(nn));
function Zn(o, e = 0) {
  let t = ~~e;
  for (let r = 0; r < o.length; r++) t = nn[(t ^ o[r]) & 255] & 255;
  return t;
}
var Tt = {
  Mainnet: { zeroTime: 1596059091e3, zeroSlot: 4492800, slotLength: 1e3 },
  Preview: { zeroTime: 1666656e6, zeroSlot: 0, slotLength: 1e3 },
  Preprod: { zeroTime: 16557696e5, zeroSlot: 86400, slotLength: 1e3 },
  Custom: { zeroTime: 0, zeroSlot: 0, slotLength: 0 },
};
function sn(o, e) {
  let t = (o - e.zeroSlot) * e.slotLength;
  return e.zeroTime + t;
}
function on(o, e) {
  let t = o - e.zeroTime;
  return Math.floor(t / e.slotLength) + e.zeroSlot;
}
var B = Symbol.for("TypeBox.Kind"),
  At = Symbol.for("TypeBox.Hint"),
  ue = Symbol.for("TypeBox.Modifier"),
  Ys = 0,
  an = class {
    ReadonlyOptional(e) {
      return { [ue]: "ReadonlyOptional", ...e };
    }
    Readonly(e) {
      return { [ue]: "Readonly", ...e };
    }
    Optional(e) {
      return { [ue]: "Optional", ...e };
    }
    Any(e = {}) {
      return this.Create({ ...e, [B]: "Any" });
    }
    Array(e, t = {}) {
      return this.Create({ ...t, [B]: "Array", type: "array", items: e });
    }
    Boolean(e = {}) {
      return this.Create({ ...e, [B]: "Boolean", type: "boolean" });
    }
    ConstructorParameters(e, t = {}) {
      return this.Tuple([...e.parameters], { ...t });
    }
    Constructor(e, t, r = {}) {
      if (e[B] === "Tuple") {
        let n = e.items === void 0 ? [] : e.items;
        return this.Create({
          ...r,
          [B]: "Constructor",
          type: "object",
          instanceOf: "Constructor",
          parameters: n,
          returns: t,
        });
      } else {
        if (globalThis.Array.isArray(e)) {
          return this.Create({
            ...r,
            [B]: "Constructor",
            type: "object",
            instanceOf: "Constructor",
            parameters: e,
            returns: t,
          });
        }
        throw new Error("TypeBuilder.Constructor: Invalid parameters");
      }
    }
    Date(e = {}) {
      return this.Create({
        ...e,
        [B]: "Date",
        type: "object",
        instanceOf: "Date",
      });
    }
    Enum(e, t = {}) {
      let n = Object.keys(e).filter((s) => isNaN(s)).map((s) => e[s]).map((s) =>
        typeof s == "string"
          ? { [B]: "Literal", type: "string", const: s }
          : { [B]: "Literal", type: "number", const: s }
      );
      return this.Create({ ...t, [B]: "Union", [At]: "Enum", anyOf: n });
    }
    Function(e, t, r = {}) {
      if (e[B] === "Tuple") {
        let n = e.items === void 0 ? [] : e.items;
        return this.Create({
          ...r,
          [B]: "Function",
          type: "object",
          instanceOf: "Function",
          parameters: n,
          returns: t,
        });
      } else {
        if (globalThis.Array.isArray(e)) {
          return this.Create({
            ...r,
            [B]: "Function",
            type: "object",
            instanceOf: "Function",
            parameters: e,
            returns: t,
          });
        }
        throw new Error("TypeBuilder.Function: Invalid parameters");
      }
    }
    InstanceType(e, t = {}) {
      return { ...t, ...this.Clone(e.returns) };
    }
    Integer(e = {}) {
      return this.Create({ ...e, [B]: "Integer", type: "integer" });
    }
    Intersect(e, t = {}) {
      let r = (a) =>
          a[ue] && a[ue] === "Optional" || a[ue] === "ReadonlyOptional",
        [n, s] = [new Set(), new Set()];
      for (let a of e) {
        for (let [c, d] of Object.entries(a.properties)) {
          r(d) && s.add(c);
        }
      }
      for (let a of e) {
        for (let c of Object.keys(a.properties)) {
          s.has(c) || n.add(c);
        }
      }
      let i = {};
      for (let a of e) {
        for (let [c, d] of Object.entries(a.properties)) {
          i[c] = i[c] === void 0
            ? d
            : { [B]: "Union", anyOf: [i[c], { ...d }] };
        }
      }
      return n.size > 0
        ? this.Create({
          ...t,
          [B]: "Object",
          type: "object",
          properties: i,
          required: [...n],
        })
        : this.Create({ ...t, [B]: "Object", type: "object", properties: i });
    }
    KeyOf(e, t = {}) {
      let r = Object.keys(e.properties).map((n) =>
        this.Create({ ...t, [B]: "Literal", type: "string", const: n })
      );
      return this.Create({ ...t, [B]: "Union", [At]: "KeyOf", anyOf: r });
    }
    Literal(e, t = {}) {
      return this.Create({ ...t, [B]: "Literal", const: e, type: typeof e });
    }
    Never(e = {}) {
      return this.Create({
        ...e,
        [B]: "Never",
        allOf: [{ type: "boolean", const: !1 }, { type: "boolean", const: !0 }],
      });
    }
    Null(e = {}) {
      return this.Create({ ...e, [B]: "Null", type: "null" });
    }
    Number(e = {}) {
      return this.Create({ ...e, [B]: "Number", type: "number" });
    }
    Object(e, t = {}) {
      let r = Object.keys(e),
        n = r.filter((i) => {
          let c = e[i][ue];
          return c && (c === "Optional" || c === "ReadonlyOptional");
        }),
        s = r.filter((i) => !n.includes(i));
      return s.length > 0
        ? this.Create({
          ...t,
          [B]: "Object",
          type: "object",
          properties: e,
          required: s,
        })
        : this.Create({ ...t, [B]: "Object", type: "object", properties: e });
    }
    Omit(e, t, r = {}) {
      let n = t[B] === "Union" ? t.anyOf.map((i) => i.const) : t,
        s = { ...this.Clone(e), ...r, [At]: "Omit" };
      s.required &&
        (s.required = s.required.filter((i) => !n.includes(i)),
          s.required.length === 0 && delete s.required);
      for (let i of Object.keys(s.properties)) {
        n.includes(i) &&
          delete s.properties[i];
      }
      return this.Create(s);
    }
    Parameters(e, t = {}) {
      return we.Tuple(e.parameters, { ...t });
    }
    Partial(e, t = {}) {
      let r = { ...this.Clone(e), ...t, [At]: "Partial" };
      delete r.required;
      for (let n of Object.keys(r.properties)) {
        let s = r.properties[n];
        switch (s[ue]) {
          case "ReadonlyOptional":
            s[ue] = "ReadonlyOptional";
            break;
          case "Readonly":
            s[ue] = "ReadonlyOptional";
            break;
          case "Optional":
            s[ue] = "Optional";
            break;
          default:
            s[ue] = "Optional";
            break;
        }
      }
      return this.Create(r);
    }
    Pick(e, t, r = {}) {
      let n = t[B] === "Union" ? t.anyOf.map((i) => i.const) : t,
        s = { ...this.Clone(e), ...r, [At]: "Pick" };
      s.required &&
        (s.required = s.required.filter((i) => n.includes(i)),
          s.required.length === 0 && delete s.required);
      for (let i of Object.keys(s.properties)) {
        n.includes(i) || delete s.properties[i];
      }
      return this.Create(s);
    }
    Promise(e, t = {}) {
      return this.Create({
        ...t,
        [B]: "Promise",
        type: "object",
        instanceOf: "Promise",
        item: e,
      });
    }
    Record(e, t, r = {}) {
      if (e[B] === "Union") {
        return this.Object(
          e.anyOf.reduce((s, i) => ({ ...s, [i.const]: t }), {}),
          { ...r, [At]: "Record" },
        );
      }
      let n = ["Integer", "Number"].includes(e[B])
        ? "^(0|[1-9][0-9]*)$"
        : e[B] === "String" && e.pattern
        ? e.pattern
        : "^.*$";
      return this.Create({
        ...r,
        [B]: "Record",
        type: "object",
        patternProperties: { [n]: t },
        additionalProperties: !1,
      });
    }
    Recursive(e, t = {}) {
      t.$id === void 0 && (t.$id = `T${Ys++}`);
      let r = e({ [B]: "Self", $ref: `${t.$id}` });
      return r.$id = t.$id, this.Create({ ...t, ...r });
    }
    Ref(e, t = {}) {
      if (e.$id === void 0) {
        throw Error("TypeBuilder.Ref: Referenced schema must specify an $id");
      }
      return this.Create({ ...t, [B]: "Ref", $ref: e.$id });
    }
    RegEx(e, t = {}) {
      return this.Create({
        ...t,
        [B]: "String",
        type: "string",
        pattern: e.source,
      });
    }
    Required(e, t = {}) {
      let r = { ...this.Clone(e), ...t, [At]: "Required" };
      r.required = Object.keys(r.properties);
      for (let n of Object.keys(r.properties)) {
        let s = r.properties[n];
        switch (s[ue]) {
          case "ReadonlyOptional":
            s[ue] = "Readonly";
            break;
          case "Readonly":
            s[ue] = "Readonly";
            break;
          case "Optional":
            delete s[ue];
            break;
          default:
            delete s[ue];
            break;
        }
      }
      return this.Create(r);
    }
    ReturnType(e, t = {}) {
      return { ...t, ...this.Clone(e.returns) };
    }
    Strict(e) {
      return JSON.parse(JSON.stringify(e));
    }
    String(e = {}) {
      return this.Create({ ...e, [B]: "String", type: "string" });
    }
    Tuple(e, t = {}) {
      let n = e.length,
        s = e.length,
        i = e.length > 0
          ? {
            ...t,
            [B]: "Tuple",
            type: "array",
            items: e,
            additionalItems: !1,
            minItems: n,
            maxItems: s,
          }
          : { ...t, [B]: "Tuple", type: "array", minItems: n, maxItems: s };
      return this.Create(i);
    }
    Undefined(e = {}) {
      return this.Create({
        ...e,
        [B]: "Undefined",
        type: "null",
        typeOf: "Undefined",
      });
    }
    Union(e, t = {}) {
      return e.length === 0
        ? we.Never({ ...t })
        : this.Create({ ...t, [B]: "Union", anyOf: e });
    }
    Uint8Array(e = {}) {
      return this.Create({
        ...e,
        [B]: "Uint8Array",
        type: "object",
        instanceOf: "Uint8Array",
      });
    }
    Unknown(e = {}) {
      return this.Create({ ...e, [B]: "Unknown" });
    }
    Unsafe(e = {}) {
      return this.Create({ ...e, [B]: e[B] || "Unsafe" });
    }
    Void(e = {}) {
      return this.Create({ ...e, [B]: "Void", type: "null", typeOf: "Void" });
    }
    Create(e) {
      return e;
    }
    Clone(e) {
      let t = (n) => typeof n == "object" && n !== null && !Array.isArray(n),
        r = (n) => typeof n == "object" && n !== null && Array.isArray(n);
      return t(e)
        ? Object.keys(e).reduce(
          (n, s) => ({ ...n, [s]: this.Clone(e[s]) }),
          Object.getOwnPropertySymbols(e).reduce(
            (n, s) => ({ ...n, [s]: this.Clone(e[s]) }),
            {},
          ),
        )
        : r(e)
        ? e.map((n) => this.Clone(n))
        : e;
    }
  },
  we = new an();
var he = class {
    constructor(e, t) {
      Object.defineProperty(this, "index", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
        Object.defineProperty(this, "fields", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        this.index = e,
        this.fields = t;
    }
  },
  Ft = {
    Integer: function (o) {
      let e = we.Unsafe({ dataType: "integer" });
      return o && Object.entries(o).forEach(([t, r]) => {
        e[t] = r;
      }),
        e;
    },
    Bytes: function (o) {
      let e = we.Unsafe({ dataType: "bytes" });
      return o && Object.entries(o).forEach(([t, r]) => {
        e[t] = r;
      }),
        e;
    },
    Boolean: function () {
      return we.Unsafe({
        anyOf: [{
          title: "False",
          dataType: "constructor",
          index: 0,
          fields: [],
        }, { title: "True", dataType: "constructor", index: 1, fields: [] }],
      });
    },
    Any: function () {
      return we.Unsafe({ description: "Any Data." });
    },
    Array: function (o, e) {
      let t = we.Array(o);
      return tr(t, { dataType: "list", items: o }),
        e && Object.entries(e).forEach(([r, n]) => {
          t[r] = n;
        }),
        t;
    },
    Map: function (o, e, t) {
      let r = we.Unsafe({ dataType: "map", keys: o, values: e });
      return t && Object.entries(t).forEach(([n, s]) => {
        r[n] = s;
      }),
        r;
    },
    Object: function (o, e) {
      let t = we.Object(o);
      return tr(t, {
        anyOf: [{
          dataType: "constructor",
          index: 0,
          fields: Object.entries(o).map(([r, n]) => ({ ...n, title: r })),
        }],
      }),
        t.anyOf[0].hasConstr = typeof e?.hasConstr > "u" || e.hasConstr,
        t;
    },
    Enum: function (o) {
      let e = we.Union(o);
      return tr(e, {
        anyOf: o.map((t, r) =>
          t.anyOf[0].fields.length === 0 ? { ...t.anyOf[0], index: r } : {
            dataType: "constructor",
            title: (() => {
              let n = t.anyOf[0].fields[0].title;
              if (n.charAt(0) !== n.charAt(0).toUpperCase()) {
                throw new Error(
                  `Enum '${n}' needs to start with an uppercase letter.`,
                );
              }
              return t.anyOf[0].fields[0].title;
            })(),
            index: r,
            fields: t.anyOf[0].fields[0].items,
          }
        ),
      }),
        e;
    },
    Tuple: function (o, e) {
      let t = we.Tuple(o);
      return tr(t, { dataType: "list", items: o }),
        e && Object.entries(e).forEach(([r, n]) => {
          t[r] = n;
        }),
        t;
    },
    Literal: function (o) {
      if (o.charAt(0) !== o.charAt(0).toUpperCase()) {
        throw new Error(
          `Enum '${o}' needs to start with an uppercase letter.`,
        );
      }
      let e = we.Literal(o);
      return tr(e, {
        anyOf: [{ dataType: "constructor", title: o, index: 0, fields: [] }],
      }),
        e;
    },
    Nullable: function (o) {
      return we.Unsafe({
        anyOf: [{
          title: "Some",
          description: "An optional value.",
          dataType: "constructor",
          index: 0,
          fields: [o],
        }, {
          title: "None",
          description: "Nothing.",
          dataType: "constructor",
          index: 1,
          fields: [],
        }],
      });
    },
    to: Xs,
    from: Qs,
    fromJson: eo,
    toJson: to,
    void: function () {
      return "d87980";
    },
    castFrom: Ae,
    castTo: Ze,
  };
function Xs(o, e) {
  function t(n) {
    try {
      if (typeof n == "bigint") {
        return u.PlutusData.new_integer(u.BigInt.from_str(n.toString()));
      }
      if (typeof n == "string") return u.PlutusData.new_bytes(w(n));
      if (n instanceof he) {
        let { index: s, fields: i } = n, a = u.PlutusList.new();
        return i.forEach((c) => a.add(t(c))),
          u.PlutusData.new_constr_plutus_data(
            u.ConstrPlutusData.new(u.BigNum.from_str(s.toString()), a),
          );
      } else if (n instanceof Array) {
        let s = u.PlutusList.new();
        return n.forEach((i) => s.add(t(i))), u.PlutusData.new_list(s);
      } else if (n instanceof Map) {
        let s = u.PlutusMap.new();
        for (let [i, a] of n.entries()) s.insert(t(i), t(a));
        return u.PlutusData.new_map(s);
      }
      throw new Error("Unsupported type");
    } catch (s) {
      throw new Error("Could not serialize the data: " + s);
    }
  }
  let r = e ? Ze(o, e) : o;
  return k(t(r).to_bytes());
}
function Qs(o, e) {
  function t(n) {
    if (n.kind() === 0) {
      let s = n.as_constr_plutus_data(), i = s.data(), a = [];
      for (let c = 0; c < i.len(); c++) a.push(t(i.get(c)));
      return new he(parseInt(s.alternative().to_str()), a);
    } else if (n.kind() === 1) {
      let s = n.as_map(), i = new Map(), a = s.keys();
      for (let c = 0; c < a.len(); c++) i.set(t(a.get(c)), t(s.get(a.get(c))));
      return i;
    } else if (n.kind() === 2) {
      let s = n.as_list(), i = [];
      for (let a = 0; a < s.len(); a++) i.push(t(s.get(a)));
      return i;
    } else {
      if (n.kind() === 3) return BigInt(n.as_integer().to_str());
      if (n.kind() === 4) return k(n.as_bytes());
    }
    throw new Error("Unsupported type");
  }
  let r = t(u.PlutusData.from_bytes(w(o)));
  return e ? Ae(r, e) : r;
}
function eo(o) {
  function e(t) {
    if (typeof t == "string") {
      return t.startsWith("0x") ? k(w(t.slice(2))) : un(t);
    }
    if (typeof t == "number") return BigInt(t);
    if (typeof t == "bigint") return t;
    if (t instanceof Array) return t.map((r) => e(r));
    if (t instanceof Object) {
      let r = new Map();
      return Object.entries(t).forEach(([n, s]) => {
        r.set(e(n), e(s));
      }),
        r;
    }
    throw new Error("Unsupported type");
  }
  return e(o);
}
function to(o) {
  function e(t) {
    if (
      typeof t == "bigint" || typeof t == "number" ||
      typeof t == "string" && !isNaN(parseInt(t)) && t.slice(-1) === "n"
    ) {
      let r = typeof t == "string" ? BigInt(t.slice(0, -1)) : t;
      return parseInt(r.toString());
    }
    if (typeof t == "string") {
      try {
        return new TextDecoder(void 0, { fatal: !0 }).decode(w(t));
      } catch {
        return "0x" + k(w(t));
      }
    }
    if (t instanceof Array) return t.map((r) => e(r));
    if (t instanceof Map) {
      let r = {};
      return t.forEach((n, s) => {
        let i = e(s);
        if (typeof i != "string" && typeof i != "number") {
          throw new Error(
            "Unsupported type (Note: Only bytes or integers can be keys of a JSON object)",
          );
        }
        r[i] = e(n);
      }),
        r;
    }
    throw new Error(
      "Unsupported type (Note: Constructor cannot be converted to JSON)",
    );
  }
  return e(o);
}
function Ae(o, e) {
  if (!e) throw new Error("Could not type cast data.");
  switch ((e.anyOf ? "enum" : "") || e.dataType) {
    case "integer": {
      if (typeof o != "bigint") {
        throw new Error("Could not type cast to integer.");
      }
      return Yn(o, e), o;
    }
    case "bytes": {
      if (typeof o != "string") {
        throw new Error("Could not type cast to bytes.");
      }
      return Xn(o, e), o;
    }
    case "constructor": {
      if (
        o instanceof he && o.index === e.index &&
        (e.hasConstr || e.hasConstr === void 0)
      ) {
        let r = {};
        if (e.fields.length !== o.fields.length) {
          throw new Error("Could not ype cast to object. Fields do not match.");
        }
        return e.fields.forEach((n, s) => {
          if (/[A-Z]/.test(n.title[0])) {
            throw new Error(
              "Could not type cast to object. Object properties need to start with a lowercase letter.",
            );
          }
          r[n.title] = Ae(o.fields[s], n);
        }),
          r;
      } else if (o instanceof Array && !e.hasConstr && e.hasConstr !== void 0) {
        let r = {};
        if (e.fields.length !== o.length) {
          throw new Error("Could not ype cast to object. Fields do not match.");
        }
        return e.fields.forEach((n, s) => {
          if (/[A-Z]/.test(n.title[0])) {
            throw new Error(
              "Could not type cast to object. Object properties need to start with a lowercase letter.",
            );
          }
          r[n.title] = Ae(o[s], n);
        }),
          r;
      }
      throw new Error("Could not type cast to object.");
    }
    case "enum": {
      if (e.anyOf.length === 1) return Ae(o, e.anyOf[0]);
      if (!(o instanceof he)) throw new Error("Could not type cast to enum.");
      let r = e.anyOf.find((n) => n.index === o.index);
      if (!r || r.fields.length !== o.fields.length) {
        throw new Error("Could not type cast to enum.");
      }
      if (ts(e)) {
        if (o.fields.length !== 0) {
          throw new Error("Could not type cast to boolean.");
        }
        switch (o.index) {
          case 0:
            return !1;
          case 1:
            return !0;
        }
        throw new Error("Could not type cast to boolean.");
      } else if (rs(e)) {
        switch (o.index) {
          case 0: {
            if (o.fields.length !== 1) {
              throw new Error("Could not type cast to nullable object.");
            }
            return Ae(o.fields[0], e.anyOf[0].fields[0]);
          }
          case 1: {
            if (o.fields.length !== 0) {
              throw new Error("Could not type cast to nullable object.");
            }
            return null;
          }
        }
        throw new Error("Could not type cast to nullable object.");
      }
      switch (r.dataType) {
        case "constructor":
          if (r.fields.length === 0) {
            if (/[A-Z]/.test(r.title[0])) return r.title;
            throw new Error("Could not type cast to enum.");
          } else {
            if (!/[A-Z]/.test(r.title)) {
              throw new Error(
                "Could not type cast to enum. Enums need to start with an uppercase letter.",
              );
            }
            if (r.fields.length !== o.fields.length) {
              throw new Error("Could not type cast to enum.");
            }
            return { [r.title]: r.fields.map((n, s) => Ae(o.fields[s], n)) };
          }
      }
      throw new Error("Could not type cast to enum.");
    }
    case "list":
      if (e.items instanceof Array) {
        if (o instanceof he && o.index === 0 && e.hasConstr) {
          return o.fields.map((r, n) => Ae(r, e.items[n]));
        }
        if (o instanceof Array && !e.hasConstr) {
          return o.map((r, n) => Ae(r, e.items[n]));
        }
        throw new Error("Could not type cast to tuple.");
      } else {
        if (!(o instanceof Array)) {
          throw new Error("Could not type cast to array.");
        }
        return Qn(o, e), o.map((r) => Ae(r, e.items));
      }
    case "map": {
      if (!(o instanceof Map)) throw new Error("Could not type cast to map.");
      es(o, e);
      let r = new Map();
      for (let [n, s] of o.entries()) r.set(Ae(n, e.keys), Ae(s, e.values));
      return r;
    }
    case void 0:
      return o;
  }
  throw new Error("Could not type cast data.");
}
function Ze(o, e) {
  if (!e) throw new Error("Could not type cast struct.");
  switch ((e.anyOf ? "enum" : "") || e.dataType) {
    case "integer": {
      if (typeof o != "bigint") {
        throw new Error("Could not type cast to integer.");
      }
      return Yn(o, e), o;
    }
    case "bytes": {
      if (typeof o != "string") {
        throw new Error("Could not type cast to bytes.");
      }
      return Xn(o, e), o;
    }
    case "constructor": {
      if (typeof o != "object" || o === null) {
        throw new Error("Could not type cast to constructor.");
      }
      let r = e.fields.map((n) => Ze(o[n.title], n));
      return e.hasConstr || e.hasConstr === void 0 ? new he(e.index, r) : r;
    }
    case "enum": {
      if (e.anyOf.length === 1) return Ze(o, e.anyOf[0]);
      if (ts(e)) {
        if (typeof o != "boolean") {
          throw new Error("Could not type cast to boolean.");
        }
        return new he(o ? 1 : 0, []);
      } else if (rs(e)) {
        if (o === null) return new he(1, []);
        {
          let r = e.anyOf[0].fields;
          if (r.length !== 1) {
            throw new Error("Could not type cast to nullable object.");
          }
          return new he(0, [Ze(o, r[0])]);
        }
      }
      switch (typeof o) {
        case "string": {
          if (!/[A-Z]/.test(o[0])) {
            throw new Error(
              "Could not type cast to enum. Enum needs to start with an uppercase letter.",
            );
          }
          let r = e.anyOf.findIndex((n) =>
            n.dataType === "constructor" && n.fields.length === 0 &&
            n.title === o
          );
          if (r === -1) throw new Error("Could not type cast to enum.");
          return new he(r, []);
        }
        case "object": {
          if (o === null) throw new Error("Could not type cast to enum.");
          let r = Object.keys(o)[0];
          if (!/[A-Z]/.test(r)) {
            throw new Error(
              "Could not type cast to enum. Enum needs to start with an uppercase letter.",
            );
          }
          let n = e.anyOf.find((s) =>
            s.dataType === "constructor" && s.title === r
          );
          if (!n) throw new Error("Could not type cast to enum.");
          return new he(n.index, o[r].map((s, i) => Ze(s, n.fields[i])));
        }
      }
      throw new Error("Could not type cast to enum.");
    }
    case "list": {
      if (!(o instanceof Array)) {
        throw new Error("Could not type cast to array/tuple.");
      }
      if (e.items instanceof Array) {
        let r = o.map((n, s) => Ze(n, e.items[s]));
        return e.hasConstr ? new he(0, r) : r;
      } else return Qn(o, e), o.map((r) => Ze(r, e.items));
    }
    case "map": {
      if (!(o instanceof Map)) throw new Error("Could not type cast to map.");
      es(o, e);
      let r = new Map();
      for (let [n, s] of o.entries()) r.set(Ze(n, e.keys), Ze(s, e.values));
      return r;
    }
    case void 0:
      return o;
  }
  throw new Error("Could not type cast struct.");
}
function Yn(o, e) {
  if (e.minimum && o < BigInt(e.minimum)) {
    throw new Error(`Integer ${o} is below the minimum ${e.minimum}.`);
  }
  if (e.maximum && o > BigInt(e.maximum)) {
    throw new Error(`Integer ${o} is above the maxiumum ${e.maximum}.`);
  }
  if (e.exclusiveMinimum && o <= BigInt(e.exclusiveMinimum)) {
    throw new Error(
      `Integer ${o} is below the exclusive minimum ${e.exclusiveMinimum}.`,
    );
  }
  if (e.exclusiveMaximum && o >= BigInt(e.exclusiveMaximum)) {
    throw new Error(
      `Integer ${o} is above the exclusive maximum ${e.exclusiveMaximum}.`,
    );
  }
}
function Xn(o, e) {
  if (e.enum && !e.enum.some((t) => t === o)) {
    throw new Error(`None of the keywords match with '${o}'.`);
  }
  if (e.minLength && o.length / 2 < e.minLength) {
    throw new Error(
      `Bytes need to have a length of at least ${e.minLength} bytes.`,
    );
  }
  if (e.maxLength && o.length / 2 > e.maxLength) {
    throw new Error(`Bytes can have a length of at most ${e.minLength} bytes.`);
  }
}
function Qn(o, e) {
  if (e.minItems && o.length < e.minItems) {
    throw new Error(`Array needs to contain at least ${e.minItems} items.`);
  }
  if (e.maxItems && o.length > e.maxItems) {
    throw new Error(`Array can contain at most ${e.maxItems} items.`);
  }
  if (e.uniqueItems && new Set(o).size !== o.length) {
    throw new Error("Array constains duplicates.");
  }
}
function es(o, e) {
  if (e.minItems && o.size < e.minItems) {
    throw new Error(`Map needs to contain at least ${e.minItems} items.`);
  }
  if (e.maxItems && o.size > e.maxItems) {
    throw new Error(`Map can contain at most ${e.maxItems} items.`);
  }
}
function ts(o) {
  return o.anyOf && o.anyOf[0]?.title === "False" &&
    o.anyOf[1]?.title === "True";
}
function rs(o) {
  return o.anyOf && o.anyOf[0]?.title === "Some" &&
    o.anyOf[1]?.title === "None";
}
function tr(o, e) {
  Object.keys(o).forEach((t) => {
    delete o[t];
  }), Object.assign(o, e);
}
var rr = class {
  constructor(e) {
    Object.defineProperty(this, "lucid", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }), this.lucid = e;
  }
  validatorToAddress(e, t) {
    let r = this.validatorToScriptHash(e);
    return t
      ? u.BaseAddress.new(
        rt(this.lucid.network),
        u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(r)),
        t.type === "Key"
          ? u.StakeCredential.from_keyhash(u.Ed25519KeyHash.from_hex(t.hash))
          : u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(t.hash)),
      ).to_address().to_bech32(void 0)
      : u.EnterpriseAddress.new(
        rt(this.lucid.network),
        u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(r)),
      ).to_address().to_bech32(void 0);
  }
  credentialToAddress(e, t) {
    return t
      ? u.BaseAddress.new(
        rt(this.lucid.network),
        e.type === "Key"
          ? u.StakeCredential.from_keyhash(u.Ed25519KeyHash.from_hex(e.hash))
          : u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(e.hash)),
        t.type === "Key"
          ? u.StakeCredential.from_keyhash(u.Ed25519KeyHash.from_hex(t.hash))
          : u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(t.hash)),
      ).to_address().to_bech32(void 0)
      : u.EnterpriseAddress.new(
        rt(this.lucid.network),
        e.type === "Key"
          ? u.StakeCredential.from_keyhash(u.Ed25519KeyHash.from_hex(e.hash))
          : u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(e.hash)),
      ).to_address().to_bech32(void 0);
  }
  validatorToRewardAddress(e) {
    let t = this.validatorToScriptHash(e);
    return u.RewardAddress.new(
      rt(this.lucid.network),
      u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(t)),
    ).to_address().to_bech32(void 0);
  }
  credentialToRewardAddress(e) {
    return u.RewardAddress.new(
      rt(this.lucid.network),
      e.type === "Key"
        ? u.StakeCredential.from_keyhash(u.Ed25519KeyHash.from_hex(e.hash))
        : u.StakeCredential.from_scripthash(u.ScriptHash.from_hex(e.hash)),
    ).to_address().to_bech32(void 0);
  }
  validatorToScriptHash(e) {
    switch (e.type) {
      case "Native":
        return u.NativeScript.from_bytes(w(e.script)).hash(
          u.ScriptHashNamespace.NativeScript,
        ).to_hex();
      case "PlutusV1":
        return u.PlutusScript.from_bytes(w(De(e.script))).hash(
          u.ScriptHashNamespace.PlutusV1,
        ).to_hex();
      case "PlutusV2":
        return u.PlutusScript.from_bytes(w(De(e.script))).hash(
          u.ScriptHashNamespace.PlutusV2,
        ).to_hex();
      default:
        throw new Error("No variant matched");
    }
  }
  mintingPolicyToId(e) {
    return this.validatorToScriptHash(e);
  }
  datumToHash(e) {
    return u.hash_plutus_data(u.PlutusData.from_bytes(w(e))).to_hex();
  }
  scriptHashToCredential(e) {
    return { type: "Script", hash: e };
  }
  keyHashToCredential(e) {
    return { type: "Key", hash: e };
  }
  generatePrivateKey() {
    return ss();
  }
  generateSeedPhrase() {
    return os();
  }
  unixTimeToSlot(e) {
    return on(e, Tt[this.lucid.network]);
  }
  slotToUnixTime(e) {
    return sn(e, Tt[this.lucid.network]);
  }
  getAddressDetails(e) {
    return me(e);
  }
  nativeScriptFromJson(e) {
    return ds(e);
  }
  paymentCredentialOf(e) {
    return nt(e);
  }
  stakeCredentialOf(e) {
    return ns(e);
  }
};
function Er(o) {
  try {
    return u.Address.from_bytes(w(o));
  } catch {
    try {
      return u.Address.from_bech32(o);
    } catch {
      throw new Error("Could not deserialize address.");
    }
  }
}
function me(o) {
  try {
    let e = u.BaseAddress.from_address(Er(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: k(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: k(e.payment_cred().to_scripthash().to_bytes()),
        },
      r = e.stake_cred().kind() === 0
        ? { type: "Key", hash: k(e.stake_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: k(e.stake_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Base",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: k(e.to_address().to_bytes()),
      },
      paymentCredential: t,
      stakeCredential: r,
    };
  } catch {}
  try {
    let e = u.EnterpriseAddress.from_address(Er(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: k(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: k(e.payment_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Enterprise",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: k(e.to_address().to_bytes()),
      },
      paymentCredential: t,
    };
  } catch {}
  try {
    let e = u.PointerAddress.from_address(Er(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: k(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: k(e.payment_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Pointer",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: k(e.to_address().to_bytes()),
      },
      paymentCredential: t,
    };
  } catch {}
  try {
    let e = u.RewardAddress.from_address(Er(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: k(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: k(e.payment_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Reward",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: k(e.to_address().to_bytes()),
      },
      stakeCredential: t,
    };
  } catch {}
  throw new Error("No address type matched for: " + o);
}
function nt(o) {
  let { paymentCredential: e } = me(o);
  if (!e) {
    throw new Error(
      "The specified address does not contain a payment credential.",
    );
  }
  return e;
}
function ns(o) {
  let { stakeCredential: e } = me(o);
  if (!e) {
    throw new Error(
      "The specified address does not contain a stake credential.",
    );
  }
  return e;
}
function ss() {
  return u.PrivateKey.generate_ed25519().to_bech32();
}
function os() {
  return qn(256);
}
function is(o) {
  let e = {};
  e.lovelace = BigInt(o.coin().to_str());
  let t = o.multiasset();
  if (t) {
    let r = t.keys();
    for (let n = 0; n < r.len(); n++) {
      let s = r.get(n), i = t.get(s), a = i.keys();
      for (let c = 0; c < a.len(); c++) {
        let d = a.get(c), f = i.get(d), p = k(s.to_bytes()) + k(d.name());
        e[p] = BigInt(f.to_str());
      }
    }
  }
  return e;
}
function nr(o) {
  let e = u.MultiAsset.new(), t = o.lovelace, r = Object.keys(o);
  Array.from(
    new Set(r.filter((i) => i !== "lovelace").map((i) => i.slice(0, 56))),
  ).forEach((i) => {
    let a = r.filter((d) => d.slice(0, 56) === i), c = u.Assets.new();
    a.forEach((d) => {
      c.insert(
        u.AssetName.new(w(d.slice(56))),
        u.BigNum.from_str(o[d].toString()),
      );
    }), e.insert(u.ScriptHash.from_bytes(w(i)), c);
  });
  let s = u.Value.new(u.BigNum.from_str(t ? t.toString() : "0"));
  return (r.length > 1 || !t) && s.set_multiasset(e), s;
}
function as(o) {
  switch (o.get().kind()) {
    case 0:
      return { type: "Native", script: k(o.get().as_native().to_bytes()) };
    case 1:
      return { type: "PlutusV1", script: k(o.get().as_plutus_v1().to_bytes()) };
    case 2:
      return { type: "PlutusV2", script: k(o.get().as_plutus_v2().to_bytes()) };
    default:
      throw new Error("No variant matched.");
  }
}
function Ir(o) {
  switch (o.type) {
    case "Native":
      return u.ScriptRef.new(
        u.Script.new_native(u.NativeScript.from_bytes(w(o.script))),
      );
    case "PlutusV1":
      return u.ScriptRef.new(
        u.Script.new_plutus_v1(u.PlutusScript.from_bytes(w(De(o.script)))),
      );
    case "PlutusV2":
      return u.ScriptRef.new(
        u.Script.new_plutus_v2(u.PlutusScript.from_bytes(w(De(o.script)))),
      );
    default:
      throw new Error("No variant matched.");
  }
}
function pt(o) {
  let e = (() => {
      try {
        return u.Address.from_bech32(o.address);
      } catch {
        return u.ByronAddress.from_base58(o.address).to_address();
      }
    })(),
    t = u.TransactionOutput.new(e, nr(o.assets));
  return o.datumHash &&
    t.set_datum(u.Datum.new_data_hash(u.DataHash.from_bytes(w(o.datumHash)))),
    !o.datumHash && o.datum &&
    t.set_datum(
      u.Datum.new_data(u.Data.new(u.PlutusData.from_bytes(w(o.datum)))),
    ),
    o.scriptRef && t.set_script_ref(Ir(o.scriptRef)),
    u.TransactionUnspentOutput.new(
      u.TransactionInput.new(
        u.TransactionHash.from_bytes(w(o.txHash)),
        u.BigNum.from_str(o.outputIndex.toString()),
      ),
      t,
    );
}
function sr(o) {
  return {
    txHash: k(o.input().transaction_id().to_bytes()),
    outputIndex: parseInt(o.input().index().to_str()),
    assets: is(o.output().amount()),
    address: o.output().address().as_byron()
      ? o.output().address().as_byron()?.to_base58()
      : o.output().address().to_bech32(void 0),
    datumHash: o.output()?.datum()?.as_data_hash()?.to_hex(),
    datum: o.output()?.datum()?.as_data() &&
      k(o.output().datum().as_data().get().to_bytes()),
    scriptRef: o.output()?.script_ref() && as(o.output().script_ref()),
  };
}
function rt(o) {
  switch (o) {
    case "Preview":
      return 0;
    case "Preprod":
      return 0;
    case "Custom":
      return 0;
    case "Mainnet":
      return 1;
    default:
      throw new Error("Network not found");
  }
}
function w(o) {
  return Ln(o);
}
function k(o) {
  return Hn(o);
}
function ro(o) {
  return new TextDecoder().decode(rn(new TextEncoder().encode(o)));
}
function un(o) {
  return k(new TextEncoder().encode(o));
}
function no(o) {
  return u.PrivateKey.from_bech32(o).to_public().to_bech32();
}
function us(o) {
  return Zn(w(o)).toString(16).padStart(2, "0");
}
function cs(o) {
  if (o < 0 || o > 65535) {
    throw new Error(`Label ${o} out of range: min label 1 - max label 65535.`);
  }
  let e = o.toString(16).padStart(4, "0");
  return "0" + e + us(e) + "0";
}
function ls(o) {
  if (o.length !== 8 || !(o[0] === "0" && o[7] === "0")) return null;
  let e = o.slice(1, 5), t = parseInt(e, 16);
  return o.slice(5, 7) === us(e) ? t : null;
}
function so(o, e, t) {
  let r = Number.isInteger(t) ? cs(t) : "", n = e || "";
  if ((n + r).length > 64) throw new Error("Asset name size exceeds 32 bytes.");
  if (o.length !== 56) throw new Error(`Policy id invalid: ${o}.`);
  return o + r + n;
}
function Cr(o) {
  let e = o.slice(0, 56),
    t = o.slice(56) || null,
    r = ls(o.slice(56, 64)),
    n = (() => (Number.isInteger(r) ? o.slice(64) : o.slice(56)) || null)();
  return { policyId: e, assetName: t, name: n, label: r };
}
function ds(o) {
  return {
    type: "Native",
    script: k(
      u.encode_json_str_to_native_script(
        JSON.stringify(o),
        "",
        u.ScriptSchema.Node,
      ).to_bytes(),
    ),
  };
}
function oo(o, e, t) {
  let r = t ? Ft.castTo(e, t) : e;
  return k(
    u.apply_params_to_plutus_script(
      u.PlutusList.from_bytes(w(Ft.to(r))),
      u.PlutusScript.from_bytes(w(De(o))),
    ).to_bytes(),
  );
}
function De(o) {
  try {
    return u.PlutusScript.from_bytes(u.PlutusScript.from_bytes(w(o)).bytes()),
      o;
  } catch {
    return k(u.PlutusScript.new(w(o)).to_bytes());
  }
}
function io(o, e) {
  if (o.length !== e.length) return !1;
  for (let t = 0; t < e.length; t++) if (o[t] !== e[t]) return !1;
  return !0;
}
function ao(o, e) {
  if (o.length !== e.length) return !1;
  let t = o.length,
    r = Math.floor(t / 4),
    n = new Uint32Array(o.buffer, 0, r),
    s = new Uint32Array(e.buffer, 0, r);
  for (let i = r * 4; i < t; i++) if (o[i] !== e[i]) return !1;
  for (let i = 0; i < n.length; i++) if (n[i] !== s[i]) return !1;
  return !0;
}
function or(o, e) {
  return o.length < 1e3 ? io(o, e) : ao(o, e);
}
function cn(...o) {
  let e = 0;
  for (let n of o) e += n.length;
  let t = new Uint8Array(e), r = 0;
  for (let n of o) t.set(n, r), r += n.length;
  return t;
}
var ar = class {
  constructor(e) {
    Object.defineProperty(this, "root", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }), this.root = ar.buildRecursively(e.map((t) => ir(t)));
  }
  static fromHashes(e) {
    return new this(e);
  }
  static buildRecursively(e) {
    if (e.length <= 0) return null;
    if (e.length === 1) return { node: e[0], left: null, right: null };
    let t = Math.floor(e.length / 2),
      [r, n] = [e.slice(0, t), e.slice(t)],
      s = this.buildRecursively(r),
      i = this.buildRecursively(n);
    return s === null || i === null
      ? null
      : { node: Nr(s.node, i.node), left: s, right: i };
  }
  rootHash() {
    if (this.root === null) throw new Error("Merkle tree root hash not found.");
    return this.root.node;
  }
  getProof(e) {
    let t = ir(e),
      r = [],
      n = (s) => {
        if (s && or(s.node, t)) return !0;
        if (s?.right && n(s.left)) return r.push({ right: s.right.node }), !0;
        if (s?.left && n(s.right)) return r.push({ left: s.left.node }), !0;
      };
    return n(this.root), r;
  }
  size() {
    let e = (t) => t === null ? 0 : 1 + e(t.left) + e(t.right);
    return e(this.root);
  }
  static verify(e, t, r) {
    let n = ir(e),
      s = (i, a) => {
        if (a.length <= 0) return or(t, i);
        let [c, d] = [a[0], a.slice(1)];
        return c.left
          ? s(Nr(c.left, i), d)
          : c.right
          ? s(Nr(i, c.right), d)
          : !1;
      };
    return s(n, r);
  }
  toString() {
    let e = (t) =>
      t === null
        ? null
        : { node: k(t.node), left: e(t.left), right: e(t.right) };
    return JSON.stringify(e(this.root), null, 2);
  }
};
function ir(o) {
  return new Uint8Array(new Lt().update(o).arrayBuffer());
}
function Nr(o, e) {
  return ir(cn(o, e));
}
var ur = class {
  constructor(e, t) {
    Object.defineProperty(this, "txSigned", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "lucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      this.lucid = e,
      this.txSigned = t;
  }
  async submit() {
    return await (this.lucid.wallet || this.lucid.provider).submitTx(
      k(this.txSigned.to_bytes()),
    );
  }
  toString() {
    return k(this.txSigned.to_bytes());
  }
  toHash() {
    return u.hash_transaction(this.txSigned.body()).to_hex();
  }
};
var Et = class {
  constructor(e, t) {
    Object.defineProperty(this, "txComplete", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "witnessSetBuilder", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "tasks", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "lucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      this.lucid = e,
      this.txComplete = t,
      this.witnessSetBuilder = u.TransactionWitnessSetBuilder.new(),
      this.tasks = [];
  }
  sign() {
    return this.tasks.push(async () => {
      let e = await this.lucid.wallet.signTx(this.txComplete);
      this.witnessSetBuilder.add_existing(e);
    }),
      this;
  }
  signWithPrivateKey(e) {
    let t = u.PrivateKey.from_bech32(e),
      r = u.make_vkey_witness(u.hash_transaction(this.txComplete.body()), t);
    return this.witnessSetBuilder.add_vkey(r), this;
  }
  async partialSign() {
    let e = await this.lucid.wallet.signTx(this.txComplete);
    return this.witnessSetBuilder.add_existing(e), k(e.to_bytes());
  }
  partialSignWithPrivateKey(e) {
    let t = u.PrivateKey.from_bech32(e),
      r = u.make_vkey_witness(u.hash_transaction(this.txComplete.body()), t);
    this.witnessSetBuilder.add_vkey(r);
    let n = u.TransactionWitnessSetBuilder.new();
    return n.add_vkey(r), k(n.build().to_bytes());
  }
  assemble(e) {
    return e.forEach((t) => {
      let r = u.TransactionWitnessSet.from_bytes(w(t));
      this.witnessSetBuilder.add_existing(r);
    }),
      this;
  }
  async complete() {
    for (let t of this.tasks) await t();
    this.witnessSetBuilder.add_existing(this.txComplete.witness_set());
    let e = u.Transaction.new(
      this.txComplete.body(),
      this.witnessSetBuilder.build(),
      this.txComplete.auxiliary_data(),
    );
    return new ur(this.lucid, e);
  }
  toString() {
    return k(this.txComplete.to_bytes());
  }
  toHash() {
    return u.hash_transaction(this.txComplete.body()).to_hex();
  }
};
var lr = class {
  constructor(e) {
    Object.defineProperty(this, "txBuilder", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "tasks", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "lucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      this.lucid = e,
      this.txBuilder = u.TransactionBuilder.new(this.lucid.txBuilderConfig),
      this.tasks = [];
  }
  readFrom(e) {
    return this.tasks.push(async (t) => {
      for (let r of e) {
        if (r.datumHash) {
          r.datum = await t.lucid.datumOf(r);
          let s = u.PlutusData.from_bytes(w(r.datum));
          t.txBuilder.add_plutus_data(s);
        }
        let n = pt(r);
        t.txBuilder.add_reference_input(n);
      }
    }),
      this;
  }
  collectFrom(e, t) {
    return this.tasks.push(async (r) => {
      for (let n of e) {
        n.datumHash && !n.datum && (n.datum = await r.lucid.datumOf(n));
        let s = pt(n);
        r.txBuilder.add_input(
          s,
          t &&
            u.ScriptWitness.new_plutus_witness(
              u.PlutusWitness.new(
                u.PlutusData.from_bytes(w(t)),
                n.datumHash && n.datum
                  ? u.PlutusData.from_bytes(w(n.datum))
                  : void 0,
                void 0,
              ),
            ),
        );
      }
    }),
      this;
  }
  mintAssets(e, t) {
    return this.tasks.push((r) => {
      let n = Object.keys(e), s = n[0].slice(0, 56), i = u.MintAssets.new();
      n.forEach((c) => {
        if (c.slice(0, 56) !== s) {
          throw new Error(
            "Only one policy id allowed. You can chain multiple mintAssets functions together if you need to mint assets with different policy ids.",
          );
        }
        i.insert(
          u.AssetName.new(w(c.slice(56))),
          u.Int.from_str(e[c].toString()),
        );
      });
      let a = u.ScriptHash.from_bytes(w(s));
      r.txBuilder.add_mint(
        a,
        i,
        t
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(w(t)), void 0, void 0),
          )
          : void 0,
      );
    }),
      this;
  }
  payToAddress(e, t) {
    return this.tasks.push((r) => {
      let n = u.TransactionOutput.new(cr(e, r.lucid), nr(t));
      r.txBuilder.add_output(n);
    }),
      this;
  }
  payToAddressWithData(e, t, r) {
    return this.tasks.push((n) => {
      if (
        typeof t == "string" && (t = { asHash: t }),
          [t.hash, t.asHash, t.inline].filter((a) => a).length > 1
      ) {
        throw new Error(
          "Not allowed to set hash, asHash and inline at the same time.",
        );
      }
      let s = u.TransactionOutput.new(cr(e, n.lucid), nr(r));
      if (t.hash) {
        s.set_datum(u.Datum.new_data_hash(u.DataHash.from_hex(t.hash)));
      } else if (t.asHash) {
        let a = u.PlutusData.from_bytes(w(t.asHash));
        s.set_datum(u.Datum.new_data_hash(u.hash_plutus_data(a))),
          n.txBuilder.add_plutus_data(a);
      } else if (t.inline) {
        let a = u.PlutusData.from_bytes(w(t.inline));
        s.set_datum(u.Datum.new_data(u.Data.new(a)));
      }
      let i = t.scriptRef;
      i && s.set_script_ref(Ir(i)), n.txBuilder.add_output(s);
    }),
      this;
  }
  payToContract(e, t, r) {
    if (
      typeof t == "string" && (t = { asHash: t }),
        !(t.hash || t.asHash || t.inline)
    ) {
      throw new Error(
        "No datum set. Script output becomes unspendable without datum.",
      );
    }
    return this.payToAddressWithData(e, t, r);
  }
  delegateTo(e, t, r) {
    return this.tasks.push((n) => {
      let s = n.lucid.utils.getAddressDetails(e);
      if (s.type !== "Reward" || !s.stakeCredential) {
        throw new Error("Not a reward address provided.");
      }
      let i = s.stakeCredential.type === "Key"
        ? u.StakeCredential.from_keyhash(
          u.Ed25519KeyHash.from_bytes(w(s.stakeCredential.hash)),
        )
        : u.StakeCredential.from_scripthash(
          u.ScriptHash.from_bytes(w(s.stakeCredential.hash)),
        );
      n.txBuilder.add_certificate(
        u.Certificate.new_stake_delegation(
          u.StakeDelegation.new(i, u.Ed25519KeyHash.from_bech32(t)),
        ),
        r
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(w(r)), void 0, void 0),
          )
          : void 0,
      );
    }),
      this;
  }
  registerStake(e) {
    return this.tasks.push((t) => {
      let r = t.lucid.utils.getAddressDetails(e);
      if (r.type !== "Reward" || !r.stakeCredential) {
        throw new Error("Not a reward address provided.");
      }
      let n = r.stakeCredential.type === "Key"
        ? u.StakeCredential.from_keyhash(
          u.Ed25519KeyHash.from_bytes(w(r.stakeCredential.hash)),
        )
        : u.StakeCredential.from_scripthash(
          u.ScriptHash.from_bytes(w(r.stakeCredential.hash)),
        );
      t.txBuilder.add_certificate(
        u.Certificate.new_stake_registration(u.StakeRegistration.new(n)),
        void 0,
      );
    }),
      this;
  }
  deregisterStake(e, t) {
    return this.tasks.push((r) => {
      let n = r.lucid.utils.getAddressDetails(e);
      if (n.type !== "Reward" || !n.stakeCredential) {
        throw new Error("Not a reward address provided.");
      }
      let s = n.stakeCredential.type === "Key"
        ? u.StakeCredential.from_keyhash(
          u.Ed25519KeyHash.from_bytes(w(n.stakeCredential.hash)),
        )
        : u.StakeCredential.from_scripthash(
          u.ScriptHash.from_bytes(w(n.stakeCredential.hash)),
        );
      r.txBuilder.add_certificate(
        u.Certificate.new_stake_deregistration(u.StakeDeregistration.new(s)),
        t
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(w(t)), void 0, void 0),
          )
          : void 0,
      );
    }),
      this;
  }
  registerPool(e) {
    return this.tasks.push(async (t) => {
      let r = await fs(e, t.lucid), n = u.Certificate.new_pool_registration(r);
      t.txBuilder.add_certificate(n, void 0);
    }),
      this;
  }
  updatePool(e) {
    return this.tasks.push(async (t) => {
      let r = await fs(e, t.lucid);
      r.set_is_update(!0);
      let n = u.Certificate.new_pool_registration(r);
      t.txBuilder.add_certificate(n, void 0);
    }),
      this;
  }
  retirePool(e, t) {
    return this.tasks.push((r) => {
      let n = u.Certificate.new_pool_retirement(
        u.PoolRetirement.new(u.Ed25519KeyHash.from_bech32(e), t),
      );
      r.txBuilder.add_certificate(n, void 0);
    }),
      this;
  }
  withdraw(e, t, r) {
    return this.tasks.push((n) => {
      n.txBuilder.add_withdrawal(
        u.RewardAddress.from_address(cr(e, n.lucid)),
        u.BigNum.from_str(t.toString()),
        r
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(w(r)), void 0, void 0),
          )
          : void 0,
      );
    }),
      this;
  }
  addSigner(e) {
    let t = this.lucid.utils.getAddressDetails(e);
    if (!t.paymentCredential && !t.stakeCredential) {
      throw new Error("Not a valid address.");
    }
    let r = t.type === "Reward" ? t.stakeCredential : t.paymentCredential;
    if (r.type === "Script") {
      throw new Error("Only key hashes are allowed as signers.");
    }
    return this.addSignerKey(r.hash);
  }
  addSignerKey(e) {
    return this.tasks.push((t) => {
      t.txBuilder.add_required_signer(u.Ed25519KeyHash.from_bytes(w(e)));
    }),
      this;
  }
  validFrom(e) {
    return this.tasks.push((t) => {
      let r = t.lucid.utils.unixTimeToSlot(e);
      t.txBuilder.set_validity_start_interval(u.BigNum.from_str(r.toString()));
    }),
      this;
  }
  validTo(e) {
    return this.tasks.push((t) => {
      let r = t.lucid.utils.unixTimeToSlot(e);
      t.txBuilder.set_ttl(u.BigNum.from_str(r.toString()));
    }),
      this;
  }
  attachMetadata(e, t) {
    return this.tasks.push((r) => {
      r.txBuilder.add_json_metadatum(
        u.BigNum.from_str(e.toString()),
        JSON.stringify(t),
      );
    }),
      this;
  }
  attachMetadataWithConversion(e, t) {
    return this.tasks.push((r) => {
      r.txBuilder.add_json_metadatum_with_schema(
        u.BigNum.from_str(e.toString()),
        JSON.stringify(t),
        u.MetadataJsonSchema.BasicConversions,
      );
    }),
      this;
  }
  addNetworkId(e) {
    return this.tasks.push((t) => {
      t.txBuilder.set_network_id(
        u.NetworkId.from_bytes(w(e.toString(16).padStart(2, "0"))),
      );
    }),
      this;
  }
  attachSpendingValidator(e) {
    return this.tasks.push((t) => {
      Br(t, e);
    }),
      this;
  }
  attachMintingPolicy(e) {
    return this.tasks.push((t) => {
      Br(t, e);
    }),
      this;
  }
  attachCertificateValidator(e) {
    return this.tasks.push((t) => {
      Br(t, e);
    }),
      this;
  }
  attachWithdrawalValidator(e) {
    return this.tasks.push((t) => {
      Br(t, e);
    }),
      this;
  }
  compose(e) {
    return e && (this.tasks = this.tasks.concat(e.tasks)), this;
  }
  async complete(e) {
    if (
      [
        e?.change?.outputData?.hash,
        e?.change?.outputData?.asHash,
        e?.change?.outputData?.inline,
      ].filter((s) => s).length > 1
    ) {
      throw new Error(
        "Not allowed to set hash, asHash and inline at the same time.",
      );
    }
    let t = this.tasks.shift();
    for (; t;) await t(this), t = this.tasks.shift();
    let r = await this.lucid.wallet.getUtxosCore(),
      n = cr(
        e?.change?.address || await this.lucid.wallet.address(),
        this.lucid,
      );
    return (e?.coinSelection || e?.coinSelection === void 0) &&
      this.txBuilder.add_inputs_from(r, n),
      this.txBuilder.balance(
        n,
        (() =>
          e?.change?.outputData?.hash
            ? u.Datum.new_data_hash(
              u.DataHash.from_hex(e.change.outputData.hash),
            )
            : e?.change?.outputData?.asHash
            ? (this.txBuilder.add_plutus_data(
              u.PlutusData.from_bytes(w(e.change.outputData.asHash)),
            ),
              u.Datum.new_data_hash(
                u.hash_plutus_data(
                  u.PlutusData.from_bytes(w(e.change.outputData.asHash)),
                ),
              ))
            : e?.change?.outputData?.inline
            ? u.Datum.new_data(
              u.Data.new(
                u.PlutusData.from_bytes(w(e.change.outputData.inline)),
              ),
            )
            : void 0)(),
      ),
      new Et(
        this.lucid,
        await this.txBuilder.construct(
          r,
          n,
          e?.nativeUplc === void 0 ? !0 : e?.nativeUplc,
        ),
      );
  }
  async toString() {
    let e = this.tasks.shift();
    for (; e;) await e(this), e = this.tasks.shift();
    return k(this.txBuilder.to_bytes());
  }
};
function Br(o, { type: e, script: t }) {
  if (e === "Native") {
    return o.txBuilder.add_native_script(u.NativeScript.from_bytes(w(t)));
  }
  if (e === "PlutusV1") {
    return o.txBuilder.add_plutus_script(u.PlutusScript.from_bytes(w(De(t))));
  }
  if (e === "PlutusV2") {
    return o.txBuilder.add_plutus_v2_script(
      u.PlutusScript.from_bytes(w(De(t))),
    );
  }
  throw new Error("No variant matched.");
}
async function fs(o, e) {
  let t = u.Ed25519KeyHashes.new();
  o.owners.forEach((i) => {
    let { stakeCredential: a } = e.utils.getAddressDetails(i);
    if (a?.type === "Key") t.add(u.Ed25519KeyHash.from_hex(a.hash));
    else throw new Error("Only key hashes allowed for pool owners.");
  });
  let r = o.metadataUrl
      ? await fetch(o.metadataUrl).then((i) => i.arrayBuffer())
      : null,
    n = r
      ? u.PoolMetadataHash.from_bytes(u.hash_blake2b256(new Uint8Array(r)))
      : null,
    s = u.Relays.new();
  return o.relays.forEach((i) => {
    switch (i.type) {
      case "SingleHostIp": {
        let a = i.ipV4
            ? u.Ipv4.new(
              new Uint8Array(i.ipV4.split(".").map((d) => parseInt(d))),
            )
            : void 0,
          c = i.ipV6 ? u.Ipv6.new(w(i.ipV6.replaceAll(":", ""))) : void 0;
        s.add(u.Relay.new_single_host_addr(u.SingleHostAddr.new(i.port, a, c)));
        break;
      }
      case "SingleHostDomainName": {
        s.add(
          u.Relay.new_single_host_name(
            u.SingleHostName.new(i.port, u.DNSRecordAorAAAA.new(i.domainName)),
          ),
        );
        break;
      }
      case "MultiHost": {
        s.add(
          u.Relay.new_multi_host_name(
            u.MultiHostName.new(u.DNSRecordSRV.new(i.domainName)),
          ),
        );
        break;
      }
    }
  }),
    u.PoolRegistration.new(
      u.PoolParams.new(
        u.Ed25519KeyHash.from_bech32(o.poolId),
        u.VRFKeyHash.from_hex(o.vrfKeyHash),
        u.BigNum.from_str(o.pledge.toString()),
        u.BigNum.from_str(o.cost.toString()),
        u.UnitInterval.from_float(o.margin),
        u.RewardAddress.from_address(cr(o.rewardAddress, e)),
        t,
        s,
        n ? u.PoolMetadata.new(u.Url.new(o.metadataUrl), n) : void 0,
      ),
    );
}
function cr(o, e) {
  let t = e.utils.getAddressDetails(o), r = rt(e.network);
  if (t.networkId !== r) {
    throw new Error(
      `Invalid address: Expected address with network id ${r}, but got ${t.networkId}`,
    );
  }
  return u.Address.from_bech32(o);
}
function ps(
  o,
  e = { addressType: "Base", accountIndex: 0, network: "Mainnet" },
) {
  function t(m) {
    if (typeof m != "number") throw new Error("Type number required here!");
    return 2147483648 + m;
  }
  let r = zn(o),
    s = u.Bip32PrivateKey.from_bip39_entropy(
      w(r),
      e.password ? new TextEncoder().encode(e.password) : new Uint8Array(),
    ).derive(t(1852)).derive(t(1815)).derive(t(e.accountIndex)),
    i = s.derive(0).derive(0).to_raw_key(),
    a = s.derive(2).derive(0).to_raw_key(),
    c = i.to_public().hash(),
    d = a.to_public().hash(),
    f = e.network === "Mainnet" ? 1 : 0,
    p = e.addressType === "Base"
      ? u.BaseAddress.new(
        f,
        u.StakeCredential.from_keyhash(c),
        u.StakeCredential.from_keyhash(d),
      ).to_address().to_bech32(void 0)
      : u.EnterpriseAddress.new(f, u.StakeCredential.from_keyhash(c))
        .to_address().to_bech32(void 0),
    h = e.addressType === "Base"
      ? u.RewardAddress.new(f, u.StakeCredential.from_keyhash(d)).to_address()
        .to_bech32(void 0)
      : null;
  return {
    address: p,
    rewardAddress: h,
    paymentKey: i.to_bech32(),
    stakeKey: e.addressType === "Base" ? a.to_bech32() : null,
  };
}
function hs(o, e, t) {
  let r = [], n = o.body().inputs();
  for (let m = 0; m < n.len(); m++) {
    let g = n.get(m),
      O = k(g.transaction_id().to_bytes()),
      v = parseInt(g.index().to_str()),
      C = t.find((x) => x.txHash === O && x.outputIndex === v);
    if (C) {
      let { paymentCredential: x } = me(C.address);
      r.push(x?.hash);
    }
  }
  let s = o.body();
  function i(m) {
    let g = m.certs();
    if (g) {
      for (let O = 0; O < g.len(); O++) {
        let v = g.get(O);
        if (v.kind() === 0) {
          v.as_stake_registration()?.stake_credential()?.kind();
        } else if (v.kind() === 1) {
          let C = v.as_stake_deregistration()?.stake_credential();
          if (C?.kind() === 0) {
            let x = k(C.to_keyhash().to_bytes());
            r.push(x);
          }
        } else if (v.kind() === 2) {
          let C = v.as_stake_delegation()?.stake_credential();
          if (C?.kind() === 0) {
            let x = k(C.to_keyhash().to_bytes());
            r.push(x);
          }
        } else if (v.kind() === 3) {
          let C = v.as_pool_registration()?.pool_params(), x = C?.pool_owners();
          if (!x) break;
          for (let D = 0; D < x.len(); D++) {
            let L = k(x.get(D).to_bytes());
            r.push(L);
          }
          let F = C.operator().to_hex();
          r.push(F);
        } else if (v.kind() === 4) {
          let C = v.as_pool_retirement().pool_keyhash().to_hex();
          r.push(C);
        } else if (v.kind() === 6) {
          let C = v.as_move_instantaneous_rewards_cert()
            ?.move_instantaneous_reward().as_to_stake_creds()?.keys();
          if (!C) break;
          for (let x = 0; x < C.len(); x++) {
            let F = C.get(x);
            if (F.kind() === 0) {
              let D = k(F.to_keyhash().to_bytes());
              r.push(D);
            }
          }
        }
      }
    }
  }
  s.certs() && i(s);
  let a = s.withdrawals();
  function c(m) {
    let g = m.keys();
    for (let O = 0; O < g.len(); O++) {
      let v = g.get(O).payment_cred();
      v.kind() === 0 && r.push(v.to_keyhash().to_hex());
    }
  }
  a && c(a);
  let d = o.witness_set().native_scripts();
  function f(m) {
    for (let g = 0; g < m.len(); g++) {
      let O = m.get(g);
      if (O.kind() === 0) {
        let v = k(O.as_script_pubkey().addr_keyhash().to_bytes());
        r.push(v);
      }
      if (O.kind() === 1) {
        f(O.as_script_all().native_scripts());
        return;
      }
      if (O.kind() === 2) {
        f(O.as_script_any().native_scripts());
        return;
      }
      if (O.kind() === 3) {
        f(O.as_script_n_of_k().native_scripts());
        return;
      }
    }
  }
  d && f(d);
  let p = s.required_signers();
  if (p) for (let m = 0; m < p.len(); m++) r.push(k(p.get(m).to_bytes()));
  let h = s.collateral();
  if (h) {
    for (let m = 0; m < h.len(); m++) {
      let g = h.get(m),
        O = k(g.transaction_id().to_bytes()),
        v = parseInt(g.index().to_str()),
        C = t.find((x) => x.txHash === O && x.outputIndex === v);
      if (C) {
        let { paymentCredential: x } = me(C.address);
        r.push(x?.hash);
      }
    }
  }
  return r.filter((m) => e.includes(m));
}
function dr(o, e, t) {
  let r = M.HeaderMap.new();
  r.set_algorithm_id(M.Label.from_algorithm_id(M.AlgorithmId.EdDSA)),
    r.set_header(M.Label.new_text("address"), M.CBORValue.new_bytes(w(o)));
  let n = M.ProtectedHeaderMap.new(r),
    s = M.HeaderMap.new(),
    i = M.Headers.new(n, s),
    a = M.COSESign1Builder.new(i, w(e), !1),
    c = a.make_data_to_sign().to_bytes(),
    d = u.PrivateKey.from_bech32(t),
    f = d.sign(c).to_bytes(),
    p = a.build(f),
    h = M.COSEKey.new(M.Label.from_key_type(M.KeyType.OKP));
  return h.set_algorithm_id(M.Label.from_algorithm_id(M.AlgorithmId.EdDSA)),
    h.set_header(
      M.Label.new_int(M.Int.new_negative(M.BigNum.from_str("1"))),
      M.CBORValue.new_int(M.Int.new_i32(6)),
    ),
    h.set_header(
      M.Label.new_int(M.Int.new_negative(M.BigNum.from_str("2"))),
      M.CBORValue.new_bytes(d.to_public().as_bytes()),
    ),
    { signature: k(p.to_bytes()), key: k(h.to_bytes()) };
}
function ms(o, e, t, r) {
  let n = M.COSESign1.from_bytes(w(r.signature)),
    s = M.COSEKey.from_bytes(w(r.key)),
    i = n.headers().protected().deserialized_headers(),
    a = (() => {
      try {
        return k(i.header(M.Label.new_text("address"))?.as_bytes());
      } catch {
        throw new Error("No address found in signature.");
      }
    })(),
    c = (() => {
      try {
        let v = i.algorithm_id()?.as_int();
        return v?.is_positive()
          ? parseInt(v.as_positive()?.to_str())
          : parseInt(v?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Algorithm Id.");
      }
    })(),
    d = (() => {
      try {
        let v = s.algorithm_id()?.as_int();
        return v?.is_positive()
          ? parseInt(v.as_positive()?.to_str())
          : parseInt(v?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Algorithm Id.");
      }
    })(),
    f = (() => {
      try {
        let v = s.header(
          M.Label.new_int(M.Int.new_negative(M.BigNum.from_str("1"))),
        )?.as_int();
        return v?.is_positive()
          ? parseInt(v.as_positive()?.to_str())
          : parseInt(v?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Curve.");
      }
    })(),
    p = (() => {
      try {
        let v = s.key_type().as_int();
        return v?.is_positive()
          ? parseInt(v.as_positive()?.to_str())
          : parseInt(v?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Key Type.");
      }
    })(),
    h = (() => {
      try {
        return u.PublicKey.from_bytes(
          s.header(M.Label.new_int(M.Int.new_negative(M.BigNum.from_str("2"))))
            ?.as_bytes(),
        );
      } catch {
        throw new Error("No public key found.");
      }
    })(),
    m = (() => {
      try {
        return k(n.payload());
      } catch {
        throw new Error("No payload found.");
      }
    })(),
    g = u.Ed25519Signature.from_bytes(n.signature()),
    O = n.signed_data(void 0, void 0).to_bytes();
  return a !== o || e !== h.hash().to_hex() ||
      c !== d && c !== M.AlgorithmId.EdDSA || f !== 6 || p !== 1 || m !== t
    ? !1
    : h.verify(O, g);
}
var Dr = class {
  constructor(e, t, r) {
    Object.defineProperty(this, "lucid", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "address", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "payload", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      this.lucid = e,
      this.address = t,
      this.payload = r;
  }
  sign() {
    return this.lucid.wallet.signMessage(this.address, this.payload);
  }
  signWithPrivateKey(e) {
    let { paymentCredential: t, stakeCredential: r, address: { hex: n } } = this
        .lucid.utils.getAddressDetails(this.address),
      s = t?.hash || r?.hash,
      i = u.PrivateKey.from_bech32(e).to_public().hash().to_hex();
    if (!s || s !== i) {
      throw new Error(`Cannot sign message for address: ${this.address}.`);
    }
    return dr(n, this.payload, e);
  }
};
var fr = class {
  constructor(e, t = en) {
    Object.defineProperty(this, "ledger", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "mempool", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {},
      }),
      Object.defineProperty(this, "chain", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {},
      }),
      Object.defineProperty(this, "blockHeight", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "slot", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "time", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "protocolParameters", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "datumTable", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {},
      });
    let r = "00".repeat(32);
    this.blockHeight = 0,
      this.slot = 0,
      this.time = Date.now(),
      this.ledger = {},
      e.forEach(({ address: n, assets: s }, i) => {
        this.ledger[r + i] = {
          utxo: { txHash: r, outputIndex: i, address: n, assets: s },
          spent: !1,
        };
      }),
      this.protocolParameters = t;
  }
  now() {
    return this.time;
  }
  awaitSlot(e = 1) {
    this.slot += e, this.time += e * 1e3;
    let t = this.blockHeight;
    if (this.blockHeight = Math.floor(this.slot / 20), this.blockHeight > t) {
      for (let [r, { utxo: n, spent: s }] of Object.entries(this.mempool)) {
        this.ledger[r] = { utxo: n, spent: s };
      }
      for (let [r, { spent: n }] of Object.entries(this.ledger)) {
        n && delete this.ledger[r];
      }
      this.mempool = {};
    }
  }
  awaitBlock(e = 1) {
    this.blockHeight += e, this.slot += e * 20, this.time += e * 20 * 1e3;
    for (let [t, { utxo: r, spent: n }] of Object.entries(this.mempool)) {
      this.ledger[t] = { utxo: r, spent: n };
    }
    for (let [t, { spent: r }] of Object.entries(this.ledger)) {
      r && delete this.ledger[t];
    }
    this.mempool = {};
  }
  getUtxos(e) {
    let t = Object.values(this.ledger).flatMap(({ utxo: r }) => {
      if (typeof e == "string") return e === r.address ? r : [];
      {
        let { paymentCredential: n } = me(r.address);
        return n?.hash === e.hash ? r : [];
      }
    });
    return Promise.resolve(t);
  }
  getProtocolParameters() {
    return Promise.resolve(this.protocolParameters);
  }
  getDatum(e) {
    return Promise.resolve(this.datumTable[e]);
  }
  getUtxosWithUnit(e, t) {
    let r = Object.values(this.ledger).flatMap(({ utxo: n }) => {
      if (typeof e == "string") {
        return e === n.address && n.assets[t] > 0n ? n : [];
      }
      {
        let { paymentCredential: s } = me(n.address);
        return s?.hash === e.hash && n.assets[t] > 0n ? n : [];
      }
    });
    return Promise.resolve(r);
  }
  getUtxosByOutRef(e) {
    return Promise.resolve(
      e.flatMap((t) => this.ledger[t.txHash + t.outputIndex]?.utxo || []),
    );
  }
  getUtxoByUnit(e) {
    let t = Object.values(this.ledger).flatMap(({ utxo: r }) =>
      r.assets[e] > 0n ? r : []
    );
    if (t.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    return Promise.resolve(t[0]);
  }
  getDelegation(e) {
    return Promise.resolve({
      poolId: this.chain[e]?.delegation?.poolId || null,
      rewards: this.chain[e]?.delegation?.rewards || 0n,
    });
  }
  awaitTx(e) {
    return this.mempool[e + 0] && this.awaitBlock(), Promise.resolve(!0);
  }
  distributeRewards(e) {
    for (
      let [t, { registeredStake: r, delegation: n }] of Object.entries(
        this.chain,
      )
    ) {
      r && n.poolId &&
        (this.chain[t] = {
          registeredStake: r,
          delegation: { poolId: n.poolId, rewards: n.rewards += e },
        });
    }
    this.awaitBlock();
  }
  submitTx(e) {
    let t = u.Transaction.from_bytes(w(e)),
      r = t.body(),
      n = t.witness_set(),
      s = n.plutus_data(),
      i = u.hash_transaction(r).to_hex(),
      a = r.validity_start_interval()
        ? parseInt(r.validity_start_interval().to_str())
        : null,
      c = r.ttl() ? parseInt(r.ttl().to_str()) : null;
    if (Number.isInteger(a) && this.slot < a) {
      throw new Error(`Lower bound (${a}) not in slot range (${this.slot}).`);
    }
    if (Number.isInteger(c) && this.slot > c) {
      throw new Error(`Upper bound (${c}) not in slot range (${this.slot}).`);
    }
    let d = (() => {
        let b = {};
        for (let P = 0; P < (s?.len() || 0); P++) {
          let A = s.get(P), $ = u.hash_plutus_data(A).to_hex();
          b[$] = k(A.to_bytes());
        }
        return b;
      })(),
      f = new Set(),
      p = (() => {
        let b = [];
        for (let P = 0; P < (n.vkeys()?.len() || 0); P++) {
          let A = n.vkeys().get(P),
            $ = A.vkey().public_key(),
            U = $.hash().to_hex();
          if (!$.verify(w(i), A.signature())) {
            throw new Error(
              `Invalid vkey witness. Key hash: ${U}`,
            );
          }
          b.push(U);
        }
        return b;
      })(),
      h = u.Ed25519KeyHashes.new();
    p.forEach((b) => h.add(u.Ed25519KeyHash.from_hex(b)));
    let m = (() => {
        let b = [];
        for (let P = 0; P < (n.native_scripts()?.len() || 0); P++) {
          let A = n.native_scripts().get(P),
            $ = A.hash(u.ScriptHashNamespace.NativeScript).to_hex();
          if (
            !A.verify(
              Number.isInteger(a) ? u.BigNum.from_str(a.toString()) : void 0,
              Number.isInteger(c) ? u.BigNum.from_str(c.toString()) : void 0,
              h,
            )
          ) throw new Error(`Invalid native script witness. Script hash: ${$}`);
          for (let U = 0; U < A.get_required_signers().len(); U++) {
            let ne = A.get_required_signers().get(U).to_hex();
            f.add(ne);
          }
          b.push($);
        }
        return b;
      })(),
      g = {},
      O = [],
      v = (() => {
        let b = [];
        for (let P = 0; P < (n.plutus_scripts()?.len() || 0); P++) {
          let $ = n.plutus_scripts().get(P).hash(u.ScriptHashNamespace.PlutusV1)
            .to_hex();
          b.push($);
        }
        for (let P = 0; P < (n.plutus_v2_scripts()?.len() || 0); P++) {
          let $ = n.plutus_v2_scripts().get(P).hash(
            u.ScriptHashNamespace.PlutusV2,
          ).to_hex();
          b.push($);
        }
        return b;
      })(),
      C = r.inputs();
    C.sort();
    let x = [];
    for (let b = 0; b < C.len(); b++) {
      let P = C.get(b),
        A = P.transaction_id().to_hex() + P.index().to_str(),
        $ = this.ledger[A],
        { entry: U, type: ne } = $
          ? { entry: $, type: "Ledger" }
          : { entry: this.mempool[A], type: "Mempool" };
      if (!U || U.spent) {
        throw new Error(
          `Could not spend UTxO: ${
            JSON.stringify({
              txHash: U?.utxo.txHash,
              outputIndex: U?.utxo.outputIndex,
            })
          }
It does not exist or was already spent.`,
        );
      }
      let le = U.utxo.scriptRef;
      if (le) {
        switch (le.type) {
          case "Native": {
            let Ce = u.NativeScript.from_bytes(w(le.script));
            g[Ce.hash(u.ScriptHashNamespace.NativeScript).to_hex()] = Ce;
            break;
          }
          case "PlutusV1": {
            let Ce = u.PlutusScript.from_bytes(w(le.script));
            O.push(Ce.hash(u.ScriptHashNamespace.PlutusV1).to_hex());
            break;
          }
          case "PlutusV2": {
            let Ce = u.PlutusScript.from_bytes(w(le.script));
            O.push(Ce.hash(u.ScriptHashNamespace.PlutusV2).to_hex());
            break;
          }
        }
      }
      U.utxo.datumHash && f.add(U.utxo.datumHash),
        x.push({ entry: U, type: ne });
    }
    for (let b = 0; b < (r.reference_inputs()?.len() || 0); b++) {
      let P = r.reference_inputs().get(b),
        A = P.transaction_id().to_hex() + P.index().to_str(),
        $ = this.ledger[A] || this.mempool[A];
      if (!$ || $.spent) {
        throw new Error(
          `Could not read UTxO: ${
            JSON.stringify({
              txHash: $?.utxo.txHash,
              outputIndex: $?.utxo.outputIndex,
            })
          }
It does not exist or was already spent.`,
        );
      }
      let U = $.utxo.scriptRef;
      if (U) {
        switch (U.type) {
          case "Native": {
            let ne = u.NativeScript.from_bytes(w(U.script));
            g[ne.hash(u.ScriptHashNamespace.NativeScript).to_hex()] = ne;
            break;
          }
          case "PlutusV1": {
            let ne = u.PlutusScript.from_bytes(w(U.script));
            O.push(ne.hash(u.ScriptHashNamespace.PlutusV1).to_hex());
            break;
          }
          case "PlutusV2": {
            let ne = u.PlutusScript.from_bytes(w(U.script));
            O.push(ne.hash(u.ScriptHashNamespace.PlutusV2).to_hex());
            break;
          }
        }
      }
      $.utxo.datumHash && f.add($.utxo.datumHash);
    }
    let F = (() => {
      let b = { 0: "Spend", 1: "Mint", 2: "Cert", 3: "Reward" }, P = [];
      for (let A = 0; A < (n.redeemers()?.len() || 0); A++) {
        let $ = n.redeemers().get(A);
        P.push({ tag: b[$.tag().kind()], index: parseInt($.index().to_str()) });
      }
      return P;
    })();
    function D(b, P, A) {
      switch (b.type) {
        case "Key": {
          if (!p.includes(b.hash)) {
            throw new Error(`Missing vkey witness. Key hash: ${b.hash}`);
          }
          f.add(b.hash);
          break;
        }
        case "Script": {
          if (m.includes(b.hash)) {
            f.add(b.hash);
            break;
          } else if (g[b.hash]) {
            if (
              !g[b.hash].verify(
                Number.isInteger(a) ? u.BigNum.from_str(a.toString()) : void 0,
                Number.isInteger(c) ? u.BigNum.from_str(c.toString()) : void 0,
                h,
              )
            ) {
              throw new Error(
                `Invalid native script witness. Script hash: ${b.hash}`,
              );
            }
            break;
          } else if (
            (v.includes(b.hash) || O.includes(b.hash)) &&
            F.find(($) => $.tag === P && $.index === A)
          ) {
            f.add(b.hash);
            break;
          }
          throw new Error(`Missing script witness. Script hash: ${b.hash}`);
        }
      }
    }
    for (let b = 0; b < (r.collateral()?.len() || 0); b++) {
      let P = r.collateral().get(b),
        A = P.transaction_id().to_hex() + P.index().to_str(),
        $ = this.ledger[A] || this.mempool[A];
      if (!$ || $.spent) {
        throw new Error(
          `Could not read UTxO: ${
            JSON.stringify({
              txHash: $?.utxo.txHash,
              outputIndex: $?.utxo.outputIndex,
            })
          }
It does not exist or was already spent.`,
        );
      }
      let { paymentCredential: U } = me($.utxo.address);
      if (U?.type === "Script") {
        throw new Error("Collateral inputs can only contain vkeys.");
      }
      D(U, null, null);
    }
    for (let b = 0; b < (r.required_signers()?.len() || 0); b++) {
      let P = r.required_signers().get(b);
      D({ type: "Key", hash: P.to_hex() }, null, null);
    }
    for (let b = 0; b < (r.mint()?.keys().len() || 0); b++) {
      let P = r.mint().keys().get(b).to_hex();
      D({ type: "Script", hash: P }, "Mint", b);
    }
    let L = [];
    for (let b = 0; b < (r.withdrawals()?.keys().len() || 0); b++) {
      let P = r.withdrawals().keys().get(b),
        A = BigInt(r.withdrawals().get(P).to_str()),
        $ = P.to_address().to_bech32(void 0),
        { stakeCredential: U } = me($);
      if (D(U, "Reward", b), this.chain[$]?.delegation.rewards !== A) {
        throw new Error(
          "Withdrawal amount doesn't match actual reward balance.",
        );
      }
      L.push({ rewardAddress: $, withdrawal: A });
    }
    let G = [];
    for (let b = 0; b < (r.certs()?.len() || 0); b++) {
      let P = r.certs().get(b);
      switch (P.kind()) {
        case 0: {
          let A = P.as_stake_registration(),
            $ = u.RewardAddress.new(
              u.NetworkInfo.testnet().network_id(),
              A.stake_credential(),
            ).to_address().to_bech32(void 0);
          if (this.chain[$]?.registeredStake) {
            throw new Error(
              `Stake key is already registered. Reward address: ${$}`,
            );
          }
          G.push({ type: "Registration", rewardAddress: $ });
          break;
        }
        case 1: {
          let A = P.as_stake_deregistration(),
            $ = u.RewardAddress.new(
              u.NetworkInfo.testnet().network_id(),
              A.stake_credential(),
            ).to_address().to_bech32(void 0),
            { stakeCredential: U } = me($);
          if (D(U, "Cert", b), !this.chain[$]?.registeredStake) {
            throw new Error(
              `Stake key is already deregistered. Reward address: ${$}`,
            );
          }
          G.push({ type: "Deregistration", rewardAddress: $ });
          break;
        }
        case 2: {
          let A = P.as_stake_delegation(),
            $ = u.RewardAddress.new(
              u.NetworkInfo.testnet().network_id(),
              A.stake_credential(),
            ).to_address().to_bech32(void 0),
            U = A.pool_keyhash().to_bech32("pool"),
            { stakeCredential: ne } = me($);
          if (
            D(ne, "Cert", b),
              !this.chain[$]?.registeredStake &&
              !G.find((le) =>
                le.type === "Registration" && le.rewardAddress === $
              )
          ) {
            throw new Error(
              `Stake key is not registered. Reward address: ${$}`,
            );
          }
          G.push({ type: "Delegation", rewardAddress: $, poolId: U });
          break;
        }
      }
    }
    x.forEach(({ entry: { utxo: b } }, P) => {
      let { paymentCredential: A } = me(b.address);
      D(A, "Spend", P);
    });
    let _e = (() => {
        let b = [];
        for (let P = 0; P < r.outputs().len(); P++) {
          let A = r.outputs().get(P),
            $ = u.TransactionUnspentOutput.new(
              u.TransactionInput.new(
                u.TransactionHash.from_hex(i),
                u.BigNum.from_str(P.toString()),
              ),
              A,
            ),
            U = sr($);
          U.datumHash && f.add(U.datumHash), b.push({ utxo: U, spent: !1 });
        }
        return b;
      })(),
      [pe] = p.filter((b) => !f.has(b));
    if (pe) throw new Error(`Extraneous vkey witness. Key hash: ${pe}`);
    let [X] = m.filter((b) => !f.has(b));
    if (X) throw new Error(`Extraneous native script. Script hash: ${X}`);
    let [Q] = v.filter((b) => !f.has(b));
    if (Q) throw new Error(`Extraneous plutus script. Script hash: ${Q}`);
    let [ce] = Object.keys(d).filter((b) => !f.has(b));
    if (ce) throw new Error(`Extraneous plutus data. Datum hash: ${ce}`);
    x.forEach(({ entry: b, type: P }) => {
      let A = b.utxo.txHash + b.utxo.outputIndex;
      b.spent = !0,
        P === "Ledger"
          ? this.ledger[A] = b
          : P === "Mempool" && (this.mempool[A] = b);
    }),
      L.forEach(({ rewardAddress: b, withdrawal: P }) => {
        this.chain[b].delegation.rewards -= P;
      }),
      G.forEach(({ type: b, rewardAddress: P, poolId: A }) => {
        switch (b) {
          case "Registration": {
            this.chain[P]
              ? this.chain[P].registeredStake = !0
              : this.chain[P] = {
                registeredStake: !0,
                delegation: { poolId: null, rewards: 0n },
              };
            break;
          }
          case "Deregistration": {
            this.chain[P].registeredStake = !1,
              this.chain[P].delegation.poolId = null;
            break;
          }
          case "Delegation":
            this.chain[P].delegation.poolId = A;
        }
      }),
      _e.forEach(({ utxo: b, spent: P }) => {
        this.mempool[b.txHash + b.outputIndex] = { utxo: b, spent: P };
      });
    for (let [b, P] of Object.entries(d)) this.datumTable[b] = P;
    return Promise.resolve(i);
  }
  log() {
    function e(n) {
      let s = n === "lovelace" ? "1" : n, i = 0;
      for (let f = 0; f < s.length; f++) i += s.charCodeAt(f);
      let a = i * 123 % 256, c = i * 321 % 256, d = i * 213 % 256;
      return "#" + ((1 << 24) + (a << 16) + (c << 8) + d).toString(16).slice(1);
    }
    let t = {}, r = {};
    for (let { utxo: n } of Object.values(this.ledger)) {
      for (let [s, i] of Object.entries(n.assets)) {
        r[n.address]
          ? r[n.address]?.[s] ? r[n.address][s] += i : r[n.address][s] = i
          : r[n.address] = { [s]: i }, t[s] ? t[s] += i : t[s] = i;
      }
    }
    console.log(
      `
%cBlockchain state`,
      "color:purple",
    ),
      console.log(
        `
    Block height:   %c${this.blockHeight}%c
    Slot:           %c${this.slot}%c
    Unix time:      %c${this.time}
  `,
        "color:yellow",
        "color:white",
        "color:yellow",
        "color:white",
        "color:yellow",
      ),
      console.log(`
`);
    for (let [n, s] of Object.entries(r)) {
      console.log(
        `Address: %c${n}`,
        "color:blue",
        `
`,
      );
      for (let [i, a] of Object.entries(s)) {
        let c = Math.max(Math.floor(60 * (Number(a) / Number(t[i]))), 1);
        console.log(
          `%c${"\u2586".repeat(c) + " ".repeat(60 - c)}`,
          `color: ${e(i)}`,
          "",
          `${i}:`,
          a,
          "",
        );
      }
      console.log(`
${"\u2581".repeat(60)}
`);
    }
  }
};
var pr = class {
  constructor() {
    Object.defineProperty(this, "txBuilderConfig", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "wallet", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "provider", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "network", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: "Mainnet",
      }),
      Object.defineProperty(this, "utils", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      });
  }
  static async new(e, t) {
    let r = new this();
    if (t && (r.network = t), e) {
      r.provider = e;
      let n = await e.getProtocolParameters();
      r.provider instanceof fr &&
        (r.network = "Custom",
          Tt[r.network] = {
            zeroTime: r.provider.now(),
            zeroSlot: 0,
            slotLength: 1e3,
          });
      let s = Tt[r.network];
      r.txBuilderConfig = u.TransactionBuilderConfigBuilder.new()
        .coins_per_utxo_byte(u.BigNum.from_str(n.coinsPerUtxoByte.toString()))
        .fee_algo(
          u.LinearFee.new(
            u.BigNum.from_str(n.minFeeA.toString()),
            u.BigNum.from_str(n.minFeeB.toString()),
          ),
        ).key_deposit(u.BigNum.from_str(n.keyDeposit.toString())).pool_deposit(
          u.BigNum.from_str(n.poolDeposit.toString()),
        ).max_tx_size(n.maxTxSize).max_value_size(n.maxValSize)
        .collateral_percentage(n.collateralPercentage).max_collateral_inputs(
          n.maxCollateralInputs,
        ).max_tx_ex_units(
          u.ExUnits.new(
            u.BigNum.from_str(n.maxTxExMem.toString()),
            u.BigNum.from_str(n.maxTxExSteps.toString()),
          ),
        ).ex_unit_prices(u.ExUnitPrices.from_float(n.priceMem, n.priceStep))
        .slot_config(
          u.BigNum.from_str(s.zeroTime.toString()),
          u.BigNum.from_str(s.zeroSlot.toString()),
          s.slotLength,
        ).blockfrost(
          u.Blockfrost.new(
            (e?.url || "") + "/utils/txs/evaluate",
            e?.projectId || "",
          ),
        ).costmdls(Qr(n.costModels)).build();
    }
    return r.utils = new rr(r), r;
  }
  async switchProvider(e, t) {
    if (this.network === "Custom") {
      throw new Error("Cannot switch when on custom network.");
    }
    let r = await pr.new(e, t);
    return this.txBuilderConfig = r.txBuilderConfig,
      this.provider = e || this.provider,
      this.network = t || this.network,
      this.wallet = r.wallet,
      this;
  }
  newTx() {
    return new lr(this);
  }
  fromTx(e) {
    return new Et(this, u.Transaction.from_bytes(w(e)));
  }
  newMessage(e, t) {
    return new Dr(this, e, t);
  }
  verifyMessage(e, t, r) {
    let { paymentCredential: n, stakeCredential: s, address: { hex: i } } = this
        .utils.getAddressDetails(e),
      a = n?.hash || s?.hash;
    if (!a) throw new Error("Not a valid address provided.");
    return ms(i, a, t, r);
  }
  currentSlot() {
    return this.utils.unixTimeToSlot(Date.now());
  }
  utxosAt(e) {
    return this.provider.getUtxos(e);
  }
  utxosAtWithUnit(e, t) {
    return this.provider.getUtxosWithUnit(e, t);
  }
  utxoByUnit(e) {
    return this.provider.getUtxoByUnit(e);
  }
  utxosByOutRef(e) {
    return this.provider.getUtxosByOutRef(e);
  }
  delegationAt(e) {
    return this.provider.getDelegation(e);
  }
  awaitTx(e, t = 3e3) {
    return this.provider.awaitTx(e, t);
  }
  async datumOf(e, t) {
    if (!e.datum) {
      if (!e.datumHash) {
        throw new Error("This UTxO does not have a datum hash.");
      }
      e.datum = await this.provider.getDatum(e.datumHash);
    }
    return t ? Ft.from(e.datum, t) : e.datum;
  }
  selectWalletFromPrivateKey(e) {
    let t = u.PrivateKey.from_bech32(e), r = t.to_public().hash();
    return this.wallet = {
      address: async () =>
        u.EnterpriseAddress.new(
          this.network === "Mainnet" ? 1 : 0,
          u.StakeCredential.from_keyhash(r),
        ).to_address().to_bech32(void 0),
      rewardAddress: async () => null,
      getUtxos: async () => await this.utxosAt(nt(await this.wallet.address())),
      getUtxosCore: async () => {
        let n = await this.utxosAt(nt(await this.wallet.address())),
          s = u.TransactionUnspentOutputs.new();
        return n.forEach((i) => {
          s.add(pt(i));
        }),
          s;
      },
      getDelegation: async () => ({ poolId: null, rewards: 0n }),
      signTx: async (n) => {
        let s = u.make_vkey_witness(u.hash_transaction(n.body()), t),
          i = u.TransactionWitnessSetBuilder.new();
        return i.add_vkey(s), i.build();
      },
      signMessage: async (n, s) => {
        let { paymentCredential: i, address: { hex: a } } = this.utils
            .getAddressDetails(n),
          c = i?.hash,
          d = r.to_hex();
        if (!c || c !== d) {
          throw new Error(`Cannot sign message for address: ${n}.`);
        }
        return dr(a, s, e);
      },
      submitTx: async (n) => await this.provider.submitTx(n),
    },
      this;
  }
  selectWallet(e) {
    let t = async () => {
      let [r] = await e.getUsedAddresses();
      if (r) return r;
      let [n] = await e.getUnusedAddresses();
      return n;
    };
    return this.wallet = {
      address: async () => u.Address.from_bytes(w(await t())).to_bech32(void 0),
      rewardAddress: async () => {
        let [r] = await e.getRewardAddresses();
        return r
          ? u.RewardAddress.from_address(u.Address.from_bytes(w(r)))
            .to_address().to_bech32(void 0)
          : null;
      },
      getUtxos: async () =>
        (await e.getUtxos() || []).map((n) => {
          let s = u.TransactionUnspentOutput.from_bytes(w(n));
          return sr(s);
        }),
      getUtxosCore: async () => {
        let r = u.TransactionUnspentOutputs.new();
        return (await e.getUtxos() || []).forEach((n) => {
          r.add(u.TransactionUnspentOutput.from_bytes(w(n)));
        }),
          r;
      },
      getDelegation: async () => {
        let r = await this.wallet.rewardAddress();
        return r ? await this.delegationAt(r) : { poolId: null, rewards: 0n };
      },
      signTx: async (r) => {
        let n = await e.signTx(k(r.to_bytes()), !0);
        return u.TransactionWitnessSet.from_bytes(w(n));
      },
      signMessage: async (r, n) => {
        let s = k(u.Address.from_bech32(r).to_bytes());
        return await e.signData(s, n);
      },
      submitTx: async (r) => await e.submitTx(r),
    },
      this;
  }
  selectWalletFrom({ address: e, utxos: t, rewardAddress: r }) {
    let n = this.utils.getAddressDetails(e);
    return this.wallet = {
      address: async () => e,
      rewardAddress: async () =>
        (!r && n.stakeCredential
          ? (() =>
            n.stakeCredential.type === "Key"
              ? u.RewardAddress.new(
                this.network === "Mainnet" ? 1 : 0,
                u.StakeCredential.from_keyhash(
                  u.Ed25519KeyHash.from_hex(n.stakeCredential.hash),
                ),
              ).to_address().to_bech32(void 0)
              : u.RewardAddress.new(
                this.network === "Mainnet" ? 1 : 0,
                u.StakeCredential.from_scripthash(
                  u.ScriptHash.from_hex(n.stakeCredential.hash),
                ),
              ).to_address().to_bech32(void 0))()
          : r) || null,
      getUtxos: async () => t || await this.utxosAt(nt(e)),
      getUtxosCore: async () => {
        let s = u.TransactionUnspentOutputs.new();
        return (t || await this.utxosAt(nt(e))).forEach((i) => s.add(pt(i))), s;
      },
      getDelegation: async () => {
        let s = await this.wallet.rewardAddress();
        return s ? await this.delegationAt(s) : { poolId: null, rewards: 0n };
      },
      signTx: async () => {
        throw new Error("Not implemented");
      },
      signMessage: async () => {
        throw new Error("Not implemented");
      },
      submitTx: async (s) => await this.provider.submitTx(s),
    },
      this;
  }
  selectWalletFromSeed(e, t) {
    let { address: r, rewardAddress: n, paymentKey: s, stakeKey: i } = ps(e, {
        addressType: t?.addressType || "Base",
        accountIndex: t?.accountIndex || 0,
        password: t?.password,
        network: this.network,
      }),
      a = u.PrivateKey.from_bech32(s).to_public().hash().to_hex(),
      c = i ? u.PrivateKey.from_bech32(i).to_public().hash().to_hex() : "",
      d = { [a]: s, [c]: i };
    return this.wallet = {
      address: async () => r,
      rewardAddress: async () => n || null,
      getUtxos: async () => this.utxosAt(nt(r)),
      getUtxosCore: async () => {
        let f = u.TransactionUnspentOutputs.new();
        return (await this.utxosAt(nt(r))).forEach((p) => f.add(pt(p))), f;
      },
      getDelegation: async () => {
        let f = await this.wallet.rewardAddress();
        return f ? await this.delegationAt(f) : { poolId: null, rewards: 0n };
      },
      signTx: async (f) => {
        let p = await this.utxosAt(r),
          m = hs(f, [a, c], p),
          g = u.TransactionWitnessSetBuilder.new();
        return m.forEach((O) => {
          let v = u.make_vkey_witness(
            u.hash_transaction(f.body()),
            u.PrivateKey.from_bech32(d[O]),
          );
          g.add_vkey(v);
        }),
          g.build();
      },
      signMessage: async (f, p) => {
        let { paymentCredential: h, stakeCredential: m, address: { hex: g } } =
            this.utils.getAddressDetails(f),
          O = h?.hash || m?.hash,
          v = d[O];
        if (!v) throw new Error(`Cannot sign message for address: ${f}.`);
        return dr(g, p, v);
      },
      submitTx: async (f) => await this.provider.submitTx(f),
    },
      this;
  }
};
var ln = class {
  constructor(e, t) {
    Object.defineProperty(this, "url", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "projectId", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      this.url = e,
      this.projectId = t || "";
  }
  async getProtocolParameters() {
    let e = await fetch(`${this.url}/epochs/latest/parameters`, {
      headers: { project_id: this.projectId, lucid: Ue },
    }).then((t) => t.json());
    return {
      minFeeA: parseInt(e.min_fee_a),
      minFeeB: parseInt(e.min_fee_b),
      maxTxSize: parseInt(e.max_tx_size),
      maxValSize: parseInt(e.max_val_size),
      keyDeposit: BigInt(e.key_deposit),
      poolDeposit: BigInt(e.pool_deposit),
      priceMem: parseFloat(e.price_mem),
      priceStep: parseFloat(e.price_step),
      maxTxExMem: BigInt(e.max_tx_ex_mem),
      maxTxExSteps: BigInt(e.max_tx_ex_steps),
      coinsPerUtxoByte: BigInt(e.coins_per_utxo_size),
      collateralPercentage: parseInt(e.collateral_percent),
      maxCollateralInputs: parseInt(e.max_collateral_inputs),
      costModels: e.cost_models,
    };
  }
  async getUtxos(e) {
    let t =
        (() =>
          typeof e == "string"
            ? e
            : e.type === "Key"
            ? u.Ed25519KeyHash.from_hex(e.hash).to_bech32("addr_vkh")
            : u.ScriptHash.from_hex(e.hash).to_bech32("addr_vkh"))(),
      r = [],
      n = 1;
    for (;;) {
      let s = await fetch(`${this.url}/addresses/${t}/utxos?page=${n}`, {
        headers: { project_id: this.projectId, lucid: Ue },
      }).then((i) => i.json());
      if (s.error) {
        if (s.status_code === 404) return [];
        throw new Error("Could not fetch UTxOs from Blockfrost. Try again.");
      }
      if (r = r.concat(s), s.length <= 0) break;
      n++;
    }
    return this.blockfrostUtxosToUtxos(r);
  }
  async getUtxosWithUnit(e, t) {
    let r =
        (() =>
          typeof e == "string"
            ? e
            : e.type === "Key"
            ? u.Ed25519KeyHash.from_hex(e.hash).to_bech32("addr_vkh")
            : u.ScriptHash.from_hex(e.hash).to_bech32("addr_vkh"))(),
      n = [],
      s = 1;
    for (;;) {
      let i = await fetch(`${this.url}/addresses/${r}/utxos/${t}?page=${s}`, {
        headers: { project_id: this.projectId, lucid: Ue },
      }).then((a) => a.json());
      if (i.error) {
        if (i.status_code === 404) return [];
        throw new Error("Could not fetch UTxOs from Blockfrost. Try again.");
      }
      if (n = n.concat(i), i.length <= 0) break;
      s++;
    }
    return this.blockfrostUtxosToUtxos(n);
  }
  async getUtxoByUnit(e) {
    let t = await fetch(`${this.url}/assets/${e}/addresses?count=2`, {
      headers: { project_id: this.projectId, lucid: Ue },
    }).then((s) => s.json());
    if (!t || t.error) throw new Error("Unit not found.");
    if (t.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    let r = t[0].address, n = await this.getUtxosWithUnit(r, e);
    if (n.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    return n[0];
  }
  async getUtxosByOutRef(e) {
    let t = [...new Set(e.map((n) => n.txHash))];
    return (await Promise.all(t.map(async (n) => {
      let s = await fetch(`${this.url}/txs/${n}/utxos`, {
        headers: { project_id: this.projectId, lucid: Ue },
      }).then((a) => a.json());
      if (!s || s.error) return [];
      let i = s.outputs.map((a) => ({ ...a, tx_hash: n }));
      return this.blockfrostUtxosToUtxos(i);
    }))).reduce((n, s) => n.concat(s), []).filter((n) =>
      e.some((s) => n.txHash === s.txHash && n.outputIndex === s.outputIndex)
    );
  }
  async getDelegation(e) {
    let t = await fetch(`${this.url}/accounts/${e}`, {
      headers: { project_id: this.projectId, lucid: Ue },
    }).then((r) => r.json());
    return !t || t.error
      ? { poolId: null, rewards: 0n }
      : { poolId: t.pool_id || null, rewards: BigInt(t.withdrawable_amount) };
  }
  async getDatum(e) {
    let t = await fetch(`${this.url}/scripts/datum/${e}/cbor`, {
      headers: { project_id: this.projectId, lucid: Ue },
    }).then((r) => r.json()).then((r) => r.cbor);
    if (!t || t.error) throw new Error(`No datum found for datum hash: ${e}`);
    return t;
  }
  awaitTx(e, t = 3e3) {
    return new Promise((r) => {
      let n = setInterval(async () => {
        let s = await fetch(`${this.url}/txs/${e}`, {
          headers: { project_id: this.projectId, lucid: Ue },
        }).then((i) => i.json());
        if (s && !s.error) {
          clearInterval(n), r(!0);
          return;
        }
      }, t);
    });
  }
  async submitTx(e) {
    let t = await fetch(`${this.url}/tx/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/cbor",
        project_id: this.projectId,
        lucid: Ue,
      },
      body: w(e),
    }).then((r) => r.json());
    if (!t || t.error) {
      throw t?.status_code === 400
        ? new Error(t.message)
        : new Error("Could not submit transaction.");
    }
    return t;
  }
  async blockfrostUtxosToUtxos(e) {
    return await Promise.all(
      e.map(async (t) => ({
        txHash: t.tx_hash,
        outputIndex: t.output_index,
        assets: (() => {
          let r = {};
          return t.amount.forEach((n) => {
            r[n.unit] = BigInt(n.quantity);
          }),
            r;
        })(),
        address: t.address,
        datumHash: t.inline_datum ? void 0 : t.data_hash,
        datum: t.inline_datum,
        scriptRef: t.reference_script_hash && await (async () => {
          let { type: r } = await fetch(
            `${this.url}/scripts/${t.reference_script_hash}`,
            { headers: { project_id: this.projectId, lucid: Ue } },
          ).then((s) => s.json());
          if (r === "Native" || r === "native") {
            throw new Error("Native script ref not implemented!");
          }
          let { cbor: n } = await fetch(
            `${this.url}/scripts/${t.reference_script_hash}/cbor`,
            { headers: { project_id: this.projectId, lucid: Ue } },
          ).then((s) => s.json());
          return {
            type: r === "plutusV1" ? "PlutusV1" : "PlutusV2",
            script: De(n),
          };
        })(),
      })),
    );
  }
};
function uo(o) {
  let e = (t) => {
    if (isNaN(t.int)) {
      if (t.bytes || !isNaN(Number(t.bytes))) {
        return u.PlutusData.new_bytes(w(t.bytes));
      }
      if (t.map) {
        let r = u.PlutusMap.new();
        return t.map.forEach(({ k: n, v: s }) => {
          r.insert(e(n), e(s));
        }),
          u.PlutusData.new_map(r);
      } else if (t.list) {
        let r = u.PlutusList.new();
        return t.list.forEach((n) => {
          r.add(e(n));
        }),
          u.PlutusData.new_list(r);
      } else if (!isNaN(t.constructor)) {
        let r = u.PlutusList.new();
        return t.fields.forEach((n) => {
          r.add(e(n));
        }),
          u.PlutusData.new_constr_plutus_data(
            u.ConstrPlutusData.new(
              u.BigNum.from_str(t.constructor.toString()),
              r,
            ),
          );
      }
    } else return u.PlutusData.new_integer(u.BigInt.from_str(t.int.toString()));
    throw new Error("Unsupported type");
  };
  return k(e(o).to_bytes());
}
var Ue = $r.version;
var dn = class {
  constructor(e, t) {
    Object.defineProperty(this, "kupoUrl", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }),
      Object.defineProperty(this, "ogmiosUrl", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      this.kupoUrl = e,
      this.ogmiosUrl = t;
  }
  async getProtocolParameters() {
    let e = await this.ogmiosWsp("Query", {
      query: "currentProtocolParameters",
    });
    return new Promise((t, r) => {
      e.addEventListener("message", (n) => {
        try {
          let { result: s } = JSON.parse(n.data), i = {};
          Object.keys(s.costModels).forEach((p) => {
            let m = "Plutus" + p.split(":")[1].toUpperCase();
            i[m] = s.costModels[p];
          });
          let [a, c] = s.prices.memory.split("/"),
            [d, f] = s.prices.steps.split("/");
          t({
            minFeeA: parseInt(s.minFeeCoefficient),
            minFeeB: parseInt(s.minFeeConstant),
            maxTxSize: parseInt(s.maxTxSize),
            maxValSize: parseInt(s.maxValueSize),
            keyDeposit: BigInt(s.stakeKeyDeposit),
            poolDeposit: BigInt(s.poolDeposit),
            priceMem: parseInt(a) / parseInt(c),
            priceStep: parseInt(d) / parseInt(f),
            maxTxExMem: BigInt(s.maxExecutionUnitsPerTransaction.memory),
            maxTxExSteps: BigInt(s.maxExecutionUnitsPerTransaction.steps),
            coinsPerUtxoByte: BigInt(s.coinsPerUtxoByte),
            collateralPercentage: parseInt(s.collateralPercentage),
            maxCollateralInputs: parseInt(s.maxCollateralInputs),
            costModels: i,
          }), e.close();
        } catch (s) {
          r(s);
        }
      }, { once: !0 });
    });
  }
  async getUtxos(e) {
    let t = typeof e == "string",
      r = t ? e : e.hash,
      n = await fetch(`${this.kupoUrl}/matches/${r}${t ? "" : "/*"}?unspent`)
        .then((s) => s.json());
    return this.kupmiosUtxosToUtxos(n);
  }
  async getUtxosWithUnit(e, t) {
    let r = typeof e == "string",
      n = r ? e : e.hash,
      { policyId: s, assetName: i } = Cr(t),
      a = await fetch(
        `${this.kupoUrl}/matches/${n}${r ? "" : "/*"}?unspent&policy_id=${s}${
          i ? `&asset_name=${i}` : ""
        }`,
      ).then((c) => c.json());
    return this.kupmiosUtxosToUtxos(a);
  }
  async getUtxoByUnit(e) {
    let { policyId: t, assetName: r } = Cr(e),
      n = await fetch(
        `${this.kupoUrl}/matches/${t}.${r ? `${r}` : "*"}?unspent`,
      ).then((i) => i.json()),
      s = await this.kupmiosUtxosToUtxos(n);
    if (s.length > 1) {
      throw new Error("Unit needs to be an NFT or only held by one address.");
    }
    return s[0];
  }
  async getUtxosByOutRef(e) {
    let t = [...new Set(e.map((n) => n.txHash))];
    return (await Promise.all(t.map(async (n) => {
      let s = await fetch(`${this.kupoUrl}/matches/*@${n}?unspent`).then((i) =>
        i.json()
      );
      return this.kupmiosUtxosToUtxos(s);
    }))).reduce((n, s) => n.concat(s), []).filter((n) =>
      e.some((s) => n.txHash === s.txHash && n.outputIndex === s.outputIndex)
    );
  }
  async getDelegation(e) {
    let t = await this.ogmiosWsp("Query", {
      query: { delegationsAndRewards: [e] },
    });
    return new Promise((r, n) => {
      t.addEventListener("message", (s) => {
        try {
          let { result: i } = JSON.parse(s.data),
            a = i ? Object.values(i)[0] : {};
          r({ poolId: a?.delegate || null, rewards: BigInt(a?.rewards || 0) }),
            t.close();
        } catch (i) {
          n(i);
        }
      }, { once: !0 });
    });
  }
  async getDatum(e) {
    let t = await fetch(`${this.kupoUrl}/datums/${e}`).then((r) => r.json());
    if (!t || !t.datum) throw new Error(`No datum found for datum hash: ${e}`);
    return t.datum;
  }
  awaitTx(e, t = 3e3) {
    return new Promise((r) => {
      let n = setInterval(async () => {
        let s = await fetch(`${this.kupoUrl}/matches/*@${e}?unspent`).then(
          (i) => i.json(),
        );
        if (s && s.length > 0) {
          clearInterval(n), r(!0);
          return;
        }
      }, t);
    });
  }
  async submitTx(e) {
    let t = await this.ogmiosWsp("SubmitTx", { submit: e });
    return new Promise((r, n) => {
      t.addEventListener("message", (s) => {
        try {
          let { result: i } = JSON.parse(s.data);
          i.SubmitSuccess ? r(i.SubmitSuccess.txId) : n(i.SubmitFail),
            t.close();
        } catch (i) {
          n(i);
        }
      }, { once: !0 });
    });
  }
  kupmiosUtxosToUtxos(e) {
    return Promise.all(
      e.map(async (t) => ({
        txHash: t.transaction_id,
        outputIndex: parseInt(t.output_index),
        address: t.address,
        assets: (() => {
          let r = { lovelace: BigInt(t.value.coins) };
          return Object.keys(t.value.assets).forEach((n) => {
            r[n.replace(".", "")] = BigInt(t.value.assets[n]);
          }),
            r;
        })(),
        datumHash: t?.datum_type === "hash" ? t.datum_hash : null,
        datum: t?.datum_type === "inline"
          ? await this.getDatum(t.datum_hash)
          : null,
        scriptRef: t.script_hash && await (async () => {
          let { script: r, language: n } = await fetch(
            `${this.kupoUrl}/scripts/${t.script_hash}`,
          ).then((s) => s.json());
          if (n === "native") return { type: "Native", script: r };
          if (n === "plutus:v1") {
            return {
              type: "PlutusV1",
              script: k(u.PlutusScript.new(w(r)).to_bytes()),
            };
          }
          if (n === "plutus:v2") {
            return {
              type: "PlutusV2",
              script: k(u.PlutusScript.new(w(r)).to_bytes()),
            };
          }
        })(),
      })),
    );
  }
  async ogmiosWsp(e, t) {
    let r = new WebSocket(this.ogmiosUrl);
    return await new Promise((n) => {
      r.addEventListener("open", () => n(1), { once: !0 });
    }),
      r.send(
        JSON.stringify({
          type: "jsonwsp/request",
          version: "1.0",
          servicename: "ogmios",
          methodname: e,
          args: t,
        }),
      ),
      r;
  }
};
var R = {
    to: (o) => S.Data.to(R.lucid(o)),
    from: (o) => R.plutus(S.Data.from(o)),
    plutus: (o) => {
      if (typeof o == "string") return S.fromHex(o);
      if (typeof o == "bigint") return o;
      if (o instanceof Array) return o.map(R.plutus);
      if (o instanceof Map) {
        return new Map(
          [...o.entries()].map(([e, t]) => [R.plutus(e), R.plutus(t)]),
        );
      }
      if (o instanceof S.Constr) {
        return new S.Constr(o.index, o.fields.map(R.plutus));
      }
      throw new Error(`bytey: unknown data type ${o}`);
    },
    lucid: (o) => {
      if (o instanceof Uint8Array) {
        return S.toHex(o);
      }
      if (typeof o == "bigint") return o;
      if (o instanceof Array) return o.map(R.lucid);
      if (o instanceof Map) {
        return new Map(
          [...o.entries()].map(([e, t]) => [R.lucid(e), R.lucid(t)]),
        );
      }
      if (o instanceof S.Constr) {
        return new S.Constr(
          o.index,
          o.fields.map(R.lucid),
        );
      }
      throw new Error(`stringy: unknown data type ${o}`);
    },
  },
  E = "+  ",
  I = "   ";
var V = 9000n,
  It = V,
  hr = It / 2n,
  se = 3n,
  gs = 4n,
  Ur = 100000000n,
  co = "abcdefghijklmnopqrstuvwxyz";
var lo = .5,
  bs = class {
    constructor(e, t) {
      Object.defineProperty(this, "primitives", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "containers", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        });
    }
    generate(e) {
      return (e > 0
        ? te([...this.primitives, ...this.containers])
        : te(this.primitives))(this, ht(e - 1n, 0n));
    }
  };
function ht(o, e) {
  return o > e ? o : e;
}
function xe(o, e) {
  return o < e ? o : e;
}
function fn(o) {
  return o < 0n ? -o : o;
}
function te(o) {
  return Mr(o)[0];
}
function Mr(o) {
  l(o.length > 0, "randomIndexedChoice: alternatives.length <= 0");
  let e = Math.floor(Math.random() * o.length);
  return [o[e], e];
}
function pn(o) {
  let e = new Array();
  return o.forEach((t) => {
    Math.random() > lo && e.push(t);
  }),
    e;
}
function ys(o) {
  let e = pn(o);
  return e.length === 0 && e.push(te(o)), e;
}
function Hr(o, e = 0n, t) {
  l(e <= o.length, `minSizedSubset: ${e} > ${o.length}`);
  let r = [],
    n = [],
    s = t ? xe(t, BigInt(o.length)) : BigInt(o.length),
    i = e + Z(s - e);
  for (; r.length < i;) {
    let [a, c] = Mr(o);
    n.includes(c) || (r.push(a), n.push(c));
  }
  return r;
}
function be(o) {
  return te([o, void 0]);
}
function Z(o = V) {
  return l(o >= 0n, `genNonNegative: maxValue < 0: ${o}`),
    te([0n, BigInt(Math.floor(Math.random() * Number(o))), o]);
}
function ke(o = V) {
  return l(o >= 1n, `genPositive: maxValue < 1: ${o}`), 1n + Z(o - 1n);
}
function ws(o = V) {
  let e = Z(o);
  return te([e, -e]);
}
function xs(o, e, t, r) {
  l(e >= 0n, "genString: minBytes < 0"),
    l(It >= t, "genString: maxStringBytes < minBytes"),
    l(t >= e, "genString: maxBytes < minBytes");
  function n() {
    let c = Math.floor(Math.random() * (o.length + 10));
    return c < o.length
      ? o.charAt(c)
      : Math.floor(Math.random() * 10).toString();
  }
  let s = [], i = r * (e + Z(t - e));
  for (let c = 0n; c < i; c++) s.push(n());
  return s.join("");
}
function vs(o = 0n, e = hr) {
  return S.fromHex(xs("abcdef", o, e, 2n));
}
function Lr(o = 0n, e = It) {
  let t = co, r = t.toUpperCase(), n = t + r;
  return xs(n, o, e, 1n);
}
var z = class {
  constructor(e) {
    Object.defineProperty(this, "pfields", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "index", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: 0,
      }),
      Object.defineProperty(this, "setIndex", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => this.index = r,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          l(
            r instanceof S.Constr,
            `Record.plift: expected Constr, got ${r} (${typeof r})
for ${this.showPType()})`,
          ),
            l(
              r.index === this.index,
              `Record.plift: wrong index ${r.index} for ${this.showPType()}`,
            );
          let n = {}, s = 0;
          return Object.entries(this.pfields).forEach(([i, a]) => {
            if (a !== void 0) {
              l(
                s < r.fields.length,
                `Record.plift: too few elements at
key = ${i}
i = ${s}
pfield = ${a.showPType()}
in [${r}] of length ${r.fields.length}
for ${this.showPType()};
status: ${
                  Object.keys(n).join(`,
${E}`)
                }`,
              );
              let c = r.fields[s++];
              l(
                c !== void 0,
                `Record.plift: undefined value <${c}> at
key = ${i}
i = ${s}
pfield = ${a.showPType()}
in [${r}] of length ${r.fields.length}
for ${this.showPType()};
status: ${
                  Object.keys(n).join(`,
${E}`)
                }`,
              ), n[i] = a.plift(c);
            } else n[i] = void 0;
          }),
            l(
              s === r.fields.length,
              `Record.plift: too many elements (${r.fields.length}) for ${this.showPType()}`,
            ),
            n;
        },
      }),
      Object.defineProperty(this, "checkFields", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          l(
            r instanceof Object,
            `PRecord.checkFields: expected Object, got ${r}
for ${this.showPType()}`,
          );
          let n = Object.keys(this.pfields).join(`,
${E}`),
            s = Object.keys(r).join(`,
${E}`);
          l(
            n === s,
            `PRecord.checkFields: expected fields:
${E}${n},
got:
${E}${s}
for ${this.showPType()}
`,
          );
        },
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          this.checkFields(r);
          let n = new Array();
          return Object.entries(this.pfields).forEach(([s, i]) => {
            let a = r[s];
            i
              ? (l(
                a !== void 0,
                `cannot constant ${a} with pfield: ${i.showPType()}`,
              ),
                n.push(i.pconstant(a)))
              : l(a === void 0, `cannot constant ${a} with undefined pfield`);
          }),
            new S.Constr(this.index, n);
        },
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => {
          let r = {};
          return Object.entries(this.pfields).forEach(([n, s]) => {
            r[n] = s?.genData();
          }),
            r;
        },
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r, n = "", s) => {
          if (s !== void 0 && s <= 0n) return "Record { \u2026 }";
          if (this.checkFields(r), r.size === 0) return "Record {}";
          let i = n + I,
            a = i + E,
            c = a + I,
            d = Object.entries(r).map(([f, p]) => {
              let h = this.pfields[f];
              return h === void 0
                ? (l(
                  p === void 0,
                  `PRecord.showData: value ${p} for undefined pfield at key ${f}`,
                ),
                  `${f.length === 0 ? "_" : f}: undefined`)
                : (l(
                  p !== void 0,
                  `PRecord.showData: value undefined for pfield ${h.showPType()} at key ${f}`,
                ),
                  `${f.length === 0 ? "_" : f}: ${
                    h.showData(p, c, s && s - 1n)
                  }`);
            }).join(`,
${a}`);
          return `Record {
${a}index: ${this.index},
${a}fields: ${d}
${i}}`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r = "", n) => {
          if (n !== void 0 && n <= 0n) return "PRecord ( \u2026 )";
          let s = r + I,
            i = s + E,
            a = i + E,
            c = Object.entries(this.pfields).map(([d, f]) => `
${a}${d.length === 0 ? "_" : d}: ${
              f?.showPType(a, n && n - 1n) ?? "undefined"
            }`);
          return `PRecord (
${i}population: ${this.population},
${i}pfields: {${
            c.length > 0
              ? `${c.join(",")}
${i}`
              : ""
          }}
${s})`;
        },
      });
    let t = 1;
    Object.values(e).forEach((r) => {
      r && (t *= r.population);
    }),
      this.population = t,
      l(this.population > 0, `Population not positive in ${this.showPType()}`);
  }
  static genPType(e, t) {
    let r = {}, n = Z(se);
    for (let s = 0; s < n; s++) {
      let i = Lr(), a = be(() => e.generate(t))?.();
      r[i] = a;
    }
    return new z(r);
  }
};
var de = class {
  constructor() {
    Object.defineProperty(this, "population", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: Number(V) * 2 + 1,
    }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (l(
          typeof e == "bigint",
          `.PInteger.plift: expected Integer, got ${e} (${typeof e})`,
        ),
          e),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (l(
          typeof e == "bigint",
          `PInteger.pconstant: expected Integer, got ${e} (${typeof e})`,
        ),
          e),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => ws(),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (l(
          typeof e == "bigint",
          `PInteger.showData: expected Integer, got ${e} (${typeof e})`,
        ),
          `Integer: ${e}`),
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => "PInteger",
      });
  }
  static genPType() {
    return de.ptype;
  }
};
Object.defineProperty(de, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new de(),
});
var ae = class {
  constructor(e = 0n, t = hr) {
    Object.defineProperty(this, "minBytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "maxBytes", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          r instanceof Uint8Array,
          `PByteString.plift: expected Uint8Array, got ${r} (${typeof r})`,
        ),
          r),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          r instanceof Uint8Array,
          `PByteString.pconstant: expected Uint8Array, got ${r} (${typeof r})`,
        ),
          new Uint8Array(r)),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => vs(this.minBytes, this.maxBytes),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          r instanceof Uint8Array,
          `PByteString.showData: expected Uint8Array, got ${r} (${typeof r})`,
        ),
          `ByteString: ${r}`),
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => "PByteString",
      }),
      l(e >= 0n, `PByteString: minBytes must be non-negative, got ${e}`),
      l(
        t >= e,
        `PByteString: maxBytes must be greater than or equal to minBytes, got ${t} < ${e}`,
      ),
      this.population = t ? 1 / 0 : 1;
  }
  static genPType() {
    let e = be(Z)?.(hr), t = be(() => (e ?? 0n) + Z(hr - (e ?? 0n)))?.();
    return new ae(e, t);
  }
};
Object.defineProperty(ae, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new ae(),
});
var mr = (o) =>
    Object.fromEntries(
      Object.entries(o).filter(([e, t]) => typeof t != "function"),
    ),
  W = class {
    constructor(e, t) {
      Object.defineProperty(this, "precord", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "O", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "population", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "setIndex", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => this.precord.setIndex(r),
        }),
        Object.defineProperty(this, "plift", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            l(r instanceof S.Constr, "plift: expected Constr");
            let n = this.precord.plift(r), s = Object.values(n);
            return new this.O(...s);
          },
        }),
        Object.defineProperty(this, "pconstant", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            let n = mr(r);
            return this.precord.pconstant(n);
          },
        }),
        Object.defineProperty(this, "genData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            let r = this.precord.genData();
            try {
              return new this.O(...Object.values(r));
            } catch (n) {
              throw new Error(
                `Error in genData for ${this.precord.showData(r)}: ${n}`,
              );
            }
          },
        }),
        Object.defineProperty(this, "showData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r, n = "", s) => {
            if (s !== void 0 && s <= 0n) return "Object ( \u2026 )";
            let i = n + I,
              a = i + E,
              c = this.precord.showData(mr(r), a, s && s - 1n);
            return `Object: ${this.O.name} (
${a}${c}
${i})`;
          },
        }),
        Object.defineProperty(this, "showPType", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r = "", n) => {
            if (n !== void 0 && n <= 0n) return "PObject ( \u2026 )";
            let s = r + I, i = s + E;
            return `PObject (
${i}population: ${this.population},
${i}precord: ${this.precord.showPType(i, n && n - 1n)},
${i}O: ${this.O.name}
${s})`;
          },
        }),
        this.population = e.population,
        l(
          this.population > 0,
          `Population not positive in ${this.showPType()}`,
        );
    }
    static genPType(e, t) {
      let r = new z({ s: ae.genPType(), i: de.genPType() });
      return new W(r, hn);
    }
  },
  hn = class {
    constructor(e, t) {
      Object.defineProperty(this, "s", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "i", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => `ExampleClass (${this.s}, ${this.i})`,
        });
    }
  };
var oe = class {
    constructor(e, t) {
      Object.defineProperty(this, "pinner", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "O", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "population", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "plift", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            let n = this.pinner.plift(r);
            return new this.O(n);
          },
        }),
        Object.defineProperty(this, "pconstant", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            let n = mr(r), s = Object.values(n);
            return l(s.length === 1, "pconstant: expected one value"),
              this.pinner.pconstant(s[0]);
          },
        }),
        Object.defineProperty(this, "genData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            let r = this.pinner.genData();
            return new this.O(r);
          },
        }),
        Object.defineProperty(this, "showData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r, n = "", s) => {
            if (s !== void 0 && s <= 0n) return "Wrapped ( \u2026 )";
            let i = n + I, a = i + E, c = mr(r), d = Object.values(c);
            return l(d.length === 1, "showData: expected one value"),
              `Wrapped: ${this.O.name} (
${a}${this.pinner.showData(d[0], a, s && s - 1n)}
${i})`;
          },
        }),
        Object.defineProperty(this, "showPType", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r = "", n) => {
            if (n !== void 0 && n <= 0n) return "PObject: PWrapped ( \u2026 )";
            let s = r + I, i = s + E;
            return `PObject: PWrapped (
${i}population: ${this.population},
${i}pinner: ${this.pinner.showPType(i, n && n - 1n)},
${i}O: ${this.O.name}
${s})`;
          },
        }),
        this.population = e.population,
        l(
          this.population > 0,
          `Population not positive in ${this.showPType()}`,
        );
    }
    static genPType(e, t) {
      let r = e.generate(t);
      return new oe(r, mn);
    }
  },
  mn = class {
    constructor(e) {
      Object.defineProperty(this, "inner", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => `WrapperClass (${this.inner})`,
        });
    }
  };
var J = class {
  constructor(e) {
    Object.defineProperty(this, "symbol", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "toString", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => S.toHex(this.symbol),
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `Currency(${this.toString()})`,
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => this.symbol.length === 0 ? "ADA" : this.toString(),
      }),
      Object.defineProperty(this, "valueOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: this.show,
      }),
      Object.defineProperty(this, "toLucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => S.toHex(this.symbol),
      });
  }
  static fromLucid(e) {
    return new J(S.fromHex(e));
  }
};
Object.defineProperty(J, "fromHex", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => new J(S.fromHex(o)),
});
Object.defineProperty(J, "numBytes", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 28n,
});
Object.defineProperty(J, "ADA", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new J(new Uint8Array(0)),
});
Object.defineProperty(J, "dummy", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new J(S.fromHex("cc")),
});
var ge = class extends oe {
  constructor() {
    super(new ae(J.numBytes, J.numBytes), J);
  }
  static genPType() {
    return ge.ptype;
  }
};
Object.defineProperty(ge, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new ge(),
});
var st = class {
    constructor(e) {
      Object.defineProperty(this, "pconstrs", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "population", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "plift", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => (l(t instanceof S.Constr, "plift: expected Constr"),
            l(
              t.index < this.pconstrs.length,
              "plift: constr index out of bounds",
            ),
            this.pconstrs[Number(t.index)].plift(t)),
        }),
        Object.defineProperty(this, "matchData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            l(t instanceof Object, "PSum.matchData: expected Object");
            let r = new Array();
            return this.pconstrs.forEach((n, s) => {
              t instanceof n.O && r.push(n);
            }),
              l(
                r.length === 1,
                `PSum.pconstant: expected exactly one match, got ${r.length}: ${
                  r.map((n) => n.O.name)
                }`,
              ),
              r[0];
          },
        }),
        Object.defineProperty(this, "pconstant", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.matchData(t).pconstant(t),
        }),
        Object.defineProperty(this, "genData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => te(this.pconstrs).genData(),
        }),
        Object.defineProperty(this, "showData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r = "", n) => {
            if (n !== void 0 && n <= 0n) return "Sum ( \u2026 )";
            let s = r + I, i = s + E;
            return `Sum (
${i}${this.matchData(t).showData(t, i, n && n - 1n)}
${s})`;
          },
        }),
        l(e.length > 0, "PSum: expected at least one PObject"),
        l(
          e.every((t) => t instanceof W),
          "PSum: expected all pconstrs to be PObjects",
        ),
        this.population = e.reduce((t, r) => t + r.population, 0),
        e.forEach((t, r) => {
          t.setIndex(r);
        });
    }
    showPType(e = "", t) {
      if (t !== void 0 && t <= 0n) return "PSum ( \u2026 )";
      let r = e + I, n = r + E;
      return `PSum (
${n}${
        this.pconstrs.map((s) => s.showPType(n, t && t - 1n)).join(`,
`)
      }
${r})`;
    }
    static genPType() {
      let e = [fo, po, ho, mo], t = ke(BigInt(e.length)), r = Hr(e, t);
      return new st(r);
    }
  },
  bn = class {
    constructor(e, t) {
      Object.defineProperty(this, "s", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "i", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        });
    }
  },
  gn = class {
    constructor(e, t) {
      Object.defineProperty(this, "i", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "s", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        });
    }
  },
  yn = class {
    constructor(e) {
      Object.defineProperty(this, "i", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  wn = class {
    constructor(e) {
      Object.defineProperty(this, "s", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  fo = new W(new z({ s: ae.genPType(), i: de.genPType() }), bn),
  po = new W(new z({ i: de.genPType(), s: ae.genPType() }), gn),
  ho = new W(new z({ i: de.genPType() }), yn),
  mo = new W(new z({ s: ae.genPType() }), wn);
var re = class {
  constructor(e) {
    Object.defineProperty(this, "bytes", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "hash", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t = 1n) => {
          let r = this.bytes;
          for (let n = 0n; n < t; n++) r = S.sha256(r);
          return new re(r);
        },
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `Hash: ${this.toString()}`,
      }),
      Object.defineProperty(this, "toString", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => S.toHex(this.bytes),
      }),
      Object.defineProperty(this, "toLucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => S.toHex(this.bytes),
      }),
      l(
        e.length === Number(re.numBytes),
        `hash must be ${re.numBytes} bytes, got ${e.length}`,
      );
  }
  static fromLucid(e) {
    try {
      return re.fromString(e);
    } catch (t) {
      throw new Error(`Token.fromLucid ${e}:
${t}`);
    }
  }
  static fromString(e) {
    try {
      return new re(S.fromHex(e));
    } catch (t) {
      throw new Error(`Hash.fromString ${e}:
${t}`);
    }
  }
};
Object.defineProperty(re, "numBytes", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 32n,
});
Object.defineProperty(re, "dummy", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new re(new Uint8Array(Number(re.numBytes))),
});
var mt = class extends oe {
  constructor() {
    super(new ae(re.numBytes, re.numBytes), re);
  }
  static genPType() {
    return mt.ptype;
  }
};
Object.defineProperty(mt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new mt(),
});
var Me = class {
  constructor(e) {
    Object.defineProperty(this, "keyHash", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "hash", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => new re(S.sha256(this.keyHash)),
      }),
      Object.defineProperty(this, "toString", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => S.toHex(this.keyHash),
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `KeyHash: ${this.toString()}`,
      }),
      l(
        e.length === Number(Me.numBytes),
        `keyHash must be ${re.numBytes} bytes, got ${e.length}`,
      );
  }
  static fromCredential(e) {
    return new Me(S.fromHex(e.hash));
  }
};
Object.defineProperty(Me, "numBytes", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 28n,
});
var ve = class extends oe {
  constructor() {
    super(new ae(Me.numBytes, Me.numBytes), Me);
  }
  static genPType() {
    return ve.ptype;
  }
};
Object.defineProperty(ve, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new ve(),
});
var bt = class {
  constructor(e = 0n, t = It) {
    Object.defineProperty(this, "minLength", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "maxLength", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          l(
            r instanceof Uint8Array,
            `PString.plift: expected Uint8Array, got ${r} (${typeof r})`,
          );
          let n = S.toText(S.toHex(r));
          return l(
            n.length >= this.minLength,
            `PString.plift: data too short: ${n}`,
          ),
            l(n.length <= this.maxLength, `PString.plift: data too long: ${n}`),
            n;
        },
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          typeof r == "string",
          `PString.pconstant: expected string, got ${r} (${typeof r})`,
        ),
          l(
            r.length >= this.minLength,
            `PString.pconstant: data too short: ${r}`,
          ),
          l(
            r.length <= this.maxLength,
            `PString.pconstant: data too long: ${r}`,
          ),
          S.fromHex(S.fromText(r.toString()))),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => Lr(this.minLength, this.maxLength),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          typeof r == "string",
          `PString.showData: expected String, got ${r} (${typeof r})`,
        ),
          `PString: ${r}`),
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => "PString",
      }),
      l(e >= 0n, `PString: minLength must be non-negative, got ${e}`),
      l(
        t >= e,
        `PString: maxLength must be greater than or equal to minLength, got ${t} < ${e}`,
      ),
      this.population = t ? 1 / 0 : 1;
  }
  static genPType() {
    let e = be(Z)?.(It), t = be(() => (e ?? 0n) + Z(It - (e ?? 0n)))?.();
    return new bt(e, t);
  }
};
Object.defineProperty(bt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new bt(),
});
var Oe = class {
  constructor(e) {
    Object.defineProperty(this, "name", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `Token(${this.name})`,
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => this.name,
      }),
      Object.defineProperty(this, "valueOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: this.show,
      }),
      Object.defineProperty(this, "toLucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => S.fromText(this.name),
      }),
      l(e.length <= Oe.maxLength, `Token too long: ${e}, ${e.length}`);
  }
  static fromLucid(e) {
    try {
      return new Oe(S.toText(e));
    } catch (t) {
      throw new Error(`Token.fromLucid ${e}:
${t}`);
    }
  }
};
Object.defineProperty(Oe, "maxLength", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 32n,
});
Object.defineProperty(Oe, "lovelace", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Oe(""),
});
var je = class extends oe {
  constructor() {
    super(new bt(0n, Oe.maxLength), Oe);
  }
  static genPType() {
    return je.ptype;
  }
};
Object.defineProperty(je, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new je(),
});
var H = class {
  constructor(e, t) {
    Object.defineProperty(this, "currency", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "token", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "equals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) =>
          this.currency.symbol === r.currency.symbol &&
          this.token.name === r.token.name,
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `Asset(${this.currency.toString()}, ${this.token.name})`,
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `${this.currency.concise()}.${this.token.concise()}`,
      }),
      Object.defineProperty(this, "toLucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () =>
          this.currency.symbol.length === 0
            ? "lovelace"
            : S.toUnit(this.currency.toLucid(), this.token.toLucid()),
      }),
      Object.defineProperty(this, "toLucidWith", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => ({ [this.toLucid()]: r }),
      }),
      H.assertADAlovelace(this);
  }
  static fromLucid(e) {
    try {
      if (e === "lovelace") return H.ADA;
      {
        let t = S.fromUnit(e);
        return new H(J.fromLucid(t.policyId), Oe.fromLucid(t.assetName ?? ""));
      }
    } catch (t) {
      throw new Error(`Asset.fromLucid ${e}:
${t}`);
    }
  }
  static assertADAlovelace(e) {
    S.toHex(e.currency.symbol) === "" &&
      l(e.token.name === "", `ADA must have lovelace, got ${e.show()}`);
  }
  static generate() {
    return te([() => H.ADA, H.generateNonADA])();
  }
};
Object.defineProperty(H, "ADA", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new H(J.ADA, Oe.lovelace),
});
Object.defineProperty(H, "generateNonADA", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: () => {
    let o = ge.ptype.genData(), e = je.ptype.genData();
    return new H(o, e);
  },
});
var He = class extends W {
  constructor() {
    super(new z({ currency: ge.ptype, token: je.ptype }), H),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: H.generate,
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (l(
          e instanceof H,
          `PAsset.showData: expected Asset, got ${e}`,
        ),
          e.show()),
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => "PObject: PAsset",
      });
  }
  static genPType() {
    return He.ptype;
  }
};
Object.defineProperty(He, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new He(),
});
var Ye = class {
  constructor(e, t, r, n) {
    Object.defineProperty(this, "pinner", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "asserts", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "genInnerData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: r,
      }),
      Object.defineProperty(this, "details", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n,
      }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s) => {
          let i = this.pinner.plift(s);
          return this.asserts.forEach((a) => {
            a(i);
          }),
            i;
        },
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s) => (this.asserts.forEach((i) => {
          try {
            i(s);
          } catch (a) {
            throw new Error(
              `Assertion failed in pconstant: ${a.message} of ${this.showPType()}`,
            );
          }
        }),
          this.pinner.pconstant(s)),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => this.genInnerData(),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s, i = "", a) => {
          if (a !== void 0 && a <= 0n) return "Constraint ( \u2026 )";
          let c = i + I, d = c + E;
          return `Constraint (
${d}${this.pinner.showData(s, d, a && a - 1n)}
${c})`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s = "", i) => {
          if (i !== void 0 && i <= 0n) return "PConstraint ( \u2026 )";
          let a = s + I,
            c = a + E,
            d = `[

      ${c}` + this.asserts.map((f) => `(${f.toString()})`).join(`,
${c}`) + `

    ${c}]`;
          return `PConstraint (${
            this.details
              ? `
${c}details: ${this.details}`
              : ""
          }
${c}population: ${this.population},
${c}pinner: ${this.pinner.showPType(c, i && i - 1n)},
${a})`;
        },
      }),
      this.population = e.population,
      l(this.population > 0, `Population not positive in ${this.showPType()}`);
  }
  static genPType(e, t) {
    let r = e.generate(t), n = r.genData;
    return new Ye(r, [], n);
  }
};
var ec = (o, e) => o === e && o === V || o === -V,
  Se = class extends Ye {
    constructor(e = -V, t = V) {
      l(e <= t, `PBounded: ${e} > ${t}`),
        super(Se.pinner, [bo(e, t)], br(e, t), `PBounded(${e}, ${t})`),
        Object.defineProperty(this, "lowerBound", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: e,
        }),
        Object.defineProperty(this, "upperBound", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        this.population = Number(t - e) + 1;
    }
    static genPType() {
      return xn();
    }
  };
Object.defineProperty(Se, "pinner", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new de(),
});
var xn = (o = -V) => {
    l(o >= -V, `${o} < -maxInteger`), l(o < V, `${o} >= maxInteger`);
    let e = br(o, V)(), t = br(e, V)();
    return new Se(e, t);
  },
  br = (o, e) =>
    o === e
      ? () => o
      : (l(o <= e, `newGenInRange: ${o} > ${e}`), () => o + Z(e - o)),
  bo = (o, e) => (t) => {
    l(!o || o <= t, `too small: ${t} < ${o} by ${o - t}`),
      l(!e || t <= e, `too big: ${t} > ${e} by ${t - e}`);
  };
var fe = class extends Se {
  constructor(e = 1n, t = V) {
    l(!e || e > 0n, `PPositive: ${e} <= 0`),
      super(e, t),
      Object.defineProperty(this, "lowerBound", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
      Object.defineProperty(this, "upperBound", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      });
  }
  static genPType() {
    return xn(1n);
  }
};
var Rr = 5n;
function cc(o, e) {
  let t = new Map(), r = new Map(), n = new Map(), s = new Map();
  for (let a = 0; a < e; a++) {
    let c = t.size + r.size + n.size + s.size;
    console.log(`${a}` + (c ? ` (${c} errors)` : ""));
    try {
      let d = o.generate(gs), f = d.genData(), p = d.pconstant(f);
      xo(d, t), go(p, r), yo(p, f, d, n);
    } catch (d) {
      zr(d, s);
    }
  }
  let i = e;
  i -= Fr(t, "Population errors"),
    i -= Fr(r, "Data parsing errors"),
    i -= Fr(n, "PType parsing errors"),
    i -= Fr(s, "other errors"),
    console.log(i + " x correct"),
    Qt(i, e);
}
function go(o, e) {
  try {
    Qt(o, R.from(R.to(o)));
  } catch (t) {
    zr(t, e);
  }
}
function yo(o, e, t, r) {
  try {
    let n = t.plift(o);
    if (t.showPType().includes("PObject")) Qt(t.showData(e), t.showData(n));
    else {try {
        Qt(e, n);
      } catch (s) {
        throw new Error(
          t.showPType() + `
` + s.message,
        );
      }}
  } catch (n) {
    zr(n, r);
  }
}
function zr(o, e) {
  let t = [o.stack].join(`
`),
    r = e.get(t);
  e.set(t, r ? r + 1 : 1);
}
function Fr(o, e) {
  let t = 0;
  return o.forEach((r, n) => {
    console.error(`
${r} x ${n}`), t += r;
  }),
    console.log(
      t
        ? `${e} ==> total: ${o.size} (${t})
`
        : `==> no ${e}
`,
    ),
    t;
}
function wo(o, e) {
  let t = [], r = 0;
  try {
    for (
      l(o.population > 0, "population must be positive");
      t.length < o.population;
    ) {
      let n = o.genData(), s = o.showData(n);
      if (!t.includes(s)) r = 0, t.push(s);
      else if (++r > 1e4) {
        throw new Error(
          `could only achive population size ${t.length} for ${
            o.showPType(void 0, Rr)
          }${
            t.length < 20
              ? `:
` + t.join(", ")
              : ""
          }`,
        );
      }
    }
  } catch (n) {
    zr(n, e);
  }
}
function xo(o, e) {
  o.population > 20 || wo(o, e);
}
var Xe = class {
  constructor(e, t) {
    Object.defineProperty(this, "pelem", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "length", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (
          r,
        ) => (l(r instanceof Array, `List.plift: expected List: ${r}`),
          l(
            !this.length || this.length === BigInt(r.length),
            `plift: wrong length - ${this.length} vs. ${r.length}`,
          ),
          r.map((s) => this.pelem.plift(s))),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(r instanceof Array, "pconstant: expected Array"),
          l(
            !this.length || this.length === BigInt(r.length),
            "pconstant: wrong length",
          ),
          r.map(this.pelem.pconstant)),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => {
          let r = this.length ? this.length : Z(se);
          return Xe.genList(this.pelem.genData, r);
        },
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r, n = "", s) => {
          if (s !== void 0 && s <= 0n) return "List [ \u2026 ]";
          l(r instanceof Array, `PList.showData: expected Array, got ${r}`);
          let i = n + I, a = i + E;
          return `List [
${
            r.map((c) => `${a}${this.pelem.showData(c, a, s && s - 1n)}`).join(
              `,
`,
            )
          }
${i}]`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r = "", n) => {
          if (n !== void 0 && n <= 0n) return "PList ( \u2026 )";
          let s = r + I, i = s + E;
          return `PList (
${i}population: ${this.population},
${i}pelem: ${this.pelem.showPType(i, n && n - 1n)},
${i}length?: ${this.length}
${s})`;
        },
      }),
      l(!t || t >= 0, "negative length"),
      !t || t === 0n
        ? this.population = 1
        : this.population = e.population ** Number(t),
      l(this.population > 0, `Population not positive in ${this.showPType()}`);
  }
  static genList(e, t) {
    let r = new Array();
    for (let n = 0; n < t; n++) r.push(e());
    return r;
  }
  static genPType(e, t) {
    let r = be(Z(se)), n = e.generate(t);
    return new Xe(n, r);
  }
};
function vo(o, e, t) {
  let r = 1, n = o;
  for (let s = 0; s < t; s++) r *= e * n--;
  return r;
}
var q = class {
    constructor(e) {
      Object.defineProperty(this, "showKey", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "inner", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: new Map(),
        }),
        Object.defineProperty(this, "set", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            this.inner.set(this.showKey(t), [t, r]);
          },
        }),
        Object.defineProperty(this, "get", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.inner.get(this.showKey(t))?.[1],
        }),
        Object.defineProperty(this, "has", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.inner.has(this.showKey(t)),
        }),
        Object.defineProperty(this, "delete", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.inner.delete(this.showKey(t)),
        }),
        Object.defineProperty(this, "clear", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            this.inner.clear();
          },
        }),
        Object.defineProperty(this, "forEach", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            for (let [n, s] of this) t.call(r, s, n, this);
          },
        }),
        Object.defineProperty(this, "map", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = new q(this.showKey);
            for (let [n, s] of this) {
              let i = t(s);
              i && r.set(n, i);
            }
            return r;
          },
        }),
        Object.defineProperty(this, "zipWith", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            let n = new q(this.showKey);
            for (let [s, i] of this) {
              let a = t.get(s);
              a && n.set(s, r(i, a));
            }
            return n;
          },
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r = "") => {
            let n = I + r, s = n + E;
            return `AssocMap {
      ${
              [...this.inner.values()].map(([i, a]) =>
                `${s}${this.showKey(i, s)} => ${t(a, s)}`
              ).join(`,
`)
            }
      ${n}}`;
          },
        });
    }
    get size() {
      return this.inner.size;
    }
    get anew() {
      return new q(this.showKey);
    }
    get last() {
      if (this.size === 0) return;
      let e = [...this.keys()];
      if (e) return this.get(e[e.length - 1]);
    }
    *keys() {
      for (let [e, t] of this.inner) yield t[0];
    }
    *values() {
      for (let [e, t] of this.inner) yield t[1];
    }
    *entries() {
      for (let [e, t] of this.inner) yield t;
    }
    *[Symbol.iterator]() {
      yield* this.entries();
    }
  },
  $e = class {
    constructor(e, t, r, n, s) {
      if (
        Object.defineProperty(this, "pkey", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: e,
        }),
          Object.defineProperty(this, "pvalue", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: t,
          }),
          Object.defineProperty(this, "size", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: r,
          }),
          Object.defineProperty(this, "keys", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: n,
          }),
          Object.defineProperty(this, "dataKeys", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: s,
          }),
          Object.defineProperty(this, "population", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "plift", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i) => {
              l(i instanceof Map, "plift: expected Map"),
                l(
                  !this.size || this.size === BigInt(i.size),
                  "plift: wrong size",
                );
              let a = new q(this.pkey.showData), c = 0;
              return i.forEach((d, f) => {
                let p = this.pkey.plift(f);
                l(
                  !this.dataKeys || R.to(this.dataKeys[c++]) === R.to(f),
                  `PMap.pconstant: wrong key of ptype
        ${this.pkey.showPType("", Rr)}
        : ${f.toString()}`,
                ), a.set(p, this.pvalue.plift(d));
              }),
                a;
            },
          }),
          Object.defineProperty(this, "pconstant", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i) => {
              l(i instanceof q, "AssocMap.pconstant: expected AssocMap"),
                l(
                  !this.size || this.size === BigInt(i.size),
                  `AssocMap.pconstant: wrong size: ${this.size} vs. ${i.size} of ${
                    this.showData(i, "", Rr)
                  }`,
                );
              let a = new Map(), c = 0;
              return i.forEach((d, f) => {
                let p = this.pkey.pconstant(f);
                l(
                  !this.dataKeys || R.to(this.dataKeys[c++]) === R.to(p),
                  "PMap.plift: wrong key",
                ), a.set(p, this.pvalue.pconstant(d));
              }),
                a;
            },
          }),
          Object.defineProperty(this, "genData", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: () => {
              if (this.keys) {
                let i = new q(this.pkey.showData);
                return this.keys.forEach((a) => {
                  i.set(a, this.pvalue.genData());
                }),
                  i;
              } else {
                let i = this.size
                  ? this.size
                  : Z(BigInt(Math.min(Number(se), this.pkey.population)));
                return $e.genMap(this.pkey, this.pvalue, i);
              }
            },
          }),
          Object.defineProperty(this, "showData", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i, a = "", c) => {
              if (c !== void 0 && c <= 0n) return "AssocMap { \u2026 }";
              l(i instanceof q, `PMap.showData: expected AssocMap, got ${i}`);
              let d = a + I, f = d + E;
              return `AssocMap {
${
                [...i.entries()].map(([p, h]) =>
                  `${f}${this.pkey.showData(p, f, c && c - 1n)} => ${
                    this.pvalue.showData(h, f, c && c - 1n)
                  }`
                ).join(`,
`)
              }
${d}}`;
            },
          }),
          Object.defineProperty(this, "showPType", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i = "", a) => {
              if (a !== void 0 && a <= 0n) return "PMap ( \u2026 )";
              let c = i + I,
                d = c + E,
                f = d + I,
                p = this.keys
                  ? new Xe(this.pkey).showData(this.keys, f)
                  : "undefined";
              return `PMap (
${d}population: ${this.population},
${d}pkey: ${this.pkey.showPType(d, a && a - 1n)},
${d}pvalue: ${this.pvalue.showPType(d, a && a - 1n)},
${d}size?: ${this.size},
${d}keys?: ${p}
${c})`;
            },
          }),
          n
      ) {
        this.dataKeys = n.map((a) => e.pconstant(a));
        let i = BigInt(n.length);
        r ? l(i === r, "PMap: wrong size") : this.size = i,
          this.population = t.population ** n.length;
      } else {r
          ? (l(
            Number(r) <= e.population,
            `PMap: not enough keys for size ${r} in
${e.showPType()}`,
          ),
            this.population = vo(e.population, t.population, r))
          : this.population = 1;}
      l(this.population > 0, `Population not positive in ${this.showPType()}`);
    }
    static genKeys(e, t) {
      let r = se + 100n;
      function n() {
        let c = e.genData(), d = e.showData(c);
        if (!i.has(d)) i.set(d, 1), s.push(c);
        else if (i.set(d, i.get(d) + 1), r-- < 0n) {
          throw new Error(`Map.genKeys: timeout with
${I}size: ${Number(t)},
${I}keyStrings: ${
            [...i.entries()].map(([f, p]) => `${p} x ${f}`).join(`,
${I + E}`)
          },
${I}pkey: ${e.showPType(I)}`);
        }
      }
      let s = new Array(), i = new Map(), a = e.population;
      if (t) {
        for (
          l(t <= a, `PMap.genKeys: size too big: ${Number(t)} vs. ${a}`);
          s.length < t;
        ) n();
      } else {
        let c = Z(BigInt(Math.min(Number(se), a)));
        for (let d = 0; d < c; d++) n();
      }
      return s;
    }
    static genMap(e, t, r) {
      l(
        Number(r) <= e.population,
        `PMap: not enough keys for size ${Number(r)} in ${e.showPType()}`,
      );
      let n = new q(e.showData);
      return $e.genKeys(e, r).forEach((i) => {
        n.set(i, t.genData());
      }),
        n;
    }
    static genPType(e, t) {
      let r = e.generate(t - 1n),
        n = e.generate(t - 1n),
        s = be(() => $e.genKeys(r))?.(),
        i = be(
          BigInt(s?.length ?? Z(BigInt(Math.min(Number(se), r.population)))),
        );
      return new $e(r, n, i, s);
    }
  };
var Rt = class extends Ye {
  constructor(e, t) {
    l(!t || t > 0, "empty list"),
      super(new Xe(e, t), [Po], () => Xe.genList(e.genData, t ?? ke(se)));
  }
  static genPType(e, t) {
    let r = be(ke(se)), n = e.generate(t);
    return new Rt(n, r);
  }
};
function Po(o) {
  l(o.length > 0, "encountered empty List");
}
var gr = new q((o) => o.show()),
  _o = new Rt(je.ptype),
  K = class {
    constructor(e = gr.anew) {
      Object.defineProperty(this, "assets", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t = "") => {
            let r = t + I + E, n = r + E, s = ["Assets:"];
            for (let [i, a] of this.assets) {
              let c = i.toString();
              s.push(`${r}${c === "" ? "ADA" : c}:`);
              let d = [];
              for (let f of a) {
                d.push(
                  `${n}${f.name === "" ? c === "" ? "lovelace" : "_" : f.name}`,
                );
              }
              s.push(d.join(`,
`));
            }
            return s.join(`
`);
          },
        }),
        Object.defineProperty(this, "equals", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.subsetOf(t) && t.subsetOf(this),
        }),
        Object.defineProperty(this, "insert", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let { currency: r, token: n } = t, s = this.assets.get(r) ?? [];
            l(
              !s.some((i) => i.name === n.name),
              `${t} already in ${this.show()}`,
            ),
              s.push(n),
              this.assets.set(r, s);
          },
        }),
        Object.defineProperty(this, "add", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = this.clone;
            return r.insert(t), r;
          },
        }),
        Object.defineProperty(this, "drop", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let { currency: r, token: n } = t, s = this.assets.get(r);
            l(s !== void 0, `${t.show()} not in ${this.show()}`);
            let i = s.findIndex((a) => a.name === n.name);
            return l(i >= 0, `${t.show()} not in ${this.show()}`),
              s.splice(i, 1),
              s.length === 0 && this.assets.delete(r),
              this;
          },
        }),
        Object.defineProperty(this, "head", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            l(this.assets.size > 0, "empty assets have no head");
            let t = [...this.assets.keys()].sort()[0],
              r = this.assets.get(t).slice(0).sort()[0];
            return new H(t, r);
          },
        }),
        Object.defineProperty(this, "tail", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            l(this.assets.size > 0, "empty assets tell no tails");
            let t = this.assets.anew, r = !0;
            for (let s of [...this.assets.keys()].sort()) {
              let i = this.assets.get(s).slice(0).sort();
              if (r) {
                if (l(i.length > 0, "empty token map"), i.length > 1) {
                  let a = i.slice(1);
                  t.set(s, a);
                }
                r = !1;
              } else t.set(s, i);
            }
            let n = new K(t);
            return l(n.add(this.head()).equals(this), "tail is not tail"), n;
          },
        }),
        Object.defineProperty(this, "randomChoice", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            let t = te([...this.assets.keys()]), r = te(this.assets.get(t));
            return new H(t, r);
          },
        }),
        Object.defineProperty(this, "randomSubset", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            let t = new K(), r = pn([...this.assets.keys()]);
            for (let n of r) {
              let s = ys(this.assets.get(n));
              t.assets.set(n, s);
            }
            return t;
          },
        }),
        Object.defineProperty(this, "boundedSubset", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => K.fromList(Hr(this.toList, t, r)),
        }),
        Object.defineProperty(this, "has", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let { currency: r, token: n } = t, s = this.assets.get(r);
            return s !== void 0 && s.some((i) => i.name === n.name);
          },
        }),
        Object.defineProperty(this, "subsetOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            for (let [r, n] of this.assets) {
              let s = t.toMap.get(r);
              if (s === void 0) return !1;
              for (let i of n) if (!s.some((a) => i.name === a.name)) return !1;
            }
            return !0;
          },
        }),
        Object.defineProperty(this, "forEach", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.toList.forEach(t),
        }),
        Object.defineProperty(this, "intersect", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = this.assets.anew, n = t.toMap;
            for (let [s, i] of this.assets) {
              let a = n.get(s);
              if (a) {
                let c = i.filter((d) => a.some((f) => f.name === d.name));
                c.length > 0 && r.set(s, c);
              }
            }
            return new K(r);
          },
        }),
        Object.defineProperty(this, "union", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = this.assets.anew, n = t.toMap;
            for (let [s, i] of this.assets) {
              let a = n.get(s);
              if (a) {
                let c = i.concat(
                  a.filter((d) => !i.some((f) => f.name === d.name)),
                );
                r.set(s, c);
              } else r.set(s, i);
            }
            for (let [s, i] of n) this.assets.has(s) || r.set(s, i);
            return new K(r);
          },
        }),
        Object.defineProperty(this, "toLucidWith", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = {};
            return this.forEach((n) => r[n.toLucid()] = t), r;
          },
        }),
        K.assert(this);
    }
    get clone() {
      let e = new K();
      for (let [t, r] of this.assets) e.assets.set(t, r.slice());
      return e;
    }
    get toMap() {
      let e = gr.anew;
      for (let [t, r] of this.assets) e.set(t, r.slice());
      return e;
    }
    get empty() {
      return this.assets.size === 0;
    }
    get size() {
      let e = 0n;
      for (let t of this.assets.values()) e += BigInt(t.length);
      return e;
    }
    get toList() {
      let e = [];
      for (let [t, r] of this.assets) for (let n of r) e.push(new H(t, n));
      return e;
    }
    static fromList(e) {
      let t = new K();
      for (let r of e) t.insert(r);
      return t;
    }
    static assert(e) {
      for (let [t, r] of e.assets) l(r.length > 0, `empty token list for ${t}`);
      e.forEach((t) => H.assertADAlovelace(t));
    }
  };
Object.defineProperty(K, "generate", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o = 0n, e) => {
    let t = $e.genKeys(He.ptype, br(o, e ?? ht(o, se))());
    l(t.length >= o, `generated ${t} too small`);
    let r = K.fromList(t);
    return l(r.size >= o, `generated ${r.show()} too small`), r;
  },
});
Object.defineProperty(K, "singleton", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = new K();
    return e.insert(o), e;
  },
});
var zt = class extends oe {
  constructor() {
    super(new $e(ge.ptype, _o), K),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: K.generate,
      });
  }
  static genPType() {
    return zt.ptype;
  }
};
Object.defineProperty(zt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new zt(),
});
var qr = new q((o) => o.show()),
  qt = new q((o) => o.show()),
  y = class {
    constructor(e = qr.anew) {
      Object.defineProperty(this, "value", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t = "") => {
            let r = t + I + E, n = r + E, s = ["Value:"];
            for (let [i, a] of this.value) {
              let c = i.toString();
              s.push(`${r}${c === "" ? "ADA" : c}:`);
              let d = [];
              for (let [f, p] of a) {
                d.push(
                  `${n}${
                    f.name === "" ? c === "" ? "lovelace" : "_" : f.name
                  }: ${p}`,
                );
              }
              s.push(d.join(`,
`));
            }
            return s.join(`
`);
          },
        }),
        Object.defineProperty(this, "concise", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t = "") => {
            let r = t + E, n = [];
            for (let [s, i] of this.value) {
              for (let [a, c] of i) {
                n.push(`${r}${s.toString()}_${a.name}: ${c.toString()}`);
              }
            }
            return n.length === 0 ? "[]" : `[
${
              n.join(`,
`)
            }
${t}]`;
          },
        }),
        Object.defineProperty(this, "divideByScalar", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => y.newMapAmounts((r) => r / t)(this),
        }),
        Object.defineProperty(this, "divideByScalar_", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) =>
            y.newMapAmounts((r) => BigInt(Math.floor(Number(r) / t)))(this),
        }),
        Object.defineProperty(this, "newFoldWith", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => () => {
            let n = t;
            for (let [s, i] of this.value) for (let [a, c] of i) n = r(n, c);
            return n;
          },
        }),
        Object.defineProperty(this, "sumAmounts", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: this.newFoldWith(0n, (t, r) => t + r),
        }),
        Object.defineProperty(this, "mulAmounts", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: this.newFoldWith(1n, (t, r) => t * r),
        }),
        Object.defineProperty(this, "gcd", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t = 0n) =>
            this.newFoldWith(t, (r, n) => this.euclidean(r, n))(),
        }),
        Object.defineProperty(this, "exactAssets", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.assets.equals(t),
        }),
        Object.defineProperty(this, "maybeAmountOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => this.value.get(t.currency)?.get(t.token),
        }),
        Object.defineProperty(this, "amountOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            let n = this.maybeAmountOf(t) ?? r;
            return l(
              n !== void 0,
              `amountOf: amount not found for asset
${t.show()}
in ${this.concise()}`,
            ),
              n;
          },
        }),
        Object.defineProperty(this, "setAmountOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            let n = this.value.get(t.currency);
            l(
              n,
              `setAmountOf: tokens not found for asset ${t.show()} in ${this.show()}`,
            ),
              l(
                n.has(t.token),
                `setAmountOf: amount not found for asset ${t.show()} in ${this.show()}`,
              ),
              n.set(t.token, r);
          },
        }),
        Object.defineProperty(this, "initAmountOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            let n = this.value.get(t.currency);
            if (n) {
              l(
                !n.has(t.token),
                `initAmountOf: amount already set for asset ${t.show()} in ${this.show()}`,
              ), n.set(t.token, r);
            } else {
              let s = qt.anew;
              s.set(t.token, r), this.value.set(t.currency, s);
            }
          },
        }),
        Object.defineProperty(this, "fillAmountOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            let n = this.value.get(t.currency);
            if (n) n.has(t.token) || n.set(t.token, r);
            else {
              let s = qt.anew;
              s.set(t.token, r), this.value.set(t.currency, s);
            }
          },
        }),
        Object.defineProperty(this, "ofAssets", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = new y();
            return t.intersect(this.assets).forEach((n) => {
              let s = this.amountOf(n);
              r.initAmountOf(n, s);
            }),
              r;
          },
        }),
        Object.defineProperty(this, "intersect", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = new y();
            for (let [n, s] of this.value) {
              let i = t.value.get(n);
              if (i) {
                for (let [a, c] of s) {
                  let d = i.get(a);
                  d && r.initAmountOf(new H(n, a), xe(c, d));
                }
              }
            }
            return r;
          },
        }),
        Object.defineProperty(this, "has", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = this.value.get(t.currency);
            return r ? r.has(t.token) : !1;
          },
        }),
        Object.defineProperty(this, "drop", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = this.value.get(t.currency);
            l(
              r,
              `drop: tokens not found for asset ${t.show()} in ${this.show()}`,
            ),
              l(
                r.has(t.token),
                `drop: amount not found for asset ${t.show()} in ${this.show()}`,
              ),
              r.delete(t.token),
              r.size === 0 && this.value.delete(t.currency);
          },
        }),
        Object.defineProperty(this, "addAmountOf", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            this.setAmountOf(t, this.amountOf(t) + r);
          },
        }),
        Object.defineProperty(this, "fill", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => {
            let n = this.clone;
            return t.forEach((s) => {
              n.fillAmountOf(s, r);
            }),
              n;
          },
        }),
        Object.defineProperty(this, "newAmountsCheck", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => y.newCompareWith((r) => t(r))(this),
        }),
        y.assert(this);
    }
    get zeroed() {
      return y.newSetAmounts(0n)(this);
    }
    get unit() {
      return y.newSetAmounts(1n)(this);
    }
    get assets() {
      let e = gr.anew;
      for (let [t, r] of this.value) e.set(t, [...r.keys()]);
      return new K(e);
    }
    get normed() {
      let e = qr.anew;
      for (let [t, r] of this.value) {
        let n = qt.anew;
        for (let [s, i] of r) i && n.set(s, i);
        n.size && e.set(t, n);
      }
      return new y(e);
    }
    euclidean(e, t) {
      if (e = fn(e), t = fn(t), t > e) {
        let r = e;
        e = t, t = r;
      }
      for (;;) {
        if (t === 0n) return e;
        if (e %= t, e === 0n) return t;
        t %= e;
      }
    }
    get maxAmount() {
      return this.newFoldWith(this.unsortedHeadAmount, ht)();
    }
    cleanReduce(...e) {
      let t = e.reduce((r, n) => n.gcd(r), this.gcd());
      return [this, ...e].map((r) => r.divideByScalar(t));
    }
    dirtyReduce(...e) {
      let t = e.reduce((s, i) => ht(s, i.maxAmount), this.maxAmount),
        r = [this, ...e];
      if (t <= V) return r;
      let n = Number(t) / Number(V);
      return r.map((s) => s.divideByScalar_(n));
    }
    get toMap() {
      let e = this.value.anew;
      for (let [t, r] of this.value) {
        let n = qt.anew;
        for (let [s, i] of r) n.set(s, i);
        e.set(t, n);
      }
      return e;
    }
    get size() {
      let e = 0n;
      for (let [t, r] of this.value) e += BigInt(r.size);
      return e;
    }
    get headAsset() {
      l(this.value.size > 0, `no currencies in value: ${this.show()}`);
      let e = [...this.value.keys()].sort()[0], t = this.value.get(e);
      l(t, `no tokens for currency ${e}`),
        l(t.size > 0, `no tokens for currency ${e}`);
      let r = [...t.keys()].sort()[0];
      return new H(e, r);
    }
    get unsortedHeadAmount() {
      for (let [e, t] of this.value) for (let [r, n] of t) return n;
      throw new Error(`no amounts in value: ${this.show()}`);
    }
    get clone() {
      return new y(this.toMap);
    }
    get smallestAmount() {
      let e;
      for (let t of this.value.values()) {
        for (let r of t.values()) {
          (!e || r < e) && (e = r);
        }
      }
      return l(e, `smallestAmount: no smallest found in ${this.concise()}`), e;
    }
    get biggestAmount() {
      let e;
      for (let t of this.value.values()) {
        for (let r of t.values()) {
          (!e || e < r) && (e = r);
        }
      }
      return l(e, `biggestAmount: no biggest found in ${this.concise()}`), e;
    }
    static assert(e) {
      l(e.value instanceof q, `Value must be a AssocMap, not ${e.value}`),
        K.assert(e.assets);
    }
    static assetsOf(...e) {
      let t = gr.anew;
      for (let r of e) {
        for (let [n, s] of r.toMap) {
          let i = t.get(n) ?? [];
          for (let a of s.keys()) i.some((c) => c.name === a.name) || i.push(a);
          t.set(n, i);
        }
      }
      return new K(t);
    }
    static singleton(e, t) {
      let r = qr.anew, n = qt.anew;
      return n.set(e.token, t), r.set(e.currency, n), new y(r);
    }
    get positive() {
      return this.newAmountsCheck((e) => e > 0n);
    }
    get leqMaxInteger() {
      return this.newAmountsCheck((e) => e <= V);
    }
    static newSetAmounts(e) {
      return y.newMapAmounts(() => e);
    }
  };
Object.defineProperty(y, "nullOfAssets", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = qr.anew;
    for (let [t, r] of o.toMap) {
      let n = qt.anew;
      for (let s of r) n.set(s, 0n);
      e.set(t, n);
    }
    return new y(e);
  },
});
Object.defineProperty(y, "generateWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = K.generate(), t = new y();
    return e.forEach((r) => {
      t.initAmountOf(r, o.genData());
    }),
      t;
  },
});
Object.defineProperty(y, "newUnionWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e, ...t) => (r = new y(), ...n) => {
    try {
      let s = n.map((c) => c ?? new y()), i = y.assetsOf(r, ...s), a = new y();
      return i.forEach((c) => {
        let d = new Array();
        [r, ...s].forEach((p, h) => {
          let m = t[h];
          d.push(p.amountOf(c, m));
        });
        let f = o(d[0], ...d.slice(1));
        f !== e && a.initAmountOf(c, f);
      }),
        a;
    } catch (s) {
      throw new Error(`newUnionWith:
${o}
${
        [r, ...n].map((i) =>
          i?.concise()
        ).join(`,
`)
      }
failed: ${s}`);
    }
  },
});
Object.defineProperty(y, "add", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o + e),
});
Object.defineProperty(y, "normedAdd", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o + e, 0n, 0n, 0n),
});
Object.defineProperty(y, "subtract", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o - e),
});
Object.defineProperty(y, "normedSubtract", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o - e, 0n, 0n, 0n),
});
Object.defineProperty(y, "hadamard", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o * e),
});
Object.defineProperty(y, "hadamard_", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o * e, void 0, 0n),
});
Object.defineProperty(y, "divide", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o / e),
});
Object.defineProperty(y, "normedDivide", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newUnionWith((o, e) => o / e, 0n, 0n, 0n),
});
Object.defineProperty(y, "genBetween", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e) => y.newUnionWith((t, r) => new Se(t, r - 1n).genData())(o, e),
});
Object.defineProperty(y, "newCompareWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, ...e) => (t = new y(), ...r) => {
    let n = r.map((i) => i ?? new y()), s = y.assetsOf(t, ...n);
    for (let [i, a] of s.toMap) {
      for (let c of a) {
        let d = new H(i, c), f = new Array();
        if (
          [t, ...n].forEach((p, h) => {
            let m = e[h], g = p.amountOf(d, m);
            f.push(g);
          }), !o(f[0], ...f.slice(1))
        ) return !1;
      }
    }
    return !0;
  },
});
Object.defineProperty(y, "leq", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newCompareWith((o, e) => o <= e),
});
Object.defineProperty(y, "leq_", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newCompareWith((o, e) => o <= e, void 0, 0n),
});
Object.defineProperty(y, "lt_", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: y.newCompareWith((o, e) => o < e, 0n),
});
Object.defineProperty(y, "newBoundedWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => (e) => {
    let t = new y();
    for (let [r, n] of e.toMap) {
      for (let [s, i] of n) {
        t.initAmountOf(
          new H(r, s),
          i < o.lowerBound ? o.lowerBound : i > o.upperBound ? o.upperBound : i,
        );
      }
    }
    return t;
  },
});
Object.defineProperty(y, "newMapAmounts", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => y.newUnionWith((e) => o(e)),
});
var Kt = class extends oe {
  constructor(e) {
    super(new $e(ge.ptype, new $e(je.ptype, e)), y),
      Object.defineProperty(this, "pbounded", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => y.generateWith(this.pbounded),
      });
  }
  static genPType() {
    return new Kt(Se.genPType());
  }
};
var T = class {
  constructor(e = new y()) {
    Object.defineProperty(this, "value", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "initAmountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => {
          l(
            r >= 0n,
            `initAmountOf: amount must be positive, got ${r} for asset ${t.show()}`,
          ), this.value?.initAmountOf(t, r);
        },
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t = "") => `+${this.value.concise(t)}`,
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t = "") =>
          `PositiveValue (
${this.value.show(t)}
)`,
      }),
      Object.defineProperty(this, "amountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => this.value.amountOf(t, r),
      }),
      Object.defineProperty(this, "drop", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => this.value.drop(t),
      }),
      Object.defineProperty(this, "ofAssets", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(this.value.ofAssets(t)),
      }),
      Object.defineProperty(this, "intersect", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(this.value.intersect(t.value)),
      }),
      Object.defineProperty(this, "setAmountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => this.value.setAmountOf(t, r),
      }),
      Object.defineProperty(this, "has", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => this.value.has(t),
      }),
      Object.defineProperty(this, "fill", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (
          t,
          r,
        ) => (l(r > 0n, `fill: amount must be positive, got ${r}`),
          new T(this.value.fill(t, r))),
      }),
      Object.defineProperty(this, "addAmountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => {
          this.has(t) ? this.increaseAmountOf(t, r) : this.initAmountOf(t, r);
        },
      }),
      Object.defineProperty(this, "increaseAmountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => {
          let n = this.amountOf(t) + r;
          l(
            n >= 0n,
            `addAmountOf: newAmount must be nonnegative, got ${
              this.amountOf(t)
            } - ${r} = ${n}`,
          ), n === 0n ? this.value.drop(t) : this.value.setAmountOf(t, n);
        },
      }),
      Object.defineProperty(this, "boundedSubValue", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => {
          let n = this.assets.boundedSubset(t, r), s = new T();
          return n.forEach((i) => {
            let a = this.amountOf(i);
            s.initAmountOf(i, ke(a));
          }),
            s;
        },
      }),
      Object.defineProperty(this, "plus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.add(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedPlus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.normedAdd(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "minus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.subtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedMinus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.normedSubtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "divideBy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.divide(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedDivideBy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.normedDivide(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "leq", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => y.leq(this.unsigned, t.unsigned),
      }),
      l(e.positive, `value must be positive: ${e.show()}`);
  }
  get toMap() {
    return this.value.toMap;
  }
  get assets() {
    return this.value.assets;
  }
  get unsigned() {
    return new y(this.value.toMap);
  }
  get unit() {
    return this.value.unit;
  }
  get zeroed() {
    return this.value.zeroed;
  }
  get size() {
    return this.value.size;
  }
  get headAsset() {
    return this.value.headAsset;
  }
  get smallestAmount() {
    return this.value.smallestAmount;
  }
  get biggestAmount() {
    return this.value.biggestAmount;
  }
  get clone() {
    return new T(this.value.clone);
  }
  get toLucid() {
    let e = {};
    return this.assets.forEach((t) => {
      e[t.toLucid()] = this.amountOf(t);
    }),
      e;
  }
  static fromLucid(e, t) {
    try {
      let r = new y();
      return Object.entries(e).forEach(([n, s]) => {
        if (n !== t) {
          let i = H.fromLucid(n);
          r.initAmountOf(i, s);
        }
      }),
        new T(r);
    } catch (r) {
      throw new Error(
        `Amounts.fromLucid ${
          Object.entries(e).map(([n, s]) =>
            `${n}: ${s}
`
          )
        }:${r}`,
      );
    }
  }
  static normed(e) {
    return new T(e.normed);
  }
  static singleton(e, t) {
    return new T(y.singleton(e, t));
  }
};
Object.defineProperty(T, "maybeFromMap", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    if (o !== void 0) return new T(new y(o));
  },
});
Object.defineProperty(T, "genOfAssets", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e = new fe()) => {
    let t = new y();
    return o.forEach((r) => {
      t.initAmountOf(r, e.genData());
    }),
      new T(t);
  },
});
var e0 = y.newBoundedWith(new fe()),
  Te = class extends oe {
    constructor() {
      super(new Kt(new fe()), T);
    }
    static genPType() {
      return Te.ptype;
    }
  };
Object.defineProperty(Te, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Te(),
});
var Qe = class {
  constructor(e, t) {
    Object.defineProperty(this, "pliteral", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "literal", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: 1,
      }),
      Object.defineProperty(this, "plutusLiteral", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "str", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          this.pliteral.showData(this.pliteral.plift(r)) === this.str,
          "Literal does not match",
        ),
          this.literal),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (l(
          this.pliteral.showData(r) === this.str,
          "Literal does not match",
        ),
          this.plutusLiteral),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => this.literal,
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r, n = "", s) => {
          if (s !== void 0 && s <= 0n) return "Literal ( \u2026 )";
          l(
            this.pliteral.showData(r) === this.str,
            `Literal.showData: Literal does not match, got:
${this.pliteral.showData(r)},
expected:
${this.str}.`,
          );
          let i = n + I, a = i + E;
          return `Literal (
${a}${this.pliteral.showData(r, a, s && s - 1n)}
${i})`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r = "", n) => {
          if (n !== void 0 && n <= 0n) return "PLiteral ( \u2026 )";
          let s = r + I, i = s + E;
          return `PLiteral (
${i}population: ${this.population},
${i}pliteral: ${this.pliteral.showPType(i, n && n - 1n)},
${i}literal: ${this.pliteral.showData(this.literal, i, n && n - 1n)}
${s})`;
        },
      }),
      this.plutusLiteral = e.pconstant(t),
      this.str = e.showData(t);
  }
  static genPType(e, t) {
    let r = e.generate(t), n = r.genData();
    return new Qe(r, n);
  }
};
var ot = V,
  ye = class {
    constructor(e, t) {
      Object.defineProperty(this, "currency", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "token", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => `IdNFT (${this.currency.show()}, ${this.token.show()})`,
        }),
        Object.defineProperty(this, "next", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r = 1n) => new ye(this.currency, this.token.hash(r)),
        }),
        Object.defineProperty(this, "sortSubsequents", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            let n = this.currency.show(),
              s = new q((h) => h.show()),
              i = new Array(),
              a = new Array();
            r.forEach((h) => {
              h.currency.show() === n ? s.set(h.token, h) : a.push(h);
            });
            let c = s.size, d = ot, f = this.token;
            for (; c && d;) {
              f = f.hash();
              let h = s.get(f);
              h ? (i.push(h), s.delete(f), d = ot, c--) : d--;
            }
            let p = [...s.values()];
            return { sorted: i, wrongPolicy: a, unmatched: p };
          },
        }),
        Object.defineProperty(this, "assertPrecedes", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            l(this.currency.show() === r.currency.show(), "currency mismatch");
            let n = this.token.hash(), s = r.token.toString();
            for (let i = 0n; i < ot; i++) {
              if (n.toString() === s) return;
              n = n.hash();
            }
            throw new Error("assertPrecedes failed");
          },
        });
    }
    get toLucid() {
      return this.currency.symbol.length === 0
        ? "lovelace"
        : S.toUnit(this.currency.toLucid(), this.token.toLucid());
    }
    get toLucidNFT() {
      return { [this.toLucid]: 1n };
    }
    static fromLucid(e) {
      try {
        if (e === "lovelace") throw new Error("lovelace is not an id-NFT");
        {
          let t = S.fromUnit(e);
          return new ye(
            J.fromLucid(t.policyId),
            re.fromLucid(t.assetName ?? ""),
          );
        }
      } catch (t) {
        throw new Error(`IdNFT.fromLucid ${e}:
${t}`);
      }
    }
    static fromAsset(e) {
      try {
        return new ye(e.currency, re.fromString(e.token.name));
      } catch (t) {
        throw new Error(`IdNFT.fromAsset ${e.show()}:
${t}`);
      }
    }
  },
  gt = class extends W {
    constructor(e) {
      super(new z({ currency: new Qe(ge.ptype, e), token: mt.ptype }), ye),
        Object.defineProperty(this, "policy", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: e,
        });
    }
    static genPType() {
      return new gt(J.dummy);
    }
  };
var Y = class {
  constructor(e) {
    Object.defineProperty(this, "value", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t = "") => this.value.concise(t),
      }),
      Object.defineProperty(this, "amountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => this.value.amountOf(t, r),
      }),
      Object.defineProperty(this, "plus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Y.fromValue(y.add(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "minus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Y.fromValue(y.subtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedMinus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new T(y.normedSubtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "hadamard", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Y.fromValue(y.hadamard(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "divideBy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Y.fromValue(y.divide(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "divideByScalar", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Y.fromValue(this.unsigned.divideByScalar(t)),
      }),
      Object.defineProperty(this, "leq", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => y.leq(this.unsigned, t.unsigned),
      }),
      Object.defineProperty(this, "bounded", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t = 1n, r = V) =>
          Y.fromValue(y.newBoundedWith(new Se(t, r))(this.unsigned)),
      }),
      Y.asserts(this);
  }
  get assets() {
    return this.value.assets;
  }
  get unsigned() {
    return this.value.unsigned;
  }
  get unsized() {
    return this.value.clone;
  }
  get unit() {
    return this.value.unit;
  }
  get toLucid() {
    return this.value.toLucid;
  }
  static asserts(e) {
    l(e.assets.size >= 2n, "at least two assets are required");
  }
  static generate() {
    let e = K.generate(2n), t = T.genOfAssets(e);
    return new Y(t);
  }
  static genOfAssets(e) {
    return new Y(T.genOfAssets(e));
  }
  static genBelow(e) {
    return Y.fromValue(y.genBetween(e.unit, e.unsigned));
  }
};
Object.defineProperty(Y, "fromValue", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => new Y(new T(o)),
});
Object.defineProperty(Y, "filled", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e, t) => new Y(o.fill(e, t)),
});
var it = class extends oe {
  constructor() {
    super(Te.ptype, Y),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Y.generate,
      });
  }
  static genPType() {
    return it.ptype;
  }
};
Object.defineProperty(it, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new it(),
});
var Le = class {
    constructor(e, t, r, n, s) {
      Object.defineProperty(this, "owner", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "virtual", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "weights", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        }),
        Object.defineProperty(this, "jumpSizes", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: n,
        }),
        Object.defineProperty(this, "active", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: s,
        }),
        Object.defineProperty(this, "sharedAssets", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (i) => this.assets.intersect(i),
        }),
        Object.defineProperty(this, "concise", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (i = "") => {
            let a = i + I, c = a + E;
            return `Param (
${c}owner: ${this.owner.toString()}, 
${c}virtual: ${this.virtual.concise(c)}, 
${c}weights: ${this.weights.concise(c)}
${c}jumpSizes: ${this.jumpSizes.concise(c)}, 
${c}active: ${this.active.toString()}
${a})`;
          },
        }),
        Le.asserts(this);
    }
    get minAnchorPrices() {
      return y.hadamard_(this.virtual.unsigned, this.weights.unsigned);
    }
    get assets() {
      return this.weights.assets;
    }
    get switched() {
      return new Le(
        this.owner,
        this.virtual,
        this.weights,
        this.jumpSizes,
        this.active ? 0n : 1n,
      );
    }
    static asserts(e) {
      let t = e.jumpSizes.assets;
      l(
        t.equals(e.weights.assets),
        "assets of jumpSizes and weights must match",
      ),
        l(
          e.virtual.assets.subsetOf(t),
          `assets of virtual must be a subset of assets of jumpSizes and weights, but ${e.virtual.assets.show()}
is not a subset of ${t.show()}`,
        );
      let r = e.minAnchorPrices, n = y.add(r, e.jumpSizes.unsigned);
      l(
        n.leqMaxInteger,
        `max anchor price must be leq max integer, but is ${n.concise()}`,
      );
    }
    static generate() {
      let e = ve.ptype.genData(), t = K.generate(2n), r = t.randomSubset();
      return Le.genOf(e, t, r);
    }
    static genOf(e, t, r) {
      l(
        r.subsetOf(t),
        `Param.genOf: virtual assets must be a subset of all assets, but ${r.show()} is not a subset of ${t.show()}`,
      );
      let n = new T(), s = new T(), i = new T(), a = new fe();
      return t.forEach((c) => {
        if (r.has(c)) {
          let d = new fe(2n).genData(),
            f = new fe(1n, d - 1n).genData(),
            p = d - f,
            h = new fe(1n, p).genData();
          i.initAmountOf(c, p / h), n.initAmountOf(c, f), s.initAmountOf(c, h);
        } else {
          let d = a.genData(),
            f = a.genData(),
            p = new fe(1n, f).genData(),
            h = f - p;
          d <= h && i.initAmountOf(c, h / d),
            n.initAmountOf(c, p),
            s.initAmountOf(c, d);
        }
      }),
        new Le(e, i, new Y(s), new Y(n), 1n);
    }
  },
  et = class extends W {
    constructor() {
      super(
        new z({
          owner: ve.ptype,
          virtual: Te.ptype,
          weights: it.ptype,
          jumpSizes: it.ptype,
          active: de.ptype,
        }),
        Le,
      ),
        Object.defineProperty(this, "genData", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: Le.generate,
        });
    }
    static genPType() {
      return et.ptype;
    }
  };
Object.defineProperty(et, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new et(),
});
var Ee = class {
  constructor(e, t, r, n) {
    Object.defineProperty(this, "owner", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "threadNFT", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "paramNFT", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: r,
      }),
      Object.defineProperty(this, "anchorPrices", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n,
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s = "") => {
          let i = s + I, a = i + E;
          return `Dirac(
${a}owner: ${this.owner},
${a}threadNFT: ${this.threadNFT.show()},
${a}paramNFT: ${this.paramNFT.show()},
${a}anchorPrices: ${this.anchorPrices.concise(a)},
${i})`;
        },
      });
  }
};
Object.defineProperty(Ee, "assertWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => (e) => {
    let t = e.anchorPrices.unsigned,
      r = o.minAnchorPrices,
      n = y.add(r, o.jumpSizes.unsigned);
    l(
      y.leq_(r, t),
      `anchorPrices must be at least minAnchorPrices, but ${t.show()}
is not at least ${r.show()}`,
    ),
      l(
        y.lt_(t, n),
        `anchorPrices must be strictly less than maxAnchorPrices, but ${t.show()}
is not strictly less than ${n.show()}`,
      );
  },
});
Object.defineProperty(Ee, "generateWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e, t) => () => {
    let r = o.minAnchorPrices,
      n = y.add(r, o.jumpSizes.unsigned),
      s = T.normed(y.genBetween(r, n));
    return new Ee(o.owner, t, e, s);
  },
});
var Wt = class extends W {
    constructor(e) {
      super(
        new z({
          owner: ve.ptype,
          threadNFT: new gt(e),
          paramNFT: new gt(e),
          anchorPrices: Te.ptype,
        }),
        Ee,
      );
    }
    static genPType() {
      return new Wt(J.dummy);
    }
  },
  yt = class extends Ye {
    constructor(e, t, r) {
      let n = new gt(t.currency);
      super(
        new W(
          new z({
            owner: new Qe(ve.ptype, e.owner),
            threadNFT: new Qe(n, r),
            paramNFT: new Qe(n, t),
            anchorPrices: Te.ptype,
          }),
          Ee,
        ),
        [Ee.assertWith(e)],
        Ee.generateWith(e, t, r),
      ),
        Object.defineProperty(this, "param", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: e,
        }),
        Object.defineProperty(this, "paramNFT", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "threadNFT", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        });
    }
    static genPType() {
      let e = et.ptype.genData(),
        t = new ye(J.dummy, e.owner.hash().hash(Z(ot - 1n))),
        r = t.next(ke(ot));
      return new yt(e, t, r);
    }
  };
var at = class {
    constructor(e) {
      Object.defineProperty(this, "param", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  wt = class extends W {
    constructor(e) {
      super(new z({ param: e }), at);
    }
    static genPType() {
      return wt.ptype;
    }
  };
Object.defineProperty(wt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new wt(et.ptype),
});
var Fe = class {
    constructor(e) {
      Object.defineProperty(this, "dirac", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  yr = class extends W {
    constructor(e) {
      super(new z({ dirac: new Wt(e) }), Fe);
    }
    static genPType() {
      return new yr(J.dummy);
    }
  },
  wr = class extends W {
    constructor(e, t, r) {
      super(new z({ dirac: new yt(e, t, r) }), Fe);
    }
    static genPType() {
      let e = yt.genPType();
      return new wr(e.param, e.paramNFT, e.threadNFT);
    }
  },
  tt = class extends st {
    constructor(e) {
      super([new yr(e), wt.ptype]);
    }
    static genPType() {
      return new tt(J.dummy);
    }
  },
  Ct = class extends st {
    constructor(e, t, r) {
      super([new wr(e, t, r), wt.ptype]);
    }
    static genPType() {
      let e = yt.genPType();
      return new Ct(e.param, e.paramNFT, e.threadNFT);
    }
  };
var xr = class {
    constructor(e, t) {
      Object.defineProperty(this, "bought", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "sold", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        });
    }
  },
  xt = class extends W {
    constructor() {
      let e = new fe(1n, V ** V);
      super(new z({ bought: e, sold: e }), xr);
    }
    static genPType() {
      return xt.ptype;
    }
  };
Object.defineProperty(xt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new xt(),
});
var vr = class {
    constructor(e, t, r) {
      Object.defineProperty(this, "boughtAsset", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "soldAsset", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "prices", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        });
    }
  },
  vt = class extends W {
    constructor() {
      super(
        new z({ boughtAsset: He.ptype, soldAsset: He.ptype, prices: xt.ptype }),
        vr,
      );
    }
    static genPType() {
      return vt.ptype;
    }
  };
Object.defineProperty(vt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new vt(),
});
var Pr = class {
    constructor(e) {
      Object.defineProperty(this, "swap", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  Nt = class extends W {
    constructor() {
      super(new z({ swap: vt.ptype }), Pr);
    }
    static genPType() {
      return Nt.ptype;
    }
  };
Object.defineProperty(Nt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Nt(),
});
var Bt = class {
    constructor() {}
  },
  Dt = class extends W {
    constructor() {
      super(new z({}), Bt);
    }
    static genPType() {
      return Dt.ptype;
    }
  };
Object.defineProperty(Dt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Dt(),
});
var Ie = class extends st {
  constructor() {
    super([Nt.ptype, Dt.ptype]);
  }
  static genPType() {
    return Ie.ptype;
  }
};
Object.defineProperty(Ie, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Ie(),
});
var _r = class {
    constructor() {
      Object.defineProperty(this, "paramUtxo", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
        Object.defineProperty(this, "preDiracUtxos", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "setParamUtxo", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (e) => (l(
            !this.paramUtxo,
            `duplicate paramNFT for ${this.paramUtxo?.paramNFT.show()}`,
          ),
            this.paramUtxo = e,
            this),
        }),
        Object.defineProperty(this, "addPreDiracUtxo", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (e) => {
            let t = e.preDirac.threadNFT;
            return this.preDiracUtxos ||
              (this.preDiracUtxos = new q((r) => r.show())),
              l(!this.preDiracUtxos.has(t), `CRITICAL: duplicate dirac ${t}`),
              this.preDiracUtxos.set(t, e),
              this;
          },
        }),
        Object.defineProperty(this, "parse", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            if (!this.paramUtxo || !this.preDiracUtxos) return;
            let t = this.paramUtxo.paramNFT.sortSubsequents([
                ...this.preDiracUtxos.keys(),
              ]).sorted,
              r = new Array(),
              n = new Array();
            for (let s of t) {
              let i = this.preDiracUtxos.get(s),
                a = i.parse(this.paramUtxo.param);
              a ? r.push(a) : n.push(i);
            }
            if (r.length) return [Pt.parse(this.paramUtxo, r), t[t.length - 1]];
          },
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (e = "") => {
            let t = e + I, r = t + E;
            return `PrePool {
${r}paramUtxo: ${this.paramUtxo?.show(r)}
${r}preDiracUtxos: ${this.preDiracUtxos?.show((n, s) => n.show(s), r)}
${t}}`;
          },
        }),
        Object.defineProperty(this, "cleaningTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (e, t) => {
            let r = Ie.ptype.pconstant(new Bt()), n = {};
            for (
              let s of [
                ...this.paramUtxo ? [this.paramUtxo.paramNFT] : [],
                ...this.preDiracUtxos ? [...this.preDiracUtxos.keys()] : [],
              ]
            ) n[s.toLucid] = -1n;
            return e.attachMintingPolicy(t.mintingPolicy).mintAssets(
              n,
              S.Data.void(),
            ).collectFrom(this.utxos, R.to(r));
          },
        });
    }
    get utxos() {
      return [
        ...this.paramUtxo ? [this.paramUtxo.utxo] : [],
        ...this.preDiracUtxos
          ? [...this.preDiracUtxos.values()].map((e) => e.utxo)
          : [],
      ];
    }
  },
  Pt = class {
    constructor(e, t) {
      Object.defineProperty(this, "paramUtxo", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "diracUtxos", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "openingTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r, n) => {
            let s = this.paramUtxo.openingTx(r, n);
            return this.diracUtxos.forEach((i) => s = i.openingTx(s, n)), s;
          },
        }),
        Object.defineProperty(this, "closingTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r, n) => {
            let s = Ie.ptype.pconstant(new Bt()), i = {};
            for (
              let a of [
                this.paramUtxo.paramNFT,
                ...this.diracUtxos.map((c) => c.dirac.threadNFT),
              ]
            ) i[a.toLucid] = -1n;
            return r.attachMintingPolicy(n.mintingPolicy).mintAssets(
              i,
              S.Data.void(),
            ).collectFrom(this.utxos, R.to(s));
          },
        }),
        Object.defineProperty(this, "switchingTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r, n) => {
            let s = Ie.ptype.pconstant(new Bt()),
              a = tt.genPType().pconstant(
                new at(this.paramUtxo.param.switched),
              );
            return r.collectFrom([this.paramUtxo.utxo], R.to(s)).payToContract(
              n.address,
              { inline: R.to(a), scriptRef: n.validator },
              this.paramUtxo.utxo.assets,
            );
          },
        });
    }
    get utxos() {
      return [this.paramUtxo.utxo, ...this.diracUtxos.map((e) => e.utxo)];
    }
    get idNFT() {
      return this.paramUtxo.paramNFT;
    }
    get lastIdNFT() {
      return this.diracUtxos
        ? this.diracUtxos[this.diracUtxos.length - 1].dirac.threadNFT
        : this.paramUtxo.paramNFT;
    }
    get balance() {
      let e = this.paramUtxo.param.assets,
        t = this.diracUtxos.reduce((r, n) => r.normedPlus(n.balance), new T())
          .ofAssets(this.paramUtxo.param.assets);
      return e.forEach((r) => {
        t.addAmountOf(r, 0n);
      }),
        t;
    }
    swappingsFor(e) {
      if (this.paramUtxo.param.active === 0n) return [];
      let t = e.availableBalance;
      if (!t) return [];
      let r = t.ofAssets(this.paramUtxo.param.assets);
      return r.size
        ? this.diracUtxos.flatMap((n) =>
          n.swappingsFor(e, this.paramUtxo, r.unsigned)
        )
        : [];
    }
    static parse(e, t) {
      return new Pt(e, t);
    }
    static open(e, t) {
      return new Pt(e, t);
    }
  };
var Pe = class {
  constructor(e, t, r, n, s, i, a, c, d, f, p) {
    Object.defineProperty(this, "user", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "paramUtxo", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "diracUtxo", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: r,
      }),
      Object.defineProperty(this, "boughtAsset", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n,
      }),
      Object.defineProperty(this, "soldAsset", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: s,
      }),
      Object.defineProperty(this, "boughtAmount", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: i,
      }),
      Object.defineProperty(this, "soldAmount", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: a,
      }),
      Object.defineProperty(this, "boughtSpot", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: c,
      }),
      Object.defineProperty(this, "soldSpot", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: d,
      }),
      Object.defineProperty(this, "boughtExp", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: f,
      }),
      Object.defineProperty(this, "soldExp", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: p,
      }),
      Object.defineProperty(this, "spotPrice", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () =>
          `Swapping (
  paramUtxo: ${this.paramUtxo.show()}
  diracUtxo: ${this.diracUtxo.show()}
  boughtAsset: ${this.boughtAsset.show()}
  soldAsset: ${this.soldAsset.show()}
  boughtAmount: ${this.boughtAmount}
  soldAmount: ${this.soldAmount}
  boughtSpot: ${this.boughtSpot}
  soldSpot: ${this.soldSpot}
)`,
      }),
      Object.defineProperty(this, "tx", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (h) => {
          console.log(this.show());
          let m = this.diracUtxo.balance.clone;
          m.addAmountOf(this.boughtAsset, -this.boughtAmount),
            m.addAmountOf(this.soldAsset, this.soldAmount);
          let g = m.toLucid;
          g[this.diracUtxo.dirac.threadNFT.toLucid] = 1n;
          let O = Ie.ptype.pconstant(
              new Pr(
                new vr(
                  this.boughtAsset,
                  this.soldAsset,
                  new xr(this.boughtSpot, this.soldSpot),
                ),
              ),
            ),
            v = this.diracUtxo.peuclidDatum.pconstant(
              new Fe(this.diracUtxo.dirac),
            );
          return console.log(T.fromLucid(this.diracUtxo.utxo.assets).concise()),
            console.log(T.fromLucid(g).concise()),
            console.log(this.diracUtxo.utxo.assets),
            console.log(g),
            h.readFrom([this.paramUtxo.utxo]).collectFrom(
              [this.diracUtxo.utxo],
              R.to(O),
            ).payToContract(this.user.contract.address, { inline: R.to(v) }, g);
        },
      }),
      Object.defineProperty(this, "subsequents", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => {
          let h = [],
            m = this.user.balance.amountOf(this.soldAsset) - this.soldAmount,
            g = this.diracUtxo.applySwapping(this);
          for (; m > 0n;) {
            let O = g.swappingsFor(
              this.user,
              this.paramUtxo,
              y.singleton(this.soldAsset, m),
              this.boughtAsset,
            );
            if (O.length === 0) break;
            l(O.length === 1, "subsequents.length must be 1");
            let v = O[0];
            m -= v.soldAmount, g = g.applySwapping(v), h.push(v);
          }
          return h;
        },
      }),
      Object.defineProperty(this, "subSwap", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (h, m) => {
          let g = (m ? this.boughtAmount : h) * this.soldSpot,
            O = (m ? h : this.soldAmount) * this.boughtSpot,
            C = xe(g, O) / this.soldSpot;
          l(
            C >= 0n,
            `Swapping.subSwap: boughtAmount must be nonnegative, but is ${C} for ${this.show()}`,
          );
          let x = BigInt(Math.ceil(Number(C) * this.spotPrice));
          return l(
            x <= this.soldAmount,
            `soldAmount cannot increase: ${x} > ${this.soldAmount}`,
          ),
            l(
              C <= this.boughtAmount,
              `boughtAmount cannot increase: ${C} > ${this.boughtAmount}`,
            ),
            new Pe(
              this.user,
              this.paramUtxo,
              this.diracUtxo,
              this.boughtAsset,
              this.soldAsset,
              C,
              x,
              this.boughtSpot,
              this.soldSpot,
              this.boughtExp,
              this.soldExp,
            );
        },
      }),
      Object.defineProperty(this, "randomSubSwap", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => {
          let h = this.boughtAmount * this.soldSpot,
            m = this.soldAmount * this.boughtSpot,
            O = xe(h, m) / this.soldSpot;
          l(
            O >= 0n,
            `Swapping.randomSubSwap: maxBought must be nonnegative, but is ${O} for ${this.show()}`,
          );
          let v = ke(O), C = BigInt(Math.ceil(Number(v) * this.spotPrice));
          return new Pe(
            this.user,
            this.paramUtxo,
            this.diracUtxo,
            this.boughtAsset,
            this.soldAsset,
            v,
            C,
            this.boughtSpot,
            this.soldSpot,
            this.boughtExp,
            this.soldExp,
          );
        },
      }),
      l(i >= 0n, "boughtAmount must be nonnegative"),
      l(a >= 0n, "soldAmount must be nonnegative"),
      l(c > 0n, "boughtSpot must be positive"),
      l(d > 0n, "soldSpot must be positive"),
      this.spotPrice = Number(d) / Number(c);
  }
  get type() {
    return "Swapping";
  }
  static boundary(e, t, r, n, s, i, a, c, d, f, p) {
    return new Pe(e, t, r, n, s, i, a, c, d, f, p);
  }
  static genOfUser(e) {
    let t = e.contract.state.swappingsFor(e);
    if (!(t.length < 1)) return te(t).randomSubSwap();
  }
  static boughtAssetForSale(e, t, r, n, s) {
    let i = e <= r, a = n <= t;
    return i || console.log(`boughtAssetForSale (${s}): 
        buyingAmm ${r} > 
        spotBuying ${e}`),
      a || console.log(`boughtAssetForSale (${s}):
        sellingAmm ${n} < 
        spotSelling ${t}`),
      i && a;
  }
  static valueEquation(e, t, r, n) {
    let s = r * t, i = n * e;
    return s > i && console.log(`valueEquation: 
        addedBuyingA0 ${s} > 
        addedSellingA0 ${i}`),
      s <= i;
  }
  static validates(e, t, r, n, s, i, a, c, d, f, p, h) {
    let m = a * d, g = c * f, O = a * (d - p), v = c * (f + h);
    return Pe.boughtAssetForSale(e, t, m, g, "old") &&
      Pe.boughtAssetForSale(e, t, O, v, "new") && Pe.valueEquation(e, t, p, h);
  }
};
var ct = class {
    constructor(e, t, r) {
      Object.defineProperty(this, "param", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "paramNFT", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "utxo", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        }),
        Object.defineProperty(this, "openingTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (n, s) => {
            let a = tt.genPType().pconstant(new at(this.param)),
              c = this.paramNFT.toLucidNFT;
            return n.attachMintingPolicy(s.mintingPolicy).mintAssets(
              c,
              S.Data.void(),
            ).payToContract(s.address, {
              inline: R.to(a),
              scriptRef: s.validator,
            }, c);
          },
        }),
        Object.defineProperty(this, "sharedAssets", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (n) => this.param.sharedAssets(n),
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (n = "") => {
            let s = n + I, i = s + E;
            return `ParamUtxo (
  ${i}param: ${this.param.concise(i)}
  ${s})`;
          },
        });
    }
    static parse(e, t) {
      let r = H.ADA.toLucid(), n = Object.keys(e.assets).filter((i) => i !== r);
      l(n.length === 1, `expected exactly id-NFT in ${n.toString()}`),
        l(e.assets[n[0]] === 1n, "expected exactly 1 id-NFT");
      let s = ye.fromLucid(n[0]);
      return new ct(t, s, e);
    }
    static open(e, t) {
      return new ct(e, t);
    }
  },
  Kr = class {
    constructor(e, t, r) {
      Object.defineProperty(this, "utxo", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "datum", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "preDirac", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        }),
        Object.defineProperty(this, "balance", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
        Object.defineProperty(this, "parse", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s) => {
            try {
              return ut.parse(this, s);
            } catch {
              return;
            }
          },
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s = "") => {
            let i = s + I, a = i + E;
            return `PreDiracUtxo (
  ${a}utxo: {this.utxo.concise(ttf)}
  ${a}datum: {this.datum.concise(ttf)}
  ${a}preDirac: ${this.preDirac.concise(a)}
  ${i})`;
          },
        });
      let n = this.preDirac.threadNFT.toLucid;
      l(
        e.assets[n] === 1n,
        `expected exactly 1 thread-NFT, got ${e.assets[n]}`,
      ), this.balance = T.fromLucid(e.assets, n);
    }
  },
  ut = class {
    constructor(e, t, r, n) {
      Object.defineProperty(this, "peuclidDatum", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "dirac", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
        Object.defineProperty(this, "balance", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: r,
        }),
        Object.defineProperty(this, "utxo", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: n,
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s = "") => {
            let i = s + I, a = i + E;
            return `DiracUtxo (
  ${a}dirac: ${this.dirac.concise(a)},
  ${a}balance: ${this.balance?.concise(a) ?? "undefined"}
  ${i})`;
          },
        }),
        Object.defineProperty(this, "openingTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s, i) => {
            let a = this.peuclidDatum.pconstant(new Fe(this.dirac)),
              c = this.balance.toLucid,
              d = this.dirac.threadNFT.toLucidNFT;
            return c[Object.keys(d)[0]] = 1n,
              s.mintAssets(d, S.Data.void()).payToContract(i.address, {
                inline: R.to(a),
              }, c);
          },
        }),
        Object.defineProperty(this, "applySwapping", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s) =>
            new ut(
              this.peuclidDatum,
              this.dirac,
              this.balance.normedPlus(T.singleton(s.soldAsset, s.soldAmount))
                .normedMinus(T.singleton(s.boughtAsset, s.boughtAmount)),
            ),
        }),
        Object.defineProperty(this, "swappingsFor", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s, i, a, c) => {
            let d = new Array(),
              f = c
                ? T.singleton(c, this.balance.amountOf(c, 0n))
                : this.balance,
              p = i.param,
              h = new T(),
              m = new T(),
              g = new T(),
              O = new T(),
              v = new T(),
              C = new T(),
              x = new T();
            p.assets.forEach((L) => {
              let G = f.amountOf(L, 0n), _e = a.amountOf(L, 0n);
              if (G <= 0n && _e <= 0n) return;
              let pe = p.virtual.amountOf(L, 0n),
                X = p.weights.amountOf(L),
                Q = p.jumpSizes.amountOf(L),
                ce = this.dirac.anchorPrices.amountOf(L, 0n),
                b = G + pe;
              if (b <= 0n) return;
              h.initAmountOf(L, b);
              let P = b * X;
              l(P > 0n, "amm <= 0n");
              let A = (Number(Q) + 1) / Number(Q),
                $ = Math.log(Number(P) / Number(ce)) / Math.log(A),
                U = Math.floor($),
                ne = Math.ceil($),
                le = BigInt(Math.floor(Number(ce) * A ** U)),
                Ce = BigInt(Math.floor(Number(ce) * A ** ne)),
                _s = Number(X),
                ks = Number(b),
                Pn = (Gt) => Gt / _s - ks;
              if (G > 0n) {
                for (; le > 0n;) {
                  let Gt = Number(le),
                    Zt = Pn(Gt),
                    Yt = Zt === 1 / 0 ? G : xe(G, BigInt(Math.floor(-Zt)));
                  if (Yt > 0n) {
                    m.initAmountOf(L, le),
                      O.initAmountOf(L, BigInt(U)),
                      C.initAmountOf(L, Yt);
                    break;
                  } else U--, le = BigInt(Math.floor(Number(ce) * A ** U));
                }
              }
              if (_e > 0n && Ce > 0n) {
                for (;;) {
                  let Gt = Number(Ce),
                    Zt = Pn(Gt),
                    Yt = Zt === 1 / 0 ? _e : xe(_e, BigInt(Math.floor(Zt)));
                  if (Yt > 0n) {
                    g.initAmountOf(L, Ce),
                      v.initAmountOf(L, BigInt(ne)),
                      x.initAmountOf(L, Yt);
                    break;
                  } else ne++, Ce = BigInt(Math.floor(Number(ce) * A ** ne));
                }
              }
            });
            let F = x.assets.toList, D = C.assets.toList;
            return F.forEach((L) => {
              let G = g.amountOf(L), _e = v.amountOf(L), pe = x.amountOf(L);
              D.forEach((X) => {
                if (L.equals(X)) return;
                let Q = m.amountOf(X),
                  ce = O.amountOf(X),
                  P = C.amountOf(X) * G,
                  A = pe * Q,
                  $ = xe(A, P),
                  U = $ / G,
                  ne = BigInt(Math.ceil(Number($) / Number(Q))),
                  le = Pe.boundary(s, i, this, X, L, U, ne, Q, G, ce, _e);
                l(
                  Pe.validates(
                    Q,
                    G,
                    this.dirac.anchorPrices.amountOf(X, 0n),
                    this.dirac.anchorPrices.amountOf(L, 0n),
                    p.jumpSizes.amountOf(X),
                    p.jumpSizes.amountOf(L),
                    p.weights.amountOf(X),
                    p.weights.amountOf(L),
                    h.amountOf(X),
                    h.amountOf(L),
                    U,
                    ne,
                  ),
                  `invalid swap: ${le.show()}`,
                ), d.push(le);
              });
            }),
              d;
          },
        });
    }
    static parse(e, t) {
      let r = new Ct(t, e.preDirac.paramNFT, e.preDirac.threadNFT),
        n = r.plift(e.datum);
      return l(n instanceof Fe, "expected DiracDatum"),
        new ut(r, n.dirac, e.balance, e.utxo);
    }
    static open(e, t, r) {
      let n = new Ct(e, t.paramNFT, t.threadNFT);
      return new ut(n, t, r);
    }
  };
var Wr = class {
  constructor(e, t) {
    Object.defineProperty(this, "invalidUtxos", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: new q((s) => s),
    }),
      Object.defineProperty(this, "pools", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: new q((s) => s.show()),
      }),
      Object.defineProperty(this, "invalidPools", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: new q((s) => s.show()),
      });
    let r = new q((s) => s.show()), n = new tt(t);
    e.forEach((s) => {
      try {
        l(s.datum, "datum must be present");
        let i = R.from(s.datum);
        l(i instanceof S.Constr, `datum must be a Constr, got ${i}`);
        let a = n.plift(i);
        if (a instanceof at) {
          let c = ct.parse(s, a.param),
            d = c.param.owner,
            f = c.paramNFT,
            p = r.get(d) ?? new q((m) => m.show()),
            h = (p.get(f) ?? new _r()).setParamUtxo(c);
          p.set(f, h), r.set(d, p);
        } else if (a instanceof Fe) {
          let c = new Kr(s, i, a.dirac),
            d = c.preDirac.owner,
            f = c.preDirac.paramNFT,
            p = r.get(d) ?? new q((m) => m.show()),
            h = (p.get(f) ?? new _r()).addPreDiracUtxo(c);
          p.set(f, h), r.set(d, p);
        } else throw new Error("unknown preEuclidDatum");
      } catch (i) {
        console.error(i);
      }
    }),
      this.pools = new q((s) => s.show()),
      r.forEach((s, i) => {
        let a = new q((h) => h.show()),
          c = new q((h) => h.show()),
          d = s.size,
          f = ot,
          p = new ye(t, i.hash());
        for (; d && f;) {
          let h = s.get(p);
          if (h) {
            f = ot;
            let m = h.parse();
            if (m) {
              let [g, O] = m;
              a.set(p, g), p = O, d--;
            } else c.set(p, h);
          } else f--;
          p = p.next();
        }
        this.pools.set(i, a), this.invalidPools.set(i, c);
      });
  }
  swappingsFor(e) {
    return [...this.pools.values()].flatMap((r) => [...r.values()]).flatMap(
      (r) => r.swappingsFor(e),
    );
  }
};
var Vr = class {
  constructor(e) {
    Object.defineProperty(this, "lucid", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "validator", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "mintingPolicy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "address", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "policy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "state", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "update", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: async () => {
          let t = await this.lucid.utxosAt(this.address);
          this.state = new Wr(t, this.policy);
        },
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () =>
          `Contract (
      mintingPolicy.script: ${this.mintingPolicy.script};
      address: ${this.address};
      policy: ${this.policy};
      state?: ${this.state ? "yes" : "no"};
      )`,
      }),
      this.validator = { type: "PlutusV2", script: _n.cborHex },
      this.mintingPolicy = { type: "PlutusV2", script: kn.cborHex },
      this.address = e.utils.validatorToAddress(this.validator),
      this.policy = J.fromHex(e.utils.mintingPolicyToId(this.mintingPolicy));
  }
};
var Vt = class {
  constructor(e, t) {
    Object.defineProperty(this, "user", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "pool", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "tx", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) =>
          this.pool.closingTx(r, this.user.contract).addSigner(
            this.user.address,
          ),
      });
  }
  get type() {
    return "Closing";
  }
};
Object.defineProperty(Vt, "genOfUser", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    if (!o.availableBalance) return;
    let t = o.contract.state?.pools.get(o.paymentKeyHash);
    if (!t || !t.size) return;
    let r = te([...t.values()]);
    return new Vt(o, r);
  },
});
var Jt = class {
  constructor(e, t, r, n) {
    Object.defineProperty(this, "user", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "param", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "deposit", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: r,
      }),
      Object.defineProperty(this, "numTicks", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n,
      }),
      Object.defineProperty(this, "tx", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s) =>
          this.pool().openingTx(s, this.user.contract).addSigner(
            this.user.address,
          ),
      }),
      Object.defineProperty(this, "pool", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => {
          let s = this.param.weights.assets,
            i = this.param.minAnchorPrices,
            a = this.param.jumpSizes.divideBy(this.numTicks),
            c = this.user.nextParamNFT.next(),
            d = ct.open(this.param, c),
            f = c.next(),
            p = [new Ee(this.user.paymentKeyHash, f, c, T.normed(i))];
          s.forEach((g) => {
            let O = this.numTicks.amountOf(g),
              v = a.amountOf(g),
              C = new Array();
            p.forEach((x) => {
              for (let F = 1n; F < O; F++) {
                let D = x.anchorPrices.clone;
                D.addAmountOf(g, F * v),
                  f = f.next(),
                  C.push(new Ee(this.user.paymentKeyHash, f, c, D));
              }
            }), p = p.concat(C);
          });
          let h = T.normed(
            this.deposit.unsigned.divideByScalar(BigInt(p.length)),
          );
          l(
            h.size === this.deposit.size,
            "balance size should match deposit size",
          );
          let m = p.map((g) => ut.open(this.param, g, h));
          return this.user.setLastIdNFT(f), Pt.open(d, m);
        },
      }),
      l(
        r.assets.union(this.param.virtual.assets).equals(this.param.assets),
        `deposit and virtual must cover all assets, but got
deposit: ${r.concise()}
param: ${this.param.concise()}`,
      );
  }
  get type() {
    return "Opening";
  }
};
Object.defineProperty(Jt, "genOfUser", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = o.availableBalance;
    if (!e || e.size < 1) return;
    let t = se,
      r = e.boundedSubValue(1n, t),
      n = r.assets,
      s = new K(),
      i = ht(Z(t), 2n) - n.size;
    for (; i > 0n;) {
      let h = H.generate();
      n.has(h) || (n.insert(h), s.insert(h), i--);
    }
    let a = Le.genOf(o.paymentKeyHash, n, s),
      c = 26n,
      d = r.smallestAmount,
      f = xe(c, d),
      p = new T();
    return n.forEach((h) => {
      let m = new fe(1n, xe(xe(se, a.jumpSizes.amountOf(h)), f)).genData();
      f /= m, p.initAmountOf(h, m);
    }),
      new Jt(o, a, r, new Y(p));
  },
});
var ko = [Vt, Jt, Pe],
  Jr = class {
    constructor(e) {
      Object.defineProperty(this, "user", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      }),
        Object.defineProperty(this, "generate", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => new vn(ko).try((r) => r.genOfUser(this.user)),
        });
    }
  },
  vn = class {
    constructor(e) {
      Object.defineProperty(this, "base", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
        Object.defineProperty(this, "try", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            if (!this.done) return t(this.next) ?? this.try(t);
          },
        }),
        this.base = e.slice();
    }
    get done() {
      return this.base.length === 0;
    }
    get next() {
      if (this.done) return;
      let [e, t] = Mr(this.base);
      return this.base = this.base.slice(0, t).concat(this.base.slice(t + 1)),
        e;
    }
  };
var Oo = T.singleton(H.ADA, 10n * Ur),
  _t = class {
    constructor(e, t, r, n) {
      if (
        Object.defineProperty(this, "lucid", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: e,
        }),
          Object.defineProperty(this, "privateKey", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: t,
          }),
          Object.defineProperty(this, "address", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: r,
          }),
          Object.defineProperty(this, "contract", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "paymentKeyHash", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "balance", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "lastIdNFT", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "setLastIdNFT", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (s) => {
              this.lastIdNFT = s;
            },
          }),
          Object.defineProperty(this, "generateActions", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: async () => {
              if (
                await this.update(), this.balance.amountOf(H.ADA) < Ur
              ) return console.log("not enough ada to pay fees etc."), [];
              let s = new Jr(this).generate();
              return s ? [s] : [];
            },
          }),
          Object.defineProperty(this, "update", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: async () => {
              let s = (await Promise.all([
                this.lucid.utxosAt(this.address),
                this.contract.update(),
              ]))[0];
              return this.balance = s.map((i) => T.fromLucid(i.assets)).reduce(
                (i, a) => i.normedPlus(a),
                new T(),
              ),
                this.lastIdNFT = this.contract.state.pools.get(
                  this.paymentKeyHash,
                )?.last?.lastIdNFT,
                this.lucid.currentSlot();
            },
          }),
          this.contract = new Vr(e),
          r
      ) {
        let s = this.lucid.utils.getAddressDetails(r);
        l(s.paymentCredential, "No payment credential");
        let i = Me.fromCredential(s.paymentCredential);
        n && l(n.show() === i.show()), this.paymentKeyHash = i;
      } else {l(n, "neither address nor paymentKeyHash provided"),
          this.paymentKeyHash = n;}
    }
    get availableBalance() {
      if (
        l(this.balance, "No balance"), this.balance.amountOf(H.ADA, 0n) < Ur
      ) return;
      let e = this.balance.clone;
      return e.drop(H.ADA), e;
    }
    get hasPools() {
      return this.lastIdNFT !== void 0;
    }
    get nextParamNFT() {
      return this.lastIdNFT
        ? this.lastIdNFT.next()
        : new ye(this.contract.policy, this.paymentKeyHash.hash());
    }
    get account() {
      return l(this.address, "No address"),
        l(this.balance, "No balance"),
        { address: this.address, assets: this.balance.toLucid };
    }
    static async fromWalletApi(e, t) {
      let r = await e.selectWallet(t).wallet.address();
      return new _t(e, void 0, r);
    }
    static async fromPrivateKey(e, t) {
      let r = await e.selectWalletFromPrivateKey(t).wallet.address();
      return new _t(e, t, r);
    }
    static async generateWith(e, t) {
      let r = S.generatePrivateKey(),
        n = await e.selectWalletFromPrivateKey(r).wallet.address(),
        s = new _t(e, r, n);
      return s.balance = T.genOfAssets(t.boundedSubset(1n)).normedPlus(Oo), s;
    }
    static generateDummy() {
      let e = new S.Lucid();
      e.utils = new S.Utils(e);
      let t = S.generatePrivateKey(),
        r = ve.ptype.genData(),
        n = new _t(e, t, void 0, r),
        s = K.generate(2n);
      return n.balance = T.genOfAssets(s), n;
    }
    static async genSeveral(e, t) {
      let r = new Array(),
        n = K.generate(t, t),
        s = await S.Lucid.new(void 0, "Custom"),
        i = new Array();
      for (; r.length < e;) {
        let a = await _t.generateWith(s, n);
        l(a.address, "user.address is undefined"),
          i.includes(a.address) || (i.push(a.address), r.push(a));
      }
      return r;
    }
  };
var Gr = class {
  constructor(e, t) {
    Object.defineProperty(this, "user", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "prePool", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "tx", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) =>
          this.prePool.cleaningTx(r, this.user.contract).addSigner(
            this.user.address,
          ),
      });
  }
  get type() {
    return "Cleaning";
  }
};
Object.defineProperty(Gr, "genOfUser", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    if (!o.availableBalance) return;
    let t = o.contract.state?.invalidPools.get(o.paymentKeyHash);
    if (!t || !t.size) return;
    let r = te([...t.values()]);
    return new Gr(o, r);
  },
});
var Ps = class {
  constructor(e, t) {
    Object.defineProperty(this, "user", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "pool", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "tx", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) =>
          this.pool.switchingTx(r, this.user.contract).addSigner(
            this.user.address,
          ),
      });
  }
  get type() {
    return "Switching";
  }
};
var Zr = class {
  constructor(e, t) {
    Object.defineProperty(this, "pliteral", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: e,
    }),
      Object.defineProperty(this, "literals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t,
      }),
      Object.defineProperty(this, "population", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plutusLiterals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "strs", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          let n = this.pliteral.showData(this.pliteral.plift(r)),
            s = this.strs.indexOf(n);
          return l(s !== -1, "PEnum.plift: Literal does not match"),
            this.literals[s];
        },
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          let n = this.pliteral.showData(r), s = this.strs.indexOf(n);
          return l(s !== -1, "PEnum.pconstant: Literal does not match"),
            this.plutusLiterals[s];
        },
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => te(this.literals),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r, n = "", s) => {
          if (s !== void 0 && s <= 0n) return "Enum ( \u2026 )";
          let i = this.pliteral.showData(r), a = this.strs.indexOf(i);
          l(
            a !== -1,
            `PEnum.showData: Literal does not match, got:
${i},
expected one of:
${this.strs.join(", ")}.`,
          );
          let c = n + I, d = c + E;
          return `Enum (
${d}${this.pliteral.showData(r, d, s && s - 1n)}
${c})`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r = "", n) => {
          if (n !== void 0 && n <= 0n) return "PEnum ( \u2026 )";
          let s = r + I, i = s + E, a = i + I, c = a + E;
          return `PEnum (
${i}population: ${this.population},
${i}pliteral: ${this.pliteral.showPType(i, n && n - 1n)},
${i}literals: [
${c}${
            this.literals.map((d) => this.pliteral.showData(d, c, n && n - 1n))
              .join(`,
${c}`)
          }
${a}]
${s})`;
        },
      }),
      l(t.length > 0, "PEnum: literals of enum must be non-empty"),
      this.plutusLiterals = t.map((r) => e.pconstant(r)),
      this.strs = [],
      t.forEach((r) => {
        let n = e.showData(r);
        l(!this.strs.includes(n), `PEnum: Duplicate literal: ${n}`),
          this.strs.push(n);
      }),
      this.population = t.length;
  }
  static genPType(e, t) {
    let r = e.generate(t), n = ke(se), s = [], i = [];
    for (let a = 0; a < n; a++) {
      let c = r.genData(), d = r.showData(c);
      i.includes(d) || (i.push(d), s.push(c));
    }
    return new Zr(r, s);
  }
};
export {
  $e as PMap,
  _r as PrePool,
  _t as User,
  ae as PByteString,
  at as ParamDatum,
  be as maybeNdef,
  br as newGenInRange,
  bs as Generators,
  Bt as AdminRedeemer,
  bt as PString,
  cc as proptestPTypes,
  Ct as PEuclidDatum,
  ct as ParamUtxo,
  de as PInteger,
  E as f,
  e0 as boundPositive,
  ec as bothExtreme,
  Ee as Dirac,
  et as PParam,
  Fe as DiracDatum,
  fe as PPositive,
  fn as abs,
  ge as PCurrency,
  Gr as Cleaning,
  gr as ccysTkns,
  gs as gMaxDepth,
  gt as PIdNFT,
  H as Asset,
  He as PAsset,
  Hr as boundedSubset,
  hr as gMaxStringBytes,
  ht as max,
  I as t,
  Ie as PEuclidAction,
  It as gMaxStringLength,
  it as PEuclidValue,
  J as Currency,
  je as PToken,
  Jr as UserAction,
  Jt as Opening,
  K as Assets,
  ke as genPositive,
  ko as allActions,
  Kr as PreDiracUtxo,
  Kt as PValue,
  Le as Param,
  Lr as genName,
  Me as KeyHash,
  Mr as randomIndexedChoice,
  mr as filterFunctions,
  mt as PHash,
  Oe as Token,
  oe as PWrapped,
  ot as gMaxHashes,
  Pe as Swapping,
  pn as randomSubset,
  Pr as SwapRedeemer,
  Ps as Switching,
  Pt as Pool,
  q as AssocMap,
  Qe as PLiteral,
  qr as ccysTknsAmnts,
  qt as tknsAmnts,
  R as Data,
  re as Hash,
  Rr as maxShowDepth,
  Rt as PNonEmptyList,
  S as Lucid,
  Se as PBounded,
  se as gMaxLength,
  st as PSum,
  T as PositiveValue,
  Te as PPositiveValue,
  te as randomChoice,
  tt as PPreEuclidDatum,
  Ur as feesEtcLovelace,
  ut as DiracUtxo,
  V as maxInteger,
  ve as PKeyHash,
  Vr as Contract,
  vr as Swap,
  vs as genByteString,
  Vt as Closing,
  vt as PSwap,
  W as PObject,
  Wr as EuclidState,
  ws as genNumber,
  Wt as PPreDirac,
  Xe as PList,
  xe as min,
  xn as genPBounded,
  xr as BoughtSold,
  xt as PBoughtSold,
  Y as EuclidValue,
  y as Value,
  Ye as PConstraint,
  ye as IdNFT,
  ys as nonEmptySubSet,
  yt as PDirac,
  Z as genNonNegative,
  z as PRecord,
  Zr as PEnum,
  zt as PAssets,
};
