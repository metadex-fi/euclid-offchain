var Cs = Object.defineProperty;
var Ns = (o, e) => {
  for (var t in e) Cs(o, t, { get: e[t], enumerable: !0 });
};
var Tn = {
  cborHex:
    "59106159105e0100003232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232322225333038323232533303b3370e90000010991919299981f19b87480080084cc88cdd798211bac323043302c303300130423032001002323041303100130400040071333222323232323232323232323232533304d3370e90000010991919299982819b87480080084c8c8c8c8c94cc130cdc39bad305730560034800854cc130c8cdd79ba73048018374e609000260ae0122a6609866042666444646464660606660526eb4c17400cdd6982e8011bad305d001333029375a60ba60b80066eb4c174c170008dd6982e982e000982600198258019825001999814982b801182b8009bab3057305600f33302930570023057001375660ae00660ae60ac002666044e08ccc089c0199814982b801182b8009bab305700533302930570023057001375660ae60ac01c66605260ae00460ae0026eacc15c01054cc130cc084ccc888c8c8c8cc0c0ccc0a4dd6982e8019bad305d002375a60ba0026660526eb4c174c17000cdd6982e982e0011bad305d305c001304c003304b003304a00333302930570023057001375660ae60ac01e66605260ae00460ae0026eacc15c00cc15cc158004ccc089c119981138033302930570023057001375660ae00a66605260ae00460ae0026eacc15c030ccc0a4c15c008c15c004dd5982b8020a998261991191919b893370460766eb4c16c008dd6982d982d00099b82375a60b660b40046eb4c16c004c12800cc124004ccc888c8c8c8cc0c0ccc0a4dd6982e8019bad305d002375a60ba0026660526eb4c174c17000cdd6982e982e0011bad305d305c001304c003304b003304a00333302930570023057001375660ae60ac01e66605260ae00460ae0026eacc15c00cc15cc158004ccc0a4c15c008c15c004ccc0b5c01bab305700c33033037375660ae60ac01c2666644446609a609c466e1c0052000333031702002646464666068e00ccc0b0dd7182f0019bae305e305d003375a60bc0026660586eb8c178008dd7182f182e8011bad305e305d001304d004304c004304b004305700230570013330293057002305700133302d7006eacc15c030cc0cc0dcdd5982b982b007199816b80375660ae0186606606e6eacc15cc158038c154004c114050c14c004c148004c144c108c14800458c148008c148004dd51818191828181f982000099182818279820000981899819181998278039bac304f00b16304f002304f0013754605a609860960026094002607460586605a605e60940066eb0c128014c0e4c8c128c124c0e8004c0accc0b0c0b4c124008dd6182480318238009823000981b0031822000982180098199821981980098200021820000803982000118200009baa32323232009533303e3370e900000109919191919191924ca6660820022930b1822003299982119b87480000084c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c9265333051001149858c1500194ccc148cdc3a400000426464646464646493299982a8008a4c2c60b00066eb4004c15c004c15400cdd6800982a0008b182a001182a0009baa0013050001304e006533304c3370e900000109919192999827a9982419b87001480004cdc3800a40702646464a6660a466e24dc6800a4080264649329998280008a4c2c60a60062c6eb8004c148004c14001058dc68009bae001304e00116304e002304e00137540026094002609000ca66608c66e1d2000002132323253330495330423370e0029000099b87001480e04c8c8c94ccc130cdc49b8d001481004c8c926533304a001149858c13400c58dd7000982600098250020b1b8d001375c00260900022c609000460900026ea8004c11000458c110008c110004dd500098200008a99981f19b87480080084c926533303b00114985858c100008c100004dd50028999119baf303f375864608060526060002607e605e00200464607c605c002607a002008607a004607a0026ea8c8c8c8c801d4ccc0eccdc3a400000426464646464646493299981f0008a4c2c608200ca66607e66e1d20000021323253330413370e6e3400520381323232323232323232323232323232323232324994ccc1400045261630530053044375600666096466ec0c8c94ccc14d4cc130cdc3800a4000266e1c00520381305700316371a0026eb8c154004c8c8c15800ccc1348cdd819299982a19b89371a00290200982c0010b1bae3057001323057002375a60ac0020026eacc150004004dd580098280009827003299982619b87480000084c8c8c94ccc13d4cc120cdc3800a4000266e1c005203813232325333052337126e340052040132324994ccc14000452616305300316375c00260a400260a00082c6e34004dd700098270008b182700118270009baa001304a001304800653330463370e900000109919192999824a9982119b87001480004cdc3800a40702646464a66609866e24dc6800a4080264649329998250008a4c2c609a0062c6eb8004c130004c12801058dc68009bae001304800116304800230480013754002608800260840062c6eb8004c10400458c104008c104004dd5000981e8008a99981d99b87480080084c8c8c8c8c8c8c926533303e001149858c1040194ccc0fccdc3a400000426464a66608266e1cdc6800a4070264646464646464646464646464646464646464649329998288008a4c2c60a80066eb4004c14c004c144014c108dd580199824919bb03232533305153304a3370e0029000099b87001480e04c15400c58dc68009bae3053001323230540033304b23376064a6660a466e24dc6800a4080260ac0042c6eb8c154004c8c154008dd6982a0008009bab30520010013756002609c002609800a607a6eac00ccc1108cdd81919299982629982299b87001480004cdc3800a4070260a00062c6e34004dd718270009919182780199823119bb032533304d337126e3400520401305100216375c60a00026460a00046eb4c13c004004dd598268008009bab00130490013047005303837560066607e466ec0c8c94ccc11d4cc100cdc3800a4000266e1c00520381304b00316371a0026eb8c124004c8c8c12800ccc1048cdd819299982419b89371a0029020098260010b1bae304b00132304b002375a60940020026eacc120004004dd5800982200098210018b1bae001304100116304100230410013754002607a0022c607a004607a0026ea800c5261622323253302f337126eb4c0e8008dd6981d000899b89375a607460720026eb4c0e8c0e4008c0a4008c0a0008888c8c8cc034cc014dd6981d0011bad303a00133005375a607460720046eb4c0e8c0e4004c0a4008c0a0008888cdc199b8200333004337000049001000998020010009816911299981a19b8700148000520021323370466e080040054ccc0d4cdc399b86002480112000148008400ccc00c008cdc1800a4008444a66606666e1c0052000103113300400333005002001223300437520046e9800488cc00cdd48011ba8001223302e3376000400205a444646600a60020086002006600c0024466e9520003302c3750004660586ea000400d2f5c044646660280066eb8c0b8004dd718171816800980e8009111998021119980380280100080100091801911ba63300337560046eac0048c00888dd4198019bad002375a002444666600800644004004002460426004002446464466002006004444a66604c0022660500060042646464a66605866ebc0080044cc0accdd800119804981780318178019998041100100298168020a99981619b90375c0046eb80044cc0ac018cccc0208800400cc0b40100144cc0ac00ccccc02088004018014c0b4010c0bc008c0b8010c0ac004894ccc09000840044cccc00c88004c0a4008c0a000800488cc00c8cc01400c0040048c00c8dd318011bab001230022375060046eb400488cc074894ccc08000440844cc088cdd81813981280098021813181280098011812000800919b81480000048c8c8c94ccc084cdc3a4008004264646464604e00aa66604866e1d20000021323232323232324994ccc09c00452616302a00653330283370e900000109919299981519b87371a002901c09919191919191919191919191919191919191924ca6660720022930b181e00298169bab003330342337606464a666078a6606a66e1c005200013370e002901c098200018b1b8d001375c607c0026464607e0066606c466ec0c94ccc0f4cdc49b8d001481004c10400858dd718200009918200011bad303f0010013756607a0020026eac004c0e4004c0dc0194ccc0d4cdc3a40000042646464a666070a6606266e1c005200013370e002901c0991919299981d99b89371a00290200991924ca6660720022930b181e0018b1bae001303b001303900416371a0026eb8004c0dc00458c0dc008c0dc004dd500098198009818803299981799b87480000084c8c8c94ccc0c94cc0accdc3800a4000266e1c005203813232325333035337126e340052040132324994ccc0cc00452616303600316375c002606a00260660082c6e34004dd700098188008b181880118188009baa001302d001302b00316375c00260540022c605400460540026ea8004c09800454ccc090cdc3a40040042646464646464649329998138008a4c2c605400ca66605066e1d200000213232533302a3370e6e340052038132323232323232323232323232323232323232324994ccc0e800452616303d003375a0026078002607400a60566eac00ccc0c88cdd81919299981d29981999b87001480004cdc3800a40702607c0062c6e34004dd7181e0009919181e8019981a119bb032533303b337126e3400520401303f00216375c607c00264607c0046eb4c0f4004004dd5981d8008009bab00130370013035005302637560066605a466ec0c8c94ccc0d54cc0b8cdc3800a4000266e1c00520381303900316371a0026eb8c0dc004c8c8c0e000ccc0bc8cdd819299981b19b89371a00290200981d0010b1bae3039001323039002375a60700020026eacc0d8004004dd58009819000981800298109bab003330282337606464a666060a6605266e1c005200013370e002901c0981a0018b1b8d001375c60640026464606600666054466ec0c94ccc0c4cdc49b8d001481004c0d400858dd7181a00099181a0011bad3033001001375660620020026eac004c0b4004c0ac00c58dd700098150008b181500118150009baa00130260011630260023026001375460460022c604600460460026ea80048cc004800458c05c8894ccc06c004489400454ccc078c008c0800044c888c00800cc0800044cc00c008c07c00488cc00c008c078c074c03800488c8cdc39998021bab301e301d300e002375c603c0026eb8c078c0740052002300d0022223333004002480008cccc014009200075a6eac00400c8c008dd480091111980b11299980c80088028a99980e19baf3020301e00100613004301f301e00113002301d0010012301730020012301630020012301530020012301430020012301330020012301230020012301130110012301237540024a66601c66004466008466e212000001001001100116223300423003375660240020024466006460066eb4c0440040048c01c894ccc0280045288a9980218019807800898011807000911998058010008018a5023300800100214a24600444a66600a002200c26600e6006601400260046012002464600446600400400246004466004004002aae7d2f5bded8c0ae815cd2ba25742aae7955ce81",
  rawHex:
    "59105e0100003232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232322225333038323232533303b3370e90000010991919299981f19b87480080084cc88cdd798211bac323043302c303300130423032001002323041303100130400040071333222323232323232323232323232533304d3370e90000010991919299982819b87480080084c8c8c8c8c94cc130cdc39bad305730560034800854cc130c8cdd79ba73048018374e609000260ae0122a6609866042666444646464660606660526eb4c17400cdd6982e8011bad305d001333029375a60ba60b80066eb4c174c170008dd6982e982e000982600198258019825001999814982b801182b8009bab3057305600f33302930570023057001375660ae00660ae60ac002666044e08ccc089c0199814982b801182b8009bab305700533302930570023057001375660ae60ac01c66605260ae00460ae0026eacc15c01054cc130cc084ccc888c8c8c8cc0c0ccc0a4dd6982e8019bad305d002375a60ba0026660526eb4c174c17000cdd6982e982e0011bad305d305c001304c003304b003304a00333302930570023057001375660ae60ac01e66605260ae00460ae0026eacc15c00cc15cc158004ccc089c119981138033302930570023057001375660ae00a66605260ae00460ae0026eacc15c030ccc0a4c15c008c15c004dd5982b8020a998261991191919b893370460766eb4c16c008dd6982d982d00099b82375a60b660b40046eb4c16c004c12800cc124004ccc888c8c8c8cc0c0ccc0a4dd6982e8019bad305d002375a60ba0026660526eb4c174c17000cdd6982e982e0011bad305d305c001304c003304b003304a00333302930570023057001375660ae60ac01e66605260ae00460ae0026eacc15c00cc15cc158004ccc0a4c15c008c15c004ccc0b5c01bab305700c33033037375660ae60ac01c2666644446609a609c466e1c0052000333031702002646464666068e00ccc0b0dd7182f0019bae305e305d003375a60bc0026660586eb8c178008dd7182f182e8011bad305e305d001304d004304c004304b004305700230570013330293057002305700133302d7006eacc15c030cc0cc0dcdd5982b982b007199816b80375660ae0186606606e6eacc15cc158038c154004c114050c14c004c148004c144c108c14800458c148008c148004dd51818191828181f982000099182818279820000981899819181998278039bac304f00b16304f002304f0013754605a609860960026094002607460586605a605e60940066eb0c128014c0e4c8c128c124c0e8004c0accc0b0c0b4c124008dd6182480318238009823000981b0031822000982180098199821981980098200021820000803982000118200009baa32323232009533303e3370e900000109919191919191924ca6660820022930b1822003299982119b87480000084c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c9265333051001149858c1500194ccc148cdc3a400000426464646464646493299982a8008a4c2c60b00066eb4004c15c004c15400cdd6800982a0008b182a001182a0009baa0013050001304e006533304c3370e900000109919192999827a9982419b87001480004cdc3800a40702646464a6660a466e24dc6800a4080264649329998280008a4c2c60a60062c6eb8004c148004c14001058dc68009bae001304e00116304e002304e00137540026094002609000ca66608c66e1d2000002132323253330495330423370e0029000099b87001480e04c8c8c94ccc130cdc49b8d001481004c8c926533304a001149858c13400c58dd7000982600098250020b1b8d001375c00260900022c609000460900026ea8004c11000458c110008c110004dd500098200008a99981f19b87480080084c926533303b00114985858c100008c100004dd50028999119baf303f375864608060526060002607e605e00200464607c605c002607a002008607a004607a0026ea8c8c8c8c801d4ccc0eccdc3a400000426464646464646493299981f0008a4c2c608200ca66607e66e1d20000021323253330413370e6e3400520381323232323232323232323232323232323232324994ccc1400045261630530053044375600666096466ec0c8c94ccc14d4cc130cdc3800a4000266e1c00520381305700316371a0026eb8c154004c8c8c15800ccc1348cdd819299982a19b89371a00290200982c0010b1bae3057001323057002375a60ac0020026eacc150004004dd580098280009827003299982619b87480000084c8c8c94ccc13d4cc120cdc3800a4000266e1c005203813232325333052337126e340052040132324994ccc14000452616305300316375c00260a400260a00082c6e34004dd700098270008b182700118270009baa001304a001304800653330463370e900000109919192999824a9982119b87001480004cdc3800a40702646464a66609866e24dc6800a4080264649329998250008a4c2c609a0062c6eb8004c130004c12801058dc68009bae001304800116304800230480013754002608800260840062c6eb8004c10400458c104008c104004dd5000981e8008a99981d99b87480080084c8c8c8c8c8c8c926533303e001149858c1040194ccc0fccdc3a400000426464a66608266e1cdc6800a4070264646464646464646464646464646464646464649329998288008a4c2c60a80066eb4004c14c004c144014c108dd580199824919bb03232533305153304a3370e0029000099b87001480e04c15400c58dc68009bae3053001323230540033304b23376064a6660a466e24dc6800a4080260ac0042c6eb8c154004c8c154008dd6982a0008009bab30520010013756002609c002609800a607a6eac00ccc1108cdd81919299982629982299b87001480004cdc3800a4070260a00062c6e34004dd718270009919182780199823119bb032533304d337126e3400520401305100216375c60a00026460a00046eb4c13c004004dd598268008009bab00130490013047005303837560066607e466ec0c8c94ccc11d4cc100cdc3800a4000266e1c00520381304b00316371a0026eb8c124004c8c8c12800ccc1048cdd819299982419b89371a0029020098260010b1bae304b00132304b002375a60940020026eacc120004004dd5800982200098210018b1bae001304100116304100230410013754002607a0022c607a004607a0026ea800c5261622323253302f337126eb4c0e8008dd6981d000899b89375a607460720026eb4c0e8c0e4008c0a4008c0a0008888c8c8cc034cc014dd6981d0011bad303a00133005375a607460720046eb4c0e8c0e4004c0a4008c0a0008888cdc199b8200333004337000049001000998020010009816911299981a19b8700148000520021323370466e080040054ccc0d4cdc399b86002480112000148008400ccc00c008cdc1800a4008444a66606666e1c0052000103113300400333005002001223300437520046e9800488cc00cdd48011ba8001223302e3376000400205a444646600a60020086002006600c0024466e9520003302c3750004660586ea000400d2f5c044646660280066eb8c0b8004dd718171816800980e8009111998021119980380280100080100091801911ba63300337560046eac0048c00888dd4198019bad002375a002444666600800644004004002460426004002446464466002006004444a66604c0022660500060042646464a66605866ebc0080044cc0accdd800119804981780318178019998041100100298168020a99981619b90375c0046eb80044cc0ac018cccc0208800400cc0b40100144cc0ac00ccccc02088004018014c0b4010c0bc008c0b8010c0ac004894ccc09000840044cccc00c88004c0a4008c0a000800488cc00c8cc01400c0040048c00c8dd318011bab001230022375060046eb400488cc074894ccc08000440844cc088cdd81813981280098021813181280098011812000800919b81480000048c8c8c94ccc084cdc3a4008004264646464604e00aa66604866e1d20000021323232323232324994ccc09c00452616302a00653330283370e900000109919299981519b87371a002901c09919191919191919191919191919191919191924ca6660720022930b181e00298169bab003330342337606464a666078a6606a66e1c005200013370e002901c098200018b1b8d001375c607c0026464607e0066606c466ec0c94ccc0f4cdc49b8d001481004c10400858dd718200009918200011bad303f0010013756607a0020026eac004c0e4004c0dc0194ccc0d4cdc3a40000042646464a666070a6606266e1c005200013370e002901c0991919299981d99b89371a00290200991924ca6660720022930b181e0018b1bae001303b001303900416371a0026eb8004c0dc00458c0dc008c0dc004dd500098198009818803299981799b87480000084c8c8c94ccc0c94cc0accdc3800a4000266e1c005203813232325333035337126e340052040132324994ccc0cc00452616303600316375c002606a00260660082c6e34004dd700098188008b181880118188009baa001302d001302b00316375c00260540022c605400460540026ea8004c09800454ccc090cdc3a40040042646464646464649329998138008a4c2c605400ca66605066e1d200000213232533302a3370e6e340052038132323232323232323232323232323232323232324994ccc0e800452616303d003375a0026078002607400a60566eac00ccc0c88cdd81919299981d29981999b87001480004cdc3800a40702607c0062c6e34004dd7181e0009919181e8019981a119bb032533303b337126e3400520401303f00216375c607c00264607c0046eb4c0f4004004dd5981d8008009bab00130370013035005302637560066605a466ec0c8c94ccc0d54cc0b8cdc3800a4000266e1c00520381303900316371a0026eb8c0dc004c8c8c0e000ccc0bc8cdd819299981b19b89371a00290200981d0010b1bae3039001323039002375a60700020026eacc0d8004004dd58009819000981800298109bab003330282337606464a666060a6605266e1c005200013370e002901c0981a0018b1b8d001375c60640026464606600666054466ec0c94ccc0c4cdc49b8d001481004c0d400858dd7181a00099181a0011bad3033001001375660620020026eac004c0b4004c0ac00c58dd700098150008b181500118150009baa00130260011630260023026001375460460022c604600460460026ea80048cc004800458c05c8894ccc06c004489400454ccc078c008c0800044c888c00800cc0800044cc00c008c07c00488cc00c008c078c074c03800488c8cdc39998021bab301e301d300e002375c603c0026eb8c078c0740052002300d0022223333004002480008cccc014009200075a6eac00400c8c008dd480091111980b11299980c80088028a99980e19baf3020301e00100613004301f301e00113002301d0010012301730020012301630020012301530020012301430020012301330020012301230020012301130110012301237540024a66601c66004466008466e212000001001001100116223300423003375660240020024466006460066eb4c0440040048c01c894ccc0280045288a9980218019807800898011807000911998058010008018a5023300800100214a24600444a66600a002200c26600e6006601400260046012002464600446600400400246004466004004002aae7d2f5bded8c0ae815cd2ba25742aae7955ce81",
};
var An = {
  cborHex:
    "58e958e701000032323232323232323232223253330065332233300800200114a066e3cdd7180398059bab300b0014890013004300a300a37566016002266600a444a666012600e0022930998019b9200233230092253335573e002297adef6c60132533300d300400113357400026006602200426006602200460220024646660160029412899b8f375c60160020060026eb8c02cdd61805980418050009bab300d300b300a375660160022c6460146010002601660146016002ae8c8c8c0088cc0080080048c0088cc0080080055cd2ab9d2300330020012300230020015744ae848c008dd5000aab9e1",
  rawHex:
    "58e701000032323232323232323232223253330065332233300800200114a066e3cdd7180398059bab300b0014890013004300a300a37566016002266600a444a666012600e0022930998019b9200233230092253335573e002297adef6c60132533300d300400113357400026006602200426006602200460220024646660160029412899b8f375c60160020060026eb8c02cdd61805980418050009bab300d300b300a375660160022c6460146010002601660146016002ae8c8c8c0088cc0080080048c0088cc0080080055cd2ab9d2300330020012300230020015744ae848c008dd5000aab9e1",
};
var Bs = {}, Sr = Us(globalThis, Bs);
function Us(o, e) {
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
var { Deno: In } = Sr,
  Ds = typeof In?.noColor == "boolean" ? In.noColor : !0,
  Ms = !Ds;
function jt(o, e) {
  return {
    open: `\x1B[${o.join(";")}m`,
    close: `\x1B[${e}m`,
    regexp: new RegExp(`\\x1b\\[${e}m`, "g"),
  };
}
function St(o, e) {
  return Ms ? `${e.open}${o.replace(e.regexp, e.open)}${e.close}` : o;
}
function Lt(o) {
  return St(o, jt([1], 22));
}
function Qt(o) {
  return St(o, jt([31], 39));
}
function tn(o) {
  return St(o, jt([32], 39));
}
function $r(o) {
  return St(o, jt([37], 39));
}
function Cn(o) {
  return Hs(o);
}
function Hs(o) {
  return St(o, jt([90], 39));
}
function Nn(o) {
  return St(o, jt([41], 49));
}
function Bn(o) {
  return St(o, jt([42], 49));
}
var Mo = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|"),
  "g",
);
var Q;
(function (o) {
  o.removed = "removed", o.common = "common", o.added = "added";
})(Q || (Q = {}));
var Un = 1, Ls = 2, Dn = 3;
function Mn(o, e, t) {
  let r = [];
  if (o.length === 0 || e.length === 0) return [];
  for (let n = 0; n < Math.min(o.length, e.length); n += 1) {
    if (o[t ? o.length - n - 1 : n] === e[t ? e.length - n - 1 : n]) {
      r.push(o[t ? o.length - n - 1 : n]);
    } else return r;
  }
  return r;
}
function Tr(o, e) {
  let t = Mn(o, e), r = Mn(o.slice(t.length), e.slice(t.length), !0).reverse();
  o = r.length ? o.slice(t.length, -r.length) : o.slice(t.length),
    e = r.length ? e.slice(t.length, -r.length) : e.slice(t.length);
  let n = e.length > o.length;
  [o, e] = n ? [e, o] : [o, e];
  let s = o.length, i = e.length;
  if (!s && !i && !r.length && !t.length) return [];
  if (!i) {
    return [
      ...t.map((g) => ({ type: Q.common, value: g })),
      ...o.map((g) => ({ type: n ? Q.added : Q.removed, value: g })),
      ...r.map((g) => ({ type: Q.common, value: g })),
    ];
  }
  let a = i,
    c = s - i,
    l = s + i + 1,
    d = Array.from({ length: l }, () => ({ y: -1, id: -1 })),
    p = new Uint32Array((s * i + l + 1) * 2),
    m = p.length / 2,
    h = 0,
    y = -1;
  function k(g, F, U, he) {
    let N = g.length,
      ee = F.length,
      Y = [],
      fe = N - 1,
      R = ee - 1,
      ie = p[U.id],
      b = p[U.id + m];
    for (; !(!ie && !b);) {
      let v = ie;
      b === Un
        ? (Y.unshift({ type: he ? Q.removed : Q.added, value: F[R] }), R -= 1)
        : b === Dn
        ? (Y.unshift({ type: he ? Q.added : Q.removed, value: g[fe] }), fe -= 1)
        : (Y.unshift({ type: Q.common, value: g[fe] }), fe -= 1, R -= 1),
        ie = p[v],
        b = p[v + m];
    }
    return Y;
  }
  function P(g, F, U, he) {
    if (g && g.y === -1 && F && F.y === -1) return { y: 0, id: 0 };
    if (F && F.y === -1 || U === he || (g && g.y) > (F && F.y) + 1) {
      let N = g.id;
      return h++, p[h] = N, p[h + m] = Dn, { y: g.y, id: h };
    } else {
      let N = F.id;
      return h++, p[h] = N, p[h + m] = Un, { y: F.y + 1, id: h };
    }
  }
  function I(g, F, U, he, N, ee) {
    let Y = N.length, fe = ee.length;
    if (g < -fe || Y < g) return { y: -1, id: -1 };
    let R = P(F, U, g, Y);
    for (; R.y + g < Y && R.y < fe && N[R.y + g] === ee[R.y];) {
      let ie = R.id;
      h++, R.id = h, R.y += 1, p[h] = ie, p[h + m] = Ls;
    }
    return R;
  }
  for (; d[c + a].y < i;) {
    y = y + 1;
    for (let g = -y; g < c; ++g) {
      d[g + a] = I(g, d[g - 1 + a], d[g + 1 + a], a, o, e);
    }
    for (let g = c + y; g > c; --g) {
      d[g + a] = I(g, d[g - 1 + a], d[g + 1 + a], a, o, e);
    }
    d[c + a] = I(c, d[c - 1 + a], d[c + 1 + a], a, o, e);
  }
  return [
    ...t.map((g) => ({ type: Q.common, value: g })),
    ...k(o, e, d[c + a], n),
    ...r.map((g) => ({ type: Q.common, value: g })),
  ];
}
function Ln(o, e) {
  function t(d) {
    return d.replaceAll("\b", "\\b").replaceAll("\f", "\\f").replaceAll(
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
  function r(d, { wordDiff: p = !1 } = {}) {
    if (p) {
      let m = d.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),
        h =
          /^[a-zA-Z\u{C0}-\u{FF}\u{D8}-\u{F6}\u{F8}-\u{2C6}\u{2C8}-\u{2D7}\u{2DE}-\u{2FF}\u{1E00}-\u{1EFF}]+$/u;
      for (let y = 0; y < m.length - 1; y++) {
        !m[y + 1] && m[y + 2] && h.test(m[y]) && h.test(m[y + 2]) &&
          (m[y] += m[y + 2], m.splice(y + 1, 2), y--);
      }
      return m.filter((y) => y);
    } else {
      let m = [], h = d.split(/(\n|\r\n)/);
      h[h.length - 1] || h.pop();
      for (let y = 0; y < h.length; y++) {
        y % 2 ? m[m.length - 1] += h[y] : m.push(h[y]);
      }
      return m;
    }
  }
  function n(d, p) {
    return p.filter(({ type: m }) => m === d.type || m === Q.common).map((
      m,
      h,
      y,
    ) => (m.type === Q.common && y[h - 1] &&
      y[h - 1]?.type === y[h + 1]?.type && /\s+/.test(m.value) &&
      (m.type = y[h - 1].type),
      m)
    );
  }
  let s = Tr(
      r(`${t(o)}
`),
      r(`${t(e)}
`),
    ),
    i = [],
    a = [];
  for (let d of s) {
    d.type === Q.added && i.push(d), d.type === Q.removed && a.push(d);
  }
  let c = i.length < a.length ? i : a, l = c === a ? i : a;
  for (let d of c) {
    let p = [], m;
    for (
      ;
      l.length &&
      (m = l.shift(),
        p = Tr(
          r(d.value, { wordDiff: !0 }),
          r(m?.value ?? "", { wordDiff: !0 }),
        ),
        !p.some(({ type: h, value: y }) => h === Q.common && y.trim().length));
    );
    d.details = n(d, p), m && (m.details = n(m, p));
  }
  return s;
}
function Hn(o, { background: e = !1 } = {}) {
  switch (e = !1, o) {
    case Q.added:
      return (t) => e ? Bn($r(t)) : tn(Lt(t));
    case Q.removed:
      return (t) => e ? Nn($r(t)) : Qt(Lt(t));
    default:
      return $r;
  }
}
function Fs(o) {
  switch (o) {
    case Q.added:
      return "+   ";
    case Q.removed:
      return "-   ";
    default:
      return "    ";
  }
}
function Fn(o, { stringDiff: e = !1 } = {}) {
  let t = [], r = [];
  return t.push(""),
    t.push(""),
    t.push(
      `    ${Cn(Lt("[Diff]"))} ${Qt(Lt("Actual"))} / ${tn(Lt("Expected"))}`,
    ),
    t.push(""),
    t.push(""),
    o.forEach((n) => {
      let s = Hn(n.type),
        i = n.details?.map((a) =>
          a.type !== Q.common
            ? Hn(a.type, { background: !0 })(a.value)
            : a.value
        ).join("") ?? n.value;
      r.push(s(`${Fs(n.type)}${i}`));
    }),
    t.push(...e ? [r.join("")] : r),
    t.push(""),
    t;
}
function rn(o) {
  let { Deno: e } = Sr;
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
var Rs = "[Cannot display]",
  Ar = class extends Error {
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
function Rn(o) {
  return [Symbol.iterator, "size"].every((e) => e in o);
}
function qs(o, e) {
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
      if (n && s && !zs(n, s)) return !1;
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
      if (t.set(n, s), Rn(n) && Rn(s)) {
        if (n.size !== s.size) return !1;
        let a = n.size;
        for (let [c, l] of n.entries()) {
          for (let [d, p] of s.entries()) {
            if (c === l && d === p && r(c, d) || r(c, d) && r(l, p)) {
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
function zs(o, e) {
  return o.constructor === e.constructor ||
    o.constructor === Object && !e.constructor ||
    !o.constructor && e.constructor === Object;
}
function f(o, e = "") {
  if (!o) throw new Ar(e);
}
function er(o, e, t) {
  if (qs(o, e)) return;
  let r = "", n = rn(o), s = rn(e);
  try {
    let i = typeof o == "string" && typeof e == "string",
      a = i ? Ln(o, e) : Tr(
        n.split(`
`),
        s.split(`
`),
      );
    r = `Values are not equal:
${
      Fn(a, { stringDiff: i }).join(`
`)
    }`;
  } catch {
    r = `
${Qt(Rs)} + 

`;
  }
  throw t && (r = t), new Ar(r);
}
var $ = {};
Ns($, {
  Blockfrost: () => hn,
  C: () => u,
  Constr: () => me,
  Data: () => zt,
  Emulator: () => pr,
  Kupmios: () => mn,
  Lucid: () => hr,
  M: () => H,
  MerkleTree: () => ur,
  PROTOCOL_PARAMETERS_DEFAULT: () => sn,
  SLOT_CONFIG_NETWORK: () => Et,
  Tx: () => fr,
  TxComplete: () => Ct,
  TxSigned: () => cr,
  Utils: () => nr,
  applyDoubleCborEncoding: () => Ue,
  applyParamsToScript: () => ho,
  assetsToValue: () => sr,
  combineHash: () => Mr,
  concat: () => pn,
  coreToUtxo: () => or,
  coreToUtxo_: () => Ur,
  createCostModels: () => nn,
  datumJsonToCbor: () => go,
  equals: () => ir,
  fromHex: () => x,
  fromLabel: () => bs,
  fromScriptRef: () => ps,
  fromText: () => dn,
  fromUnit: () => Dr,
  generatePrivateKey: () => ls,
  generateSeedPhrase: () => fs,
  getAddressDetails: () => be,
  nativeScriptFromJson: () => gs,
  networkToId: () => rt,
  paymentCredentialOf: () => nt,
  sha256: () => ar,
  slotToBeginUnixTime: () => cn,
  stakeCredentialOf: () => cs,
  toHex: () => _,
  toLabel: () => ms,
  toPublicKey: () => fo,
  toScriptRef: () => Br,
  toText: () => lo,
  toUnit: () => po,
  unixTimeToEnclosingSlot: () => ln,
  utxoToCore: () => st,
  valueToAssets: () => ds,
});
import * as u from "../esm/lucid/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js";
import * as H from "../esm/lucid/src/core/libs/cardano_message_signing/cardano_message_signing.generated.js";
var Er = {
  name: "lucid-cardano",
  version: "0.10.2",
  license: "MIT",
  author: "Alessandro Konrad",
  description:
    "Lucid is a library, which allows you to create Cardano transactions and off-chain code for your Plutus contracts in JavaScript, Deno and Node.js.",
  repository: "https://github.com/spacebudz/lucid",
};
async function qn(o, e) {
  try {
    await o.instantiate({
      url: new URL(e, `https://deno.land/x/lucid@${Er.version}/src/core/libs/`),
    });
  } catch {}
}
await Promise.all([
  qn(u, "cardano_multiplatform_lib/cardano_multiplatform_lib_bg.wasm"),
  qn(H, "cardano_message_signing/cardano_message_signing_bg.wasm"),
]);
function nn(o) {
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
var sn = {
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
var zn = new TextEncoder().encode("0123456789abcdef");
function Ks(o) {
  return new Error(
    "encoding/hex: invalid byte: " +
      new TextDecoder().decode(new Uint8Array([o])),
  );
}
function Ws() {
  return new Error("encoding/hex: odd length hex string");
}
function on(o) {
  if (48 <= o && o <= 57) return o - 48;
  if (97 <= o && o <= 102) return o - 97 + 10;
  if (65 <= o && o <= 70) return o - 65 + 10;
  throw Ks(o);
}
function Vs(o) {
  return o * 2;
}
function Js(o) {
  let e = new Uint8Array(Vs(o.length));
  for (let t = 0; t < e.length; t++) {
    let r = o[t];
    e[t * 2] = zn[r >> 4], e[t * 2 + 1] = zn[r & 15];
  }
  return e;
}
function Kn(o) {
  return new TextDecoder().decode(Js(o));
}
function an(o) {
  let e = new Uint8Array(Gs(o.length));
  for (let t = 0; t < e.length; t++) {
    let r = on(o[t * 2]), n = on(o[t * 2 + 1]);
    e[t] = r << 4 | n;
  }
  if (o.length % 2 == 1) throw on(o[e.length * 2]), Ws();
  return e;
}
function Gs(o) {
  return o >>> 1;
}
function Wn(o) {
  return an(new TextEncoder().encode(o));
}
var B = function (o, e, t, r, n) {
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
  O = function (o, e, t, r) {
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
  ft,
  $t,
  Be,
  Ft,
  tr,
  Re,
  qe,
  ze,
  Ke,
  We,
  Ve,
  Je,
  Ge,
  Tt,
  Rt,
  dt,
  Cr,
  pt,
  Zs,
  Ys,
  Xs,
  Qs,
  S = "0123456789abcdef".split(""),
  eo = [-2147483648, 8388608, 32768, 128],
  Ne = [24, 16, 8, 0],
  Ir = [
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
  ue = [],
  qt = class {
    constructor(e = !1, t = !1) {
      ft.set(this, void 0),
        $t.set(this, void 0),
        Be.set(this, void 0),
        Ft.set(this, void 0),
        tr.set(this, void 0),
        Re.set(this, void 0),
        qe.set(this, void 0),
        ze.set(this, void 0),
        Ke.set(this, void 0),
        We.set(this, void 0),
        Ve.set(this, void 0),
        Je.set(this, void 0),
        Ge.set(this, void 0),
        Tt.set(this, void 0),
        Rt.set(this, void 0),
        dt.set(this, void 0),
        Cr.set(this, 0),
        pt.set(this, void 0),
        this.init(e, t);
    }
    init(e, t) {
      t
        ? (ue[0] =
          ue[16] =
          ue[1] =
          ue[2] =
          ue[3] =
          ue[4] =
          ue[5] =
          ue[6] =
          ue[7] =
          ue[8] =
          ue[9] =
          ue[10] =
          ue[11] =
          ue[12] =
          ue[13] =
          ue[14] =
          ue[15] =
            0,
          B(this, $t, ue, "f"))
        : B(this, $t, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "f"),
        e
          ? (B(this, Re, 3238371032, "f"),
            B(this, qe, 914150663, "f"),
            B(this, ze, 812702999, "f"),
            B(this, Ke, 4144912697, "f"),
            B(this, We, 4290775857, "f"),
            B(this, Ve, 1750603025, "f"),
            B(this, Je, 1694076839, "f"),
            B(this, Ge, 3204075428, "f"))
          : (B(this, Re, 1779033703, "f"),
            B(this, qe, 3144134277, "f"),
            B(this, ze, 1013904242, "f"),
            B(this, Ke, 2773480762, "f"),
            B(this, We, 1359893119, "f"),
            B(this, Ve, 2600822924, "f"),
            B(this, Je, 528734635, "f"),
            B(this, Ge, 1541459225, "f")),
        B(
          this,
          ft,
          B(this, pt, B(this, Be, B(this, Rt, 0, "f"), "f"), "f"),
          "f",
        ),
        B(this, Ft, B(this, Tt, !1, "f"), "f"),
        B(this, tr, !0, "f"),
        B(this, dt, e, "f");
    }
    update(e) {
      if (O(this, Ft, "f")) return this;
      let t;
      e instanceof ArrayBuffer ? t = new Uint8Array(e) : t = e;
      let r = 0, n = t.length, s = O(this, $t, "f");
      for (; r < n;) {
        let i;
        if (
          O(this, Tt, "f") &&
          (B(this, Tt, !1, "f"),
            s[0] = O(this, ft, "f"),
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
          for (i = O(this, pt, "f"); r < n && i < 64; ++r) {
            s[i >> 2] |= t[r] << Ne[i++ & 3];
          }
        } else {for (
            i = O(this, pt, "f");
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
        B(this, Cr, i, "f"),
          B(this, Be, O(this, Be, "f") + (i - O(this, pt, "f")), "f"),
          i >= 64
            ? (B(this, ft, s[16], "f"),
              B(this, pt, i - 64, "f"),
              this.hash(),
              B(this, Tt, !0, "f"))
            : B(this, pt, i, "f");
      }
      return O(this, Be, "f") > 4294967295 &&
        (B(
          this,
          Rt,
          O(this, Rt, "f") + (O(this, Be, "f") / 4294967296 << 0),
          "f",
        ),
          B(this, Be, O(this, Be, "f") % 4294967296, "f")),
        this;
    }
    finalize() {
      if (O(this, Ft, "f")) return;
      B(this, Ft, !0, "f");
      let e = O(this, $t, "f"), t = O(this, Cr, "f");
      e[16] = O(this, ft, "f"),
        e[t >> 2] |= eo[t & 3],
        B(this, ft, e[16], "f"),
        t >= 56 &&
        (O(this, Tt, "f") || this.hash(),
          e[0] = O(this, ft, "f"),
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
        e[14] = O(this, Rt, "f") << 3 | O(this, Be, "f") >>> 29,
        e[15] = O(this, Be, "f") << 3,
        this.hash();
    }
    hash() {
      let e = O(this, Re, "f"),
        t = O(this, qe, "f"),
        r = O(this, ze, "f"),
        n = O(this, Ke, "f"),
        s = O(this, We, "f"),
        i = O(this, Ve, "f"),
        a = O(this, Je, "f"),
        c = O(this, Ge, "f"),
        l = O(this, $t, "f"),
        d,
        p,
        m,
        h,
        y,
        k,
        P,
        I,
        g,
        F;
      for (let U = 16; U < 64; ++U) {
        h = l[U - 15],
          d = (h >>> 7 | h << 25) ^ (h >>> 18 | h << 14) ^ h >>> 3,
          h = l[U - 2],
          p = (h >>> 17 | h << 15) ^ (h >>> 19 | h << 13) ^ h >>> 10,
          l[U] = l[U - 16] + d + l[U - 7] + p << 0;
      }
      F = t & r;
      for (let U = 0; U < 64; U += 4) {
        O(this, tr, "f")
          ? (O(this, dt, "f")
            ? (P = 300032,
              h = l[0] - 1413257819,
              c = h - 150054599 << 0,
              n = h + 24177077 << 0)
            : (P = 704751109,
              h = l[0] - 210244248,
              c = h - 1521486534 << 0,
              n = h + 143694565 << 0),
            B(this, tr, !1, "f"))
          : (d = (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^
            (e >>> 22 | e << 10),
            p = (s >>> 6 | s << 26) ^ (s >>> 11 | s << 21) ^
              (s >>> 25 | s << 7),
            P = e & t,
            m = P ^ e & r ^ F,
            k = s & i ^ ~s & a,
            h = c + p + k + Ir[U] + l[U],
            y = d + m,
            c = n + h << 0,
            n = h + y << 0),
          d = (n >>> 2 | n << 30) ^ (n >>> 13 | n << 19) ^ (n >>> 22 | n << 10),
          p = (c >>> 6 | c << 26) ^ (c >>> 11 | c << 21) ^ (c >>> 25 | c << 7),
          I = n & e,
          m = I ^ n & t ^ P,
          k = c & s ^ ~c & i,
          h = a + p + k + Ir[U + 1] + l[U + 1],
          y = d + m,
          a = r + h << 0,
          r = h + y << 0,
          d = (r >>> 2 | r << 30) ^ (r >>> 13 | r << 19) ^ (r >>> 22 | r << 10),
          p = (a >>> 6 | a << 26) ^ (a >>> 11 | a << 21) ^ (a >>> 25 | a << 7),
          g = r & n,
          m = g ^ r & e ^ I,
          k = a & c ^ ~a & s,
          h = i + p + k + Ir[U + 2] + l[U + 2],
          y = d + m,
          i = t + h << 0,
          t = h + y << 0,
          d = (t >>> 2 | t << 30) ^ (t >>> 13 | t << 19) ^ (t >>> 22 | t << 10),
          p = (i >>> 6 | i << 26) ^ (i >>> 11 | i << 21) ^ (i >>> 25 | i << 7),
          F = t & r,
          m = F ^ t & n ^ g,
          k = i & a ^ ~i & c,
          h = s + p + k + Ir[U + 3] + l[U + 3],
          y = d + m,
          s = e + h << 0,
          e = h + y << 0;
      }
      B(this, Re, O(this, Re, "f") + e << 0, "f"),
        B(this, qe, O(this, qe, "f") + t << 0, "f"),
        B(this, ze, O(this, ze, "f") + r << 0, "f"),
        B(this, Ke, O(this, Ke, "f") + n << 0, "f"),
        B(this, We, O(this, We, "f") + s << 0, "f"),
        B(this, Ve, O(this, Ve, "f") + i << 0, "f"),
        B(this, Je, O(this, Je, "f") + a << 0, "f"),
        B(this, Ge, O(this, Ge, "f") + c << 0, "f");
    }
    hex() {
      this.finalize();
      let e = O(this, Re, "f"),
        t = O(this, qe, "f"),
        r = O(this, ze, "f"),
        n = O(this, Ke, "f"),
        s = O(this, We, "f"),
        i = O(this, Ve, "f"),
        a = O(this, Je, "f"),
        c = O(this, Ge, "f"),
        l = S[e >> 28 & 15] + S[e >> 24 & 15] + S[e >> 20 & 15] +
          S[e >> 16 & 15] + S[e >> 12 & 15] + S[e >> 8 & 15] + S[e >> 4 & 15] +
          S[e & 15] + S[t >> 28 & 15] + S[t >> 24 & 15] + S[t >> 20 & 15] +
          S[t >> 16 & 15] + S[t >> 12 & 15] + S[t >> 8 & 15] + S[t >> 4 & 15] +
          S[t & 15] + S[r >> 28 & 15] + S[r >> 24 & 15] + S[r >> 20 & 15] +
          S[r >> 16 & 15] + S[r >> 12 & 15] + S[r >> 8 & 15] + S[r >> 4 & 15] +
          S[r & 15] + S[n >> 28 & 15] + S[n >> 24 & 15] + S[n >> 20 & 15] +
          S[n >> 16 & 15] + S[n >> 12 & 15] + S[n >> 8 & 15] + S[n >> 4 & 15] +
          S[n & 15] + S[s >> 28 & 15] + S[s >> 24 & 15] + S[s >> 20 & 15] +
          S[s >> 16 & 15] + S[s >> 12 & 15] + S[s >> 8 & 15] + S[s >> 4 & 15] +
          S[s & 15] + S[i >> 28 & 15] + S[i >> 24 & 15] + S[i >> 20 & 15] +
          S[i >> 16 & 15] + S[i >> 12 & 15] + S[i >> 8 & 15] + S[i >> 4 & 15] +
          S[i & 15] + S[a >> 28 & 15] + S[a >> 24 & 15] + S[a >> 20 & 15] +
          S[a >> 16 & 15] + S[a >> 12 & 15] + S[a >> 8 & 15] + S[a >> 4 & 15] +
          S[a & 15];
      return O(this, dt, "f") ||
        (l += S[c >> 28 & 15] + S[c >> 24 & 15] + S[c >> 20 & 15] +
          S[c >> 16 & 15] + S[c >> 12 & 15] + S[c >> 8 & 15] + S[c >> 4 & 15] +
          S[c & 15]),
        l;
    }
    toString() {
      return this.hex();
    }
    digest() {
      this.finalize();
      let e = O(this, Re, "f"),
        t = O(this, qe, "f"),
        r = O(this, ze, "f"),
        n = O(this, Ke, "f"),
        s = O(this, We, "f"),
        i = O(this, Ve, "f"),
        a = O(this, Je, "f"),
        c = O(this, Ge, "f"),
        l = [
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
      return O(this, dt, "f") ||
        l.push(c >> 24 & 255, c >> 16 & 255, c >> 8 & 255, c & 255),
        l;
    }
    array() {
      return this.digest();
    }
    arrayBuffer() {
      this.finalize();
      let e = new ArrayBuffer(O(this, dt, "f") ? 28 : 32), t = new DataView(e);
      return t.setUint32(0, O(this, Re, "f")),
        t.setUint32(4, O(this, qe, "f")),
        t.setUint32(8, O(this, ze, "f")),
        t.setUint32(12, O(this, Ke, "f")),
        t.setUint32(16, O(this, We, "f")),
        t.setUint32(20, O(this, Ve, "f")),
        t.setUint32(24, O(this, Je, "f")),
        O(this, dt, "f") || t.setUint32(28, O(this, Ge, "f")),
        e;
    }
  };
ft = new WeakMap(),
  $t = new WeakMap(),
  Be = new WeakMap(),
  Ft = new WeakMap(),
  tr = new WeakMap(),
  Re = new WeakMap(),
  qe = new WeakMap(),
  ze = new WeakMap(),
  Ke = new WeakMap(),
  We = new WeakMap(),
  Ve = new WeakMap(),
  Je = new WeakMap(),
  Ge = new WeakMap(),
  Tt = new WeakMap(),
  Rt = new WeakMap(),
  dt = new WeakMap(),
  Cr = new WeakMap(),
  pt = new WeakMap();
Zs = new WeakMap(), Ys = new WeakMap(), Xs = new WeakMap(), Qs = new WeakMap();
var Vn = "Invalid mnemonic",
  At = "Invalid entropy",
  to = "Invalid mnemonic checksum",
  Jn = `A wordlist is required but a default could not be found.
Please pass a 2048 word array explicitly.`;
function Gn(o, e) {
  if (e = e || ts, !e) throw new Error(Jn);
  let t = so(o).split(" ");
  if (t.length % 3 !== 0) throw new Error(Vn);
  let r = t.map((d) => {
      let p = e.indexOf(d);
      if (p === -1) throw new Error(Vn);
      return Xn(p.toString(2), "0", 11);
    }).join(""),
    n = Math.floor(r.length / 33) * 32,
    s = r.slice(0, n),
    i = r.slice(n),
    a = s.match(/(.{1,8})/g).map(es);
  if (a.length < 16) throw new Error(At);
  if (a.length > 32) throw new Error(At);
  if (a.length % 4 !== 0) throw new Error(At);
  let c = new Uint8Array(a);
  if (Yn(c) !== i) throw new Error(to);
  return _(c);
}
function ro(o) {
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
function Zn(o, e, t) {
  if (o = o || 128, o % 32 !== 0) throw new TypeError(At);
  return e = e || ro, no(e(o / 8), t);
}
function no(o, e) {
  if (e = e || ts, !e) throw new Error(Jn);
  if (o.length < 16) throw new TypeError(At);
  if (o.length > 32) throw new TypeError(At);
  if (o.length % 4 !== 0) throw new TypeError(At);
  let t = Qn(Array.from(o)),
    r = Yn(o),
    i = (t + r).match(/(.{1,11})/g).map((a) => {
      let c = es(a);
      return e[c];
    });
  return e[0] === "\u3042\u3044\u3053\u304F\u3057\u3093"
    ? i.join("\u3000")
    : i.join(" ");
}
function Yn(o) {
  let t = o.length * 8 / 32, r = new qt().update(o).digest();
  return Qn(Array.from(r)).slice(0, t);
}
function Xn(o, e, t) {
  for (; o.length < t;) o = e + o;
  return o;
}
function Qn(o) {
  return o.map((e) => Xn(e.toString(2), "0", 8)).join("");
}
function so(o) {
  return (o || "").normalize("NFKD");
}
function es(o) {
  return parseInt(o, 2);
}
var ts = [
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
var un = [
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
typeof Int32Array < "u" && (un = new Int32Array(un));
function rs(o, e = 0) {
  let t = ~~e;
  for (let r = 0; r < o.length; r++) t = un[(t ^ o[r]) & 255] & 255;
  return t;
}
var Et = {
  Mainnet: { zeroTime: 1596059091e3, zeroSlot: 4492800, slotLength: 1e3 },
  Preview: { zeroTime: 1666656e6, zeroSlot: 0, slotLength: 1e3 },
  Preprod: { zeroTime: 16557696e5, zeroSlot: 86400, slotLength: 1e3 },
  Custom: { zeroTime: 0, zeroSlot: 0, slotLength: 0 },
};
function cn(o, e) {
  let t = (o - e.zeroSlot) * e.slotLength;
  return e.zeroTime + t;
}
function ln(o, e) {
  let t = o - e.zeroTime;
  return Math.floor(t / e.slotLength) + e.zeroSlot;
}
var D = Symbol.for("TypeBox.Kind"),
  It = Symbol.for("TypeBox.Hint"),
  le = Symbol.for("TypeBox.Modifier"),
  oo = 0,
  fn = class {
    ReadonlyOptional(e) {
      return { [le]: "ReadonlyOptional", ...e };
    }
    Readonly(e) {
      return { [le]: "Readonly", ...e };
    }
    Optional(e) {
      return { [le]: "Optional", ...e };
    }
    Any(e = {}) {
      return this.Create({ ...e, [D]: "Any" });
    }
    Array(e, t = {}) {
      return this.Create({ ...t, [D]: "Array", type: "array", items: e });
    }
    Boolean(e = {}) {
      return this.Create({ ...e, [D]: "Boolean", type: "boolean" });
    }
    ConstructorParameters(e, t = {}) {
      return this.Tuple([...e.parameters], { ...t });
    }
    Constructor(e, t, r = {}) {
      if (e[D] === "Tuple") {
        let n = e.items === void 0 ? [] : e.items;
        return this.Create({
          ...r,
          [D]: "Constructor",
          type: "object",
          instanceOf: "Constructor",
          parameters: n,
          returns: t,
        });
      } else {
        if (globalThis.Array.isArray(e)) {
          return this.Create({
            ...r,
            [D]: "Constructor",
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
        [D]: "Date",
        type: "object",
        instanceOf: "Date",
      });
    }
    Enum(e, t = {}) {
      let n = Object.keys(e).filter((s) => isNaN(s)).map((s) => e[s]).map((s) =>
        typeof s == "string"
          ? { [D]: "Literal", type: "string", const: s }
          : { [D]: "Literal", type: "number", const: s }
      );
      return this.Create({ ...t, [D]: "Union", [It]: "Enum", anyOf: n });
    }
    Function(e, t, r = {}) {
      if (e[D] === "Tuple") {
        let n = e.items === void 0 ? [] : e.items;
        return this.Create({
          ...r,
          [D]: "Function",
          type: "object",
          instanceOf: "Function",
          parameters: n,
          returns: t,
        });
      } else {
        if (globalThis.Array.isArray(e)) {
          return this.Create({
            ...r,
            [D]: "Function",
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
      return this.Create({ ...e, [D]: "Integer", type: "integer" });
    }
    Intersect(e, t = {}) {
      let r = (a) =>
          a[le] && a[le] === "Optional" || a[le] === "ReadonlyOptional",
        [n, s] = [new Set(), new Set()];
      for (let a of e) {
        for (let [c, l] of Object.entries(a.properties)) {
          r(l) && s.add(c);
        }
      }
      for (let a of e) {
        for (let c of Object.keys(a.properties)) {
          s.has(c) || n.add(c);
        }
      }
      let i = {};
      for (let a of e) {
        for (let [c, l] of Object.entries(a.properties)) {
          i[c] = i[c] === void 0
            ? l
            : { [D]: "Union", anyOf: [i[c], { ...l }] };
        }
      }
      return n.size > 0
        ? this.Create({
          ...t,
          [D]: "Object",
          type: "object",
          properties: i,
          required: [...n],
        })
        : this.Create({ ...t, [D]: "Object", type: "object", properties: i });
    }
    KeyOf(e, t = {}) {
      let r = Object.keys(e.properties).map((n) =>
        this.Create({ ...t, [D]: "Literal", type: "string", const: n })
      );
      return this.Create({ ...t, [D]: "Union", [It]: "KeyOf", anyOf: r });
    }
    Literal(e, t = {}) {
      return this.Create({ ...t, [D]: "Literal", const: e, type: typeof e });
    }
    Never(e = {}) {
      return this.Create({
        ...e,
        [D]: "Never",
        allOf: [{ type: "boolean", const: !1 }, { type: "boolean", const: !0 }],
      });
    }
    Null(e = {}) {
      return this.Create({ ...e, [D]: "Null", type: "null" });
    }
    Number(e = {}) {
      return this.Create({ ...e, [D]: "Number", type: "number" });
    }
    Object(e, t = {}) {
      let r = Object.keys(e),
        n = r.filter((i) => {
          let c = e[i][le];
          return c && (c === "Optional" || c === "ReadonlyOptional");
        }),
        s = r.filter((i) => !n.includes(i));
      return s.length > 0
        ? this.Create({
          ...t,
          [D]: "Object",
          type: "object",
          properties: e,
          required: s,
        })
        : this.Create({ ...t, [D]: "Object", type: "object", properties: e });
    }
    Omit(e, t, r = {}) {
      let n = t[D] === "Union" ? t.anyOf.map((i) => i.const) : t,
        s = { ...this.Clone(e), ...r, [It]: "Omit" };
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
      return Pe.Tuple(e.parameters, { ...t });
    }
    Partial(e, t = {}) {
      let r = { ...this.Clone(e), ...t, [It]: "Partial" };
      delete r.required;
      for (let n of Object.keys(r.properties)) {
        let s = r.properties[n];
        switch (s[le]) {
          case "ReadonlyOptional":
            s[le] = "ReadonlyOptional";
            break;
          case "Readonly":
            s[le] = "ReadonlyOptional";
            break;
          case "Optional":
            s[le] = "Optional";
            break;
          default:
            s[le] = "Optional";
            break;
        }
      }
      return this.Create(r);
    }
    Pick(e, t, r = {}) {
      let n = t[D] === "Union" ? t.anyOf.map((i) => i.const) : t,
        s = { ...this.Clone(e), ...r, [It]: "Pick" };
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
        [D]: "Promise",
        type: "object",
        instanceOf: "Promise",
        item: e,
      });
    }
    Record(e, t, r = {}) {
      if (e[D] === "Union") {
        return this.Object(
          e.anyOf.reduce((s, i) => ({ ...s, [i.const]: t }), {}),
          { ...r, [It]: "Record" },
        );
      }
      let n = ["Integer", "Number"].includes(e[D])
        ? "^(0|[1-9][0-9]*)$"
        : e[D] === "String" && e.pattern
        ? e.pattern
        : "^.*$";
      return this.Create({
        ...r,
        [D]: "Record",
        type: "object",
        patternProperties: { [n]: t },
        additionalProperties: !1,
      });
    }
    Recursive(e, t = {}) {
      t.$id === void 0 && (t.$id = `T${oo++}`);
      let r = e({ [D]: "Self", $ref: `${t.$id}` });
      return r.$id = t.$id, this.Create({ ...t, ...r });
    }
    Ref(e, t = {}) {
      if (e.$id === void 0) {
        throw Error("TypeBuilder.Ref: Referenced schema must specify an $id");
      }
      return this.Create({ ...t, [D]: "Ref", $ref: e.$id });
    }
    RegEx(e, t = {}) {
      return this.Create({
        ...t,
        [D]: "String",
        type: "string",
        pattern: e.source,
      });
    }
    Required(e, t = {}) {
      let r = { ...this.Clone(e), ...t, [It]: "Required" };
      r.required = Object.keys(r.properties);
      for (let n of Object.keys(r.properties)) {
        let s = r.properties[n];
        switch (s[le]) {
          case "ReadonlyOptional":
            s[le] = "Readonly";
            break;
          case "Readonly":
            s[le] = "Readonly";
            break;
          case "Optional":
            delete s[le];
            break;
          default:
            delete s[le];
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
      return this.Create({ ...e, [D]: "String", type: "string" });
    }
    Tuple(e, t = {}) {
      let n = e.length,
        s = e.length,
        i = e.length > 0
          ? {
            ...t,
            [D]: "Tuple",
            type: "array",
            items: e,
            additionalItems: !1,
            minItems: n,
            maxItems: s,
          }
          : { ...t, [D]: "Tuple", type: "array", minItems: n, maxItems: s };
      return this.Create(i);
    }
    Undefined(e = {}) {
      return this.Create({
        ...e,
        [D]: "Undefined",
        type: "null",
        typeOf: "Undefined",
      });
    }
    Union(e, t = {}) {
      return e.length === 0
        ? Pe.Never({ ...t })
        : this.Create({ ...t, [D]: "Union", anyOf: e });
    }
    Uint8Array(e = {}) {
      return this.Create({
        ...e,
        [D]: "Uint8Array",
        type: "object",
        instanceOf: "Uint8Array",
      });
    }
    Unknown(e = {}) {
      return this.Create({ ...e, [D]: "Unknown" });
    }
    Unsafe(e = {}) {
      return this.Create({ ...e, [D]: e[D] || "Unsafe" });
    }
    Void(e = {}) {
      return this.Create({ ...e, [D]: "Void", type: "null", typeOf: "Void" });
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
  Pe = new fn();
var me = class {
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
  zt = {
    Integer: function (o) {
      let e = Pe.Unsafe({ dataType: "integer" });
      return o && Object.entries(o).forEach(([t, r]) => {
        e[t] = r;
      }),
        e;
    },
    Bytes: function (o) {
      let e = Pe.Unsafe({ dataType: "bytes" });
      return o && Object.entries(o).forEach(([t, r]) => {
        e[t] = r;
      }),
        e;
    },
    Boolean: function () {
      return Pe.Unsafe({
        anyOf: [{
          title: "False",
          dataType: "constructor",
          index: 0,
          fields: [],
        }, { title: "True", dataType: "constructor", index: 1, fields: [] }],
      });
    },
    Any: function () {
      return Pe.Unsafe({ description: "Any Data." });
    },
    Array: function (o, e) {
      let t = Pe.Array(o);
      return rr(t, { dataType: "list", items: o }),
        e && Object.entries(e).forEach(([r, n]) => {
          t[r] = n;
        }),
        t;
    },
    Map: function (o, e, t) {
      let r = Pe.Unsafe({ dataType: "map", keys: o, values: e });
      return t && Object.entries(t).forEach(([n, s]) => {
        r[n] = s;
      }),
        r;
    },
    Object: function (o, e) {
      let t = Pe.Object(o);
      return rr(t, {
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
      let e = Pe.Union(o);
      return rr(e, {
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
      let t = Pe.Tuple(o);
      return rr(t, { dataType: "list", items: o }),
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
      let e = Pe.Literal(o);
      return rr(e, {
        anyOf: [{ dataType: "constructor", title: o, index: 0, fields: [] }],
      }),
        e;
    },
    Nullable: function (o) {
      return Pe.Unsafe({
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
    to: io,
    from: ao,
    fromJson: uo,
    toJson: co,
    void: function () {
      return "d87980";
    },
    castFrom: Ae,
    castTo: Ze,
  };
function io(o, e) {
  function t(n) {
    try {
      if (typeof n == "bigint") {
        return u.PlutusData.new_integer(u.BigInt.from_str(n.toString()));
      }
      if (typeof n == "string") return u.PlutusData.new_bytes(x(n));
      if (n instanceof me) {
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
  return _(t(r).to_bytes());
}
function ao(o, e) {
  function t(n) {
    if (n.kind() === 0) {
      let s = n.as_constr_plutus_data(), i = s.data(), a = [];
      for (let c = 0; c < i.len(); c++) a.push(t(i.get(c)));
      return new me(parseInt(s.alternative().to_str()), a);
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
      if (n.kind() === 4) return _(n.as_bytes());
    }
    throw new Error("Unsupported type");
  }
  let r = t(u.PlutusData.from_bytes(x(o)));
  return e ? Ae(r, e) : r;
}
function uo(o) {
  function e(t) {
    if (typeof t == "string") {
      return t.startsWith("0x") ? _(x(t.slice(2))) : dn(t);
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
function co(o) {
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
        return new TextDecoder(void 0, { fatal: !0 }).decode(x(t));
      } catch {
        return "0x" + _(x(t));
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
      return ns(o, e), o;
    }
    case "bytes": {
      if (typeof o != "string") {
        throw new Error("Could not type cast to bytes.");
      }
      return ss(o, e), o;
    }
    case "constructor": {
      if (
        o instanceof me && o.index === e.index &&
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
      if (!(o instanceof me)) throw new Error("Could not type cast to enum.");
      let r = e.anyOf.find((n) => n.index === o.index);
      if (!r || r.fields.length !== o.fields.length) {
        throw new Error("Could not type cast to enum.");
      }
      if (as(e)) {
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
      } else if (us(e)) {
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
        if (o instanceof me && o.index === 0 && e.hasConstr) {
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
        return os(o, e), o.map((r) => Ae(r, e.items));
      }
    case "map": {
      if (!(o instanceof Map)) throw new Error("Could not type cast to map.");
      is(o, e);
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
      return ns(o, e), o;
    }
    case "bytes": {
      if (typeof o != "string") {
        throw new Error("Could not type cast to bytes.");
      }
      return ss(o, e), o;
    }
    case "constructor": {
      if (typeof o != "object" || o === null) {
        throw new Error("Could not type cast to constructor.");
      }
      let r = e.fields.map((n) => Ze(o[n.title], n));
      return e.hasConstr || e.hasConstr === void 0 ? new me(e.index, r) : r;
    }
    case "enum": {
      if (e.anyOf.length === 1) return Ze(o, e.anyOf[0]);
      if (as(e)) {
        if (typeof o != "boolean") {
          throw new Error("Could not type cast to boolean.");
        }
        return new me(o ? 1 : 0, []);
      } else if (us(e)) {
        if (o === null) return new me(1, []);
        {
          let r = e.anyOf[0].fields;
          if (r.length !== 1) {
            throw new Error("Could not type cast to nullable object.");
          }
          return new me(0, [Ze(o, r[0])]);
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
          return new me(r, []);
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
          return new me(n.index, o[r].map((s, i) => Ze(s, n.fields[i])));
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
        return e.hasConstr ? new me(0, r) : r;
      } else return os(o, e), o.map((r) => Ze(r, e.items));
    }
    case "map": {
      if (!(o instanceof Map)) throw new Error("Could not type cast to map.");
      is(o, e);
      let r = new Map();
      for (let [n, s] of o.entries()) r.set(Ze(n, e.keys), Ze(s, e.values));
      return r;
    }
    case void 0:
      return o;
  }
  throw new Error("Could not type cast struct.");
}
function ns(o, e) {
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
function ss(o, e) {
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
function os(o, e) {
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
function is(o, e) {
  if (e.minItems && o.size < e.minItems) {
    throw new Error(`Map needs to contain at least ${e.minItems} items.`);
  }
  if (e.maxItems && o.size > e.maxItems) {
    throw new Error(`Map can contain at most ${e.maxItems} items.`);
  }
}
function as(o) {
  return o.anyOf && o.anyOf[0]?.title === "False" &&
    o.anyOf[1]?.title === "True";
}
function us(o) {
  return o.anyOf && o.anyOf[0]?.title === "Some" &&
    o.anyOf[1]?.title === "None";
}
function rr(o, e) {
  Object.keys(o).forEach((t) => {
    delete o[t];
  }), Object.assign(o, e);
}
var nr = class {
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
        return u.NativeScript.from_bytes(x(e.script)).hash(
          u.ScriptHashNamespace.NativeScript,
        ).to_hex();
      case "PlutusV1":
        return u.PlutusScript.from_bytes(x(Ue(e.script))).hash(
          u.ScriptHashNamespace.PlutusV1,
        ).to_hex();
      case "PlutusV2":
        return u.PlutusScript.from_bytes(x(Ue(e.script))).hash(
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
    return u.hash_plutus_data(u.PlutusData.from_bytes(x(e))).to_hex();
  }
  scriptHashToCredential(e) {
    return { type: "Script", hash: e };
  }
  keyHashToCredential(e) {
    return { type: "Key", hash: e };
  }
  generatePrivateKey() {
    return ls();
  }
  generateSeedPhrase() {
    return fs();
  }
  unixTimeToSlot(e) {
    return ln(e, Et[this.lucid.network]);
  }
  slotToUnixTime(e) {
    return cn(e, Et[this.lucid.network]);
  }
  getAddressDetails(e) {
    return be(e);
  }
  nativeScriptFromJson(e) {
    return gs(e);
  }
  paymentCredentialOf(e) {
    return nt(e);
  }
  stakeCredentialOf(e) {
    return cs(e);
  }
};
function Nr(o) {
  try {
    return u.Address.from_bytes(x(o));
  } catch {
    try {
      return u.Address.from_bech32(o);
    } catch {
      throw new Error("Could not deserialize address.");
    }
  }
}
function be(o) {
  try {
    let e = u.BaseAddress.from_address(Nr(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: _(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: _(e.payment_cred().to_scripthash().to_bytes()),
        },
      r = e.stake_cred().kind() === 0
        ? { type: "Key", hash: _(e.stake_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: _(e.stake_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Base",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: _(e.to_address().to_bytes()),
      },
      paymentCredential: t,
      stakeCredential: r,
    };
  } catch {}
  try {
    let e = u.EnterpriseAddress.from_address(Nr(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: _(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: _(e.payment_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Enterprise",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: _(e.to_address().to_bytes()),
      },
      paymentCredential: t,
    };
  } catch {}
  try {
    let e = u.PointerAddress.from_address(Nr(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: _(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: _(e.payment_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Pointer",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: _(e.to_address().to_bytes()),
      },
      paymentCredential: t,
    };
  } catch {}
  try {
    let e = u.RewardAddress.from_address(Nr(o)),
      t = e.payment_cred().kind() === 0
        ? { type: "Key", hash: _(e.payment_cred().to_keyhash().to_bytes()) }
        : {
          type: "Script",
          hash: _(e.payment_cred().to_scripthash().to_bytes()),
        };
    return {
      type: "Reward",
      networkId: e.to_address().network_id(),
      address: {
        bech32: e.to_address().to_bech32(void 0),
        hex: _(e.to_address().to_bytes()),
      },
      stakeCredential: t,
    };
  } catch {}
  throw new Error("No address type matched for: " + o);
}
function nt(o) {
  let { paymentCredential: e } = be(o);
  if (!e) {
    throw new Error(
      "The specified address does not contain a payment credential.",
    );
  }
  return e;
}
function cs(o) {
  let { stakeCredential: e } = be(o);
  if (!e) {
    throw new Error(
      "The specified address does not contain a stake credential.",
    );
  }
  return e;
}
function ls() {
  return u.PrivateKey.generate_ed25519().to_bech32();
}
function fs() {
  return Zn(256);
}
function ds(o) {
  let e = {};
  e.lovelace = BigInt(o.coin().to_str());
  let t = o.multiasset();
  if (t) {
    let r = t.keys();
    for (let n = 0; n < r.len(); n++) {
      let s = r.get(n), i = t.get(s), a = i.keys();
      for (let c = 0; c < a.len(); c++) {
        let l = a.get(c), d = i.get(l), p = _(s.to_bytes()) + _(l.name());
        e[p] = BigInt(d.to_str());
      }
    }
  }
  return e;
}
function sr(o) {
  let e = u.MultiAsset.new(), t = o.lovelace, r = Object.keys(o);
  Array.from(
    new Set(r.filter((i) => i !== "lovelace").map((i) => i.slice(0, 56))),
  ).forEach((i) => {
    let a = r.filter((l) => l.slice(0, 56) === i), c = u.Assets.new();
    a.forEach((l) => {
      c.insert(
        u.AssetName.new(x(l.slice(56))),
        u.BigNum.from_str(o[l].toString()),
      );
    }), e.insert(u.ScriptHash.from_bytes(x(i)), c);
  });
  let s = u.Value.new(u.BigNum.from_str(t ? t.toString() : "0"));
  return (r.length > 1 || !t) && s.set_multiasset(e), s;
}
function ps(o) {
  switch (o.get().kind()) {
    case 0:
      return { type: "Native", script: _(o.get().as_native().to_bytes()) };
    case 1:
      return { type: "PlutusV1", script: _(o.get().as_plutus_v1().to_bytes()) };
    case 2:
      return { type: "PlutusV2", script: _(o.get().as_plutus_v2().to_bytes()) };
    default:
      throw new Error("No variant matched.");
  }
}
function Br(o) {
  switch (o.type) {
    case "Native":
      return u.ScriptRef.new(
        u.Script.new_native(u.NativeScript.from_bytes(x(o.script))),
      );
    case "PlutusV1":
      return u.ScriptRef.new(
        u.Script.new_plutus_v1(u.PlutusScript.from_bytes(x(Ue(o.script)))),
      );
    case "PlutusV2":
      return u.ScriptRef.new(
        u.Script.new_plutus_v2(u.PlutusScript.from_bytes(x(Ue(o.script)))),
      );
    default:
      throw new Error("No variant matched.");
  }
}
function st(o) {
  let e = (() => {
      try {
        return u.Address.from_bech32(o.address);
      } catch {
        return u.ByronAddress.from_base58(o.address).to_address();
      }
    })(),
    t = u.TransactionOutput.new(e, sr(o.assets));
  return o.datumHash &&
    t.set_datum(u.Datum.new_data_hash(u.DataHash.from_bytes(x(o.datumHash)))),
    !o.datumHash && o.datum &&
    t.set_datum(
      u.Datum.new_data(u.Data.new(u.PlutusData.from_bytes(x(o.datum)))),
    ),
    o.scriptRef && t.set_script_ref(Br(o.scriptRef)),
    u.TransactionUnspentOutput.new(
      u.TransactionInput.new(
        u.TransactionHash.from_bytes(x(o.txHash)),
        u.BigNum.from_str(o.outputIndex.toString()),
      ),
      t,
    );
}
function or(o) {
  return Ur(
    _(o.input().transaction_id().to_bytes()),
    parseInt(o.input().index().to_str()),
    o.output(),
  );
}
function Ur(o, e, t) {
  return {
    txHash: o,
    outputIndex: e,
    assets: ds(t.amount()),
    address: t.address().as_byron()
      ? t.address().as_byron()?.to_base58()
      : t.address().to_bech32(void 0),
    datumHash: t.datum()?.as_data_hash()?.to_hex(),
    datum: t.datum()?.as_data() && _(t.datum().as_data().get().to_bytes()),
    scriptRef: t.script_ref() && ps(t.script_ref()),
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
function x(o) {
  return Wn(o);
}
function _(o) {
  return Kn(o);
}
function lo(o) {
  return new TextDecoder().decode(an(new TextEncoder().encode(o)));
}
function dn(o) {
  return _(new TextEncoder().encode(o));
}
function fo(o) {
  return u.PrivateKey.from_bech32(o).to_public().to_bech32();
}
function hs(o) {
  return rs(x(o)).toString(16).padStart(2, "0");
}
function ms(o) {
  if (o < 0 || o > 65535) {
    throw new Error(`Label ${o} out of range: min label 1 - max label 65535.`);
  }
  let e = o.toString(16).padStart(4, "0");
  return "0" + e + hs(e) + "0";
}
function bs(o) {
  if (o.length !== 8 || !(o[0] === "0" && o[7] === "0")) return null;
  let e = o.slice(1, 5), t = parseInt(e, 16);
  return o.slice(5, 7) === hs(e) ? t : null;
}
function po(o, e, t) {
  let r = Number.isInteger(t) ? ms(t) : "", n = e || "";
  if ((n + r).length > 64) throw new Error("Asset name size exceeds 32 bytes.");
  if (o.length !== 56) throw new Error(`Policy id invalid: ${o}.`);
  return o + r + n;
}
function Dr(o) {
  let e = o.slice(0, 56),
    t = o.slice(56) || null,
    r = bs(o.slice(56, 64)),
    n = (() => (Number.isInteger(r) ? o.slice(64) : o.slice(56)) || null)();
  return { policyId: e, assetName: t, name: n, label: r };
}
function gs(o) {
  return {
    type: "Native",
    script: _(
      u.encode_json_str_to_native_script(
        JSON.stringify(o),
        "",
        u.ScriptSchema.Node,
      ).to_bytes(),
    ),
  };
}
function ho(o, e, t) {
  let r = t ? zt.castTo(e, t) : e;
  return _(
    u.apply_params_to_plutus_script(
      u.PlutusList.from_bytes(x(zt.to(r))),
      u.PlutusScript.from_bytes(x(Ue(o))),
    ).to_bytes(),
  );
}
function Ue(o) {
  try {
    return u.PlutusScript.from_bytes(u.PlutusScript.from_bytes(x(o)).bytes()),
      o;
  } catch {
    return _(u.PlutusScript.new(x(o)).to_bytes());
  }
}
function mo(o, e) {
  if (o.length !== e.length) return !1;
  for (let t = 0; t < e.length; t++) if (o[t] !== e[t]) return !1;
  return !0;
}
function bo(o, e) {
  if (o.length !== e.length) return !1;
  let t = o.length,
    r = Math.floor(t / 4),
    n = new Uint32Array(o.buffer, 0, r),
    s = new Uint32Array(e.buffer, 0, r);
  for (let i = r * 4; i < t; i++) if (o[i] !== e[i]) return !1;
  for (let i = 0; i < n.length; i++) if (n[i] !== s[i]) return !1;
  return !0;
}
function ir(o, e) {
  return o.length < 1e3 ? mo(o, e) : bo(o, e);
}
function pn(...o) {
  let e = 0;
  for (let n of o) e += n.length;
  let t = new Uint8Array(e), r = 0;
  for (let n of o) t.set(n, r), r += n.length;
  return t;
}
var ur = class {
  constructor(e) {
    Object.defineProperty(this, "root", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0,
    }), this.root = ur.buildRecursively(e.map((t) => ar(t)));
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
      : { node: Mr(s.node, i.node), left: s, right: i };
  }
  rootHash() {
    if (this.root === null) throw new Error("Merkle tree root hash not found.");
    return this.root.node;
  }
  getProof(e) {
    let t = ar(e),
      r = [],
      n = (s) => {
        if (s && ir(s.node, t)) return !0;
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
    let n = ar(e),
      s = (i, a) => {
        if (a.length <= 0) return ir(t, i);
        let [c, l] = [a[0], a.slice(1)];
        return c.left
          ? s(Mr(c.left, i), l)
          : c.right
          ? s(Mr(i, c.right), l)
          : !1;
      };
    return s(n, r);
  }
  toString() {
    let e = (t) =>
      t === null
        ? null
        : { node: _(t.node), left: e(t.left), right: e(t.right) };
    return JSON.stringify(e(this.root), null, 2);
  }
};
function ar(o) {
  return new Uint8Array(new qt().update(o).arrayBuffer());
}
function Mr(o, e) {
  return ar(pn(o, e));
}
var cr = class {
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
    let e = await (this.lucid.wallet || this.lucid.provider).submitTx(
      _(this.txSigned.to_bytes()),
    );
    return this.lucid.spentOutputs = [], this.lucid.addedOutputs = [], e;
  }
  toString() {
    return _(this.txSigned.to_bytes());
  }
  toHash() {
    return u.hash_transaction(this.txSigned.body()).to_hex();
  }
};
var Ct = class {
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
      Object.defineProperty(this, "fee", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "exUnits", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: null,
      }),
      this.lucid = e,
      this.txComplete = t,
      this.witnessSetBuilder = u.TransactionWitnessSetBuilder.new(),
      this.tasks = [],
      this.fee = parseInt(t.body().fee().to_str());
    let r = t.witness_set().redeemers();
    if (r) {
      let n = { cpu: 0, mem: 0 };
      for (let s = 0; s < r.len(); s++) {
        let i = r.get(s);
        n.cpu += parseInt(i.ex_units().steps().to_str()),
          n.mem += parseInt(i.ex_units().mem().to_str());
      }
      this.exUnits = n;
    }
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
    return this.witnessSetBuilder.add_existing(e), _(e.to_bytes());
  }
  partialSignWithPrivateKey(e) {
    let t = u.PrivateKey.from_bech32(e),
      r = u.make_vkey_witness(u.hash_transaction(this.txComplete.body()), t);
    this.witnessSetBuilder.add_vkey(r);
    let n = u.TransactionWitnessSetBuilder.new();
    return n.add_vkey(r), _(n.build().to_bytes());
  }
  assemble(e) {
    return e.forEach((t) => {
      let r = u.TransactionWitnessSet.from_bytes(x(t));
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
    return new cr(this.lucid, e);
  }
  toString() {
    return _(this.txComplete.to_bytes());
  }
  toHash() {
    return u.hash_transaction(this.txComplete.body()).to_hex();
  }
};
var fr = class {
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
          let s = u.PlutusData.from_bytes(x(r.datum));
          t.txBuilder.add_plutus_data(s);
        }
        let n = st(r);
        t.txBuilder.add_reference_input(n);
      }
    }),
      this;
  }
  collectFrom(e, t) {
    return this.tasks.push(async (r) => {
      for (let n of e) {
        n.datumHash && !n.datum && (n.datum = await r.lucid.datumOf(n));
        let s = st(n);
        r.txBuilder.add_input(
          s,
          t &&
            u.ScriptWitness.new_plutus_witness(
              u.PlutusWitness.new(
                u.PlutusData.from_bytes(x(t)),
                n.datumHash && n.datum
                  ? u.PlutusData.from_bytes(x(n.datum))
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
          u.AssetName.new(x(c.slice(56))),
          u.Int.from_str(e[c].toString()),
        );
      });
      let a = u.ScriptHash.from_bytes(x(s));
      r.txBuilder.add_mint(
        a,
        i,
        t
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(x(t)), void 0, void 0),
          )
          : void 0,
      );
    }),
      this;
  }
  payToAddress(e, t) {
    return this.tasks.push((r) => {
      let n = u.TransactionOutput.new(lr(e, r.lucid), sr(t));
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
      let s = u.TransactionOutput.new(lr(e, n.lucid), sr(r));
      if (t.hash) {
        s.set_datum(u.Datum.new_data_hash(u.DataHash.from_hex(t.hash)));
      } else if (t.asHash) {
        let a = u.PlutusData.from_bytes(x(t.asHash));
        s.set_datum(u.Datum.new_data_hash(u.hash_plutus_data(a))),
          n.txBuilder.add_plutus_data(a);
      } else if (t.inline) {
        let a = u.PlutusData.from_bytes(x(t.inline));
        s.set_datum(u.Datum.new_data(u.Data.new(a)));
      }
      let i = t.scriptRef;
      i && s.set_script_ref(Br(i)), n.txBuilder.add_output(s);
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
          u.Ed25519KeyHash.from_bytes(x(s.stakeCredential.hash)),
        )
        : u.StakeCredential.from_scripthash(
          u.ScriptHash.from_bytes(x(s.stakeCredential.hash)),
        );
      n.txBuilder.add_certificate(
        u.Certificate.new_stake_delegation(
          u.StakeDelegation.new(i, u.Ed25519KeyHash.from_bech32(t)),
        ),
        r
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(x(r)), void 0, void 0),
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
          u.Ed25519KeyHash.from_bytes(x(r.stakeCredential.hash)),
        )
        : u.StakeCredential.from_scripthash(
          u.ScriptHash.from_bytes(x(r.stakeCredential.hash)),
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
          u.Ed25519KeyHash.from_bytes(x(n.stakeCredential.hash)),
        )
        : u.StakeCredential.from_scripthash(
          u.ScriptHash.from_bytes(x(n.stakeCredential.hash)),
        );
      r.txBuilder.add_certificate(
        u.Certificate.new_stake_deregistration(u.StakeDeregistration.new(s)),
        t
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(x(t)), void 0, void 0),
          )
          : void 0,
      );
    }),
      this;
  }
  registerPool(e) {
    return this.tasks.push(async (t) => {
      let r = await ys(e, t.lucid), n = u.Certificate.new_pool_registration(r);
      t.txBuilder.add_certificate(n, void 0);
    }),
      this;
  }
  updatePool(e) {
    return this.tasks.push(async (t) => {
      let r = await ys(e, t.lucid);
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
        u.RewardAddress.from_address(lr(e, n.lucid)),
        u.BigNum.from_str(t.toString()),
        r
          ? u.ScriptWitness.new_plutus_witness(
            u.PlutusWitness.new(u.PlutusData.from_bytes(x(r)), void 0, void 0),
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
      t.txBuilder.add_required_signer(u.Ed25519KeyHash.from_bytes(x(e)));
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
        u.NetworkId.from_bytes(x(e.toString(16).padStart(2, "0"))),
      );
    }),
      this;
  }
  attachSpendingValidator(e) {
    return this.tasks.push((t) => {
      Hr(t, e);
    }),
      this;
  }
  attachMintingPolicy(e) {
    return this.tasks.push((t) => {
      Hr(t, e);
    }),
      this;
  }
  attachCertificateValidator(e) {
    return this.tasks.push((t) => {
      Hr(t, e);
    }),
      this;
  }
  attachWithdrawalValidator(e) {
    return this.tasks.push((t) => {
      Hr(t, e);
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
      ].filter((l) => l).length > 1
    ) {
      throw new Error(
        "Not allowed to set hash, asHash and inline at the same time.",
      );
    }
    let t = this.tasks.shift();
    for (; t;) await t(this), t = this.tasks.shift();
    let r = u.TransactionUnspentOutputs.new();
    this.lucid.chainingUtxos(await this.lucid.wallet.getUtxos()).forEach(
      (l) => {
        r.add(st(l));
      },
    );
    let n = lr(
      e?.change?.address || await this.lucid.wallet.address(),
      this.lucid,
    );
    (e?.coinSelection || e?.coinSelection === void 0) &&
    this.txBuilder.add_inputs_from(
      r,
      n,
      Uint32Array.from([200, 1e3, 1500, 800, 800, 5e3]),
    ),
      this.txBuilder.balance(
        n,
        (() =>
          e?.change?.outputData?.hash
            ? u.Datum.new_data_hash(
              u.DataHash.from_hex(e.change.outputData.hash),
            )
            : e?.change?.outputData?.asHash
            ? (this.txBuilder.add_plutus_data(
              u.PlutusData.from_bytes(x(e.change.outputData.asHash)),
            ),
              u.Datum.new_data_hash(
                u.hash_plutus_data(
                  u.PlutusData.from_bytes(x(e.change.outputData.asHash)),
                ),
              ))
            : e?.change?.outputData?.inline
            ? u.Datum.new_data(
              u.Data.new(
                u.PlutusData.from_bytes(x(e.change.outputData.inline)),
              ),
            )
            : void 0)(),
      );
    let s = new Ct(
        this.lucid,
        await this.txBuilder.construct(
          r,
          n,
          e?.nativeUplc === void 0 ? !0 : e?.nativeUplc,
        ),
      ),
      i = s.txComplete.body().inputs();
    for (let l = 0; l < i.len(); l++) {
      let d = i.get(l);
      this.lucid.spentOutputs.push({
        txHash: _(d.transaction_id().to_bytes()),
        outputIndex: parseInt(d.index().to_str()),
      });
    }
    let a = s.txComplete.body().outputs(), c = s.toHash();
    for (let l = 0; l < a.len(); l++) {
      let d = a.get(l);
      this.lucid.addedOutputs.push(Ur(c, l, d));
    }
    return s;
  }
  async toString() {
    let e = this.tasks.shift();
    for (; e;) await e(this), e = this.tasks.shift();
    return _(this.txBuilder.to_bytes());
  }
};
function Hr(o, { type: e, script: t }) {
  if (e === "Native") {
    return o.txBuilder.add_native_script(u.NativeScript.from_bytes(x(t)));
  }
  if (e === "PlutusV1") {
    return o.txBuilder.add_plutus_script(u.PlutusScript.from_bytes(x(Ue(t))));
  }
  if (e === "PlutusV2") {
    return o.txBuilder.add_plutus_v2_script(
      u.PlutusScript.from_bytes(x(Ue(t))),
    );
  }
  throw new Error("No variant matched.");
}
async function ys(o, e) {
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
              new Uint8Array(i.ipV4.split(".").map((l) => parseInt(l))),
            )
            : void 0,
          c = i.ipV6 ? u.Ipv6.new(x(i.ipV6.replaceAll(":", ""))) : void 0;
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
        u.RewardAddress.from_address(lr(o.rewardAddress, e)),
        t,
        s,
        n ? u.PoolMetadata.new(u.Url.new(o.metadataUrl), n) : void 0,
      ),
    );
}
function lr(o, e) {
  let t = e.utils.getAddressDetails(o), r = rt(e.network);
  if (t.networkId !== r) {
    throw new Error(
      `Invalid address: Expected address with network id ${r}, but got ${t.networkId}`,
    );
  }
  return u.Address.from_bech32(o);
}
function ws(
  o,
  e = { addressType: "Base", accountIndex: 0, network: "Mainnet" },
) {
  function t(h) {
    if (typeof h != "number") throw new Error("Type number required here!");
    return 2147483648 + h;
  }
  let r = Gn(o),
    s = u.Bip32PrivateKey.from_bip39_entropy(
      x(r),
      e.password ? new TextEncoder().encode(e.password) : new Uint8Array(),
    ).derive(t(1852)).derive(t(1815)).derive(t(e.accountIndex)),
    i = s.derive(0).derive(0).to_raw_key(),
    a = s.derive(2).derive(0).to_raw_key(),
    c = i.to_public().hash(),
    l = a.to_public().hash(),
    d = e.network === "Mainnet" ? 1 : 0,
    p = e.addressType === "Base"
      ? u.BaseAddress.new(
        d,
        u.StakeCredential.from_keyhash(c),
        u.StakeCredential.from_keyhash(l),
      ).to_address().to_bech32(void 0)
      : u.EnterpriseAddress.new(d, u.StakeCredential.from_keyhash(c))
        .to_address().to_bech32(void 0),
    m = e.addressType === "Base"
      ? u.RewardAddress.new(d, u.StakeCredential.from_keyhash(l)).to_address()
        .to_bech32(void 0)
      : null;
  return {
    address: p,
    rewardAddress: m,
    paymentKey: i.to_bech32(),
    stakeKey: e.addressType === "Base" ? a.to_bech32() : null,
  };
}
function xs(o, e, t) {
  let r = [], n = o.body().inputs();
  for (let h = 0; h < n.len(); h++) {
    let y = n.get(h),
      k = _(y.transaction_id().to_bytes()),
      P = parseInt(y.index().to_str()),
      I = t.find((g) => g.txHash === k && g.outputIndex === P);
    if (I) {
      let { paymentCredential: g } = be(I.address);
      r.push(g?.hash);
    }
  }
  let s = o.body();
  function i(h) {
    let y = h.certs();
    if (y) {
      for (let k = 0; k < y.len(); k++) {
        let P = y.get(k);
        if (P.kind() === 0) {
          P.as_stake_registration()?.stake_credential()?.kind();
        } else if (P.kind() === 1) {
          let I = P.as_stake_deregistration()?.stake_credential();
          if (I?.kind() === 0) {
            let g = _(I.to_keyhash().to_bytes());
            r.push(g);
          }
        } else if (P.kind() === 2) {
          let I = P.as_stake_delegation()?.stake_credential();
          if (I?.kind() === 0) {
            let g = _(I.to_keyhash().to_bytes());
            r.push(g);
          }
        } else if (P.kind() === 3) {
          let I = P.as_pool_registration()?.pool_params(), g = I?.pool_owners();
          if (!g) break;
          for (let U = 0; U < g.len(); U++) {
            let he = _(g.get(U).to_bytes());
            r.push(he);
          }
          let F = I.operator().to_hex();
          r.push(F);
        } else if (P.kind() === 4) {
          let I = P.as_pool_retirement().pool_keyhash().to_hex();
          r.push(I);
        } else if (P.kind() === 6) {
          let I = P.as_move_instantaneous_rewards_cert()
            ?.move_instantaneous_reward().as_to_stake_creds()?.keys();
          if (!I) break;
          for (let g = 0; g < I.len(); g++) {
            let F = I.get(g);
            if (F.kind() === 0) {
              let U = _(F.to_keyhash().to_bytes());
              r.push(U);
            }
          }
        }
      }
    }
  }
  s.certs() && i(s);
  let a = s.withdrawals();
  function c(h) {
    let y = h.keys();
    for (let k = 0; k < y.len(); k++) {
      let P = y.get(k).payment_cred();
      P.kind() === 0 && r.push(P.to_keyhash().to_hex());
    }
  }
  a && c(a);
  let l = o.witness_set().native_scripts();
  function d(h) {
    for (let y = 0; y < h.len(); y++) {
      let k = h.get(y);
      if (k.kind() === 0) {
        let P = _(k.as_script_pubkey().addr_keyhash().to_bytes());
        r.push(P);
      }
      if (k.kind() === 1) {
        d(k.as_script_all().native_scripts());
        return;
      }
      if (k.kind() === 2) {
        d(k.as_script_any().native_scripts());
        return;
      }
      if (k.kind() === 3) {
        d(k.as_script_n_of_k().native_scripts());
        return;
      }
    }
  }
  l && d(l);
  let p = s.required_signers();
  if (p) for (let h = 0; h < p.len(); h++) r.push(_(p.get(h).to_bytes()));
  let m = s.collateral();
  if (m) {
    for (let h = 0; h < m.len(); h++) {
      let y = m.get(h),
        k = _(y.transaction_id().to_bytes()),
        P = parseInt(y.index().to_str()),
        I = t.find((g) => g.txHash === k && g.outputIndex === P);
      if (I) {
        let { paymentCredential: g } = be(I.address);
        r.push(g?.hash);
      }
    }
  }
  return r.filter((h) => e.includes(h));
}
function dr(o, e, t) {
  let r = H.HeaderMap.new();
  r.set_algorithm_id(H.Label.from_algorithm_id(H.AlgorithmId.EdDSA)),
    r.set_header(H.Label.new_text("address"), H.CBORValue.new_bytes(x(o)));
  let n = H.ProtectedHeaderMap.new(r),
    s = H.HeaderMap.new(),
    i = H.Headers.new(n, s),
    a = H.COSESign1Builder.new(i, x(e), !1),
    c = a.make_data_to_sign().to_bytes(),
    l = u.PrivateKey.from_bech32(t),
    d = l.sign(c).to_bytes(),
    p = a.build(d),
    m = H.COSEKey.new(H.Label.from_key_type(H.KeyType.OKP));
  return m.set_algorithm_id(H.Label.from_algorithm_id(H.AlgorithmId.EdDSA)),
    m.set_header(
      H.Label.new_int(H.Int.new_negative(H.BigNum.from_str("1"))),
      H.CBORValue.new_int(H.Int.new_i32(6)),
    ),
    m.set_header(
      H.Label.new_int(H.Int.new_negative(H.BigNum.from_str("2"))),
      H.CBORValue.new_bytes(l.to_public().as_bytes()),
    ),
    { signature: _(p.to_bytes()), key: _(m.to_bytes()) };
}
function vs(o, e, t, r) {
  let n = H.COSESign1.from_bytes(x(r.signature)),
    s = H.COSEKey.from_bytes(x(r.key)),
    i = n.headers().protected().deserialized_headers(),
    a = (() => {
      try {
        return _(i.header(H.Label.new_text("address"))?.as_bytes());
      } catch {
        throw new Error("No address found in signature.");
      }
    })(),
    c = (() => {
      try {
        let P = i.algorithm_id()?.as_int();
        return P?.is_positive()
          ? parseInt(P.as_positive()?.to_str())
          : parseInt(P?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Algorithm Id.");
      }
    })(),
    l = (() => {
      try {
        let P = s.algorithm_id()?.as_int();
        return P?.is_positive()
          ? parseInt(P.as_positive()?.to_str())
          : parseInt(P?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Algorithm Id.");
      }
    })(),
    d = (() => {
      try {
        let P = s.header(
          H.Label.new_int(H.Int.new_negative(H.BigNum.from_str("1"))),
        )?.as_int();
        return P?.is_positive()
          ? parseInt(P.as_positive()?.to_str())
          : parseInt(P?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Curve.");
      }
    })(),
    p = (() => {
      try {
        let P = s.key_type().as_int();
        return P?.is_positive()
          ? parseInt(P.as_positive()?.to_str())
          : parseInt(P?.as_negative()?.to_str());
      } catch {
        throw new Error("Failed to retrieve Key Type.");
      }
    })(),
    m = (() => {
      try {
        return u.PublicKey.from_bytes(
          s.header(H.Label.new_int(H.Int.new_negative(H.BigNum.from_str("2"))))
            ?.as_bytes(),
        );
      } catch {
        throw new Error("No public key found.");
      }
    })(),
    h = (() => {
      try {
        return _(n.payload());
      } catch {
        throw new Error("No payload found.");
      }
    })(),
    y = u.Ed25519Signature.from_bytes(n.signature()),
    k = n.signed_data(void 0, void 0).to_bytes();
  return a !== o || e !== m.hash().to_hex() ||
      c !== l && c !== H.AlgorithmId.EdDSA || d !== 6 || p !== 1 || h !== t
    ? !1
    : m.verify(k, y);
}
var Lr = class {
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
var pr = class {
  constructor(e, t = sn) {
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
        let { paymentCredential: n } = be(r.address);
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
        let { paymentCredential: s } = be(n.address);
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
    let t = u.Transaction.from_bytes(x(e)),
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
    let l = (() => {
        let b = {};
        for (let v = 0; v < (s?.len() || 0); v++) {
          let T = s.get(v), j = u.hash_plutus_data(T).to_hex();
          b[j] = _(T.to_bytes());
        }
        return b;
      })(),
      d = new Set(),
      p = (() => {
        let b = [];
        for (let v = 0; v < (n.vkeys()?.len() || 0); v++) {
          let T = n.vkeys().get(v),
            j = T.vkey().public_key(),
            M = j.hash().to_hex();
          if (!j.verify(x(i), T.signature())) {
            throw new Error(
              `Invalid vkey witness. Key hash: ${M}`,
            );
          }
          b.push(M);
        }
        return b;
      })(),
      m = u.Ed25519KeyHashes.new();
    p.forEach((b) => m.add(u.Ed25519KeyHash.from_hex(b)));
    let h = (() => {
        let b = [];
        for (let v = 0; v < (n.native_scripts()?.len() || 0); v++) {
          let T = n.native_scripts().get(v),
            j = T.hash(u.ScriptHashNamespace.NativeScript).to_hex();
          if (
            !T.verify(
              Number.isInteger(a) ? u.BigNum.from_str(a.toString()) : void 0,
              Number.isInteger(c) ? u.BigNum.from_str(c.toString()) : void 0,
              m,
            )
          ) throw new Error(`Invalid native script witness. Script hash: ${j}`);
          for (let M = 0; M < T.get_required_signers().len(); M++) {
            let ne = T.get_required_signers().get(M).to_hex();
            d.add(ne);
          }
          b.push(j);
        }
        return b;
      })(),
      y = {},
      k = [],
      P = (() => {
        let b = [];
        for (let v = 0; v < (n.plutus_scripts()?.len() || 0); v++) {
          let j = n.plutus_scripts().get(v).hash(u.ScriptHashNamespace.PlutusV1)
            .to_hex();
          b.push(j);
        }
        for (let v = 0; v < (n.plutus_v2_scripts()?.len() || 0); v++) {
          let j = n.plutus_v2_scripts().get(v).hash(
            u.ScriptHashNamespace.PlutusV2,
          ).to_hex();
          b.push(j);
        }
        return b;
      })(),
      I = r.inputs();
    I.sort();
    let g = [];
    for (let b = 0; b < I.len(); b++) {
      let v = I.get(b),
        T = v.transaction_id().to_hex() + v.index().to_str(),
        j = this.ledger[T],
        { entry: M, type: ne } = j
          ? { entry: j, type: "Ledger" }
          : { entry: this.mempool[T], type: "Mempool" };
      if (!M || M.spent) {
        throw new Error(
          `Could not spend UTxO: ${
            JSON.stringify({
              txHash: M?.utxo.txHash,
              outputIndex: M?.utxo.outputIndex,
            })
          }
It does not exist or was already spent.`,
        );
      }
      let de = M.utxo.scriptRef;
      if (de) {
        switch (de.type) {
          case "Native": {
            let ve = u.NativeScript.from_bytes(x(de.script));
            y[ve.hash(u.ScriptHashNamespace.NativeScript).to_hex()] = ve;
            break;
          }
          case "PlutusV1": {
            let ve = u.PlutusScript.from_bytes(x(de.script));
            k.push(ve.hash(u.ScriptHashNamespace.PlutusV1).to_hex());
            break;
          }
          case "PlutusV2": {
            let ve = u.PlutusScript.from_bytes(x(de.script));
            k.push(ve.hash(u.ScriptHashNamespace.PlutusV2).to_hex());
            break;
          }
        }
      }
      M.utxo.datumHash && d.add(M.utxo.datumHash),
        g.push({ entry: M, type: ne });
    }
    for (let b = 0; b < (r.reference_inputs()?.len() || 0); b++) {
      let v = r.reference_inputs().get(b),
        T = v.transaction_id().to_hex() + v.index().to_str(),
        j = this.ledger[T] || this.mempool[T];
      if (!j || j.spent) {
        throw new Error(
          `Could not read UTxO: ${
            JSON.stringify({
              txHash: j?.utxo.txHash,
              outputIndex: j?.utxo.outputIndex,
            })
          }
It does not exist or was already spent.`,
        );
      }
      let M = j.utxo.scriptRef;
      if (M) {
        switch (M.type) {
          case "Native": {
            let ne = u.NativeScript.from_bytes(x(M.script));
            y[ne.hash(u.ScriptHashNamespace.NativeScript).to_hex()] = ne;
            break;
          }
          case "PlutusV1": {
            let ne = u.PlutusScript.from_bytes(x(M.script));
            k.push(ne.hash(u.ScriptHashNamespace.PlutusV1).to_hex());
            break;
          }
          case "PlutusV2": {
            let ne = u.PlutusScript.from_bytes(x(M.script));
            k.push(ne.hash(u.ScriptHashNamespace.PlutusV2).to_hex());
            break;
          }
        }
      }
      j.utxo.datumHash && d.add(j.utxo.datumHash);
    }
    let F = (() => {
      let b = { 0: "Spend", 1: "Mint", 2: "Cert", 3: "Reward" }, v = [];
      for (let T = 0; T < (n.redeemers()?.len() || 0); T++) {
        let j = n.redeemers().get(T);
        v.push({ tag: b[j.tag().kind()], index: parseInt(j.index().to_str()) });
      }
      return v;
    })();
    function U(b, v, T) {
      switch (b.type) {
        case "Key": {
          if (!p.includes(b.hash)) {
            throw new Error(`Missing vkey witness. Key hash: ${b.hash}`);
          }
          d.add(b.hash);
          break;
        }
        case "Script": {
          if (h.includes(b.hash)) {
            d.add(b.hash);
            break;
          } else if (y[b.hash]) {
            if (
              !y[b.hash].verify(
                Number.isInteger(a) ? u.BigNum.from_str(a.toString()) : void 0,
                Number.isInteger(c) ? u.BigNum.from_str(c.toString()) : void 0,
                m,
              )
            ) {
              throw new Error(
                `Invalid native script witness. Script hash: ${b.hash}`,
              );
            }
            break;
          } else if (
            (P.includes(b.hash) || k.includes(b.hash)) &&
            F.find((j) => j.tag === v && j.index === T)
          ) {
            d.add(b.hash);
            break;
          }
          throw new Error(`Missing script witness. Script hash: ${b.hash}`);
        }
      }
    }
    for (let b = 0; b < (r.collateral()?.len() || 0); b++) {
      let v = r.collateral().get(b),
        T = v.transaction_id().to_hex() + v.index().to_str(),
        j = this.ledger[T] || this.mempool[T];
      if (!j || j.spent) {
        throw new Error(
          `Could not read UTxO: ${
            JSON.stringify({
              txHash: j?.utxo.txHash,
              outputIndex: j?.utxo.outputIndex,
            })
          }
It does not exist or was already spent.`,
        );
      }
      let { paymentCredential: M } = be(j.utxo.address);
      if (M?.type === "Script") {
        throw new Error("Collateral inputs can only contain vkeys.");
      }
      U(M, null, null);
    }
    for (let b = 0; b < (r.required_signers()?.len() || 0); b++) {
      let v = r.required_signers().get(b);
      U({ type: "Key", hash: v.to_hex() }, null, null);
    }
    for (let b = 0; b < (r.mint()?.keys().len() || 0); b++) {
      let v = r.mint().keys().get(b).to_hex();
      U({ type: "Script", hash: v }, "Mint", b);
    }
    let he = [];
    for (let b = 0; b < (r.withdrawals()?.keys().len() || 0); b++) {
      let v = r.withdrawals().keys().get(b),
        T = BigInt(r.withdrawals().get(v).to_str()),
        j = v.to_address().to_bech32(void 0),
        { stakeCredential: M } = be(j);
      if (U(M, "Reward", b), this.chain[j]?.delegation.rewards !== T) {
        throw new Error(
          "Withdrawal amount doesn't match actual reward balance.",
        );
      }
      he.push({ rewardAddress: j, withdrawal: T });
    }
    let N = [];
    for (let b = 0; b < (r.certs()?.len() || 0); b++) {
      let v = r.certs().get(b);
      switch (v.kind()) {
        case 0: {
          let T = v.as_stake_registration(),
            j = u.RewardAddress.new(
              u.NetworkInfo.testnet().network_id(),
              T.stake_credential(),
            ).to_address().to_bech32(void 0);
          if (this.chain[j]?.registeredStake) {
            throw new Error(
              `Stake key is already registered. Reward address: ${j}`,
            );
          }
          N.push({ type: "Registration", rewardAddress: j });
          break;
        }
        case 1: {
          let T = v.as_stake_deregistration(),
            j = u.RewardAddress.new(
              u.NetworkInfo.testnet().network_id(),
              T.stake_credential(),
            ).to_address().to_bech32(void 0),
            { stakeCredential: M } = be(j);
          if (U(M, "Cert", b), !this.chain[j]?.registeredStake) {
            throw new Error(
              `Stake key is already deregistered. Reward address: ${j}`,
            );
          }
          N.push({ type: "Deregistration", rewardAddress: j });
          break;
        }
        case 2: {
          let T = v.as_stake_delegation(),
            j = u.RewardAddress.new(
              u.NetworkInfo.testnet().network_id(),
              T.stake_credential(),
            ).to_address().to_bech32(void 0),
            M = T.pool_keyhash().to_bech32("pool"),
            { stakeCredential: ne } = be(j);
          if (
            U(ne, "Cert", b),
              !this.chain[j]?.registeredStake &&
              !N.find((de) =>
                de.type === "Registration" && de.rewardAddress === j
              )
          ) {
            throw new Error(
              `Stake key is not registered. Reward address: ${j}`,
            );
          }
          N.push({ type: "Delegation", rewardAddress: j, poolId: M });
          break;
        }
      }
    }
    g.forEach(({ entry: { utxo: b } }, v) => {
      let { paymentCredential: T } = be(b.address);
      U(T, "Spend", v);
    });
    let ee = (() => {
        let b = [];
        for (let v = 0; v < r.outputs().len(); v++) {
          let T = r.outputs().get(v),
            j = u.TransactionUnspentOutput.new(
              u.TransactionInput.new(
                u.TransactionHash.from_hex(i),
                u.BigNum.from_str(v.toString()),
              ),
              T,
            ),
            M = or(j);
          M.datumHash && d.add(M.datumHash), b.push({ utxo: M, spent: !1 });
        }
        return b;
      })(),
      [Y] = p.filter((b) => !d.has(b));
    if (Y) throw new Error(`Extraneous vkey witness. Key hash: ${Y}`);
    let [fe] = h.filter((b) => !d.has(b));
    if (fe) throw new Error(`Extraneous native script. Script hash: ${fe}`);
    let [R] = P.filter((b) => !d.has(b));
    if (R) throw new Error(`Extraneous plutus script. Script hash: ${R}`);
    let [ie] = Object.keys(l).filter((b) => !d.has(b));
    if (ie) throw new Error(`Extraneous plutus data. Datum hash: ${ie}`);
    g.forEach(({ entry: b, type: v }) => {
      let T = b.utxo.txHash + b.utxo.outputIndex;
      b.spent = !0,
        v === "Ledger"
          ? this.ledger[T] = b
          : v === "Mempool" && (this.mempool[T] = b);
    }),
      he.forEach(({ rewardAddress: b, withdrawal: v }) => {
        this.chain[b].delegation.rewards -= v;
      }),
      N.forEach(({ type: b, rewardAddress: v, poolId: T }) => {
        switch (b) {
          case "Registration": {
            this.chain[v]
              ? this.chain[v].registeredStake = !0
              : this.chain[v] = {
                registeredStake: !0,
                delegation: { poolId: null, rewards: 0n },
              };
            break;
          }
          case "Deregistration": {
            this.chain[v].registeredStake = !1,
              this.chain[v].delegation.poolId = null;
            break;
          }
          case "Delegation":
            this.chain[v].delegation.poolId = T;
        }
      }),
      ee.forEach(({ utxo: b, spent: v }) => {
        this.mempool[b.txHash + b.outputIndex] = { utxo: b, spent: v };
      });
    for (let [b, v] of Object.entries(l)) this.datumTable[b] = v;
    return Promise.resolve(i);
  }
  log() {
    function e(n) {
      let s = n === "lovelace" ? "1" : n, i = 0;
      for (let d = 0; d < s.length; d++) i += s.charCodeAt(d);
      let a = i * 123 % 256, c = i * 321 % 256, l = i * 213 % 256;
      return "#" + ((1 << 24) + (a << 16) + (c << 8) + l).toString(16).slice(1);
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
var hr = class {
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
      }),
      Object.defineProperty(this, "spentOutputs", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: [],
      }),
      Object.defineProperty(this, "addedOutputs", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: [],
      });
  }
  static async new(e, t) {
    let r = new this();
    if (t && (r.network = t), e) {
      r.provider = e;
      let n = await e.getProtocolParameters();
      r.provider instanceof pr &&
        (r.network = "Custom",
          Et[r.network] = {
            zeroTime: r.provider.now(),
            zeroSlot: 0,
            slotLength: 1e3,
          });
      let s = Et[r.network];
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
        ).costmdls(nn(n.costModels)).build();
    }
    return r.utils = new nr(r), r;
  }
  async switchProvider(e, t) {
    if (this.network === "Custom") {
      throw new Error("Cannot switch when on custom network.");
    }
    let r = await hr.new(e, t);
    return this.txBuilderConfig = r.txBuilderConfig,
      this.provider = e || this.provider,
      this.network = t || this.network,
      this.wallet = r.wallet,
      this;
  }
  newTx() {
    return new fr(this);
  }
  fromTx(e) {
    return new Ct(this, u.Transaction.from_bytes(x(e)));
  }
  newMessage(e, t) {
    return new Lr(this, e, t);
  }
  verifyMessage(e, t, r) {
    let { paymentCredential: n, stakeCredential: s, address: { hex: i } } = this
        .utils.getAddressDetails(e),
      a = n?.hash || s?.hash;
    if (!a) throw new Error("Not a valid address provided.");
    return vs(i, a, t, r);
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
  chainingUtxos(e) {
    return this.spentOutputs.forEach((t) => {
      e = e.filter((r) =>
        t.txHash !== r.txHash || t.outputIndex !== r.outputIndex
      );
    }),
      [...e, ...this.addedOutputs];
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
    return t ? zt.from(e.datum, t) : e.datum;
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
          s.add(st(i));
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
          l = r.to_hex();
        if (!c || c !== l) {
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
      address: async () => u.Address.from_bytes(x(await t())).to_bech32(void 0),
      rewardAddress: async () => {
        let [r] = await e.getRewardAddresses();
        return r
          ? u.RewardAddress.from_address(u.Address.from_bytes(x(r)))
            .to_address().to_bech32(void 0)
          : null;
      },
      getUtxos: async () =>
        (await e.getUtxos() || []).map((n) => {
          let s = u.TransactionUnspentOutput.from_bytes(x(n));
          return or(s);
        }),
      getUtxosCore: async () => {
        let r = u.TransactionUnspentOutputs.new();
        return (await e.getUtxos() || []).forEach((n) => {
          r.add(u.TransactionUnspentOutput.from_bytes(x(n)));
        }),
          r;
      },
      getDelegation: async () => {
        let r = await this.wallet.rewardAddress();
        return r ? await this.delegationAt(r) : { poolId: null, rewards: 0n };
      },
      signTx: async (r) => {
        let n = await e.signTx(_(r.to_bytes()), !0);
        return u.TransactionWitnessSet.from_bytes(x(n));
      },
      signMessage: async (r, n) => {
        let s = _(u.Address.from_bech32(r).to_bytes());
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
        return (t || await this.utxosAt(nt(e))).forEach((i) => s.add(st(i))), s;
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
    let { address: r, rewardAddress: n, paymentKey: s, stakeKey: i } = ws(e, {
        addressType: t?.addressType || "Base",
        accountIndex: t?.accountIndex || 0,
        password: t?.password,
        network: this.network,
      }),
      a = u.PrivateKey.from_bech32(s).to_public().hash().to_hex(),
      c = i ? u.PrivateKey.from_bech32(i).to_public().hash().to_hex() : "",
      l = { [a]: s, [c]: i };
    return this.wallet = {
      address: async () => r,
      rewardAddress: async () => n || null,
      getUtxos: async () => this.utxosAt(nt(r)),
      getUtxosCore: async () => {
        let d = u.TransactionUnspentOutputs.new();
        return (await this.utxosAt(nt(r))).forEach((p) => d.add(st(p))), d;
      },
      getDelegation: async () => {
        let d = await this.wallet.rewardAddress();
        return d ? await this.delegationAt(d) : { poolId: null, rewards: 0n };
      },
      signTx: async (d) => {
        let p = await this.utxosAt(r),
          h = xs(d, [a, c], p),
          y = u.TransactionWitnessSetBuilder.new();
        return h.forEach((k) => {
          let P = u.make_vkey_witness(
            u.hash_transaction(d.body()),
            u.PrivateKey.from_bech32(l[k]),
          );
          y.add_vkey(P);
        }),
          y.build();
      },
      signMessage: async (d, p) => {
        let { paymentCredential: m, stakeCredential: h, address: { hex: y } } =
            this.utils.getAddressDetails(d),
          k = m?.hash || h?.hash,
          P = l[k];
        if (!P) throw new Error(`Cannot sign message for address: ${d}.`);
        return dr(y, p, P);
      },
      submitTx: async (d) => await this.provider.submitTx(d),
    },
      this;
  }
};
var hn = class {
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
      headers: { project_id: this.projectId, lucid: De },
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
        headers: { project_id: this.projectId, lucid: De },
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
        headers: { project_id: this.projectId, lucid: De },
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
      headers: { project_id: this.projectId, lucid: De },
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
        headers: { project_id: this.projectId, lucid: De },
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
      headers: { project_id: this.projectId, lucid: De },
    }).then((r) => r.json());
    return !t || t.error
      ? { poolId: null, rewards: 0n }
      : { poolId: t.pool_id || null, rewards: BigInt(t.withdrawable_amount) };
  }
  async getDatum(e) {
    let t = await fetch(`${this.url}/scripts/datum/${e}/cbor`, {
      headers: { project_id: this.projectId, lucid: De },
    }).then((r) => r.json()).then((r) => r.cbor);
    if (!t || t.error) throw new Error(`No datum found for datum hash: ${e}`);
    return t;
  }
  awaitTx(e, t = 3e3) {
    return new Promise((r) => {
      let n = setInterval(async () => {
        let s = await fetch(`${this.url}/txs/${e}`, {
          headers: { project_id: this.projectId, lucid: De },
        }).then((i) => i.json());
        if (s && !s.error) {
          return clearInterval(n),
            await new Promise((i) => setTimeout(() => i(1), 1e3)),
            r(!0);
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
        lucid: De,
      },
      body: x(e),
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
            { headers: { project_id: this.projectId, lucid: De } },
          ).then((s) => s.json());
          if (r === "Native" || r === "native") {
            throw new Error("Native script ref not implemented!");
          }
          let { cbor: n } = await fetch(
            `${this.url}/scripts/${t.reference_script_hash}/cbor`,
            { headers: { project_id: this.projectId, lucid: De } },
          ).then((s) => s.json());
          return {
            type: r === "plutusV1" ? "PlutusV1" : "PlutusV2",
            script: Ue(n),
          };
        })(),
      })),
    );
  }
};
function go(o) {
  let e = (t) => {
    if (isNaN(t.int)) {
      if (t.bytes || !isNaN(Number(t.bytes))) {
        return u.PlutusData.new_bytes(x(t.bytes));
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
  return _(e(o).to_bytes());
}
var De = Er.version;
var mn = class {
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
            let h = "Plutus" + p.split(":")[1].toUpperCase();
            i[h] = s.costModels[p];
          });
          let [a, c] = s.prices.memory.split("/"),
            [l, d] = s.prices.steps.split("/");
          t({
            minFeeA: parseInt(s.minFeeCoefficient),
            minFeeB: parseInt(s.minFeeConstant),
            maxTxSize: parseInt(s.maxTxSize),
            maxValSize: parseInt(s.maxValueSize),
            keyDeposit: BigInt(s.stakeKeyDeposit),
            poolDeposit: BigInt(s.poolDeposit),
            priceMem: parseInt(a) / parseInt(c),
            priceStep: parseInt(l) / parseInt(d),
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
      { policyId: s, assetName: i } = Dr(t),
      a = await fetch(
        `${this.kupoUrl}/matches/${n}${r ? "" : "/*"}?unspent&policy_id=${s}${
          i ? `&asset_name=${i}` : ""
        }`,
      ).then((c) => c.json());
    return this.kupmiosUtxosToUtxos(a);
  }
  async getUtxoByUnit(e) {
    let { policyId: t, assetName: r } = Dr(e),
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
          return clearInterval(n),
            await new Promise((i) => setTimeout(() => i(1), 1e3)),
            r(!0);
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
              script: _(u.PlutusScript.new(x(r)).to_bytes()),
            };
          }
          if (n === "plutus:v2") {
            return {
              type: "PlutusV2",
              script: _(u.PlutusScript.new(x(r)).to_bytes()),
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
var q = {
    to: (o) => $.Data.to(q.lucid(o)),
    from: (o) => q.plutus($.Data.from(o)),
    plutus: (o) => {
      if (typeof o == "string") return $.fromHex(o);
      if (typeof o == "bigint") return o;
      if (o instanceof Array) return o.map(q.plutus);
      if (o instanceof Map) {
        return new Map(
          [...o.entries()].map(([e, t]) => [q.plutus(e), q.plutus(t)]),
        );
      }
      if (o instanceof $.Constr) {
        return new $.Constr(o.index, o.fields.map(q.plutus));
      }
      throw new Error(`bytey: unknown data type ${o}`);
    },
    lucid: (o) => {
      if (o instanceof Uint8Array) {
        return $.toHex(o);
      }
      if (typeof o == "bigint") return o;
      if (o instanceof Array) return o.map(q.lucid);
      if (o instanceof Map) {
        return new Map(
          [...o.entries()].map(([e, t]) => [q.lucid(e), q.lucid(t)]),
        );
      }
      if (o instanceof $.Constr) {
        return new $.Constr(
          o.index,
          o.fields.map(q.lucid),
        );
      }
      throw new Error(`stringy: unknown data type ${o}`);
    },
  },
  A = "+  ",
  C = "   ";
var J = 9000n,
  Nt = J,
  mr = Nt / 2n,
  se = 3n,
  _s = 4n,
  Fr = 100000000n,
  yo = "abcdefghijklmnopqrstuvwxyz";
var wo = .5,
  Ps = class {
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
function ae(o, e) {
  return o < e ? o : e;
}
function bn(o) {
  return o < 0n ? -o : o;
}
function te(o) {
  return Rr(o)[0];
}
function Rr(o) {
  f(o.length > 0, "randomIndexedChoice: alternatives.length <= 0");
  let e = Math.floor(Math.random() * o.length);
  return [o[e], e];
}
function gn(o) {
  let e = new Array();
  return o.forEach((t) => {
    Math.random() > wo && e.push(t);
  }),
    e;
}
function Os(o) {
  let e = gn(o);
  return e.length === 0 && e.push(te(o)), e;
}
function qr(o, e = 0n, t) {
  f(e <= o.length, `minSizedSubset: ${e} > ${o.length}`);
  let r = [],
    n = [],
    s = t ? ae(t, BigInt(o.length)) : BigInt(o.length),
    i = e + X(s - e);
  for (; r.length < i;) {
    let [a, c] = Rr(o);
    n.includes(c) || (r.push(a), n.push(c));
  }
  return r;
}
function ge(o) {
  return te([o, void 0]);
}
function X(o = J) {
  f(o >= 0n, `genNonNegative: maxValue < 0: ${o}`);
  let e = Math.floor(Math.random() * Number(o)), t;
  try {
    t = BigInt(e);
  } catch {
    t = o;
  }
  return te([0n, t, o]);
}
function ke(o = J) {
  return f(o >= 1n, `genPositive: maxValue < 1: ${o}`), 1n + X(o - 1n);
}
function ks(o = J) {
  let e = X(o);
  return te([e, -e]);
}
function js(o, e, t, r) {
  f(e >= 0n, "genString: minBytes < 0"),
    f(Nt >= t, "genString: maxStringBytes < minBytes"),
    f(t >= e, "genString: maxBytes < minBytes");
  function n() {
    let c = Math.floor(Math.random() * (o.length + 10));
    return c < o.length
      ? o.charAt(c)
      : Math.floor(Math.random() * 10).toString();
  }
  let s = [], i = r * (e + X(t - e));
  for (let c = 0n; c < i; c++) s.push(n());
  return s.join("");
}
function Ss(o = 0n, e = mr) {
  return $.fromHex(js("abcdef", o, e, 2n));
}
function zr(o = 0n, e = Nt) {
  let t = yo, r = t.toUpperCase(), n = t + r;
  return js(n, o, e, 1n);
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
          f(
            r instanceof $.Constr,
            `Record.plift: expected Constr, got ${r} (${typeof r})
for ${this.showPType()})`,
          ),
            f(
              r.index === this.index,
              `Record.plift: wrong index ${r.index} for ${this.showPType()}`,
            );
          let n = {}, s = 0;
          return Object.entries(this.pfields).forEach(([i, a]) => {
            if (a !== void 0) {
              f(
                s < r.fields.length,
                `Record.plift: too few elements at
key = ${i}
i = ${s}
pfield = ${a.showPType()}
in [${r}] of length ${r.fields.length}
for ${this.showPType()};
status: ${
                  Object.keys(n).join(`,
${A}`)
                }`,
              );
              let c = r.fields[s++];
              f(
                c !== void 0,
                `Record.plift: undefined value <${c}> at
key = ${i}
i = ${s}
pfield = ${a.showPType()}
in [${r}] of length ${r.fields.length}
for ${this.showPType()};
status: ${
                  Object.keys(n).join(`,
${A}`)
                }`,
              ), n[i] = a.plift(c);
            } else n[i] = void 0;
          }),
            f(
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
          f(
            r instanceof Object,
            `PRecord.checkFields: expected Object, got ${r}
for ${this.showPType()}`,
          );
          let n = Object.keys(this.pfields).join(`,
${A}`),
            s = Object.keys(r).join(`,
${A}`);
          f(
            n === s,
            `PRecord.checkFields: expected fields:
${A}${n},
got:
${A}${s}
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
              ? (f(
                a !== void 0,
                `cannot constant ${a} with pfield: ${i.showPType()}`,
              ),
                n.push(i.pconstant(a)))
              : f(a === void 0, `cannot constant ${a} with undefined pfield`);
          }),
            new $.Constr(this.index, n);
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
          let i = n + C,
            a = i + A,
            c = a + C,
            l = Object.entries(r).map(([d, p]) => {
              let m = this.pfields[d];
              return m === void 0
                ? (f(
                  p === void 0,
                  `PRecord.showData: value ${p} for undefined pfield at key ${d}`,
                ),
                  `${d.length === 0 ? "_" : d}: undefined`)
                : (f(
                  p !== void 0,
                  `PRecord.showData: value undefined for pfield ${m.showPType()} at key ${d}`,
                ),
                  `${d.length === 0 ? "_" : d}: ${
                    m.showData(p, c, s && s - 1n)
                  }`);
            }).join(`,
${a}`);
          return `Record {
${a}index: ${this.index},
${a}fields: ${l}
${i}}`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r = "", n) => {
          if (n !== void 0 && n <= 0n) return "PRecord ( \u2026 )";
          let s = r + C,
            i = s + A,
            a = i + A,
            c = Object.entries(this.pfields).map(([l, d]) => `
${a}${l.length === 0 ? "_" : l}: ${
              d?.showPType(a, n && n - 1n) ?? "undefined"
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
      f(this.population > 0, `Population not positive in ${this.showPType()}`);
  }
  static genPType(e, t) {
    let r = {}, n = X(se);
    for (let s = 0; s < n; s++) {
      let i = zr(), a = ge(() => e.generate(t))?.();
      r[i] = a;
    }
    return new z(r);
  }
};
var pe = class {
  constructor() {
    Object.defineProperty(this, "population", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: Number(J) * 2 + 1,
    }),
      Object.defineProperty(this, "plift", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (f(
          typeof e == "bigint",
          `.PInteger.plift: expected Integer, got ${e} (${typeof e})`,
        ),
          e),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (f(
          typeof e == "bigint",
          `PInteger.pconstant: expected Integer, got ${e} (${typeof e})`,
        ),
          e),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => ks(),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (f(
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
    return pe.ptype;
  }
};
Object.defineProperty(pe, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new pe(),
});
var ce = class {
  constructor(e = 0n, t = mr) {
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
        value: (r) => (f(
          r instanceof Uint8Array,
          `PByteString.plift: expected Uint8Array, got ${r} (${typeof r})`,
        ),
          r),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (f(
          r instanceof Uint8Array,
          `PByteString.pconstant: expected Uint8Array, got ${r} (${typeof r})`,
        ),
          new Uint8Array(r)),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => Ss(this.minBytes, this.maxBytes),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (f(
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
      f(e >= 0n, `PByteString: minBytes must be non-negative, got ${e}`),
      f(
        t >= e,
        `PByteString: maxBytes must be greater than or equal to minBytes, got ${t} < ${e}`,
      ),
      this.population = t ? 1 / 0 : 1;
  }
  static genPType() {
    let e = ge(X)?.(mr), t = ge(() => (e ?? 0n) + X(mr - (e ?? 0n)))?.();
    return new ce(e, t);
  }
};
Object.defineProperty(ce, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new ce(),
});
var br = (o) =>
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
            f(r instanceof $.Constr, "plift: expected Constr");
            let n = this.precord.plift(r), s = Object.values(n);
            return new this.O(...s);
          },
        }),
        Object.defineProperty(this, "pconstant", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            let n = br(r);
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
            let i = n + C,
              a = i + A,
              c = this.precord.showData(br(r), a, s && s - 1n);
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
            let s = r + C, i = s + A;
            return `PObject (
${i}population: ${this.population},
${i}precord: ${this.precord.showPType(i, n && n - 1n)},
${i}O: ${this.O.name}
${s})`;
          },
        }),
        this.population = e.population,
        f(
          this.population > 0,
          `Population not positive in ${this.showPType()}`,
        );
    }
    static genPType(e, t) {
      let r = new z({ s: ce.genPType(), i: pe.genPType() });
      return new W(r, yn);
    }
  },
  yn = class {
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
            let n = br(r), s = Object.values(n);
            return f(s.length === 1, "pconstant: expected one value"),
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
            let i = n + C, a = i + A, c = br(r), l = Object.values(c);
            return f(l.length === 1, "showData: expected one value"),
              `Wrapped: ${this.O.name} (
${a}${this.pinner.showData(l[0], a, s && s - 1n)}
${i})`;
          },
        }),
        Object.defineProperty(this, "showPType", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r = "", n) => {
            if (n !== void 0 && n <= 0n) return "PObject: PWrapped ( \u2026 )";
            let s = r + C, i = s + A;
            return `PObject: PWrapped (
${i}population: ${this.population},
${i}pinner: ${this.pinner.showPType(i, n && n - 1n)},
${i}O: ${this.O.name}
${s})`;
          },
        }),
        this.population = e.population,
        f(
          this.population > 0,
          `Population not positive in ${this.showPType()}`,
        );
    }
    static genPType(e, t) {
      let r = e.generate(t);
      return new oe(r, wn);
    }
  },
  wn = class {
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
var V = class {
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
        value: () => $.toHex(this.symbol),
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
      Object.defineProperty(this, "equals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => this.concise() === t.concise(),
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
        value: () => $.toHex(this.symbol),
      }),
      f(
        e.length === 0 || e.length === Number(V.numBytes),
        `Currency wrong size - ${e}: ${e.length}`,
      );
  }
  static fromLucid(e) {
    return new V($.fromHex(e));
  }
};
Object.defineProperty(V, "fromHex", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => new V($.fromHex(o)),
});
Object.defineProperty(V, "numBytes", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 28n,
});
Object.defineProperty(V, "ADA", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new V(new Uint8Array(0)),
});
Object.defineProperty(V, "dummy", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new V($.fromHex("cc".repeat(Number(V.numBytes)))),
});
var ye = class extends oe {
  constructor() {
    super(new ce(V.numBytes, V.numBytes), V);
  }
  static genPType() {
    return ye.ptype;
  }
};
Object.defineProperty(ye, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new ye(),
});
var ot = class {
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
          value: (t) => (f(t instanceof $.Constr, "plift: expected Constr"),
            f(
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
            f(t instanceof Object, "PSum.matchData: expected Object");
            let r = new Array();
            return this.pconstrs.forEach((n, s) => {
              t instanceof n.O && r.push(n);
            }),
              f(
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
            let s = r + C, i = s + A;
            return `Sum (
${i}${this.matchData(t).showData(t, i, n && n - 1n)}
${s})`;
          },
        }),
        f(e.length > 0, "PSum: expected at least one PObject"),
        f(
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
      let r = e + C, n = r + A;
      return `PSum (
${n}${
        this.pconstrs.map((s) => s.showPType(n, t && t - 1n)).join(`,
`)
      }
${r})`;
    }
    static genPType() {
      let e = [xo, vo, Po, _o], t = ke(BigInt(e.length)), r = qr(e, t);
      return new ot(r);
    }
  },
  xn = class {
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
  vn = class {
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
  Pn = class {
    constructor(e) {
      Object.defineProperty(this, "i", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  _n = class {
    constructor(e) {
      Object.defineProperty(this, "s", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  xo = new W(new z({ s: ce.genPType(), i: pe.genPType() }), xn),
  vo = new W(new z({ i: pe.genPType(), s: ce.genPType() }), vn),
  Po = new W(new z({ i: pe.genPType() }), Pn),
  _o = new W(new z({ s: ce.genPType() }), _n);
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
          for (let n = 0n; n < t; n++) r = $.sha256(r);
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
        value: () => $.toHex(this.bytes),
      }),
      Object.defineProperty(this, "toLucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => $.toHex(this.bytes),
      }),
      f(
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
      return new re($.fromHex(e));
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
    super(new ce(re.numBytes, re.numBytes), re);
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
        value: () => new re($.sha256(this.keyHash)),
      }),
      Object.defineProperty(this, "toString", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => $.toHex(this.keyHash),
      }),
      Object.defineProperty(this, "show", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `KeyHash: ${this.toString()}`,
      }),
      f(
        e.length === Number(Me.numBytes),
        `keyHash must be ${re.numBytes} bytes, got ${e.length}`,
      );
  }
  static fromCredential(e) {
    return new Me($.fromHex(e.hash));
  }
};
Object.defineProperty(Me, "numBytes", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 28n,
});
var _e = class extends oe {
  constructor() {
    super(new ce(Me.numBytes, Me.numBytes), Me);
  }
  static genPType() {
    return _e.ptype;
  }
};
Object.defineProperty(_e, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new _e(),
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
          let c = i + C, l = c + A;
          return `Constraint (
${l}${this.pinner.showData(s, l, a && a - 1n)}
${c})`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (s = "", i) => {
          if (i !== void 0 && i <= 0n) return "PConstraint ( \u2026 )";
          let a = s + C,
            c = a + A,
            l = `[

      ${c}` + this.asserts.map((d) => `(${d.toString()})`).join(`,
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
      f(this.population > 0, `Population not positive in ${this.showPType()}`);
  }
  static genPType(e, t) {
    let r = e.generate(t), n = r.genData;
    return new Ye(r, [], n);
  }
};
var Xe = class {
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
        value: (r) => (f(
          this.pliteral.showData(this.pliteral.plift(r)) === this.str,
          "Literal does not match",
        ),
          this.literal),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (f(
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
          f(
            this.pliteral.showData(r) === this.str,
            `Literal.showData: Literal does not match, got:
${this.pliteral.showData(r)},
expected:
${this.str}.`,
          );
          let i = n + C, a = i + A;
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
          let s = r + C, i = s + A;
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
    return new Xe(r, n);
  }
};
var Wr = 5n;
function Gu(o, e) {
  let t = new Map(), r = new Map(), n = new Map(), s = new Map();
  for (let a = 0; a < e; a++) {
    let c = t.size + r.size + n.size + s.size;
    console.log(`${a}` + (c ? ` (${c} errors)` : ""));
    try {
      let l = o.generate(_s), d = l.genData(), p = l.pconstant(d);
      So(l, t), Oo(p, r), ko(p, d, l, n);
    } catch (l) {
      Vr(l, s);
    }
  }
  let i = e;
  i -= Kr(t, "Population errors"),
    i -= Kr(r, "Data parsing errors"),
    i -= Kr(n, "PType parsing errors"),
    i -= Kr(s, "other errors"),
    console.log(i + " x correct"),
    er(i, e);
}
function Oo(o, e) {
  try {
    er(o, q.from(q.to(o)));
  } catch (t) {
    Vr(t, e);
  }
}
function ko(o, e, t, r) {
  try {
    let n = t.plift(o);
    if (t.showPType().includes("PObject")) er(t.showData(e), t.showData(n));
    else {try {
        er(e, n);
      } catch (s) {
        throw new Error(
          t.showPType() + `
` + s.message,
        );
      }}
  } catch (n) {
    Vr(n, r);
  }
}
function Vr(o, e) {
  let t = [o.stack].join(`
`),
    r = e.get(t);
  e.set(t, r ? r + 1 : 1);
}
function Kr(o, e) {
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
function jo(o, e) {
  let t = [], r = 0;
  try {
    for (
      f(o.population > 0, "population must be positive");
      t.length < o.population;
    ) {
      let n = o.genData(), s = o.showData(n);
      if (!t.includes(s)) r = 0, t.push(s);
      else if (++r > 1e4) {
        throw new Error(
          `could only achive population size ${t.length} for ${
            o.showPType(void 0, Wr)
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
    Vr(n, e);
  }
}
function So(o, e) {
  o.population > 20 || jo(o, e);
}
var Qe = class {
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
        ) => (f(r instanceof Array, `List.plift: expected List: ${r}`),
          f(
            !this.length || this.length === BigInt(r.length),
            `plift: wrong length - ${this.length} vs. ${r.length}`,
          ),
          r.map((s) => this.pelem.plift(s))),
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (f(r instanceof Array, "pconstant: expected Array"),
          f(
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
          let r = this.length ? this.length : X(se);
          return Qe.genList(this.pelem.genData, r);
        },
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r, n = "", s) => {
          if (s !== void 0 && s <= 0n) return "List [ \u2026 ]";
          f(r instanceof Array, `PList.showData: expected Array, got ${r}`);
          let i = n + C, a = i + A;
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
          let s = r + C, i = s + A;
          return `PList (
${i}population: ${this.population},
${i}pelem: ${this.pelem.showPType(i, n && n - 1n)},
${i}length?: ${this.length}
${s})`;
        },
      }),
      f(!t || t >= 0, "negative length"),
      !t || t === 0n
        ? this.population = 1
        : this.population = e.population ** Number(t),
      f(this.population > 0, `Population not positive in ${this.showPType()}`);
  }
  static genList(e, t) {
    let r = new Array();
    for (let n = 0; n < t; n++) r.push(e());
    return r;
  }
  static genPType(e, t) {
    let r = ge(X(se)), n = e.generate(t);
    return new Qe(n, r);
  }
};
function $o(o, e, t) {
  let r = 1, n = o;
  for (let s = 0; s < t; s++) r *= e * n--;
  return r;
}
var K = class {
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
            let r = new K(this.showKey);
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
            let n = new K(this.showKey);
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
            let n = C + r, s = n + A;
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
      return new K(this.showKey);
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
  je = class {
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
              f(i instanceof Map, "plift: expected Map"),
                f(
                  !this.size || this.size === BigInt(i.size),
                  "plift: wrong size",
                );
              let a = new K(this.pkey.showData), c = 0;
              return i.forEach((l, d) => {
                let p = this.pkey.plift(d);
                f(
                  !this.dataKeys || q.to(this.dataKeys[c++]) === q.to(d),
                  `PMap.pconstant: wrong key of ptype
        ${this.pkey.showPType("", Wr)}
        : ${d.toString()}`,
                ), a.set(p, this.pvalue.plift(l));
              }),
                a;
            },
          }),
          Object.defineProperty(this, "pconstant", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i) => {
              f(i instanceof K, "AssocMap.pconstant: expected AssocMap"),
                f(
                  !this.size || this.size === BigInt(i.size),
                  `AssocMap.pconstant: wrong size: ${this.size} vs. ${i.size} of ${
                    this.showData(i, "", Wr)
                  }`,
                );
              let a = new Map(), c = 0;
              return i.forEach((l, d) => {
                let p = this.pkey.pconstant(d);
                f(
                  !this.dataKeys || q.to(this.dataKeys[c++]) === q.to(p),
                  "PMap.plift: wrong key",
                ), a.set(p, this.pvalue.pconstant(l));
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
                let i = new K(this.pkey.showData);
                return this.keys.forEach((a) => {
                  i.set(a, this.pvalue.genData());
                }),
                  i;
              } else {
                let i = this.size
                  ? this.size
                  : X(BigInt(Math.min(Number(se), this.pkey.population)));
                return je.genMap(this.pkey, this.pvalue, i);
              }
            },
          }),
          Object.defineProperty(this, "showData", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i, a = "", c) => {
              if (c !== void 0 && c <= 0n) return "AssocMap { \u2026 }";
              f(i instanceof K, `PMap.showData: expected AssocMap, got ${i}`);
              let l = a + C, d = l + A;
              return `AssocMap {
${
                [...i.entries()].map(([p, m]) =>
                  `${d}${this.pkey.showData(p, d, c && c - 1n)} => ${
                    this.pvalue.showData(m, d, c && c - 1n)
                  }`
                ).join(`,
`)
              }
${l}}`;
            },
          }),
          Object.defineProperty(this, "showPType", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: (i = "", a) => {
              if (a !== void 0 && a <= 0n) return "PMap ( \u2026 )";
              let c = i + C,
                l = c + A,
                d = l + C,
                p = this.keys
                  ? new Qe(this.pkey).showData(this.keys, d)
                  : "undefined";
              return `PMap (
${l}population: ${this.population},
${l}pkey: ${this.pkey.showPType(l, a && a - 1n)},
${l}pvalue: ${this.pvalue.showPType(l, a && a - 1n)},
${l}size?: ${this.size},
${l}keys?: ${p}
${c})`;
            },
          }),
          n
      ) {
        this.dataKeys = n.map((a) => e.pconstant(a));
        let i = BigInt(n.length);
        r ? f(i === r, "PMap: wrong size") : this.size = i,
          this.population = t.population ** n.length;
      } else {r
          ? (f(
            Number(r) <= e.population,
            `PMap: not enough keys for size ${r} in
${e.showPType()}`,
          ),
            this.population = $o(e.population, t.population, r))
          : this.population = 1;}
      f(this.population > 0, `Population not positive in ${this.showPType()}`);
    }
    static genKeys(e, t) {
      let r = se + 100n;
      function n() {
        let c = e.genData(), l = e.showData(c);
        if (!i.has(l)) i.set(l, 1), s.push(c);
        else if (i.set(l, i.get(l) + 1), r-- < 0n) {
          throw new Error(`Map.genKeys: timeout with
${C}size: ${Number(t)},
${C}keyStrings: ${
            [...i.entries()].map(([d, p]) => `${p} x ${d}`).join(`,
${C + A}`)
          },
${C}pkey: ${e.showPType(C)}`);
        }
      }
      let s = new Array(), i = new Map(), a = e.population;
      if (t) {
        for (
          f(t <= a, `PMap.genKeys: size too big: ${Number(t)} vs. ${a}`);
          s.length < t;
        ) n();
      } else {
        let c = X(BigInt(Math.min(Number(se), a)));
        for (let l = 0; l < c; l++) n();
      }
      return s;
    }
    static genMap(e, t, r) {
      f(
        Number(r) <= e.population,
        `PMap: not enough keys for size ${Number(r)} in ${e.showPType()}`,
      );
      let n = new K(e.showData);
      return je.genKeys(e, r).forEach((i) => {
        n.set(i, t.genData());
      }),
        n;
    }
    static genPType(e, t) {
      let r = e.generate(t - 1n),
        n = e.generate(t - 1n),
        s = ge(() => je.genKeys(r))?.(),
        i = ge(
          BigInt(s?.length ?? X(BigInt(Math.min(Number(se), r.population)))),
        );
      return new je(r, n, i, s);
    }
  };
var it = J,
  we = class {
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
          value: (r = 1n) => new we(this.currency, this.token.hash(r)),
        }),
        Object.defineProperty(this, "sortSubsequents", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r) => {
            let n = this.currency.show(),
              s = new K((m) => m.show()),
              i = new Array(),
              a = new Array();
            r.forEach((m) => {
              m.currency.show() === n ? s.set(m.token, m) : a.push(m);
            });
            let c = s.size, l = it, d = this.token;
            for (; c && l;) {
              d = d.hash();
              let m = s.get(d);
              m ? (i.push(m), s.delete(d), l = it, c--) : l--;
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
            f(this.currency.show() === r.currency.show(), "currency mismatch");
            let n = this.token.hash(), s = r.token.toString();
            for (let i = 0n; i < it; i++) {
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
        : $.toUnit(this.currency.toLucid(), this.token.toLucid());
    }
    get toLucidNFT() {
      return { [this.toLucid]: 1n };
    }
    static fromLucid(e) {
      try {
        if (e === "lovelace") throw new Error("lovelace is not an id-NFT");
        {
          let t = $.fromUnit(e);
          return new we(
            V.fromLucid(t.policyId),
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
        return new we(e.currency, re.fromString(e.token.name));
      } catch (t) {
        throw new Error(`IdNFT.fromAsset ${e.show()}:
${t}`);
      }
    }
  },
  bt = class extends W {
    constructor(e) {
      super(new z({ currency: new Xe(ye.ptype, e), token: mt.ptype }), we),
        Object.defineProperty(this, "policy", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: e,
        });
    }
    static genPType() {
      return new bt(V.dummy);
    }
  };
var vc = (o, e) => o === e && o === J || o === -J,
  xe = class extends Ye {
    constructor(e = -J, t = J) {
      f(e <= t, `PBounded: ${e} > ${t}`),
        super(xe.pinner, [To(e, t)], gr(e, t), `PBounded(${e}, ${t})`),
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
      return On();
    }
  };
Object.defineProperty(xe, "pinner", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new pe(),
});
var On = (o = -J) => {
    f(o >= -J, `${o} < -maxInteger`), f(o < J, `${o} >= maxInteger`);
    let e = gr(o, J)(), t = gr(e, J)();
    return new xe(e, t);
  },
  gr = (o, e) =>
    o === e
      ? () => o
      : (f(o <= e, `newGenInRange: ${o} > ${e}`), () => o + X(e - o)),
  To = (o, e) => (t) => {
    f(!o || o <= t, `too small: ${t} < ${o} by ${o - t}`),
      f(!e || t <= e, `too big: ${t} > ${e} by ${t - e}`);
  };
var Kt = class extends Ye {
  constructor(e, t) {
    f(!t || t > 0, "empty list"),
      super(new Qe(e, t), [Ao], () => Qe.genList(e.genData, t ?? ke(se)));
  }
  static genPType(e, t) {
    let r = ge(ke(se)), n = e.generate(t);
    return new Kt(n, r);
  }
};
function Ao(o) {
  f(o.length > 0, "encountered empty List");
}
var gt = class {
  constructor(e = 0n, t = Nt) {
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
          f(
            r instanceof Uint8Array,
            `PString.plift: expected Uint8Array, got ${r} (${typeof r})`,
          );
          let n = $.toText($.toHex(r));
          return f(
            n.length >= this.minLength,
            `PString.plift: data too short: ${n}`,
          ),
            f(n.length <= this.maxLength, `PString.plift: data too long: ${n}`),
            n;
        },
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (f(
          typeof r == "string",
          `PString.pconstant: expected string, got ${r} (${typeof r})`,
        ),
          f(
            r.length >= this.minLength,
            `PString.pconstant: data too short: ${r}`,
          ),
          f(
            r.length <= this.maxLength,
            `PString.pconstant: data too long: ${r}`,
          ),
          $.fromHex($.fromText(r.toString()))),
      }),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => zr(this.minLength, this.maxLength),
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => (f(
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
      f(e >= 0n, `PString: minLength must be non-negative, got ${e}`),
      f(
        t >= e,
        `PString: maxLength must be greater than or equal to minLength, got ${t} < ${e}`,
      ),
      this.population = t ? 1 / 0 : 1;
  }
  static genPType() {
    let e = ge(X)?.(Nt), t = ge(() => (e ?? 0n) + X(Nt - (e ?? 0n)))?.();
    return new gt(e, t);
  }
};
Object.defineProperty(gt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new gt(),
});
var Se = class {
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
      Object.defineProperty(this, "equals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => this.concise() === t.concise(),
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
        value: () => $.fromText(this.name),
      }),
      f(e.length <= Se.maxLength, `Token too long: ${e}, ${e.length}`);
  }
  static fromLucid(e) {
    try {
      return new Se($.toText(e));
    } catch (t) {
      throw new Error(`Token.fromLucid ${e}:
${t}`);
    }
  }
};
Object.defineProperty(Se, "maxLength", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: 32n,
});
Object.defineProperty(Se, "lovelace", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Se(""),
});
var $e = class extends oe {
  constructor() {
    super(new gt(0n, Se.maxLength), Se);
  }
  static genPType() {
    return $e.ptype;
  }
};
Object.defineProperty($e, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new $e(),
});
var L = class {
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
        value: () => `Asset(${this.currency.toString()}, ${this.token.name})`,
      }),
      Object.defineProperty(this, "concise", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () => `${this.currency.concise()}.${this.token.concise()}`,
      }),
      Object.defineProperty(this, "equals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => this.concise() === r.concise(),
      }),
      Object.defineProperty(this, "toLucid", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: () =>
          this.currency.symbol.length === 0
            ? "lovelace"
            : $.toUnit(this.currency.toLucid(), this.token.toLucid()),
      }),
      Object.defineProperty(this, "toLucidWith", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => ({ [this.toLucid()]: r }),
      }),
      L.assertADAlovelace(this);
  }
  static fromLucid(e) {
    try {
      if (e === "lovelace") return L.ADA;
      {
        let t = $.fromUnit(e);
        return new L(V.fromLucid(t.policyId), Se.fromLucid(t.assetName ?? ""));
      }
    } catch (t) {
      throw new Error(`Asset.fromLucid ${e}:
${t}`);
    }
  }
  static assertADAlovelace(e) {
    $.toHex(e.currency.symbol) === "" &&
      f(e.token.name === "", `ADA must have lovelace, got ${e.show()}`);
  }
  static generate() {
    return te([() => L.ADA, L.generateNonADA])();
  }
};
Object.defineProperty(L, "ADA", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new L(V.ADA, Se.lovelace),
});
Object.defineProperty(L, "generateNonADA", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: () => {
    let o = ye.ptype.genData(), e = $e.ptype.genData();
    return new L(o, e);
  },
});
var He = class extends W {
  constructor() {
    super(new z({ currency: ye.ptype, token: $e.ptype }), L),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: L.generate,
      }),
      Object.defineProperty(this, "showData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (e) => (f(
          e instanceof L,
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
var yr = new K((o) => o.show()),
  Eo = new Kt($e.ptype),
  G = class {
    constructor(e = yr.anew) {
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
            let r = t + C + A, n = r + A, s = ["Assets:"];
            for (let [i, a] of this.assets) {
              let c = i.toString();
              s.push(`${r}${c === "" ? "ADA" : c}:`);
              let l = [];
              for (let d of a) {
                l.push(
                  `${n}${d.name === "" ? c === "" ? "lovelace" : "_" : d.name}`,
                );
              }
              s.push(l.join(`,
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
            f(
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
            f(s !== void 0, `${t.show()} not in ${this.show()}`);
            let i = s.findIndex((a) => a.name === n.name);
            return f(i >= 0, `${t.show()} not in ${this.show()}`),
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
            f(this.assets.size > 0, "empty assets have no head");
            let t = [...this.assets.keys()].sort()[0],
              r = this.assets.get(t).slice(0).sort()[0];
            return new L(t, r);
          },
        }),
        Object.defineProperty(this, "tail", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            f(this.assets.size > 0, "empty assets tell no tails");
            let t = this.assets.anew, r = !0;
            for (let s of [...this.assets.keys()].sort()) {
              let i = this.assets.get(s).slice(0).sort();
              if (r) {
                if (f(i.length > 0, "empty token map"), i.length > 1) {
                  let a = i.slice(1);
                  t.set(s, a);
                }
                r = !1;
              } else t.set(s, i);
            }
            let n = new G(t);
            return f(n.add(this.head()).equals(this), "tail is not tail"), n;
          },
        }),
        Object.defineProperty(this, "randomChoice", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            let t = te([...this.assets.keys()]), r = te(this.assets.get(t));
            return new L(t, r);
          },
        }),
        Object.defineProperty(this, "randomSubset", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: () => {
            let t = new G(), r = gn([...this.assets.keys()]);
            for (let n of r) {
              let s = Os(this.assets.get(n));
              t.assets.set(n, s);
            }
            return t;
          },
        }),
        Object.defineProperty(this, "boundedSubset", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t, r) => G.fromList(qr(this.toList, t, r)),
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
                let c = i.filter((l) => a.some((d) => d.name === l.name));
                c.length > 0 && r.set(s, c);
              }
            }
            return new G(r);
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
                  a.filter((l) => !i.some((d) => d.name === l.name)),
                );
                r.set(s, c);
              } else r.set(s, i);
            }
            for (let [s, i] of n) this.assets.has(s) || r.set(s, i);
            return new G(r);
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
        G.assert(this);
    }
    get clone() {
      let e = new G();
      for (let [t, r] of this.assets) e.assets.set(t, r.slice());
      return e;
    }
    get toMap() {
      let e = yr.anew;
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
      for (let [t, r] of this.assets) for (let n of r) e.push(new L(t, n));
      return e;
    }
    static fromList(e) {
      let t = new G();
      for (let r of e) t.insert(r);
      return t;
    }
    static assert(e) {
      for (let [t, r] of e.assets) f(r.length > 0, `empty token list for ${t}`);
      e.forEach((t) => L.assertADAlovelace(t));
    }
  };
Object.defineProperty(G, "generate", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o = 0n, e) => {
    let t = je.genKeys(He.ptype, gr(o, e ?? ht(o, se))());
    f(t.length >= o, `generated ${t} too small`);
    let r = G.fromList(t);
    return f(r.size >= o, `generated ${r.show()} too small`), r;
  },
});
Object.defineProperty(G, "singleton", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = new G();
    return e.insert(o), e;
  },
});
var Wt = class extends oe {
  constructor() {
    super(new je(ye.ptype, Eo), G),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: G.generate,
      });
  }
  static genPType() {
    return Wt.ptype;
  }
};
Object.defineProperty(Wt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Wt(),
});
var Ee = class extends xe {
  constructor(e = 1n, t = J) {
    f(!e || e > 0n, `PPositive: ${e} <= 0`),
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
    return On(1n);
  }
};
var Jr = new K((o) => o.show()),
  Vt = new K((o) => o.show()),
  w = class {
    constructor(e = Jr.anew) {
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
            let r = t + C + A, n = r + A, s = ["Value:"];
            for (let [i, a] of this.value) {
              let c = i.toString();
              s.push(`${r}${c === "" ? "ADA" : c}:`);
              let l = [];
              for (let [d, p] of a) {
                l.push(
                  `${n}${
                    d.name === "" ? c === "" ? "lovelace" : "_" : d.name
                  }: ${p}`,
                );
              }
              s.push(l.join(`,
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
            let r = t + A, n = [];
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
          value: (t) => w.newMapAmounts((r) => r / t)(this),
        }),
        Object.defineProperty(this, "divideByScalar_", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) =>
            w.newMapAmounts((r) => BigInt(Math.floor(Number(r) / t)))(this),
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
            return f(
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
            f(
              n,
              `setAmountOf: tokens not found for asset ${t.show()} in ${this.show()}`,
            ),
              f(
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
              f(
                !n.has(t.token),
                `initAmountOf: amount already set for asset ${t.show()} in ${this.show()}`,
              ), n.set(t.token, r);
            } else {
              let s = Vt.anew;
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
              let s = Vt.anew;
              s.set(t.token, r), this.value.set(t.currency, s);
            }
          },
        }),
        Object.defineProperty(this, "ofAssets", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (t) => {
            let r = new w();
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
            let r = new w();
            for (let [n, s] of this.value) {
              let i = t.value.get(n);
              if (i) {
                for (let [a, c] of s) {
                  let l = i.get(a);
                  l && r.initAmountOf(new L(n, a), ae(c, l));
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
            f(
              r,
              `drop: tokens not found for asset ${t.show()} in ${this.show()}`,
            ),
              f(
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
          value: (t) => w.newCompareWith((r) => t(r))(this),
        }),
        w.assert(this);
    }
    get zeroed() {
      return w.newSetAmounts(0n)(this);
    }
    get unit() {
      return w.newSetAmounts(1n)(this);
    }
    get assets() {
      let e = yr.anew;
      for (let [t, r] of this.value) e.set(t, [...r.keys()]);
      return new G(e);
    }
    get normed() {
      let e = Jr.anew;
      for (let [t, r] of this.value) {
        let n = Vt.anew;
        for (let [s, i] of r) i && n.set(s, i);
        n.size && e.set(t, n);
      }
      return new w(e);
    }
    euclidean(e, t) {
      if (e = bn(e), t = bn(t), t > e) {
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
      if (t <= J) return r;
      let n = Number(t) / Number(J);
      return r.map((s) => s.divideByScalar_(n));
    }
    get toMap() {
      let e = this.value.anew;
      for (let [t, r] of this.value) {
        let n = Vt.anew;
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
      f(this.value.size > 0, `no currencies in value: ${this.show()}`);
      let e = [...this.value.keys()].sort()[0], t = this.value.get(e);
      f(t, `no tokens for currency ${e}`),
        f(t.size > 0, `no tokens for currency ${e}`);
      let r = [...t.keys()].sort()[0];
      return new L(e, r);
    }
    get unsortedHeadAmount() {
      for (let [e, t] of this.value) for (let [r, n] of t) return n;
      throw new Error(`no amounts in value: ${this.show()}`);
    }
    get clone() {
      return new w(this.toMap);
    }
    get smallestAmount() {
      let e;
      for (let t of this.value.values()) {
        for (let r of t.values()) {
          (!e || r < e) && (e = r);
        }
      }
      return f(e, `smallestAmount: no smallest found in ${this.concise()}`), e;
    }
    get biggestAmount() {
      let e;
      for (let t of this.value.values()) {
        for (let r of t.values()) {
          (!e || e < r) && (e = r);
        }
      }
      return f(e, `biggestAmount: no biggest found in ${this.concise()}`), e;
    }
    static assert(e) {
      f(e.value instanceof K, `Value must be a AssocMap, not ${e.value}`),
        G.assert(e.assets);
    }
    static assetsOf(...e) {
      let t = yr.anew;
      for (let r of e) {
        for (let [n, s] of r.toMap) {
          let i = t.get(n) ?? [];
          for (let a of s.keys()) i.some((c) => c.name === a.name) || i.push(a);
          t.set(n, i);
        }
      }
      return new G(t);
    }
    static singleton(e, t) {
      let r = Jr.anew, n = Vt.anew;
      return n.set(e.token, t), r.set(e.currency, n), new w(r);
    }
    get positive() {
      return this.newAmountsCheck((e) => e > 0n);
    }
    get leqMaxInteger() {
      return this.newAmountsCheck((e) => e <= J);
    }
    static newSetAmounts(e) {
      return w.newMapAmounts(() => e);
    }
  };
Object.defineProperty(w, "nullOfAssets", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = Jr.anew;
    for (let [t, r] of o.toMap) {
      let n = Vt.anew;
      for (let s of r) n.set(s, 0n);
      e.set(t, n);
    }
    return new w(e);
  },
});
Object.defineProperty(w, "generateWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = G.generate(), t = new w();
    return e.forEach((r) => {
      t.initAmountOf(r, o.genData());
    }),
      t;
  },
});
Object.defineProperty(w, "newUnionWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e, ...t) => (r = new w(), ...n) => {
    try {
      let s = n.map((c) => c ?? new w()), i = w.assetsOf(r, ...s), a = new w();
      return i.forEach((c) => {
        let l = new Array();
        [r, ...s].forEach((p, m) => {
          let h = t[m];
          l.push(p.amountOf(c, h));
        });
        let d = o(l[0], ...l.slice(1));
        d !== e && a.initAmountOf(c, d);
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
Object.defineProperty(w, "add", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o + e),
});
Object.defineProperty(w, "normedAdd", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o + e, 0n, 0n, 0n),
});
Object.defineProperty(w, "subtract", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o - e),
});
Object.defineProperty(w, "normedSubtract", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o - e, 0n, 0n, 0n),
});
Object.defineProperty(w, "hadamard", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o * e),
});
Object.defineProperty(w, "divide", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o / e),
});
Object.defineProperty(w, "normedDivide", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newUnionWith((o, e) => o / e, 0n, 0n, 0n),
});
Object.defineProperty(w, "genBetween", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e) => w.newUnionWith((t, r) => new xe(t, r - 1n).genData())(o, e),
});
Object.defineProperty(w, "newCompareWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, ...e) => (t = new w(), ...r) => {
    let n = r.map((i) => i ?? new w()), s = w.assetsOf(t, ...n);
    for (let [i, a] of s.toMap) {
      for (let c of a) {
        let l = new L(i, c), d = new Array();
        if (
          [t, ...n].forEach((p, m) => {
            let h = e[m], y = p.amountOf(l, h);
            d.push(y);
          }), !o(d[0], ...d.slice(1))
        ) return !1;
      }
    }
    return !0;
  },
});
Object.defineProperty(w, "leq", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newCompareWith((o, e) => o <= e),
});
Object.defineProperty(w, "leq_", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newCompareWith((o, e) => o <= e, void 0, 0n),
});
Object.defineProperty(w, "lt", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newCompareWith((o, e) => o < e),
});
Object.defineProperty(w, "lt_", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: w.newCompareWith((o, e) => o < e, 0n),
});
Object.defineProperty(w, "newBoundedWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => (e) => {
    let t = new w();
    for (let [r, n] of e.toMap) {
      for (let [s, i] of n) {
        t.initAmountOf(
          new L(r, s),
          i < o.lowerBound ? o.lowerBound : i > o.upperBound ? o.upperBound : i,
        );
      }
    }
    return t;
  },
});
Object.defineProperty(w, "newMapAmounts", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => w.newUnionWith((e) => o(e)),
});
var Jt = class extends oe {
  constructor(e) {
    super(new je(ye.ptype, new je($e.ptype, e)), w),
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
        value: () => w.generateWith(this.pbounded),
      });
  }
  static genPType() {
    return new Jt(xe.genPType());
  }
};
var E = class {
  constructor(e = new w()) {
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
          f(
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
        value: (t) => new E(this.value.ofAssets(t)),
      }),
      Object.defineProperty(this, "intersect", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(this.value.intersect(t.value)),
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
        ) => (f(r > 0n, `fill: amount must be positive, got ${r}`),
          new E(this.value.fill(t, r))),
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
          f(
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
          let n = this.assets.boundedSubset(t, r), s = new E();
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
        value: (t) => new E(w.add(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedPlus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(w.normedAdd(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "minus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(w.subtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedMinus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(w.normedSubtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "divideBy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(w.divide(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedDivideBy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(w.normedDivide(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "leq", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => w.leq(this.unsigned, t.unsigned),
      }),
      f(e.positive, `value must be positive: ${e.show()}`);
  }
  get toMap() {
    return this.value.toMap;
  }
  get assets() {
    return this.value.assets;
  }
  get unsigned() {
    return new w(this.value.toMap);
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
    return new E(this.value.clone);
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
      let r = new w();
      return Object.entries(e).forEach(([n, s]) => {
        if (n !== t) {
          let i = L.fromLucid(n);
          r.initAmountOf(i, s);
        }
      }),
        new E(r);
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
    return new E(e.normed);
  }
  static singleton(e, t) {
    return new E(w.singleton(e, t));
  }
};
Object.defineProperty(E, "maybeFromMap", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    if (o !== void 0) return new E(new w(o));
  },
});
Object.defineProperty(E, "genOfAssets", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e = new Ee()) => {
    let t = new w();
    return o.forEach((r) => {
      t.initAmountOf(r, e.genData());
    }),
      new E(t);
  },
});
var _0 = w.newBoundedWith(new Ee()),
  yt = class extends oe {
    constructor() {
      super(new Jt(new Ee()), E);
    }
    static genPType() {
      return yt.ptype;
    }
  };
Object.defineProperty(yt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new yt(),
});
var Z = class {
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
      Object.defineProperty(this, "addAmountOf", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t, r) => {
          this.value.addAmountOf(t, r);
        },
      }),
      Object.defineProperty(this, "plus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Z.fromValue(w.add(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "minus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Z.fromValue(w.subtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "normedMinus", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => new E(w.normedSubtract(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "hadamard", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Z.fromValue(w.hadamard(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "divideBy", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Z.fromValue(w.divide(this.unsigned, t.unsigned)),
      }),
      Object.defineProperty(this, "divideByScalar", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => Z.fromValue(this.unsigned.divideByScalar(t)),
      }),
      Object.defineProperty(this, "lt", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => w.lt(this.unsigned, t.unsigned),
      }),
      Object.defineProperty(this, "leq", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t) => w.leq(this.unsigned, t.unsigned),
      }),
      Object.defineProperty(this, "bounded", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (t = 1n, r = J) =>
          Z.fromValue(w.newBoundedWith(new xe(t, r))(this.unsigned)),
      }),
      Z.asserts(this);
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
  get clone() {
    return new Z(this.value.clone);
  }
  get toLucid() {
    return this.value.toLucid;
  }
  get leqMaxInteger() {
    return this.unsigned.leqMaxInteger;
  }
  static asserts(e) {
    f(e.assets.size >= 2n, "at least two assets are required");
  }
  static generate() {
    let e = G.generate(2n), t = E.genOfAssets(e);
    return new Z(t);
  }
  static genOfAssets(e) {
    return new Z(E.genOfAssets(e));
  }
  static genBelow(e) {
    return Z.fromValue(w.genBetween(e.unit, e.unsigned));
  }
};
Object.defineProperty(Z, "fromValue", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => new Z(new E(o)),
});
Object.defineProperty(Z, "filled", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e, t) => new Z(o.fill(e, t)),
});
var Te = class extends oe {
  constructor() {
    super(yt.ptype, Z),
      Object.defineProperty(this, "genData", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Z.generate,
      });
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
var Io = 100n,
  Le = class {
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
            let a = i + C, c = a + A;
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
      return this.virtual.hadamard(this.weights);
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
      f(
        t.equals(e.weights.assets),
        "assets of jumpSizes and weights must match",
      ),
        f(
          e.virtual.assets.subsetOf(t),
          `assets of virtual must be a subset of assets of jumpSizes and weights, but ${e.virtual.assets.show()}
is not a subset of ${t.show()}`,
        );
      let n = e.minAnchorPrices.plus(e.jumpSizes);
      f(
        n.leqMaxInteger,
        `max anchor price must be leq max integer, but is ${n.concise()}`,
      );
    }
    static generate() {
      let e = _e.ptype.genData(), t = G.generate(2n);
      return Le.genOf(e, t);
    }
    static genOf(e, t) {
      let r = new E(), n = new E(), s = new E();
      return t.forEach((i) => {
        let a = new Ee(2n).genData(),
          c = ae(a - 1n, Io),
          l = new Ee(1n, c).genData(),
          d = a - l,
          p = new Ee(1n, d).genData();
        s.initAmountOf(i, d / p), r.initAmountOf(i, l), n.initAmountOf(i, p);
      }),
        new Le(e, new Z(s), new Z(n), new Z(r), 1n);
    }
  },
  et = class extends W {
    constructor() {
      super(
        new z({
          owner: _e.ptype,
          virtual: Te.ptype,
          weights: Te.ptype,
          jumpSizes: Te.ptype,
          active: pe.ptype,
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
var Ie = class {
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
          let i = s + C, a = i + A;
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
Object.defineProperty(Ie, "assertWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => (e) => {
    let t = e.anchorPrices, r = o.minAnchorPrices;
    f(
      r.leq(t),
      `anchorPrices must be at least minAnchorPrices, but ${t.concise()}
is not at least ${r.concise()}`,
    );
  },
});
Object.defineProperty(Ie, "generateWith", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o, e, t) => () => {
    let r = o.minAnchorPrices;
    return new Ie(o.owner, t, e, r);
  },
});
var Gt = class extends W {
    constructor(e) {
      super(
        new z({
          owner: _e.ptype,
          threadNFT: new bt(e),
          paramNFT: new bt(e),
          anchorPrices: Te.ptype,
        }),
        Ie,
      );
    }
    static genPType() {
      return new Gt(V.dummy);
    }
  },
  wt = class extends Ye {
    constructor(e, t, r) {
      let n = new bt(t.currency);
      super(
        new W(
          new z({
            owner: new Xe(_e.ptype, e.owner),
            threadNFT: new Xe(n, r),
            paramNFT: new Xe(n, t),
            anchorPrices: Te.ptype,
          }),
          Ie,
        ),
        [Ie.assertWith(e)],
        Ie.generateWith(e, t, r),
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
        t = new we(V.dummy, e.owner.hash().hash(X(it - 1n))),
        r = t.next(ke(it));
      return new wt(e, t, r);
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
  xt = class extends W {
    constructor(e) {
      super(new z({ param: e }), at);
    }
    static genPType() {
      return xt.ptype;
    }
  };
Object.defineProperty(xt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new xt(et.ptype),
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
  wr = class extends W {
    constructor(e) {
      super(new z({ dirac: new Gt(e) }), Fe);
    }
    static genPType() {
      return new wr(V.dummy);
    }
  },
  xr = class extends W {
    constructor(e, t, r) {
      super(new z({ dirac: new wt(e, t, r) }), Fe);
    }
    static genPType() {
      let e = wt.genPType();
      return new xr(e.param, e.paramNFT, e.threadNFT);
    }
  },
  tt = class extends ot {
    constructor(e) {
      super([new wr(e), xt.ptype]);
    }
    static genPType() {
      return new tt(V.dummy);
    }
  },
  Bt = class extends ot {
    constructor(e, t, r) {
      super([new xr(e, t, r), xt.ptype]);
    }
    static genPType() {
      let e = wt.genPType();
      return new Bt(e.param, e.paramNFT, e.threadNFT);
    }
  };
var vr = class {
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
  vt = class extends W {
    constructor() {
      let e = new xe(0n, J ** J);
      super(new z({ bought: e, sold: e }), vr);
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
  Pt = class extends W {
    constructor() {
      super(
        new z({ boughtAsset: He.ptype, soldAsset: He.ptype, prices: vt.ptype }),
        Pr,
      );
    }
    static genPType() {
      return Pt.ptype;
    }
  };
Object.defineProperty(Pt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Pt(),
});
var _r = class {
    constructor(e) {
      Object.defineProperty(this, "swap", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: e,
      });
    }
  },
  Ut = class extends W {
    constructor() {
      super(new z({ swap: Pt.ptype }), _r);
    }
    static genPType() {
      return Ut.ptype;
    }
  };
Object.defineProperty(Ut, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Ut(),
});
var Dt = class {
    constructor() {}
  },
  Mt = class extends W {
    constructor() {
      super(new z({}), Dt);
    }
    static genPType() {
      return Mt.ptype;
    }
  };
Object.defineProperty(Mt, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Mt(),
});
var Ce = class extends ot {
  constructor() {
    super([Ut.ptype, Mt.ptype]);
  }
  static genPType() {
    return Ce.ptype;
  }
};
Object.defineProperty(Ce, "ptype", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: new Ce(),
});
var Or = class {
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
          value: (e) => (f(
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
              (this.preDiracUtxos = new K((r) => r.show())),
              f(!this.preDiracUtxos.has(t), `CRITICAL: duplicate dirac ${t}`),
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
            if (r.length) return [_t.parse(this.paramUtxo, r), t[t.length - 1]];
          },
        }),
        Object.defineProperty(this, "show", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (e = "") => {
            let t = e + C, r = t + A;
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
            let r = Ce.ptype.pconstant(new Dt()), n = {};
            for (
              let s of [
                ...this.paramUtxo ? [this.paramUtxo.paramNFT] : [],
                ...this.preDiracUtxos ? [...this.preDiracUtxos.keys()] : [],
              ]
            ) n[s.toLucid] = -1n;
            return e.attachMintingPolicy(t.mintingPolicy).mintAssets(
              n,
              $.Data.void(),
            ).collectFrom(this.utxos, q.to(r));
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
  _t = class {
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
            let s = Ce.ptype.pconstant(new Dt()), i = {};
            for (
              let a of [
                this.paramUtxo.paramNFT,
                ...this.diracUtxos.map((c) => c.dirac.threadNFT),
              ]
            ) i[a.toLucid] = -1n;
            return r.attachMintingPolicy(n.mintingPolicy).mintAssets(
              i,
              $.Data.void(),
            ).collectFrom(this.utxos, q.to(s));
          },
        }),
        Object.defineProperty(this, "switchingTx", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (r, n) => {
            let s = Ce.ptype.pconstant(new Dt()),
              a = tt.genPType().pconstant(
                new at(this.paramUtxo.param.switched),
              );
            return r.collectFrom([this.paramUtxo.utxo], q.to(s)).payToContract(
              n.address,
              { inline: q.to(a), scriptRef: n.validator },
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
        t = this.diracUtxos.reduce((r, n) => r.normedPlus(n.balance), new E())
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
      return new _t(e, t);
    }
    static open(e, t) {
      return new _t(e, t);
    }
  };
var Oe = class {
  constructor(e, t, r, n, s, i, a, c, l, d, p) {
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
        value: l,
      }),
      Object.defineProperty(this, "boughtExp", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: d,
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
      Object.defineProperty(this, "effectivePrice", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "previous", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
      }),
      Object.defineProperty(this, "subsequent", {
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
  boughtExp: ${this.boughtExp}
  soldExp: ${this.soldExp}
  spotPrice: ${this.spotPrice}
  effectivePrice: ${this.effectivePrice}
)`,
      }),
      Object.defineProperty(this, "tx", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (m) => {
          console.log(this.show());
          let h = this.diracUtxo.balance.clone;
          h.addAmountOf(this.boughtAsset, -this.boughtAmount),
            h.addAmountOf(this.soldAsset, this.soldAmount);
          let y = h.toLucid;
          y[this.diracUtxo.dirac.threadNFT.toLucid] = 1n;
          let k = Ce.ptype.pconstant(
              new _r(
                new Pr(
                  this.boughtAsset,
                  this.soldAsset,
                  new vr(this.boughtExp, this.soldExp),
                ),
              ),
            ),
            P = this.diracUtxo.peuclidDatum.pconstant(
              new Fe(this.diracUtxo.dirac),
            );
          return m.readFrom([this.paramUtxo.utxo]).collectFrom([
            this.diracUtxo.utxo,
          ], q.to(k)).payToContract(this.user.contract.address, {
            inline: q.to(P),
          }, y);
        },
      }),
      Object.defineProperty(this, "subsequents", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (m) => {
          let h = [this],
            y = h[0],
            k = this.user
              ? this.user.balance.amountOf(this.soldAsset) - this.soldAmount
              : -1n,
            P = this.diracUtxo.applySwapping(this);
          for (; k != 0n && !(m && h.length >= m);) {
            let I = P.swappingsFor(
              this.user,
              this.paramUtxo,
              w.singleton(this.soldAsset, k),
              this.boughtAsset,
            );
            if (I.length === 0) break;
            f(
              I.length === 1,
              `subsequents.length must be 1, but got:
${
                I.map((F) => F.show()).join(`
`)
              }`,
            );
            let g = I[0];
            k > 0 &&
            (k -= g.soldAmount, f(k >= 0n, `sold too much: ${g.show()}`)),
              P = P.applySwapping(g),
              y.subsequent = g,
              g.previous = y,
              y = g,
              h.push(g);
          }
          return h;
        },
      }),
      Object.defineProperty(this, "subSwap", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (m, h) => {
          let y = (h ? this.boughtAmount : m) * this.soldSpot,
            k = (h ? m : this.soldAmount) * this.boughtSpot,
            I = ae(y, k) / this.soldSpot;
          if (!I) return;
          let g = BigInt(Math.ceil(Number(I) * this.spotPrice));
          return f(
            g <= this.soldAmount,
            `soldAmount cannot increase: ${g} > ${this.soldAmount}`,
          ),
            f(
              I <= this.boughtAmount,
              `boughtAmount cannot increase: ${I} > ${this.boughtAmount}`,
            ),
            new Oe(
              this.user,
              this.paramUtxo,
              this.diracUtxo,
              this.boughtAsset,
              this.soldAsset,
              I,
              g,
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
          let m = this.boughtAmount * this.soldSpot,
            h = this.soldAmount * this.boughtSpot,
            k = ae(m, h) / this.soldSpot;
          f(
            k > 0n,
            `Swapping.randomSubSwap: maxBought must be positive, but is ${k} for ${this.show()}`,
          );
          let P = ke(k), I = BigInt(Math.ceil(Number(P) * this.spotPrice));
          return new Oe(
            this.user,
            this.paramUtxo,
            this.diracUtxo,
            this.boughtAsset,
            this.soldAsset,
            P,
            I,
            this.boughtSpot,
            this.soldSpot,
            this.boughtExp,
            this.soldExp,
          );
        },
      }),
      f(i > 0n, "boughtAmount must be positive"),
      f(a > 0n, "soldAmount must be positive"),
      f(c > 0n, "boughtSpot must be positive"),
      f(l > 0n, "soldSpot must be positive"),
      this.spotPrice = Number(l) / Number(c),
      this.effectivePrice = Number(a) / Number(i);
  }
  get type() {
    return "Swapping";
  }
  static boundary(e, t, r, n, s, i, a, c, l, d, p) {
    return new Oe(e, t, r, n, s, i, a, c, l, d, p);
  }
  static genOfUser(e) {
    let t = e.contract.state.swappingsFor(e);
    if (!(t.length < 1)) return te(t).randomSubSwap();
  }
  static boughtAssetForSale(e, t, r, n, s) {
    let i = e <= r, a = n <= t;
    return i || console.error(`boughtAssetForSale (${s}): 
        buyingAmm ${r} > 
        spotBuying ${e}`),
      a || console.error(`boughtAssetForSale (${s}):
        sellingAmm ${n} > 
        spotSelling ${t}`),
      i && a;
  }
  static valueEquation(e, t, r, n) {
    let s = r * t, i = n * e;
    return s > i && console.error(`valueEquation: 
        addedBuyingA0 ${s} > 
        addedSellingA0 ${i}`),
      s <= i;
  }
  static validates(e, t, r, n, s, i, a, c) {
    let l = r * s, d = n * i, p = r * (s - a), m = n * (i + c);
    return Oe.boughtAssetForSale(e, t, l, d, "old") &&
      Oe.boughtAssetForSale(e, t, p, m, "new") && Oe.valueEquation(e, t, a, c);
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
              $.Data.void(),
            ).payToContract(s.address, {
              inline: q.to(a),
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
            let s = n + C, i = s + A;
            return `ParamUtxo (
  ${i}param: ${this.param.concise(i)}
  ${s})`;
          },
        });
    }
    static parse(e, t) {
      let r = L.ADA.toLucid(), n = Object.keys(e.assets).filter((i) => i !== r);
      f(n.length === 1, `expected exactly id-NFT in ${n.toString()}`),
        f(e.assets[n[0]] === 1n, "expected exactly 1 id-NFT");
      let s = we.fromLucid(n[0]);
      return new ct(t, s, e);
    }
    static open(e, t) {
      return new ct(e, t);
    }
  },
  Gr = class {
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
            let i = s + C, a = i + A;
            return `PreDiracUtxo (
  ${a}utxo: {this.utxo.concise(ttf)}
  ${a}datum: {this.datum.concise(ttf)}
  ${a}preDirac: ${this.preDirac.concise(a)}
  ${i})`;
          },
        });
      let n = this.preDirac.threadNFT.toLucid;
      f(
        e.assets[n] === 1n,
        `expected exactly 1 thread-NFT, got ${e.assets[n]}`,
      ), this.balance = E.fromLucid(e.assets, n);
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
            let i = s + C, a = i + A;
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
              l = this.dirac.threadNFT.toLucidNFT;
            return c[Object.keys(l)[0]] = 1n,
              s.mintAssets(l, $.Data.void()).payToContract(i.address, {
                inline: q.to(a),
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
              this.balance.normedPlus(E.singleton(s.soldAsset, s.soldAmount))
                .normedMinus(E.singleton(s.boughtAsset, s.boughtAmount)),
            ),
        }),
        Object.defineProperty(this, "swappingsFor", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: (s, i, a, c) => {
            let l = new Array(), d = this.balance;
            if (c) {
              let N = this.balance.amountOf(c, 0n);
              if (N > 0n) d = E.singleton(c, N);
              else return [];
            }
            let p = i.param,
              m = new E(),
              h = new E(),
              y = new E(),
              k = new E(),
              P = new E(),
              I = new E(),
              g = new E(),
              F = (N, ee) => (Y) => (Y - ee * N) / N;
            p.assets.forEach((N) => {
              let ee = d.amountOf(N, 0n), Y = a?.amountOf(N, 0n);
              if (ee <= 0n && Y && Y === 0n) return;
              let fe = p.virtual.amountOf(N),
                R = p.weights.amountOf(N),
                ie = p.jumpSizes.amountOf(N),
                b = this.dirac.anchorPrices.amountOf(N),
                v = fe + this.balance.amountOf(N, 0n);
              if (v <= 0n) return;
              m.initAmountOf(N, v);
              let T = v * R;
              f(T > 0n, "amm <= 0n");
              let j = (Number(ie) + 1) / Number(ie),
                M = Math.log(Number(T) / Number(b)) / Math.log(j),
                ne = Math.floor(M),
                de = Math.ceil(M),
                ve = BigInt(Math.floor(Number(b) * j ** ne)),
                kt = BigInt(Math.floor(Number(b) * j ** de)),
                kr = F(R, v);
              if (ee > 0n) {
                for (; ve > 0n;) {
                  let Ht = kr(ve), lt = ae(ee, -Ht);
                  if (lt > 0n) {
                    h.initAmountOf(N, ve),
                      k.initAmountOf(N, BigInt(ne)),
                      I.initAmountOf(N, lt);
                    break;
                  } else ne--, ve = BigInt(Math.floor(Number(b) * j ** ne));
                }
              }
              if ((Y === void 0 || Y != 0n) && kt > 0n) {
                for (;;) {
                  let Ht = kr(kt), lt = Y && Y > 0n ? ae(Y, Ht) : Ht;
                  if (lt > 0n) {
                    y.initAmountOf(N, kt),
                      P.initAmountOf(N, BigInt(de)),
                      g.initAmountOf(N, lt);
                    break;
                  } else de++, kt = BigInt(Math.floor(Number(b) * j ** de));
                }
              }
            });
            let U = g.assets.toList, he = I.assets.toList;
            return U.forEach((N) => {
              let ee = y.amountOf(N), Y = P.amountOf(N), fe = g.amountOf(N);
              he.forEach((R) => {
                if (N.equals(R)) return;
                let ie = h.amountOf(R),
                  b = k.amountOf(R),
                  v = I.amountOf(R),
                  T = v * ee,
                  j = fe * ie,
                  M = ae(j, T);
                if (M < ee) {
                  let kr = Number(this.dirac.anchorPrices.amountOf(N)),
                    Ht = Number(this.dirac.anchorPrices.amountOf(R)),
                    lt = Number(p.jumpSizes.amountOf(N)),
                    jn = Number(p.jumpSizes.amountOf(R)),
                    Ts = (lt + 1) / lt,
                    As = (jn + 1) / jn,
                    Sn = d.amountOf(R, 0n),
                    Xt = a?.amountOf(N, 0n);
                  if (Sn <= 0n || Xt && Xt === 0n) return;
                  let Es = F(p.weights.amountOf(N), m.amountOf(N)),
                    Is = F(p.weights.amountOf(R), m.amountOf(R));
                  for (; M < ee;) {
                    if (j <= T) {
                      Y++;
                      let jr = Math.floor(kr * Ts ** Number(Y));
                      if (!isFinite(jr)) return;
                      ee = BigInt(jr);
                      let $n = Es(ee);
                      fe = Xt && Xt > 0n ? ae(Xt, $n) : $n;
                    } else {
                      b--, ie = BigInt(Math.floor(Ht * As ** Number(b)));
                      let jr = Is(ie);
                      v = ae(Sn, -jr);
                    }
                    T = v * ee, j = fe * ie, M = ae(j, T);
                  }
                }
                let ne = M / ee, de = Math.ceil(Number(M) / Number(ie));
                if (!isFinite(de)) return;
                let ve = BigInt(de),
                  kt = Oe.boundary(s, i, this, R, N, ne, ve, ie, ee, b, Y);
                if (
                  Oe.validates(
                    ie,
                    ee,
                    p.weights.amountOf(R),
                    p.weights.amountOf(N),
                    m.amountOf(R),
                    m.amountOf(N),
                    ne,
                    ve,
                  )
                ) l.push(kt);
                else throw new Error(`invalid swap: ${kt.show()}`);
              });
            }),
              l;
          },
        });
    }
    static parse(e, t) {
      let r = new Bt(t, e.preDirac.paramNFT, e.preDirac.threadNFT),
        n = r.plift(e.datum);
      return f(n instanceof Fe, "expected DiracDatum"),
        new ut(r, n.dirac, e.balance, e.utxo);
    }
    static open(e, t, r) {
      let n = new Bt(e, t.paramNFT, t.threadNFT);
      return new ut(n, t, r);
    }
  };
var Zr = class {
  constructor(e, t) {
    Object.defineProperty(this, "invalidUtxos", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: new K((s) => s),
    }),
      Object.defineProperty(this, "pools", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: new K((s) => s.show()),
      }),
      Object.defineProperty(this, "invalidPools", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: new K((s) => s.show()),
      });
    let r = new K((s) => s.show()), n = new tt(t);
    e.forEach((s) => {
      try {
        f(s.datum, "datum must be present");
        let i = q.from(s.datum);
        f(i instanceof $.Constr, `datum must be a Constr, got ${i}`);
        let a = n.plift(i);
        if (a instanceof at) {
          let c = ct.parse(s, a.param),
            l = c.param.owner,
            d = c.paramNFT,
            p = r.get(l) ?? new K((h) => h.show()),
            m = (p.get(d) ?? new Or()).setParamUtxo(c);
          p.set(d, m), r.set(l, p);
        } else if (a instanceof Fe) {
          let c = new Gr(s, i, a.dirac),
            l = c.preDirac.owner,
            d = c.preDirac.paramNFT,
            p = r.get(l) ?? new K((h) => h.show()),
            m = (p.get(d) ?? new Or()).addPreDiracUtxo(c);
          p.set(d, m), r.set(l, p);
        } else throw new Error("unknown preEuclidDatum");
      } catch (i) {
        console.error(i);
      }
    }),
      this.pools = new K((s) => s.show()),
      r.forEach((s, i) => {
        let a = new K((m) => m.show()),
          c = new K((m) => m.show()),
          l = s.size,
          d = it,
          p = new we(t, i.hash());
        for (; l && d;) {
          let m = s.get(p);
          if (m) {
            d = it;
            let h = m.parse();
            if (h) {
              let [y, k] = h;
              a.set(p, y), p = k, l--;
            } else c.set(p, m);
          } else d--;
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
var Yr = class {
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
          this.state = new Zr(t, this.policy);
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
      this.validator = { type: "PlutusV2", script: Tn.cborHex },
      this.mintingPolicy = { type: "PlutusV2", script: An.cborHex },
      this.address = e.utils.validatorToAddress(this.validator),
      this.policy = V.fromHex(e.utils.mintingPolicyToId(this.mintingPolicy));
  }
};
var Zt = class {
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
Object.defineProperty(Zt, "genOfUser", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    if (!o.availableBalance) return;
    let t = o.contract.state?.pools.get(o.paymentKeyHash);
    if (!t || !t.size) return;
    let r = te([...t.values()]);
    return new Zt(o, r);
  },
});
var Yt = class {
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
      Object.defineProperty(this, "poolCache", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0,
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
          if (this.poolCache) return this.poolCache;
          let s = this.param.weights.assets,
            i = this.param.minAnchorPrices,
            a = this.param.jumpSizes.divideBy(this.numTicks),
            c = this.user.nextParamNFT.next(),
            l = ct.open(this.param, c),
            d = c.next(),
            p = [new Ie(this.user.paymentKeyHash, d, c, i)];
          s.forEach((k) => {
            let P = 1n, I = a.amountOf(k), g = new Array();
            p.forEach((F) => {
              for (let U = 1n; U < P; U++) {
                let he = F.anchorPrices.clone;
                he.addAmountOf(k, U * I),
                  d = d.next(),
                  g.push(new Ie(this.user.paymentKeyHash, d, c, he));
              }
            }), p = p.concat(g);
          });
          let m = E.normed(
            this.deposit.unsigned.divideByScalar(BigInt(p.length)),
          );
          f(
            m.size === this.deposit.size,
            "balance size should match deposit size",
          );
          let h = p.map((k) => ut.open(this.param, k, m));
          this.user.setLastIdNFT(d);
          let y = _t.open(l, h);
          return this.poolCache = y, y;
        },
      }),
      f(
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
Object.defineProperty(Yt, "genOfUser", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    let e = o.availableBalance;
    if (!e || e.size < 1) return;
    let t = se,
      r = e.boundedSubValue(1n, t),
      n = r.assets,
      s = ht(X(t), 2n) - n.size;
    for (; s > 0n;) {
      let p = L.generate();
      n.has(p) || (n.insert(p), s--);
    }
    let i = Le.genOf(o.paymentKeyHash, n),
      a = 26n,
      c = r.smallestAmount,
      l = ae(a, c),
      d = new E();
    return n.forEach((p) => {
      let m = new Ee(1n, ae(ae(se, i.jumpSizes.amountOf(p)), l)).genData();
      l /= m, d.initAmountOf(p, m);
    }),
      new Yt(o, i, r, new Z(d));
  },
});
var Co = [Zt, Yt, Oe],
  Xr = class {
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
          value: () => new kn(Co).try((r) => r.genOfUser(this.user)),
        });
    }
  },
  kn = class {
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
      let [e, t] = Rr(this.base);
      return this.base = this.base.slice(0, t).concat(this.base.slice(t + 1)),
        e;
    }
  };
var No = E.singleton(L.ADA, 10n * Fr),
  Ot = class {
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
                await this.update(), this.balance.amountOf(L.ADA) < Fr
              ) return console.log("not enough ada to pay fees etc."), [];
              let s = new Xr(this).generate();
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
              return this.balance = s.map((i) => E.fromLucid(i.assets)).reduce(
                (i, a) => i.normedPlus(a),
                new E(),
              ),
                this.lastIdNFT = this.contract.state.pools.get(
                  this.paymentKeyHash,
                )?.last?.lastIdNFT,
                this.lucid.currentSlot();
            },
          }),
          this.contract = new Yr(e),
          r
      ) {
        let s = this.lucid.utils.getAddressDetails(r);
        f(s.paymentCredential, "No payment credential");
        let i = Me.fromCredential(s.paymentCredential);
        n && f(n.show() === i.show()), this.paymentKeyHash = i;
      } else {f(n, "neither address nor paymentKeyHash provided"),
          this.paymentKeyHash = n;}
    }
    get availableBalance() {
      if (
        f(this.balance, "No balance"), this.balance.amountOf(L.ADA, 0n) < Fr
      ) return;
      let e = this.balance.clone;
      return e.drop(L.ADA), e;
    }
    get hasPools() {
      return this.lastIdNFT !== void 0;
    }
    get nextParamNFT() {
      return this.lastIdNFT
        ? this.lastIdNFT.next()
        : new we(this.contract.policy, this.paymentKeyHash.hash());
    }
    get account() {
      return f(this.address, "No address"),
        f(this.balance, "No balance"),
        { address: this.address, assets: this.balance.toLucid };
    }
    static async fromWalletApi(e, t) {
      let r = await e.selectWallet(t).wallet.address();
      return new Ot(e, void 0, r);
    }
    static async fromPrivateKey(e, t) {
      let r = await e.selectWalletFromPrivateKey(t).wallet.address();
      return new Ot(e, t, r);
    }
    static async generateWith(e, t) {
      let r = $.generatePrivateKey(),
        n = await e.selectWalletFromPrivateKey(r).wallet.address(),
        s = new Ot(e, r, n);
      return s.balance = E.genOfAssets(t.boundedSubset(1n)).normedPlus(No), s;
    }
    static generateDummy() {
      let e = new $.Lucid();
      e.utils = new $.Utils(e);
      let t = $.generatePrivateKey(),
        r = _e.ptype.genData(),
        n = new Ot(e, t, void 0, r),
        s = G.generate(2n);
      return n.balance = E.genOfAssets(s), n;
    }
    static async genSeveral(e, t) {
      let r = new Array(),
        n = G.generate(t, t),
        s = await $.Lucid.new(void 0, "Custom"),
        i = new Array();
      for (; r.length < e;) {
        let a = await Ot.generateWith(s, n);
        f(a.address, "user.address is undefined"),
          i.includes(a.address) || (i.push(a.address), r.push(a));
      }
      return r;
    }
  };
var Qr = class {
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
Object.defineProperty(Qr, "genOfUser", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: (o) => {
    if (!o.availableBalance) return;
    let t = o.contract.state?.invalidPools.get(o.paymentKeyHash);
    if (!t || !t.size) return;
    let r = te([...t.values()]);
    return new Qr(o, r);
  },
});
var $s = class {
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
var en = class {
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
          return f(s !== -1, "PEnum.plift: Literal does not match"),
            this.literals[s];
        },
      }),
      Object.defineProperty(this, "pconstant", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r) => {
          let n = this.pliteral.showData(r), s = this.strs.indexOf(n);
          return f(s !== -1, "PEnum.pconstant: Literal does not match"),
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
          f(
            a !== -1,
            `PEnum.showData: Literal does not match, got:
${i},
expected one of:
${this.strs.join(", ")}.`,
          );
          let c = n + C, l = c + A;
          return `Enum (
${l}${this.pliteral.showData(r, l, s && s - 1n)}
${c})`;
        },
      }),
      Object.defineProperty(this, "showPType", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: (r = "", n) => {
          if (n !== void 0 && n <= 0n) return "PEnum ( \u2026 )";
          let s = r + C, i = s + A, a = i + C, c = a + A;
          return `PEnum (
${i}population: ${this.population},
${i}pliteral: ${this.pliteral.showPType(i, n && n - 1n)},
${i}literals: [
${c}${
            this.literals.map((l) => this.pliteral.showData(l, c, n && n - 1n))
              .join(`,
${c}`)
          }
${a}]
${s})`;
        },
      }),
      f(t.length > 0, "PEnum: literals of enum must be non-empty"),
      this.plutusLiterals = t.map((r) => e.pconstant(r)),
      this.strs = [],
      t.forEach((r) => {
        let n = e.showData(r);
        f(!this.strs.includes(n), `PEnum: Duplicate literal: ${n}`),
          this.strs.push(n);
      }),
      this.population = t.length;
  }
  static genPType(e, t) {
    let r = e.generate(t), n = ke(se), s = [], i = [];
    for (let a = 0; a < n; a++) {
      let c = r.genData(), l = r.showData(c);
      i.includes(l) || (i.push(l), s.push(c));
    }
    return new en(r, s);
  }
};
export {
  $ as Lucid,
  $e as PToken,
  $s as Switching,
  _0 as boundPositive,
  _e as PKeyHash,
  _r as SwapRedeemer,
  _s as gMaxDepth,
  _t as Pool,
  A as f,
  ae as min,
  at as ParamDatum,
  bn as abs,
  br as filterFunctions,
  Bt as PEuclidDatum,
  bt as PIdNFT,
  C as t,
  Ce as PEuclidAction,
  ce as PByteString,
  Co as allActions,
  ct as ParamUtxo,
  Dt as AdminRedeemer,
  E as PositiveValue,
  Ee as PPositive,
  en as PEnum,
  et as PParam,
  Fe as DiracDatum,
  Fr as feesEtcLovelace,
  G as Assets,
  ge as maybeNdef,
  gn as randomSubset,
  Gr as PreDiracUtxo,
  gr as newGenInRange,
  Gt as PPreDirac,
  gt as PString,
  Gu as proptestPTypes,
  He as PAsset,
  ht as max,
  Ie as Dirac,
  Io as maxJumpSize,
  it as gMaxHashes,
  J as maxInteger,
  je as PMap,
  Jr as ccysTknsAmnts,
  Jt as PValue,
  K as AssocMap,
  ke as genPositive,
  ks as genNumber,
  Kt as PNonEmptyList,
  L as Asset,
  Le as Param,
  Me as KeyHash,
  mr as gMaxStringBytes,
  mt as PHash,
  Nt as gMaxStringLength,
  Oe as Swapping,
  oe as PWrapped,
  On as genPBounded,
  Or as PrePool,
  Os as nonEmptySubSet,
  Ot as User,
  ot as PSum,
  pe as PInteger,
  Pr as Swap,
  Ps as Generators,
  Pt as PSwap,
  q as Data,
  Qe as PList,
  Qr as Cleaning,
  qr as boundedSubset,
  re as Hash,
  Rr as randomIndexedChoice,
  Se as Token,
  se as gMaxLength,
  Ss as genByteString,
  Te as PEuclidValue,
  te as randomChoice,
  tt as PPreEuclidDatum,
  ut as DiracUtxo,
  V as Currency,
  vc as bothExtreme,
  vr as BoughtSold,
  Vt as tknsAmnts,
  vt as PBoughtSold,
  W as PObject,
  w as Value,
  we as IdNFT,
  Wr as maxShowDepth,
  Wt as PAssets,
  wt as PDirac,
  X as genNonNegative,
  Xe as PLiteral,
  xe as PBounded,
  Xr as UserAction,
  Ye as PConstraint,
  ye as PCurrency,
  Yr as Contract,
  yr as ccysTkns,
  Yt as Opening,
  yt as PPositiveValue,
  Z as EuclidValue,
  z as PRecord,
  Zr as EuclidState,
  zr as genName,
  Zt as Closing,
};
