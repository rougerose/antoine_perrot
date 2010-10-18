$(document).ready(function(){
	/**
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
	
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("body").toggleClass("grille");
	});
	
	/**
	 * transitions CSS3 non disponibles dans Firefox 3 (max)
	 */
	
	if (typeof getStyleProperty('transition') == 'undefined') {
		// property is unsupported
		// simulation CSS3 pour firefox 3
		$("#nav li a").addClass("ff3").hover(
			function() {
				$(this).stop().animate({paddingLeft:"30px"},600);
			},
			function() {
				$(this).stop().animate({paddingLeft:"40px"},600);
			}
		);
	}
	
	/**
	 * Slider
	 * script est un mix entre deux sources principales : 
	 * http://jqueryfordesigners.com/coda-slider-effect/
	 * et
	 * http://jqueryfordesigners.com/jquery-infinite-carousel/
	 */
	
	$("#slider").each(function(){
		var slider = $(this),
			scroll = $(".scroll"),
			conteneur = $(".scrollConteneur"),
			panneaux = $(".panneau"),
			pages = panneaux.length,
			nav = $(".navigation a"),
			pageCourante = 1,
			p = 1,
			panneauLargeur = panneaux.outerWidth(),
			horizontal = true,
			delai = 700;
		
		// pas de barre défilement sur le div.scroll
		scroll.css("overflow","hidden");
		
		
		// défilement horizontal du slider
		if (horizontal) {
			panneaux.css({ 'float': 'left', 'position' : 'relative' });
			conteneur.css('width', panneauLargeur * pages);
		}
		
		// hauteur du premier panneau
		var panneauHauteur = panneaux.eq((pageCourante - 1)).outerHeight();
		
		// premier bouton de la navigation sélectionné
		nav.eq(0).addClass("actif");
		
		// boutons de navigation gauche et droite
		// et application de la hauteur du premier panneau
		scroll
			.before('<span id="sbg" class="scrollBouton gauche">&nbsp;</span>')
			.after('<span id="sbd" class="scrollBouton droite">&nbsp;</span>')
			.css({ height:panneauHauteur });
		
		// ajustement du positionnement en hauteur des boutons de navigation
	//	$("span.scrollBouton").css({ top: Math.round(panneauHauteur/2) })
		
		// navigation via les boutons
		$('span.scrollBouton.gauche', this).click(function () {
			p--; if (p < 1) p = pages;
			var el = nav.eq(p-1); selectNav.call(el);
			return gotoPage(pageCourante - 1);
		});
		$('span.scrollBouton.droite', this).click(function () {
			p++; if (p > pages) p = 1;
			var el = nav.eq(p-1); selectNav.call(el);
			return gotoPage(pageCourante + 1);
		});
		
		function gotoPage(page) {
			var dir = page < pageCourante ? -1 : 1,
				n = Math.abs(pageCourante - page),
				left = panneauLargeur * dir * n;
				
			if (page < 1) {
				left = Math.abs(left*pages);
				page = pages;
			} else if (page > pages) {
				left = - (panneauLargeur * pages);
				page = 1;
			}
			p = page;
			pageCourante = page;
			
			// modification de la hauteur du scroll en fonction de celle du panneau affiché
			var hauteurPanneau = panneaux.eq(pageCourante-1).outerHeight();
			
			scroll.animate({
				scrollLeft: '+=' + left,
				height: hauteurPanneau
			},delai);
		}
		
		nav.each(function (a) {
			$(this).bind("click",function(){
				selectNav.call($(this));
				gotoPage(a + 1);
			});
		});
		
		function selectNav () {
			$(this)
				.parents("ul")
					.find("a")
						.removeClass("actif")
					.end()
				.end()
			.addClass("actif");
		}
		
		// l'url comporte un hash, on affiche l'œuvre directement
		if (window.location.hash) {
			var afficher = '[hash=' + window.location.hash + ']';
			$("#slider .navigation a").filter(afficher).click();
		}
	});
	
	/**
	 * Visualisation des oeuvres via un aperçu et agrandissement dans le slider
	 */
	
	$(".visuOeuvres").each(function(){
		// récupération de tous les liens de l'aperçu des images
		var $liensApercu = $(this).find("ul.imgApercu li a"),
			delai = 500;
		
		// Ajout du bouton pour afficher le descriptif de l'œuvre
		$("div.conteneurDesc").append('<span class="afficheInfos" />');
		
		// Le descriptif de l'œuvre dans la zone d'agrandissement est masqué
		$(".imgAgrandissement .imgDesc").hide();

		$liensApercu.click(function(){
			// mise en cache une copie de l'élément cliqué, puis transformation en objet jQuery 
			var lien = this,
				$lien = $(this),
				$panneau = $lien.parents("div.panneau"),
				// récupération des éléments nécessaires 
				// pour afficher l'image et sa description dans la zone d'agrandissement
				$urlApercu = $lien.attr("href"),
				$descApercu = $lien.parent().find('.imgDesc').html(),
				// mise en cache de la zone d'agrandissement relative au lien cliqué
				$zoneAgrandissement = $panneau.find(".imgAgrandissement"),
				$desc = $zoneAgrandissement.find(".imgDesc"),
				$img = $zoneAgrandissement.find("img"),
				imgHauteur = $img.outerHeight(),
				panneauHauteur = $panneau.outerHeight(),
				// récupération de la dimension de l'image indiquée dans son url
				// (de la forme chemin/LlargeurxHhauteur/nomdufichier.extension). 
				// L'expression régulière ci-dessous fonctionne mais sort en premier résultat L...xH...
				// le résultat est une chaîne, donc on converti en nombre (nécessaire pour le test sur la hauteur)
				dimensions = $urlApercu.match(/L(\d+)xH(\d+)/),
				largeur = parseInt(dimensions[1]),
				hauteur = parseInt(dimensions[2]),
				hauteurPanneau = $lien.parents(".panneau").height(),
				scroll = $lien.parents(".scroll"),
				hauteurScroll = scroll.height(),
				
				// difference pour le réajustement de la hauteur du div.scroll
				difference = hauteurScroll - imgHauteur + hauteur;
				
			if ($lien.is('.actif')) {
				return false;
			};
			
			$lien
				.parents("ul")
					.find("a")
						.removeClass("actif")
					.end()
				.end()
			.addClass("actif");
			
			// changement de l'image et de sa description
			$zoneAgrandissement.stop().animate({ opacity: 0 },delai,function(){
				// on ajuste la hauteur du div.scroll
				scroll.animate({ height: difference });
				
				$img.animate({ width: largeur, height: hauteur }, delai)
				.attr({
					src: $urlApercu,
					width: largeur,
					height: hauteur
				});
				
				$desc.hide().html($descApercu).next("span").removeClass("actif");
			});
			
			$zoneAgrandissement.animate({ opacity: 1 },delai);
			return false;
		});
		
		$("span.afficheInfos").click(function(){
			$(this).toggleClass("actif").prev("div.imgDesc").toggleClass("actif").slideToggle(delai);
		});
	});
});


/**
 * @method getStyleProperty
 * @param {String} propName style property to test
 * @param {HTMLElement} element optional optional element to test
 * @return {String | undefined}
 *
 * @example getStyleProperty('borderRadius');
 * http://perfectionkills.com/feature-testing-css-properties/
 */
var getStyleProperty = (function(){

  var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];

  function getStyleProperty(propName, element) {
    element = element || document.documentElement;
    var style = element.style,
        prefixed;

    // test standard property first
    if (typeof style[propName] == 'string') return propName;

    // capitalize
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    for (var i=0, l=prefixes.length; i<l; i++) {
      prefixed = prefixes[i] + propName;
      if (typeof style[prefixed] == 'string') return prefixed;
    }
  }

  return getStyleProperty;
})();