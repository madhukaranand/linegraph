(function($){

    chartModel = Backbone.Model.extend();
  
   
  
    // Define the collection
  
    chartCollection = Backbone.Collection.extend({
  
        url: 'json/report.json',
  
        parse: function(response) {return response;}
  
    });
  
   
  
    var report;
  
    ChartView = Backbone.View.extend({
  
        initialize: function() {
  
            _.bindAll(this, 'render');
  
   
  
            // create a collection
  
            this.collection = new chartCollection;
  
   
  
            // Fetch the collection and call render() method
  
            var that = this;
  
            var a = this.collection.fetch({
  
                success: function () {
  
                    report = that.collection.models[0]['attributes'];
  
                    that.render();
  
                }
  
            });
  
   
  
            
  
        },
  
   
  
        render:function () {
  
            $(this.el).html('<select name="update" id="update"><option clickThruRate="volvo">clickThruRate</option><option value="sales">sales</option><option value="pageViews">pageViews</option><option value="orders">orders</option></select>' +
  
                    '<div id="gviz" style="width:600px; height:300px;"></div>');
  
            google.load('visualization', '1',  {'callback':this.drawVisualization,
  
                'packages':['linechart']});
  
            return this;
  
        },
  
   
  
        events: {
  
            "change #update": "update",
  
        },
  
        update: function(e) {
  
            this.drawVisualization(e.target.value);
  
        },
  
   
  
        drawVisualization:function (filter) {
  
            var filter = filter ? filter : 'clickThruRate';
  
            var res = [];
  
            res[0] = ["date", filter]
  
            for(var i = 0; i < report.records.length; i++){
  
                res.push(_.toArray(_.pick(report.records[i], "date", filter)))
  
            }
  
   
  
            var data = google.visualization.arrayToDataTable(res);
  
            var options = {
  
                curveType: 'function',
  
                legend: { position: 'bottom' }
  
            };
  
            var chart = new google.visualization.LineChart(this.$('#gviz').get(0));
  
            chart.draw(data, options);
  
        }
  
    });
  
   
  
    var AppRouter = Backbone.Router.extend({
  
        routes:{
  
            "":"chart"
  
        },
  
        chart:function () {
  
            $("#content").append(new ChartView().render().el);
  
        }
  
    });
  
   
  
    router = new AppRouter();
  
    Backbone.history.start();
  
  })(jQuery)