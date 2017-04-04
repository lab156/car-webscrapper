"use strict";
$(document).ready(function() {
    //$("#pop-horarios").popover();
	$('.carousel-destacados-home').on('resized.owl.carousel', function() {
		var $stage = $(this).find('.owl-stage');
		var c = $stage.css('background-color');
		c = (c == '#fffffe' || c == 'rgb(255, 255, 254)') ? '#ffffff' : '#fffffe';
		$stage.css('background-color', c);
	});

    $(".carousel-destacados-busqueda").owlCarousel({
	nav : !0,
	loop : !0,
	navText : [ "&#x25c0;", "&#x25b6;" ],
	dots : !1,
	responsive : {
	    0 : {
		items : 3
	    },
	    992 : {
		items : 4
	    },
	    1200 : {
		items : 5
	    }
	}
    }), $(".carousel-destacados-home").owlCarousel({
	nav : !0,
	loop : !0,
	navText : [ "&#x25c0;", "&#x25b6;" ],
	dots : !1,
	responsive : {
	    0 : {
		items : 3
	    },
	    992 : {
		items : 4
	    },
	    1200 : {
		items : 5
	    }
	}
    }), $(".carousel-ultimos-agregados").owlCarousel({
	nav : !0,
	margin : 5,
	loop : !0,
	navText : [ "&#x25c0;", "&#x25b6;" ],
	dots : !1,
	responsive : {
	    0 : {
		items : 2
	    },
	    992 : {
		items : 3
	    },
	    1200 : {
		items : 5
	    }
	}
    }), $(".carousel-resultado-busqueda").owlCarousel({
	nav : false,
	margin : 5,
	loop : !0,
	navText : [ "&#x25c0;", "&#x25b6;" ],
	dots : !1,
	responsive : {
	    0 : {
		items : 2
	    },
	    992 : {
		items : 3
	    },
	    1200 : {
		items : 4
	    }
	}
    }), $(".carousel-ofertas-destacadas").owlCarousel({
	nav : !0,
	margin : 5,
	loop : !0,
	navText : [ "&#x25c0;", "&#x25b6;" ],
	dots : !1,
	responsive : {
	    0 : {
		items : 1
	    },
	    992 : {
		items : 1
	    },
	    1200 : {
		items : 1
	    }
	}
    }), $(".carousel-wholesales-destacadas").owlCarousel({
	nav : !0,
	margin : 5,
	loop : !0,
	navText : [ "&#x25c0;", "&#x25b6;" ],
	dots : !1,
	responsive : {
	    0 : {
		items : 1
	    },
	    992 : {
		items : 2
	    },
	    1200 : {
		items : 3
	    }
	}
    })

    setInterval(function() {
		var $stage = $('body').find('.owl-stage');
		var c = $stage.css('background-color');
		c = (c == '#fffffe' || c == 'rgb(255, 255, 254)') ? '#ffffff' : '#fffffe';
		$stage.css('background-color', c);
    }, 4000);
});
