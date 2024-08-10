'use strict'

let Flavor = (function() {
	let Flavor = {};

	Flavor.generate = function() {
		let patterns = [
			'{adjectives} {nouns}',
		];
		
		return GenUtil.generatePattern(GenUtil.pickRandom(patterns), Flavor);
	}

	Flavor.generateTerrainTitle = function(terrainType) {
		Flavor.__terrains = terrainType.titles;
		Flavor.__random = [Flavor.generateNationName()];
		
		let patterns = [
			'The {__random} {__terrains}',
			'The {__random} {__terrains}',
			'The {__random} {__terrains}',
			'The {__random} {__terrains}',
			'The {__terrains} of {__random}',
			'The {__terrains} of {__random}',
			'The {__terrains} of {__random}',
		
			'The {adjectives} {__terrains}',
			'The {adjectives} {__terrains}',
			'The {adjectives} {__terrains}',
			'The {__terrains} of {nouns}s',
			'The {__terrains} of {nouns}s',
			'The {nouns} {__terrains}',
			'The {__terrains} of the {adjectives} {nouns}',
			'The {adjectives} {__terrains} of the {nouns}'
		];

		return GenUtil.generatePattern(GenUtil.pickRandom(patterns), Flavor);
	}
	
	Flavor.generateNationName = function() {
		//return GenUtil.pickRandom(Flavor.placeNames);
		
		let r = Math.random();
		
		//if (r < 0.333) {
		//	return GenUtil.mashup(GenUtil.pickRandom(Flavor.placeNames),GenUtil.pickRandom(Flavor.placeNames));
		//} else if (r < 0.666) {
			return Flavor.generateName();
		//} else {
		//	return GenUtil.mashup(Flavor.generateName(),GenUtil.pickRandom(Flavor.placeNames));
		//}
	}

	Flavor.VOWELS = ['a', 'a', 'a', 'e', 'i', 'i', 'o', 'o', 'u'];
	Flavor.CONSONANTS = ['b','c','ch','d','f','g','h','k','l','m','n','n','n','n','p','r','r','r','r','s','sh','t','th','v','w','x','y','z'];
	
	Flavor.generateName = function() {
		let lengths = [3,4,4,4,4,5,5,5,6,6];
		let length = GenUtil.pickRandom(lengths);
		let v = Math.floor(Math.random()*1.5);
		
		let result = '';
		
		while (length) {
			length--;
			
			if (v == 0) {
				result += GenUtil.pickRandom(Flavor.CONSONANTS);
				if (length > 0 && Math.random() < 0.25) {
					result += GenUtil.pickRandom(Flavor.CONSONANTS);
				}
				v++;
			} else {
				result += GenUtil.pickRandom(Flavor.VOWELS);
				if (v >= 2) {
					v = 0;
				} else {
					if (Math.random() < 0.333) {
						v++;
					} else {
						v = 0;
					}
				}
			}
		}
		
		return result;
	}

	Flavor.adjectives = ['Glass','Silent','Silver','Golden','Rocky','Burning','Elven','Dwarven','Gnomish','Orcish','Deep','Draconic','Mad','Fungal','Hateful','Legendary','Fabled','Mythical','Dark','Gloomy','Steadfast','Adamantine','Hellish','Bleak','Murky','Dismal','Desolate','Grim','Sinister','Draconic','Monstrous','Lonely','Twin','Sealed','Wild','Crystalline','Haunted','Obsidian','Frozen','Unworthy','Scorched','Whispering','Blighted','Slimy','Corrupted','Nightmare','Solar','Lunar','Undead','Demonic','Demon','Primordial','Abyssal','Forbidden','Laughing','Eternal','Lost','Tribal','Rusty','Abandoned','Gray','Black','White','Blue','Green','Onyx','Red','Orange','Yellow','Violet','Indigo','Umber','Dead','Vile','Cursed','Ancient','Dread','Thorny','Timeless','Fearsome','Oaken','Shrouded','Windy','Cruel','Bitter','Blasted','Hidden','Shadowy','Shining','Screaming','Howling','Undersea','Lofty','Subterranian','Unearthly','Illusory','Sunless','Tidal','Sandy','Parched','Slimy','Mysterious','Bloody','Divine','Snowy','Holy','Unholy','Clockwork','Royal','Crooked','Secret','Creeping','Great','Broken','All-Seeing','Singing','Impervious','Imperial','Enchanted','Beguiling','Bewitched','Enslaved','Living','Ghostly','Colossal','Planar','Lightning-Struck','Drowned','Poisonous','Prismatic','Cunning','Ashen','Besieged','Enigmatic','Wandering','Misty','Twisted','Twisty','Homely','Stinking','Deathless','Savage','Mechanized','Animated','Scoured','Ruined','Bubbling','Olympian','Drunken','Hungering','Foul','Damned','Cracked','Demented','Chaotic','Damp','Stygian','Olympic','Raging','Stony','Starving','Musical','Windswept','Vast','Dry','Sandy','Mossy','Foggy','Echoing','Hypnotic','Magnetic','Apocalyptic','Diabolical','Attuned','Fossilized','Elder','Ominous','Ghastly','Baleful','Dying','Lucky','Sunny','Flowering','Petrified','Putrified','Rejoicing','Woody','Metallic','Razored','Deserted'];

	Flavor.nouns = ['Adventure','Ale','Angel','Annihilation','Arm','Army','Armor','Ash','Axe','Bane','Banner','Battle','Bear','Beetle','Bell','Berry','Blood','Blossom','Twilight','Bone','Book','Candles','Chaos','Clan','Claw','Coin','Comet','Copper','Cove','Crab','Crown','Danger','Darkness','Dawn','Daylight','Death','Demon','Despair','Devil','Devotion','Diamond','Discord','Doom','Dragon','Dream','Dusk','Dust','Eagle','Earth','Elf','Emerald','End','Vine','Bramble','Thorn','Evil','Eye','Face','Faith','Falcon','Fate','Favor','Fear','Feast','Finger','Fire','Fish','Fist','Flesh','Flower','Fool','Foot','Fortune','Frog','Helm','Gear','Gem','Giant','Glen','Glory','Gnome','Goblin','Gold','Granite','Grave','Grief','Grove','Guard','Hand','Harmony','Hatred','High','Hope','Horror','Ice','Illusion','Ivy','Judgement','Justice','King','Knight','Knowledge','Law','Legion','Lightning','Lizard','Lost','Madness','Magic','Mask','Memory','Metal','Meteor','Midnight','Mirror','Mist','Monkey','Monster','Mystery','Night','Oblivion','Orb','Orc','Pain','Peace','Peak','Pirate','Power','Prophecy','Queen','Rage','Rat','Raven','Ring','Rock','Rose','Rot','Ruby','Ruin','Rune','Sage','Sapphire','Scar','Scroll','Secret','Serpent','Shadow','Shield','Shrine','Silence','Silver','Skull','Arrow','Slime','Smoke','Song','Spear','Spell','Spider','Spike','Spirit','Star','Storm','Sword','Temple','Terror','Thief','Tiger','Tooth','Topaz','Town','Treasure','Tree','Trick','Truth','Valour','Venom','Vice','Vile','Villainy','Vision','Void','Vow','War','Water','Wealth','Wind','Wine','Wisdom','Witchcraft','Wizard','Wizardry','Wolf', 'Titan', 'God', 'Goddess', 'Ogre'];

	Flavor.placeNames = ['Adan','Magrit','Ahsa','Masqat','Andalus','Misr','Asmara','Muruni','Asqlan','Qabis','Baqubah','Qina','Basit','Rabat','Baysan','Ramlah','Baytlahm','Riyadh','Bursaid','Sabtah','Dahilah','Salalah','Darasalam','Sana','Dawhah','Sinqit','Ganin','Suqutrah','Gebal','Sur','Gibuti','Tabuk','Giddah','Tangah','Harmah','Tarifah','Hartum','Tarrakunah','Hibah','Tisit','Hims','Uman','Hubar','Urdunn','Karbala','Wasqah','Kut','Yaburah','Lacant','Yaman','Andong','Luzhou','Anqing','Ningxia','Anshan','Pingxiang','Chaoyang','Pizhou','Chaozhou','Qidong','Chifeng','Qingdao','Dalian','Qinghai','Dunhuang','Rehe','Fengjia','Shanxi','Fengtian','Taiyuan','Fuliang','Tengzhou','Fushun','Urumqi','Gansu','Weifang','Ganzhou','Wugang','Guizhou','Wuxi','Hotan','Xiamen','Hunan','Xian','Jinan','Xikang','Jingdezhen','Xining','Jinxi','Xinjiang','Jinzhou','Yidu','Kunming','Yingkou','Liaoning','Yuxi','Linyi','Zigong','Lushun','Zoige','Ahmedabad','Alipurduar','Alubari','Anjanadri','Ankleshwar','Balarika','Bhanuja','Bhilwada','Brahmaghosa','Bulandshahar','Candrama','Chalisgaon','Chandragiri','Charbagh','Chayanka','Chittorgarh','Dayabasti','Dikpala','Ekanga','Gandhidham','Gollaprolu','Grahisa','Guwahati','Haridasva','Indraprastha','Jaisalmer','Jharonda','Kadambur','Kalasipalyam','Karnataka','Kutchuhery','Lalgola','Mainaguri','Nainital','Nandidurg','Narayanadri','Panipat','Panjagutta','Pathankot','Pathardih','Porbandar','Rajasthan','Renigunta','Sewagram','Shakurbasti','Siliguri','Sonepat','Teliwara','Tinpahar','Villivakkam','Bando','Chikuma','Chikusei','Chino','Hitachi','Hitachinaka','Hitachiomiya','Hitachiota','Iida','Iiyama','Ina','Inashiki','Ishioka','Itako','Kamisu','Kasama','Kashima','Kasumigaura','Kitaibaraki','Kiyose','Koga','Komagane','Komoro','Matsumoto','Mito','Mitsukaido','Moriya','Nagano','Naka','Nakano','Ogi','Okaya','Omachi','Ryugasaki','Saku','Settsu','Shimotsuma','Shiojiri','Suwa','Suzaka','Takahagi','Takeo','Tomi','Toride','Tsuchiura','Tsukuba','Ueda','Ushiku','Yoshikawa','Yuki','Abadan','Ador','Agatu','Akamkpa','Akpabuyo','Ala','Askira','Bakassi','Bama','Bayo','Bekwara','Biase','Boki','Buruku','Calabar','Chibok','Damboa','Dikwa','Etung','Gboko','Gubio','Guzamala','Gwoza','Hawul','Ikom','Jere','Kalabalge','Katsina','Knoduga','Konshishatse','Kukawa','Kwande','Kwayakusar','Logo','Mafa','Makurdi','Nganzai','Obanliku','Obi','Obubra','Obudu','Odukpani','Ogbadibo','Ohimini','Okpokwu','Otukpo','Shani','Ugep','Vandeikya','Yala','Amur','Arkhangelsk','Astrakhan','Belgorod','Bryansk','Chelyabinsk','Chita','Gorki','Irkutsk','Ivanovo','Kaliningrad','Kaluga','Kamchatka','Kemerovo','Kirov','Kostroma','Kurgan','Kursk','Leningrad','Lipetsk','Magadan','Murmansk','Novgorod','Novosibirsk','Omsk','Orenburg','Oryol','Penza','Perm','Pskov','Rostov','Ryazan','Sakhalin','Samara','Saratov','Smolensk','Sverdlovsk','Tambov','Tomsk','Tula','Tver','Tyumen','Ulyanovsk','Vladimir','Volgograd','Vologda','Voronezh','Vyborg','Yaroslavl','Aguascebas','Alcazar','Barranquete','Bravatas','Cabezudos','Calderon','Cantera','Castillo','Delgadas','Donablanca','Encinetas','Estrella','Faustino','Fuentebravia','Gafarillos','Gironda','Higueros','Huelago','Humilladero','Illora','Isabela','Izbor','Jandilla','Jinetes','Limones','Loreto','Lujar','Marbela','Matagorda','Nacimiento','Ogijares','Ortegicar','Pampanico','Pelado','Quesada','Quintera','Riguelo','Ruescas','Salteras','Santopitar','Taberno','Torres','Umbrete','Valdecazorla','Velez','Vistahermosa','Yeguas','Zahora','Zumeta','Athens','Thessaloniki','Patras','Piraeus','Larissa','Heraklion','Peristeri','Kallithea','Acharnes','Kalamaria','Nikaia','Glyfada','Volos','Ilio','Ilioupoli','Keratsini','Evosmos','Chalandri','Nea','Marousi','Agios','Zografou','Egaleo','Nea','Ioannina','Palaio','Korydallos','Trikala','Vyronas','Agia','Galatsi','Agrinio','Chalcis','Petroupoli','Serres','Alexandroupoli','Xanthi','Katerini','Kalamata','Kavala','Chania','Lamia','Komotini','Irakleio','Rhodes','Kifissia','Stavroupoli','Chaidari','Veria','Sirmium','Spalatum','Tarraco','Treverorum','Verulamium','Vesontio','Vetera','Vindelicorum','Vindobona','Vinovia','Viroconium','Volubilis','Abilia','Alsium','Aquileia','Argentoratum','Ascrivium','Asculum','Attalia','Barium','Batavorum','Belum','Bobbium','Brigantium','Burgodunum','Camulodunum','Clausentum','Corduba','Coriovallum','Durucobrivis','Eboracum','Emona','Florentia','Lactodurum','Lentia','Lindum','Londinium','Marstrand','Öregrund','Gränna','Borgholm','Skänninge','Mariefred','Askersund','Säter','Östhammar','Haparanda','Vaxholm','Trosa','Sävsjö','Hagfors','Vadstena','Laholm','Hjo','Strömstad','Flen','Filipstad','Kramfors','Nora','Simrishamn','Falsterbo','Skanör','Söderköping','Sigtuna','Lysekil','Torshälla','Vimmerby','Sölvesborg','Tidaholm','Sollefteå','Lycksele','Lindesberg','Djursholm','Säffle','Åmål','Eksjö','Ulricehamn','Arboga','Oxelösund','Fagersta','Ronneby','Mjölby','Söderhamn','Sala','Nybro','Vetlanda','Nynäshamn','Palhoça','Abaetetuba','Açailândia','Alagoinhas','Altamira','Apucarana','Araguari','Arapongas','Araras','Araruama','Araucária','Araxá','Ariquemes','Assis','Atibaia','Bacabal','Bagé','Barbacena','Barcarena','Barreiras','Barretos','Birigui','Botucatu','Bragança','Brusque','Cachoeirinha','Camaragibe','Cambé','Cametá','Campo Largo','Caraguatatuba','Catalão','Catanduva','Codó','Colatina','Conselheiro Lafaiete','Coronel Fabriciano','Corumbá','Crato','Cubatão','Erechim','Eunápolis','Formosa','Garanhuns','Guarapari','Guaratinguetá','Igarassu','Iguatu','Itabira','Itaguaí','Gyeryong','Taebaek','Gwacheon','Samcheok','Mungyeong','Sokcho','Namwon','Gimje','Donghae','Dongducheon','Yeongcheon','Sangju','Boryeong','Naju','Miryang','Yeongju','Gongju','Yeoju','Sacheon','Jeongeup','Nonsan','Jecheon','Tongyeong','Gimcheon','Gwangyang','Pocheon','Uiwang','Dangjin','Andong','Seosan','Seogwipo','Anseong','Guri','Yangju','Chungju','Osan','Icheon','Hanam','Gangneung','Mokpo','Sejong','Geoje','Gyeongsan','Gyeongju','Gunsan','Suncheon','Chuncheon','Gunpo','Yeosu','Iksan','Asella','Debre','Kombolcha','Debre','Adigrat','Woldiya','Sebeta','Burayu','Shire','Ambo','Arsi','Aksum','Gambela','Bale','Butajira','Ziway','Adwa','Areka','Yirgalem','Woliso','Welkite','Gode','Meki','Negele','Alaba','Alamata','Chiro','Tepi','Durame','Goba','Asosa','Boditi','Gimbi','Wukro','Alemaya','Mizan','Sawla','Modjo','Dembi','Aleta','Metu','Mota','Fiche','Finote','Bule','Bonga','Kobo','Jinka','Dangila','Degehabur','Alençon','Armentières','Aurillac','Bègles','Bergerac','Béthune','Bezons','Bois-Colombes','Brunoy','Cachan','Carpentras','Cavaillon','Draveil','Élancourt','Ermont','Fresnes','Gonesse','Grigny','Guyancourt','Herblay','Kourou','Lambersart','Menton','Montbéliard','Montfermeil','Orange','Oullins','Rambouillet','Romainville','Saintes','Sannois','Saumur','Soissons','Taverny','Thiais','Tournefeuille','Vallauris','Vanves','Vichy','Vienne','Vierzon','Villemomble','Villeparisis','Yerres','Agde','Laon','Sens','Lunel','Miramas','Biarritz'];

	return Flavor;

}) ();