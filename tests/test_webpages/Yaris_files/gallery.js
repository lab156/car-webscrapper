$(function(){
    var carrousels = $('.crousel');
    
    carrousels.each(function(){
        var carrousel = $(this);
        var prev_button = carrousel.find('.prev');
        var next_button = carrousel.find('.next');
        var panes = carrousel.find('.pan');
        var current_pane_index = 0;
        var panes_count = panes.length;
        var current_pane = panes.filter(':eq(' + current_pane_index + ')');
        var active = true;
        
        prev_button.click(function(e){
            current_pane_index--;
            if(current_pane_index < 0){
                current_pane_index = panes_count - 1;
            }
            showPane(current_pane_index, current_pane);
            e.preventDefault();
        });
        next_button.click(function(e){
            current_pane_index++;
            if(current_pane_index >= panes_count){
                current_pane_index = 0;
            }
            showPane(current_pane_index, current_pane);
            e.preventDefault();
        });
        
        function showPane(current_pane_index, old_pane){
            if(active){
                active = false;
                old_pane.fadeTo('fast', 0.1, function(){
                    old_pane.hide();
                    current_pane = panes.filter(':eq(' + current_pane_index + ')');
                    current_pane.fadeTo('normal', 1);
                    active = true;
                });
            }
        }
    });
});