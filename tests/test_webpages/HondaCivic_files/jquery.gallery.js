
/*
 * CurrentOptions:
 * - reverse: Boolean, if true, right button moves the gallery items to the left, and viceversa
 * - carrousel: Boolean, if true, if the items reach the maxium amount of pages, go to the begining or to the end
 * - rowMax: Integer, number of items per row
 * - easing: String, name of an jQuery easing function
 * - easing: String, name of an jQuery easing function for carrousel
 * - speed: Integer [milisegundos] | String ['slow', 'normal', 'fast'], movement speed.
 * - speed: Integer [milisegundos] | String ['slow', 'normal', 'fast'], movement speed for carrousel.
 * - paginate: Boolean, if true, creates pagination links
 */

(function($) {
    $.fn.createGallery = function(currentOptions){
        //Options
        var options = {
            reverse: true,
            carrousel: true,
            rowMax: 5,
            easing: 'easeOutCubic',
            carrouselEasing: 'easeOutBack',
            speed: 800,
            carrouselSpeed: 1000,
            paginate: false,
            withPreview: false,
            preloadPreviewImages: true,

            controls: 'gallery-controls',
            leftButton: 'gallery-button-left',
            rightButton: 'gallery-button-right',
            firstButton: 'gallery-button-first',
            lastButton: 'gallery-button-last',
            topButton: 'gallery-button-top',
            bottomButton: 'gallery-button-bottom',
            itemsContainer: 'gallery-items-container',
            items: 'gallery-item',
            previewContainer: 'preview-container',
            currentPageContainer: 'gallery-current-page',
            totalPagesContainer: 'gallery-total-pages'
        }
        $.extend(options, currentOptions);

        //Gallery Components
        var gallery = $(this);
        gallery.each(function(i, element){
            var gallery = $(element);

            var itemsContainer = gallery.find('ul.' + options.itemsContainer);
            var items = itemsContainer.find('.' + options.items);
            var controls = gallery.find('.' + options.controls);
            var leftButton = controls.find('.' + options.leftButton);
            var rightButton = controls.find('.' + options.rightButton);
            var firstButton = controls.find('.' + options.firstButton);
            var lastButton = controls.find('.' + options.lastButton);
            var topButton = controls.find('.' + options.topButton);
            var bottomButton = controls.find('.' + options.bottomButton);
            var currentPageContainer = controls.find('.' + options.currentPageContainer);
            var totalPagesContainer  = controls.find('.' + options.totalPagesContainer);
            var previewContainer = gallery.find('.' + options.previewContainer);

            //Movement properties
            var rowMax = options.rowMax;
            var totalItems = items.length;

            var itemWidth = items.outerWidth(true);
            var itemHeight = items.outerHeight(true);
            var galleryWidth = itemWidth * rowMax;
            var galleryHeight = itemHeight * rowMax;
            var totalWidth = itemWidth * totalItems;
            var totalHeight = itemHeight * totalItems;
             
            var pages =  Math.floor(totalItems / rowMax);
            if(totalItems % rowMax) pages++;
            var currentPage = 1;
            var minPos = 0;//itemsContainer.offset().left;
            var maxPos = minPos + (pages - 1) * galleryWidth;
            var maxPosY = minPos + (pages - 1) * galleryHeight;
            
            if(totalPagesContainer[0]){
                totalPagesContainer.text(pages);
            }
            if(currentPageContainer[0]){
                currentPageContainer.text(currentPage);
            }
             
            //Movement functions
            function moveRight(){
                if(currentPage - 1  > 0){
                    currentPage--;
                    itemsContainer.animate({marginLeft: '+=' + galleryWidth}, options.speed, options.easing);
                }else if(options.carrousel && totalItems > rowMax){
                    /*currentPage = pages;
                    itemsContainer.animate({marginLeft: - maxPos}, options.carrouselSpeed, options.carrouselEasing);*/
                }
                if(options.paginate) switchActivePage(currentPage);
                onPageChanged();
                return false;
            }
            function moveLeft(){ 
                if(currentPage + 1  <= pages){
                    currentPage++;
                    itemsContainer.animate({marginLeft: '-=' + galleryWidth}, options.speed, options.easing);
                }else if(options.carrousel && totalItems > rowMax){
                    /*currentPage = 1;
                    itemsContainer.animate({marginLeft: minPos}, options.carrouselSpeed, options.carrouselEasing);*/
                }
                if(options.paginate) switchActivePage(currentPage);
                onPageChanged();
                return false;
            }
            
            function moveBottom(){
                if(currentPage - 1  > 0){
                    currentPage--;
                    console.log('galleryHeight', galleryHeight);
                    itemsContainer.animate({marginTop: '+=' + galleryHeight}, options.speed, options.easing);
                }else if(options.carrousel && totalItems > rowMax){
                    currentPage = pages;
                    itemsContainer.animate({marginTop: - maxPosY}, options.carrouselSpeed, options.carrouselEasing);
                }
                if(options.paginate) switchActivePage(currentPage);
                onPageChanged();
                return false;
            }
            function moveTop(){ 
                console.log('moveTop');
                if(currentPage + 1  <= pages){
                    currentPage++;
                    itemsContainer.animate({marginTop: '-=' + galleryHeight}, options.speed, options.easing);
                }else if(options.carrousel && totalItems > rowMax){
                    currentPage = 1;
                    itemsContainer.animate({marginTop: minPos}, options.carrouselSpeed, options.carrouselEasing);
                }
                if(options.paginate) switchActivePage(currentPage);
                onPageChanged();
                return false;
            }
            
            //Avanza hacia la primer pagina
            function pageFirst(){ 
                goToPage(1);
                return false;
            }
            
            //Avanza hacia la ultima pagina
            function pageLast(){ 
                goToPage(pages);
                return false;
            }

            //Paginator function
            function paginate(){
                var pageContainer = $('<ul>').addClass('gallery-pages');
                for(var i = 1; i <= pages; i++){
                    //Add page number, and goToPage functionality
                    $('<li>').addClass('page')
                             .addClass(i == 1 ? 'active' : '')
                             .text(i)
                             .attr('page', i )
                             .click(function(){
                                 //Change the active button and call goToPage
                                 goToPage($(this).attr('page'));
                                 switchActivePage($(this).attr('page'));
                             }).appendTo(pageContainer);
                }
                pageContainer.prependTo(controls);

            }

            //GoToPage function
            function goToPage(page){
                if(page!=currentPage){
                    itemsContainer.animate({marginLeft: - galleryWidth * (page - 1)}, options.speed, options.easing);                
                    //itemsContainer.animate({left: - galleryWidth * (page - 1)}, options.speed, options.easing);
                    currentPage = page;
                    onPageChanged();
                }
            }
            
            //onPageChanged
            function onPageChanged(){
                if(currentPageContainer[0]){
                    currentPageContainer.text(currentPage);
                }
            }

            //Actives or desactive current page
            function switchActivePage(page){
                controls.find('.active').removeClass('active');
                controls.find('.page:eq('+(page - 1)+')').addClass('active');
            }

            //Show Preview function
            function addPreviewBehavior(){
                //Obtain the target preview image
                var target = previewContainer.find('img:first');
                var active_item = null;
                //When the user clicks the thumb
                items.click(function(){
                    //Get the new src image
                    if(active_item){
                        active_item.removeClass('active');
                    }
                    active_item = $(this).addClass('active');
                    var src = active_item.find('a[rel]').attr('rel');
                    //If the new image is diferent than the actual one
                    if(src != target.attr('src')){
                        var img = target.clone();
                        img.attr('src', src);
                        //Hide the original image
                        target.hide();
                        //We show the new image when it is complete loaded
                        img.load(function(){
                            target.replaceWith(img);
                            img.show();
                            target = img;
                        });
                        //We check if the image is already completed. Browser cache may corrupt the desired behavior
                        if(img[0].complete){
                            img.load();
                            img.unbind('load');
                        }
                    }
                    //Return false to avoid event propagation and bubbling
                    return false;
                });
                items.filter(':eq(0)').click();
            }
            if(options.withPreview) addPreviewBehavior();

            //Preload preview images
            function preloadPreviewImages(){
                //When the page is completely loaded, we preload the images
                $(window).load(function(){
                    //Get the links to the images
                    items.find('a[rel]').each(function(i, element){
                       var src = $(this).attr('rel');
                       $('<img>').attr('src', src);
                    });
                });
            }
            if(options.preloadPreviewImages) preloadPreviewImages();


            //Buttons behaviors
            options.reverse ? leftButton.click(moveRight) : leftButton.click(moveLeft);
            options.reverse ? rightButton.click(moveLeft) : rightButton.click(moveRight);
            firstButton.click(pageFirst);
            lastButton.click(pageLast);
            
            options.reverse ? topButton.click(moveBottom) : topButton.click(moveTop);
            options.reverse ? bottomButton.click(moveTop) : bottomButton.click(moveBottom);

            //Paginator behaviors
            if(options.paginate) paginate();
        });
    }
})(jQuery);

/*
 * Easing functions
 */

jQuery.extend( jQuery.easing,
{
        easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},

	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}	
});
