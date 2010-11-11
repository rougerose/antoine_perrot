$(document).ready(function(){
	/**
	 * Grille de mise en page ajoutée aux boutons d'administration de spip
	 */
	/*
	$("#spip-admin").append("<a id='grille' class='spip-admin-boutons' href='#'>Grille</a>");
	$("#grille").click(function(){
		$("body").toggleClass("grille");
	});
	*/// $("body").toggleClass("grille");
	
	/**
	 *	Plugin Mediabox (colorbox)
	 *	petite fonction pour afficher titre et descriptif de l'image 
	 */
	/*
	$(".documents_portfolio a").colorbox({title: function(){
		var titre = $(this).attr("title").match(/^(.+)\*(.+)$/);
		return '<h3>' + titre[1] + '</h3>' + '<p>' + titre[2] + '</p>';
	}});
	*/
	/**
	 *	Les messages d'informations sur les erreurs de saisies
	 *	des formulaires masque les champs. 
	 *	Lorsque l'utilisateur clique dans le champ pour corriger,
	 *	le message d'erreur est automatique masqué.
	 */
	
	$(".formulaire_spip").delegate("li.erreur","click",function(){
		$(this).find("span").hide();
		$(this).removeClass("erreur");
	});
	
	
	/**
	 * transitions CSS3 non disponibles dans Firefox 3 (max)
	 */
	
	if (typeof getStyleProperty('transition') == 'undefined') {
		// property is unsupported
		// simulation CSS3 pour firefox 3
		$("#nav li a").addClass("ff3");
		$("#nav li.off a.ff3").hover(
			function() {
				$(this).stop().animate({paddingLeft:"20px"},600);
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
	 * Animation de pseudo tooltips
	 * inspiré de http://jqueryfordesigners.com/coda-popup-bubbles/
	 */
	$(".tooltip").each(function(){
		var trigger = $("a",this);
		var texteInfo = trigger.html();
		
		var delai = 250;
		var hideDelay = 500;
		var hideDelayTimer = null;
		var beingShown = false;
		var shown = false;
		var direction;
		var marge;
		
		if ($(this).is(".next")) {
			$(this).prepend('<div class="next info">'+ texteInfo +'</div>');
			largeurNext = $(".next.info").outerWidth();
			$(".next.info").addClass("a").css({
				marginLeft: '-' + largeurNext + 'px',
				top:30
			});
		}
		if ($(this).is(".back")) {
			$(this).append('<div class="back info">'+ texteInfo +'</div>');
			largeurBack = $(".back.info").outerWidth();
			$(".back.info").css({top:30});
		}
		
		var info = $(".info",this).css('opacity',0);
		
		trigger.mouseover(function(){
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			if (beingShown || shown) {
				// don't trigger the animation again
				return;
			} else {
				// reset position of info box
				beingShown = true;
				
				info.show().animate({
					display: 'block',
					top:0,
					opacity: 1
				}, delai, 'swing', function(){
					beingShown = false;
					shown = true;
				});
			}
		}).mouseout(function(){
			if (hideDelayTimer) clearTimeout(hideDelayTimer);
			hideDelayTimer = setTimeout(function () {
				hideDelayTimer = null;
				
				if (info.is(".next")) {
					direction = '+=';
				} else {
					direction = '-='
				}
				
				info.animate({
					top:30,
					opacity: 0
				}, delai, 'swing', function () {
					shown = false;
					info.css('display', 'none');
				});
			}, hideDelay);
		});
	});
	
	/**
	 * Menus de tri pour la rubrique Œuvres
	 */
	$(".rubrique_oeuvres .optionsTri").menuTri();
	
	/**
	 * Agrandissement des images des œuvres via plugin "visu"
	 */
//	$(".page_sommaire .visuOeuvres").visu({conteneur:".scroll"});
	
//	$(".rubrique_oeuvres .visuOeuvres").visu({conteneur: ".panneau"});
	
	/**
	 * Rechargement des plugins, après changement de page en ajax
	 */
	
	// 
	$(".rubrique_oeuvres .ajaxbloc").ajaxSuccess(function(){
	//	$(".visuOeuvres").visu({conteneur: ".panneau"});
		$(".rubrique_oeuvres .optionsTri").menuTri();
	});
});

/**
 * plugin "menu tri"
 */
(function( $ ){
	$.fn.menuTri = function() {
		return this.each(function(){
			var obj = $(this);
			
			var dropdown = $('.dropdown',obj);
			
			dropdown.each(function(){
				var selection = $(this).find("ul li strong.on").html();
				$(this).prepend('<div>' + selection + '</div>');
			});
			
			dropdown.click(function(){
				if($(this).is('.ouvert')) {
					$(this).children("ul.options").slideUp({
						duration:300,
						easing:"swing",
						complete:function(){
							$(this).parent(".dropdown").removeClass("ouvert");
						}
					});
				} else {
					$(this).addClass("ouvert").children("ul.options").slideDown({
						duration: 300, easing: "swing"
					});
				}
			});
		});
	};
})( jQuery );

/**
 * plugin "visu"
 */

(function($){
	$.fn.visu = function(options) {
		var defaults = {
			conteneur: '.scroll'
		}

		var opts = $.extend(defaults, options);

		return this.each(function(){
			var obj = $(this);
			var delai = 500;

			// DESCRIPTIF DE L'ŒUVRE
			// ----------------------

			// descriptif de l'œuvre affichée en grand format
			var descriptif = $('.conteneurDesc, obj');
			var texteDescriptif = $(descriptif.find('.imgDesc'), obj);

			// Ajout du bouton pour afficher le conteneur du descriptif de l'œuvre
			descriptif.append('<span class="afficheInfos" />')

			// on masque le texte du descriptif
			texteDescriptif.hide();

			// affichage du descriptif
			$('span.afficheInfos').click(function(){
				$(this).toggleClass('actif').prev('.imgDesc').toggleClass('actif').slideToggle(delai);
			});

			// AGRANDISSEMENT DES APERÇUS
			// --------------------------

			var liensApercu = $('ul.imgApercu li a', obj);

			liensApercu.click(function(){

				//	if ($(this).is('.actif')) { return false; };

				// url de l'image à agrandir
				var imgUrl = $(this).attr('href');

				// le descriptif également
				var imgDescriptif = $(this).parent().find('.imgDesc').html();

				var conteneur = $(this).parents("'" + options.conteneur + "'"),
				panneau = $(this).parents('div.panneau'),
				imgAgrandie = panneau.find('.imgAgrandissement'),
				img = imgAgrandie.find('img'),
				descriptif = imgAgrandie.find('.imgDesc'),
				imgHauteur = img.outerHeight(),
				dimension = imgUrl.match(/L(\d+)xH(\d+)/),
				calcLargeur = parseInt(dimension[1]),
				calcHauteur = parseInt(dimension[2]),
				calcHauteurConteneur = conteneur.outerHeight(),
				// hauteur du conteneur avec l'image qui va être affichée
				hauteurConteneur = calcHauteurConteneur - imgHauteur + calcHauteur;

				$(this)
				.parents("ul")
				.find("a")
				.removeClass("actif")
				.end()
				.end()
				.addClass("actif");

				// changement de l'image et de sa description
				imgAgrandie.stop().animate({ opacity: 0 }, delai, function(){

					if (conteneur == '.scroll') {
						conteneur.animate({ height: hauteurConteneur });
					}

					img
					.animate({ width: calcLargeur, height: calcHauteur }, delai)
					.attr({src: imgUrl, width: calcLargeur, height: calcHauteur});

					descriptif.hide().html(imgDescriptif).next("span").removeClass("actif");
				});
				imgAgrandie.animate({ opacity: 1 }, delai);

				return false;
			});
		});
	};
})( jQuery );

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