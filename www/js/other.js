function triggerIndexButton(e) {
            var viewID = e.view.element.attr("id");
            if( viewID == 'bloodSugar' || viewID == 'history' 
                ||viewID == 'alert' || viewID == 'medRecord'||viewID=='eatDrink') {
                e.layout.header.find(".nav-backbtn").css('visibility','visible');
            }
            else if(viewID =='chart'){
                e.layout.header.find(".nav-backbtn").css('visibility','hidden');
                chart.validateData();
                chart.write("chartdiv");
            }
            else{
                e.layout.header.find(".nav-backbtn").css('visibility','hidden');
            }
            if(viewID=='medRecord')
            {
                loadMedName();
            }
            if(viewID=='eatDrink')
            {
                loadFoodName();
            }
            if(viewID=='history')
            {
                // onChange2();
            }
        }


        window.swipeTohistory = {
            swipe: function(e) {
            if(e.direction =="left") {
                app.navigate('#history','slide:left');
            }
        }
        
    }
    
    window.swipeBack = {
        swipe: function(e) {
            if(e.direction =="right") {
                app.navigate('#:back','slide:right');
            }
        }
    }