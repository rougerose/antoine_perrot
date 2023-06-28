<?php

if (!defined('_ECRIRE_INC_VERSION')) {
	return;
}

$GLOBALS['debut_intertitre']='<h2>';
$GLOBALS['fin_intertitre']='</h2>';

// ajout du bloc hierarchie dans la gestion des blocs de la page par Zpip
if (!isset($GLOBALS['z_blocs'])) {
	$GLOBALS['z_blocs'] = array('contenu','navigation','extra','head','hierarchie');
}
